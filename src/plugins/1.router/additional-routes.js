const emailRouteComponent = () => import('@/pages/apps/email/index.vue')

// 👉 Redirects
export const redirects = [
    // ℹ️ We are redirecting to different pages based on role.
    // NOTE: Role is just for UI purposes. ACL is based on abilities.
    {
        path: '/dang-nhap',
        name: 'index',
        redirect: to => {
            // TODO: Get type from backend
            const userData = useCookie('userData')
            const userRole = userData.value?.role
            if (userData)
                return {name: 'business-dashboard'}
            if (userRole === 'admin')
                return {name: 'business-dashboard'}
            if (userRole === 'client')
                return {name: 'business-dashboard'}

            return {name: 'login', query: to.query}
        },
    },
    {
        path: '/pages/user-profile',
        name: 'pages-user-profile',
        redirect: () => ({name: 'pages-user-profile-tab', params: {tab: 'profile'}}),
    },
    {
        path: '/pages/account-settings',
        name: 'pages-account-settings',
        redirect: () => ({name: 'pages-account-settings-tab', params: {tab: 'account'}}),
    },
]
export const routes = [
    // Email filter
    {
        path: '/apps/email/filter/:filter',
        name: 'apps-email-filter',
        component: emailRouteComponent,
        meta: {
            navActiveLink: 'apps-email',
            layoutWrapperClasses: 'layout-content-height-fixed',
        },
    },

    // Email label
    {
        path: '/apps/email/label/:label',
        name: 'apps-email-label',
        component: emailRouteComponent,
        meta: {
            // contentClass: 'email-application',
            navActiveLink: 'apps-email',
            layoutWrapperClasses: 'layout-content-height-fixed',
        },
    },
    {
        path: '/business/dashboards',
        name: 'business-dashboard',
        component: () => import('@/views/portal/dashboard/ecommerce.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/business/sell/products',
        name: 'portal-products-my',
        component: () => import('@/views/portal/sell/product/MyProducts.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/business/sell/products/create',
        name: 'portal-products-create',
        component: () => import('@/views/portal/sell/product/ProductForm.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/business/sell/products/:id/edit',
        name: 'portal-products-edit',
        component: () => import('@/views/portal/sell/product/ProductForm.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/business/sell/inquiries',
        name: 'business-inquiries',
        component: () => import('@/views/portal/sell/inquiries/Index.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/business/buying-leads',
        name: 'business-buying-leads',
        component: () => import('@/views/portal/sell/BuyingLeads.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/business/contacts',
        name: 'business-contacts',
        component: () => import('@/views/portal/sell/contacts/Index.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/business/company/profile',
        name: 'company-profile',
        component: () => import('@/views/portal/company/profile.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/',
        name: 'page-home',
        component: () => import('@/views/page-home.vue'),
        meta: {public: true, layout: 'blank'},
    },
    {
        path: '/giao-thuong.html',
        name: 'page-product-trade',
        component: () => import('@/views/page-product-trade.vue'),
        meta: {public: true, layout: 'blank'},
    },
    {
        path: '/:slug.html',
        name: 'slug-html',
        component: () => import('@/views/SlugHtml.vue'),
        meta: {public: true, layout: 'blank'},
    },
]
