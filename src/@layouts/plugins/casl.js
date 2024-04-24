
/**
 * Returns ability result if ACL is configured or else just return true
 * We should allow passing string | undefined to can because for admin ability we omit defining action & subject
 *
 * Useful if you don't know if ACL is configured or not
 * Used in @core files to handle absence of ACL without errors
 *
 * @param {string} action CASL Actions // https://casl.js.org/v4/en/guide/intro#basics
 * @param {string} subject CASL Subject // https://casl.js.org/v4/en/guide/intro#basics
 */
export const can = (action, subject) => {
  const vm = getCurrentInstance()
  if (!vm)
    return false
  const localCan = vm.proxy && '$can' in vm.proxy
   
  if (typeof subject === 'object') {
    if (localCan) {
      const resp = []
      subject.forEach(sub => {
        resp.push(vm.proxy?.$can(action, sub))
      })
      return resp.some(r => r)
    } else {
      return true
    }
  } else {
    return localCan ? vm.proxy?.$can(action, subject) : true
  }
}

/**
 * Check if user can view item based on it's ability
 * Based on item's action and subject & Hide group if all of it's children are hidden
 * @param {object} item navigation object item
 */
export const canViewNavMenuGroup = item => {
  const hasAnyVisibleChild = item.children.some(i => can(i.action, i.subject))

  // If subject and action is defined in item => Return based on children visibility (Hide group if no child is visible)
  // Else check for ability using provided subject and action along with checking if has any visible child
  if (!(item.action && item.subject))
    return hasAnyVisibleChild
  
  return can(item.action, item.subject) && hasAnyVisibleChild
}
export const canNavigate = to => {
  const ability = useAbility()
  const resp = []
  to.matched.forEach(route => {
    if (route.meta.hasOwnProperty('action') && route.meta.hasOwnProperty('subject')) {
      if (typeof route.meta.subject === 'object') {
        route.meta.subject.forEach(sub => {
          resp.push(ability.can(route.meta.action, sub))
        })
      }
    }
  })
  if (resp.length > 0)
    return resp.some(r => r)
  else
    return to.matched.some(route => ability.can(route.meta.action, route.meta.subject))
}
