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
export const routes = [
    {
        path: '/apps/users/view/:tab',
        name: 'apps-users-view-tab',
        component: () => import('@/pages/apps/users/view/[tab].vue'),
        meta: {
            action: 'read',
            subject: ['admin', 'brigadier'],
        },
    },
    // {
    //     path: '/apps/basins/view/:id',
    //     name: 'apps-basins-view-id',
    //     component: () => import('@/pages/apps/basins/view/[id].vue'),
    //     meta: {
    //         navActiveLink: 'apps-basins-list'
    //     }
    // }
]
