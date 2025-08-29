<script setup>
import { ref } from 'vue'
import api from '@/services/api' // axios client bạn đã cấu hình
import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
import { themeConfig } from '@themeConfig'
import authV2ForgotPasswordIllustrationDark from '@images/pages/auth-v2-forgot-password-illustration-dark.png'
import authV2ForgotPasswordIllustrationLight from '@images/pages/auth-v2-forgot-password-illustration-light.png'
import authV2MaskDark from '@images/pages/misc-mask-dark.png'
import authV2MaskLight from '@images/pages/misc-mask-light.png'

const email = ref('')
const loading = ref(false)
const successMsg = ref('')
const serverError = ref('')
const fieldErrors = ref({})

// Nếu backend khác path, sửa tại đây
const FORGOT_ENDPOINT = '/auth/forgot-password'

// Link reset (backend sẽ nhúng token vào link này). 
// Nếu trang reset của bạn ở URL khác, chỉnh lại:
const RESET_REDIRECT_URL = `${window.location.origin}/account/reset-password`

const authThemeImg = useGenerateImageVariant(authV2ForgotPasswordIllustrationLight, authV2ForgotPasswordIllustrationDark)
const authThemeMask = useGenerateImageVariant(authV2MaskLight, authV2MaskDark)

definePage({
  meta: { layout: 'blank', unauthenticatedOnly: true },
})

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
}

async function submitForgot() {
  successMsg.value = ''
  serverError.value = ''
  fieldErrors.value = {}

  if (!email.value || !isValidEmail(email.value)) {
    fieldErrors.value.email = 'Vui lòng nhập email hợp lệ'
    return
  }

  loading.value = true
  try {
    // payload tối thiểu cho API quên mật khẩu
    const payload = { email: email.value, redirect_url: RESET_REDIRECT_URL }
    const { data } = await api.post(FORGOT_ENDPOINT, payload)

    successMsg.value = data?.message || 'Đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra email của bạn.'
    email.value = ''
  } catch (err) {
    // Bắt lỗi validation 422 hoặc thông báo chung
    const res = err?.response
    if (res?.status === 422 && res.data?.errors) {
      fieldErrors.value = res.data.errors
    } else {
      serverError.value =
        res?.data?.message || 'Không thể gửi yêu cầu lúc này. Vui lòng thử lại sau.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <VRow class="auth-wrapper bg-surface" no-gutters>
    <VCol md="8" class="d-none d-md-flex">
      <div class="position-relative bg-background w-100 me-0">
        <div
          class="d-flex align-center justify-center w-100 h-100"
          style="
            padding-inline: 6.25rem;background-image: url(images/bg-login.jpg);
            background-size: cover;
            background-position: center;
          "
        >
          <h1
            style="
              position: absolute;
              max-width: 410px;
              color: #fff;
              bottom: 35px;
              right: 30px;
              padding: 25px;
              text-align: right;
            "
          >
            Tạo gian hàng, tìm kiếm & kết nối với nhà mua nông sản, thực phẩm
          </h1>
        </div>
        <img class="auth-footer-mask" :src="authThemeMask" alt="auth-footer-mask" height="280" width="100" />
      </div>
    </VCol>

    <VCol cols="12" md="4" class="d-flex align-center justify-center">
      <VCard flat :max-width="500" class="mt-12 mt-sm-0 pa-4">
        <VCardText>
          <RouterLink to="/">
            <div class="d-flex align-center gap-x-3">
              <VNodeRenderer :nodes="themeConfig.app.logo" />
            </div>
          </RouterLink>
          <h4 class="text-h4 mb-1 mt-7">Đặt lại mật khẩu?</h4>
          <p class="mb-0">
            Vui lòng nhập địa chỉ email của bạn và gửi. Một liên kết đặt lại sẽ được gửi đến email của bạn.
          </p>
        </VCardText>

        <VCardText>
          <!-- Thông báo -->
          <VAlert
            v-if="successMsg"
            type="success"
            variant="tonal"
            class="mb-4"
            :text="successMsg"
          />
          <VAlert
            v-if="serverError"
            type="error"
            variant="tonal"
            class="mb-4"
            :text="serverError"
          />

          <VForm @submit.prevent="submitForgot">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <AppTextField
                  v-model="email"
                  autofocus
                  label="Email *"
                  type="email"
                  placeholder="Nhập email của bạn"
                  :error="!!fieldErrors.email"
                  :error-messages="fieldErrors.email"
                />
              </VCol>

              <!-- Reset link -->
              <VCol cols="12">
                <VBtn block type="submit" :loading="loading" :disabled="loading">Gửi yêu cầu</VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink class="d-flex align-center justify-center" :to="{ name: 'login' }">
                  <VIcon icon="tabler-chevron-left" size="20" class="me-1 flip-in-rtl" />
                  <span>Trở lại Đăng nhập</span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
