<script setup>
    import { VForm } from 'vuetify/components/VForm'
    import api, { setToken } from '@/services/api'
    import AuthProvider from '@/views/pages/authentication/AuthProvider.vue'
    import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
    import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
    import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
    import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
    import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
    import authV2MaskDark from '@images/pages/misc-mask-dark.png'
    import authV2MaskLight from '@images/pages/misc-mask-light.png'
    import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
    import { themeConfig } from '@themeConfig'

    definePage({
        meta: { layout: 'blank', unauthenticatedOnly: true },
    })

    const authThemeImg = useGenerateImageVariant(
        authV2LoginIllustrationLight,
        authV2LoginIllustrationDark,
        authV2LoginIllustrationBorderedLight,
        authV2LoginIllustrationBorderedDark,
        true
    )
    const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

    const isPasswordVisible = ref(false)
    const route = useRoute()
    const router = useRouter()

    const refVForm = ref()
    const credentials = ref({ email: '', password: '' })
    const rememberMe = ref(false)
    const loading = ref(false)

    const errors = ref({
        email: undefined,
        password: undefined,
    })

    const clearErrors = () => {
        errors.value = { email: undefined, password: undefined }
    }

    const login = async () => {
        try {
            const { data } = await api.post('/login', {
                email: credentials.value.email,
                password: credentials.value.password,
            })

            const { accessToken, userData } = data
            // Lưu token
            setToken(accessToken)
            useCookie('accessToken').value = accessToken
            useCookie('userData').value = userData

            await nextTick(() => {
              router.replace(route.query.to ? String(route.query.to) : '/business/dashboards')
            })
        } catch (err) {
            // 422 hiển thị lỗi field (nếu backend trả)
            if(err?.response?.status === 422 && err.response.data?.errors) {
                errors.value = err.response.data.errors
            }else if (err?.response?.data?.message) {
                errors.value = { email: [err.response.data.message] }
            } else {
                errors.value = { email: ['Đăng nhập thất bại. Vui lòng thử lại.'] }
            }
            console.error(err)
        }
    }

    const onSubmit = () => {
        refVForm.value?.validate().then(({ valid }) => {
            if (valid) login()
        })
    }
</script>

<template>
    <VRow no-gutters class="auth-wrapper bg-surface">
        <VCol md="8" class="d-none d-md-flex">
            <div class="position-relative bg-background w-100 me-0">
                <div class="d-flex align-center justify-center w-100 h-100" style="padding-inline: 6.25rem;background-image:url(images/bg-login.jpg);background-size:cover;background-position:center;">
                    <h1 style="position:absolute;max-width:410px;color:#fff;bottom:35px;right:30px;padding:25px;text-align:right;">
                        Tạo gian hàng, tìm kiếm & kết nối với nhà mua nông sản, thực phẩm
                    </h1>
                </div>
                <img class="auth-footer-mask" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100">
            </div>
        </VCol>

        <!-- right card -->
        <VCol cols="12" md="4" class="auth-card-v2 d-flex align-center">
            <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
                <VCardText>
                    <RouterLink to="/">
                        <div class="d-flex align-center justify-center gap-x-3">
                            <VNodeRenderer :nodes="themeConfig.app.logo" />
                        </div>
                    </RouterLink>
                    <h4 class="text-h4 mb-1 mt-7 text-primary">Đăng nhập</h4>
                </VCardText>

                <VCardText>
                    <VForm ref="refVForm" @submit.prevent="onSubmit">
                        <VRow>
                            <VCol cols="12">
                                <AppTextField
                                  v-model="credentials.email"
                                  label="Địa chỉ email *"
                                  placeholder="Nhập email của bạn"
                                  type="email"
                                  autofocus
                                  :rules="[requiredValidator, emailValidator]"
                                  :error-messages="errors.email"
                                />
                            </VCol>

                            <VCol cols="12">
                                <AppTextField
                                  v-model="credentials.password"
                                  label="Mật khẩu"
                                  placeholder="············"
                                  :rules="[requiredValidator]"
                                  :type="isPasswordVisible ? 'text' : 'password'"
                                  autocomplete="current-password"
                                  :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                                  :error-messages="errors.password"
                                />

                                <div class="d-flex align-center flex-wrap justify-space-between my-6">
                                    <VCheckbox v-model="rememberMe" label="Ghi nhớ mật khẩu" />
                                    <RouterLink class="text-primary ms-2 mb-1" :to="{ name: 'forgot-password' }">
                                      Quên mật khẩu?
                                    </RouterLink>
                                </div>

                                <VBtn :loading="loading" block type="submit">Đăng nhập ngay</VBtn>
                            </VCol>

                            <VCol cols="12" class="d-flex align-center">
                                <VDivider /><span class="mx-4">Hoặc</span><VDivider />
                            </VCol>

                            <VCol cols="12" class="text-center">
                                <AuthProvider />
                            </VCol>

                            <VCol cols="12" class="text-center">
                                <span>Không có tài khoản?</span>
                                <RouterLink class="text-primary ms-1" :to="{ name: 'register' }">Đăng ký</RouterLink>
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </VCard>
        </VCol>
    </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth";
</style>
