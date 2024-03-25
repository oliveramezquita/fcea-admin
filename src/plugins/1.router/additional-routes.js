export const redirects = [
    {
        path: '/',
        name: 'index',
        redirect: to => {
            // const userData = userCookie('userData')
            // const userRole = userData.value?.role
            // if(userRole === 'admin')
            //     return { name: 'apps-projects-list' }
            // if(userRole === 'brigadier')
            //     return { name: 'form' }

            //return { name: 'authentication/login', query: to.query }
            return { name: 'apps-projects-list' }
        },
    }
]
