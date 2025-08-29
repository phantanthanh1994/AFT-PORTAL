<script setup>
    import { ref, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import { useGenerateImageVariant } from '@core/composable/useGenerateImageVariant'
    import { VNodeRenderer } from '@layouts/components/VNodeRenderer'
    import { themeConfig } from '@themeConfig'
    import registerMultiStepIllustrationDark from '@images/illustrations/register-multi-step-illustration-dark.png'
    import registerMultiStepIllustrationLight from '@images/illustrations/register-multi-step-illustration-light.png'
    import registerMultiStepBgDark from '@images/pages/register-multi-step-bg-dark.png'
    import registerMultiStepBgLight from '@images/pages/register-multi-step-bg-light.png'
    import api from '@/services/api'

    // ===== META & ROUTER =====
    definePage({ meta: { layout: 'blank', public: true } })
    const router = useRouter()

    // ===== CONSTANTS =====
    const BUSINESS_TYPES = ['Sản xuất', 'Thương mại', 'Dịch vụ', 'Công nghệ', 'Khác']
    const REGIONS = ['Toàn quốc', 'Miền Bắc', 'Miền Trung', 'Miền Nam', 'Quốc tế']

    const STEPPER_ITEMS = [
        { title: 'Tài khoản', subtitle: 'Đăng ký bằng email', icon: 'tabler-mail' },
        { title: 'Liên hệ', subtitle: 'Thông tin cá nhân', icon: 'tabler-user' },
        { title: 'Doanh nghiệp', subtitle: 'Thông tin doanh nghiệp', icon: 'tabler-building' }
    ]

    const MAIL_PROVIDERS = {
        'gmail.com': 'https://mail.google.com',
        'outlook.com': 'https://outlook.live.com',
        'hotmail.com': 'https://outlook.live.com',
        'yahoo.com': 'https://mail.yahoo.com',
        'icloud.com': 'https://www.icloud.com/mail'
    }

    // ===== UTILITIES =====
    const useDebounce = (fn, wait = 400) => {
        let timer
        return (...args) => {
          clearTimeout(timer)
          timer = setTimeout(() => fn(...args), wait)
        }
    }

    // ===== REACTIVE STATE =====
    // UI State
    const currentStep = ref(0)
    const isPasswordVisible = ref(false)
    const isConfirmPasswordVisible = ref(false)

    // Loading States
    const submitting = ref(false)
    const validatingStep1 = ref(false)
    const showOverlay = ref(false)

    // Form Data
    const form = ref({
        // Step 1 - Account
        email: '',
        password: '',
        password_confirmation: '',
        agree_terms: true,

        // Step 2 - Contact
        name: '',
        phone: '',

        // Step 3 - Business
        company_name: '',
        founded_year: '',
        business_type: null,
        operating_region: null,
        company_website: '',
        business_license: null
    })

    // Error Handling
    const errors = ref({})

    // Success Dialog
    const successOpen = ref(false)
    const successEmail = ref('')

    // Error Dialog
    const errorDialogOpen = ref(false)
    const errorDialogTitle = ref('Không thể hoàn tất đăng ký')
    const errorDialogMsgs = ref([])

    // ===== COMPUTED =====
    const registerMultiStepBg = useGenerateImageVariant(registerMultiStepBgLight, registerMultiStepBgDark)
    const registerMultiStepIllustration = useGenerateImageVariant(registerMultiStepIllustrationLight, registerMultiStepIllustrationDark)

    const currentYear = computed(() => new Date().getFullYear())

    // ===== VALIDATION METHODS =====
    const setFieldError = (field, message) => {
        errors.value[field] = message
    }

    const clearErrors = () => {
        errors.value = {}
    }

    const validateEmail = (email) => {
        const emailRegex = /^\S+@\S+\.\S+$/
        return emailRegex.test(email)
    }

    const validateURL = (url) => {
        const urlRegex = /^https?:\/\/.+/i
        return urlRegex.test(url)
    }

    const validateStep1 = () => {
        let isValid = true

        if (!form.value.email) {
            setFieldError('email', 'Vui lòng nhập email')
            isValid = false
        } else if (!validateEmail(form.value.email)) {
            setFieldError('email', 'Email không hợp lệ')
            isValid = false
        }

        if (!form.value.password) {
            setFieldError('password', 'Vui lòng nhập mật khẩu')
            isValid = false
        } else if (form.value.password.length < 8) {
            setFieldError('password', 'Mật khẩu tối thiểu 8 ký tự')
            isValid = false
        }

        if (form.value.password_confirmation !== form.value.password) {
            setFieldError('password_confirmation', 'Xác nhận mật khẩu không khớp')
            isValid = false
        }

        if (!form.value.agree_terms) {
            setFieldError('agree_terms', 'Bạn cần đồng ý điều khoản')
            isValid = false
        }

        return isValid
    }

    const validateStep2 = () => {
        let isValid = true

        if (!form.value.name?.trim()) {
            setFieldError('name', 'Vui lòng nhập họ và tên')
            isValid = false
        }

        if (!form.value.phone?.trim()) {
            setFieldError('phone', 'Vui lòng nhập số điện thoại')
            isValid = false
        }

        return isValid
    }

    const validateStep3 = () => {
        let isValid = true

        if (!form.value.company_name?.trim()) {
            setFieldError('company_name', 'Vui lòng nhập tên tổ chức/công ty')
            isValid = false
        }

        if (!form.value.founded_year) {
            setFieldError('founded_year', 'Vui lòng nhập năm thành lập')
            isValid = false
        } else {
            const year = Number(form.value.founded_year)
            if (isNaN(year) || year < 1900 || year > currentYear.value) {
                setFieldError('founded_year', 'Năm thành lập không hợp lệ')
                isValid = false
            }
        }

        if (!form.value.business_type) {
            setFieldError('business_type', 'Vui lòng chọn loại hình kinh doanh')
            isValid = false
        }

        if (!form.value.operating_region) {
            setFieldError('operating_region', 'Vui lòng chọn khu vực hoạt động')
            isValid = false
        }

        if (form.value.company_website && !validateURL(form.value.company_website)) {
            setFieldError('company_website', 'URL không hợp lệ (cần bắt đầu bằng http:// hoặc https://)')
            isValid = false
        }

        return isValid
    }

    const validateStep = (step) => {
        clearErrors()

        switch (step) {
            case 0: return validateStep1()
            case 1: return validateStep2()
            case 2: return validateStep3()
            default: return true
        }
    }

    // ===== ERROR HANDLING =====
    const extractMessagesFromAxiosError = (error) => {
        const messages = []
        const response = error?.response

        if (!response) {
            messages.push('Không thể kết nối máy chủ. Vui lòng kiểm tra mạng và thử lại.')
            return messages
        }

        // Laravel 422 validation errors
        if (response.status === 422 && response.data?.errors) {
            const serverErrors = response.data.errors
            Object.keys(serverErrors).forEach(key => {
                const value = serverErrors[key]
                if (Array.isArray(value) && value.length) {
                    messages.push(value[0])
                } else if (typeof value === 'string') {
                    messages.push(value)
                }
            })
            if (!messages.length && response.data?.message) {
                messages.push(response.data.message)
            }
            return messages
        }

        // Other error codes
        if (typeof response.data?.message === 'string') {
            messages.push(response.data.message)
        } else {
            messages.push('Đã xảy ra lỗi không xác định. Vui lòng thử lại.')
        }

        return messages
    }

    // ===== API METHODS =====
    const serverValidateStep1 = async () => {
        if (!validateStep1()) return false

        validatingStep1.value = true
        try {
            await api.post('/portal/auth/validate-step1', {
                email: form.value.email,
                password: form.value.password,
                password_confirmation: form.value.password_confirmation
            })
          return true
        } catch (error) {
            if (error?.response?.status === 422 && error.response.data?.errors) {
                const serverErrors = error.response.data.errors
                Object.keys(serverErrors).forEach(key => {
                    const errorMsg = Array.isArray(serverErrors[key]) ? serverErrors[key][0] : serverErrors[key]
                    setFieldError(key, errorMsg)
                })
            } else {
              setFieldError('general', error?.response?.data?.message || 'Không thể xác thực. Thử lại sau.')
            }
            return false
        } finally {
            validatingStep1.value = false
        }
    }

    // ===== EVENT HANDLERS =====
    const debouncedServerValidateStep1 = useDebounce(() => {
        if (currentStep.value === 0) {
            serverValidateStep1()
        }
    }, 500)

    const onFileChange = (files) => {
        form.value.business_license = Array.isArray(files) ? files[0] : files
    }

    const openMailProvider = () => {
        const email = successEmail.value || form.value.email
        const domain = (email.split('@')[1] || '').toLowerCase()
        const url = MAIL_PROVIDERS[domain] || `https://${domain}`
        window.open(url, '_blank')
    }

    const handleNext = async () => {
        if (!validateStep(currentStep.value)) return

        if (currentStep.value === 0) {
            const isValid = await serverValidateStep1()
            if (!isValid) return
        }

        currentStep.value++
    }

    const handlePrevious = () => {
        if (currentStep.value > 0) {
            currentStep.value--
        }
    }

    // ===== FORM SUBMISSION =====
    const buildFormData = () => {
        const formData = new FormData()

        // Step 1 - Account
        formData.append('email', form.value.email)
        formData.append('password', form.value.password)
        formData.append('password_confirmation', form.value.password_confirmation)
        formData.append('agree_terms', form.value.agree_terms ? '1' : '0')

        // Step 2 - Contact
        formData.append('name', form.value.name)
        formData.append('phone', form.value.phone)

        // Step 3 - Business
        formData.append('company_name', form.value.company_name)
        formData.append('founded_year', String(form.value.founded_year))
        formData.append('business_type', form.value.business_type || '')
        formData.append('operating_region', form.value.operating_region || '')

        if (form.value.company_website) {
            formData.append('company_website', form.value.company_website)
        }

        if (form.value.business_license) {
            formData.append('business_license', form.value.business_license)
        }

        return formData
    }

    const onSubmit = async () => {
        if (!validateStep(2)) return

        submitting.value = true
        showOverlay.value = true
        clearErrors()

        try {
            const formData = buildFormData()
            await api.post('/register', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })

            successEmail.value = form.value.email
            successOpen.value = true
        } catch (error) {
            if (error?.response?.status === 422 && error.response.data?.errors) {
                const serverErrors = error.response.data.errors
                Object.keys(serverErrors).forEach(key => {
                    const errorMsg = Array.isArray(serverErrors[key]) ? serverErrors[key][0] : serverErrors[key]
                    setFieldError(key, errorMsg)
                })
            } else {
                setFieldError('general', error?.response?.data?.message || 'Đăng ký thất bại')
            }

            errorDialogMsgs.value = extractMessagesFromAxiosError(error)
            errorDialogOpen.value = true
        } finally {
            submitting.value = false
            showOverlay.value = false
        }
    }

    const gotoLogin = () => {
        successOpen.value = false
        router.push({ name: 'login', query: { registered: '1' } })
    }

    // ===== BLUR EVENT HANDLERS =====
    const onEmailBlur = () => debouncedServerValidateStep1()
    const onPasswordBlur = () => debouncedServerValidateStep1()
    const onPasswordConfirmBlur = () => debouncedServerValidateStep1()
</script>

<template>
    <RouterLink to="/">
      <div class="auth-logo d-flex align-center justify-center gap-x-3">
        <VNodeRenderer :nodes="themeConfig.app.logo" />
      </div>
    </RouterLink>

    <VRow no-gutters class="auth-wrapper">
      <!-- Background Column -->
      <VCol md="4" class="d-none d-md-flex">
        <div class="d-flex justify-center align-center w-100 position-relative auth-multisteps-bg-height" />
      </VCol>

      <!-- Form Column -->
      <VCol 
        cols="12" 
        md="8" 
        class="auth-card-v2 d-flex align-center justify-center pa-10" 
        style="background-color: rgb(var(--v-theme-surface));"
      >
        <VCard flat class="mt-12 mt-sm-10">
          <!-- Stepper -->
          <AppStepper
            v-model:current-step="currentStep"
            :items="STEPPER_ITEMS"
            :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
            icon-size="22"
            class="stepper-icon-step-bg mb-12"
          />

          <!-- Form Steps -->
          <VWindow v-model="currentStep" class="disable-tab-transition" style="max-inline-size: 681px;">
            <!-- Step 1: Account Information -->
            <VWindowItem>
              <h4 class="text-h4">Tạo tài khoản</h4>
              <p class="text-body-1 mb-6">Đăng ký bằng email</p>

              <VRow>
                <VCol cols="12">
                  <AppTextField 
                    v-model="form.email" 
                    label="Địa chỉ email *" 
                    placeholder="name@example.com" 
                    :error-messages="errors.email"
                    @blur="onEmailBlur"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="form.password"
                    label="Mật khẩu *"
                    placeholder="············"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    autocomplete="new-password"
                    :append-inner-icon="isPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    :error-messages="errors.password"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    @blur="onPasswordBlur"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppTextField
                    v-model="form.password_confirmation"
                    label="Xác nhận mật khẩu *"
                    placeholder="············"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    autocomplete="new-password"
                    :append-inner-icon="isConfirmPasswordVisible ? 'tabler-eye-off' : 'tabler-eye'"
                    :error-messages="errors.password_confirmation"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                    @blur="onPasswordConfirmBlur"
                  />
                </VCol>

                <VCol cols="12">
                  <VCheckbox v-model="form.agree_terms" :error-messages="errors.agree_terms">
                    <template #label>
                      <span>
                        Bằng việc tham gia, tôi đồng ý với
                        <RouterLink to="/terms" class="text-primary"> Điều khoản sử dụng</RouterLink>,
                        <RouterLink to="/privacy" class="text-primary"> Chính sách quyền riêng tư</RouterLink>,
                        <RouterLink to="/disclaimer" class="text-primary"> Tuyên bố từ chối trách nhiệm</RouterLink>
                        của AFT và nhận email liên quan đến dịch vụ của chúng tôi.
                      </span>
                    </template>
                  </VCheckbox>
                </VCol>
              </VRow>
            </VWindowItem>

            <!-- Step 2: Contact Information -->
            <VWindowItem>
              <h4 class="text-h4">Thông tin liên hệ</h4>
              <p class="text-body-1 mb-6">Vui lòng cung cấp họ và tên, số điện thoại</p>

              <VRow>
                <VCol cols="12" md="8">
                  <AppTextField 
                    v-model="form.name" 
                    label="Họ và tên *" 
                    placeholder="Nguyễn Văn A" 
                    :error-messages="errors.name" 
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <AppTextField 
                    v-model="form.phone" 
                    label="Số điện thoại *" 
                    placeholder="+84 912 345 678" 
                    :error-messages="errors.phone" 
                  />
                </VCol>
              </VRow>
            </VWindowItem>

            <!-- Step 3: Business Information -->
            <VWindowItem>
              <h4 class="text-h4">Thông tin doanh nghiệp</h4>
              <p class="text-body-1 mb-6">Điền thông tin tổ chức/công ty</p>

              <VRow>
                <VCol cols="12" md="8">
                  <AppTextField 
                    v-model="form.company_name" 
                    label="Tên tổ chức/công ty *" 
                    placeholder="Công ty TNHH ABC" 
                    :error-messages="errors.company_name" 
                  />
                </VCol>

                <VCol cols="12" md="4">
                  <AppTextField 
                    v-model="form.founded_year" 
                    label="Năm thành lập *" 
                    placeholder="2015" 
                    :error-messages="errors.founded_year" 
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppSelect
                    v-model="form.business_type"
                    :items="BUSINESS_TYPES"
                    label="Loại hình kinh doanh *"
                    placeholder="Chọn loại hình"
                    :error-messages="errors.business_type"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppSelect
                    v-model="form.operating_region"
                    :items="REGIONS"
                    label="Khu vực hoạt động *"
                    placeholder="Chọn khu vực"
                    :error-messages="errors.operating_region"
                  />
                </VCol>

                <VCol cols="12">
                  <AppTextField 
                    v-model="form.company_website" 
                    label="Trang web công ty" 
                    placeholder="https://abc.com" 
                    :error-messages="errors.company_website" 
                  />
                </VCol>

                <VCol cols="12">
                  <VFileInput
                    label="Tải lên giấy phép kinh doanh (PDF/JPG/PNG)"
                    accept=".pdf,image/*"
                    prepend-icon="tabler-upload"
                    show-size
                    :error-messages="errors.business_license"
                    @update:model-value="onFileChange"
                  />
                </VCol>

                <!-- General Error Display -->
                <VCol v-if="errors.general" cols="12">
                  <p class="text-error">{{ errors.general }}</p>
                </VCol>
              </VRow>
            </VWindowItem>
          </VWindow>

          <!-- Navigation Buttons -->
          <div class="d-flex flex-wrap justify-space-between gap-x-4 mt-6">
            <VBtn
              color="secondary"
              variant="tonal"
              :disabled="currentStep === 0 || submitting"
              @click="handlePrevious"
            >
              <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" />
              Quay lại
            </VBtn>

            <!-- Submit Button (Final Step) -->
            <VBtn
              v-if="currentStep === STEPPER_ITEMS.length - 1"
              color="success"
              :loading="submitting"
              :disabled="submitting"
              @click="onSubmit"
            >
              Đăng ký
            </VBtn>

            <!-- Next Button -->
            <VBtn
              v-else
              :disabled="submitting || validatingStep1"
              :loading="validatingStep1"
              @click="handleNext"
            >
              Tiếp tục
              <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
            </VBtn>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <!-- Loading Overlay -->
    <VOverlay v-model="showOverlay" class="align-center justify-center" persistent scrim>
        <VProgressCircular indeterminate size="48" />
        <div class="mt-3 text-white">Đang xử lý đăng ký...</div>
    </VOverlay>

    <!-- Success Dialog -->
    <VDialog v-model="successOpen" width="520" persistent>
        <VCard>
            <VCardTitle class="text-success">
                <VIcon icon="tabler-check" class="me-2" />
                Đăng ký thành công
            </VCardTitle>

            <VCardText>
                <p class="mb-2">
                  Vui lòng kiểm tra hộp thư <strong>{{ successEmail || form.email }}</strong> để xác minh tài khoản.
                </p>
                <p>Nếu không thấy, hãy kiểm tra thêm mục <em>Spam/Quảng cáo</em>.</p>
            </VCardText>

            <VCardActions class="justify-end">
                <VBtn variant="tonal" color="secondary" @click="openMailProvider">
                    Mở hộp thư
                </VBtn>
                <VBtn color="primary" @click="gotoLogin">
                    Đăng nhập ngay
                </VBtn>
          </VCardActions>
        </VCard>
    </VDialog>

    <!-- Error Dialog -->
    <VDialog v-model="errorDialogOpen" width="560">
        <VCard>
            <VCardTitle class="text-error">
                <VIcon icon="tabler-alert-triangle" class="me-2" />
                {{ errorDialogTitle }}
            </VCardTitle>

            <VCardText>
                <ul class="mb-2">
                    <li v-for="(message, index) in errorDialogMsgs" :key="index">
                      {{ message }}
                    </li>
                </ul>
                <div v-if="errors.general" class="text-error mt-2">
                    {{ errors.general }}
                </div>
            </VCardText>

            <VCardActions class="justify-end">
                <VBtn color="primary" @click="errorDialogOpen = false">
                    Đã hiểu
                </VBtn>
            </VCardActions>
        </VCard>
    </VDialog>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.illustration-image {
  block-size: 550px;
  inline-size: 248px;
}

.bg-image {
  inset-block-end: 0;
}

.text-error {
  color: rgb(var(--v-theme-error));
  margin-top: 0.25rem;
}

.auth-multisteps-bg-height {
  background-image: url(images/bg-register.jpg);
  background-size: cover;
  background-position: center;
}
</style>