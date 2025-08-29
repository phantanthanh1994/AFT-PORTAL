import { canNavigate } from '@layouts/plugins/casl'

export const setupGuards = router => {
  const TOKEN_KEY = 'accessToken' // hoặc 'token' tuỳ bạn đang lưu
const getToken = () => useCookie(TOKEN_KEY).value || localStorage.getItem('token')

router.beforeEach((to, from, next) => {
        const token = getToken()

        if (to.meta?.requiresAuth && !token) {
            return next({ name: 'login', query: { to: to.fullPath } })
        }

        // ❌ KHÔNG kiểm tra ability/can nữa
        next()
    })
}
