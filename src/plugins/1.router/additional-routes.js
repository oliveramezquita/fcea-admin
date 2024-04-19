export const redirects = [
    {
        path: '/',
        name: 'index',
        redirect: to => {
            const userData = useCookie('userData')
            const userRole = userData.value?.role
            
            if(['SUPER_ADMIN', 'ADMIN', 'BRIGADIER'].includes(userRole))
                return { name: 'home' }

            return { name: 'login', query: to.query }
        },
    }
]
