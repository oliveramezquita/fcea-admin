export const redirects = [
    {
        path: '/',
        name: 'index',
        redirect: to => {
            const userData = useCookie('userData')
            const userRole = userData.value?.role
            
            if(['SUPER_ADMIN', 'ADMIN'].includes(userRole)){
                return { name: 'apps-projects-list' }
            }
            if(userRole === 'BRIGADIER') {
                return { name: 'forms-reference-site' }
            }

            return { name: 'login', query: to.query }
        },
    }
]
