<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const loading = ref(true)
const saving  = ref(false)
const successMsg = ref('')
const errorMsg   = ref('')
const errors = reactive({})

const form = reactive({
  id: null,
  name: '',
  type: 'company',
  business_type: 'trader',

  email: '',
  phone: '',
  website: '',
  facebook: '',
  zalo: '',
  linkedin: '',

  country: 'VN',
  province: '',
  district: '',
  ward: '',
  address: '',
  lat: null,
  lng: null,

  tax_code: '',
  description: '',
  main_products: '',
  capacity_per_month: null,
  capacity_unit: '',

  logo_path: '',
  banner_path: '',

  // NEW: các trường server trả về liên quan duyệt
  business_license_path: '',   // NEW
  verification_status: '',     // NEW
  rejection_reason: '',        // NEW
  blue_tick: false,            // NEW
})

// file chọn mới
const logoFile   = ref(null)
const bannerFile = ref(null)
// NEW: license file
const licenseFile = ref(null)

// preview ảnh
const previewLogo   = ref('')
const previewBanner = ref('')

// NEW: preview license (nếu là ảnh thì xem, nếu PDF thì hiển thị icon/link)
const previewLicense = ref('')
const licenseMime = ref('')

const clearErrors = () => {
  Object.keys(errors).forEach(k => delete errors[k])
  errorMsg.value = ''
}

const setFieldError = (field, msg) => {
  errors[field] = Array.isArray(msg) ? msg[0] : msg
}

const buildPublicUrlFromPath = path => {
  if (!path) return ''
  const base = import.meta.env.VITE_PUBLIC_BASE_URL || ''
  // Nếu BE đã map sẵn /storage hoặc /uploads thì base có thể để rỗng
  return `${base}${path}`
}

// Khi người dùng chọn file -> tạo preview
const onLogoChange = fileOrFiles => {
  const f = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles
  logoFile.value = f || null
  if (f) {
    const r = new FileReader()
    r.onload = e => { previewLogo.value = e.target.result }
    r.readAsDataURL(f)
  } else {
    previewLogo.value = buildPublicUrlFromPath(form.logo_path)
  }
}
const onBannerChange = fileOrFiles => {
  const f = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles
  bannerFile.value = f || null
  if (f) {
    const r = new FileReader()
    r.onload = e => { previewBanner.value = e.target.result }
    r.readAsDataURL(f)
  } else {
    previewBanner.value = buildPublicUrlFromPath(form.banner_path)
  }
}

// NEW: chọn license
const onLicenseChange = fileOrFiles => {
  const f = Array.isArray(fileOrFiles) ? fileOrFiles[0] : fileOrFiles
  licenseFile.value = f || null
  if (!f) {
    previewLicense.value = buildPublicUrlFromPath(form.business_license_path)
    licenseMime.value = ''
    return
  }
  licenseMime.value = f.type || ''
  // nếu là ảnh → preview, nếu pdf → không preview, chỉ link/tên
  if (licenseMime.value.startsWith('image/')) {
    const r = new FileReader()
    r.onload = e => { previewLicense.value = e.target.result }
    r.readAsDataURL(f)
  } else {
    previewLicense.value = '' // để hiển thị link hoặc tên file
  }
}

const fetchCompany = async () => {
  loading.value = true
  clearErrors()
  successMsg.value = ''
  try {
    const { data } = await api.get('/portal/company')
    if (data?.company) {
      Object.assign(form, {
        id: data.company.id,
        name: data.company.name ?? '',
        type: data.company.type ?? 'company',
        business_type: data.company.business_type ?? 'trader',

        email: data.company.email ?? '',
        phone: data.company.phone ?? '',
        website: data.company.website ?? '',
        facebook: data.company.facebook ?? '',
        zalo: data.company.zalo ?? '',
        linkedin: data.company.linkedin ?? '',

        country: data.company.country ?? 'VN',
        province: data.company.province ?? '',
        district: data.company.district ?? '',
        ward: data.company.ward ?? '',
        address: data.company.address ?? '',
        lat: data.company.lat,
        lng: data.company.lng,

        tax_code: data.company.tax_code ?? '',
        description: data.company.description ?? '',
        main_products: data.company.main_products ?? '',
        capacity_per_month: data.company.capacity_per_month,
        capacity_unit: data.company.capacity_unit ?? '',

        logo_path: data.company.logo_path ?? '',
        banner_path: data.company.banner_path ?? '',

        // NEW: đồng bộ các trường duyệt
        business_license_path: data.company.business_license_path ?? '',
        verification_status: data.company.verification_status ?? 'pending',
        rejection_reason: data.company.rejection_reason ?? '',
        blue_tick: !!data.company.blue_tick,
      })
      previewLogo.value   = buildPublicUrlFromPath(form.logo_path)
      previewBanner.value = buildPublicUrlFromPath(form.banner_path)
      // NEW: preview license
      previewLicense.value = buildPublicUrlFromPath(form.business_license_path)
    } else {
      previewLogo.value   = ''
      previewBanner.value = ''
      previewLicense.value = ''
    }
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || 'Không tải được dữ liệu hồ sơ doanh nghiệp.'
  } finally {
    loading.value = false
  }
}
onMounted(fetchCompany)

const submit = async () => {
  clearErrors()
  successMsg.value = ''
  saving.value = true

  try {
    const fd = new FormData()

    // text fields
    fd.append('name', form.name ?? '')
    fd.append('type', form.type ?? 'company')
    fd.append('business_type', form.business_type ?? 'trader')

    fd.append('email', form.email ?? '')
    fd.append('phone', form.phone ?? '')
    fd.append('website', form.website ?? '')
    fd.append('facebook', form.facebook ?? '')
    fd.append('zalo', form.zalo ?? '')
    fd.append('linkedin', form.linkedin ?? '')

    fd.append('country', form.country ?? '')
    fd.append('province', form.province ?? '')
    fd.append('district', form.district ?? '')
    fd.append('ward', form.ward ?? '')
    fd.append('address', form.address ?? '')

    if (form.lat !== null && form.lat !== undefined) fd.append('lat', form.lat)
    if (form.lng !== null && form.lng !== undefined) fd.append('lng', form.lng)

    fd.append('tax_code', form.tax_code ?? '')
    fd.append('description', form.description ?? '')
    fd.append('main_products', form.main_products ?? '')
    if (form.capacity_per_month !== null && form.capacity_per_month !== undefined)
      fd.append('capacity_per_month', form.capacity_per_month)
    fd.append('capacity_unit', form.capacity_unit ?? '')

    // Giữ nguyên logic path cho logo/banner nếu bạn CHO PHÉP nhập thủ công path
    if (!logoFile.value && form.logo_path)   fd.append('logo_path', form.logo_path)
    if (!bannerFile.value && form.banner_path) fd.append('banner_path', form.banner_path)

    // files
    if (logoFile.value)     fd.append('logo', logoFile.value)
    if (bannerFile.value)   fd.append('banner', bannerFile.value)
    if (licenseFile.value)  fd.append('business_license', licenseFile.value) // NEW

    // create/update
    let resp
    if (form.id) {
      resp = await api.post(`/portal/company/${form.id}?_method=PUT`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    } else {
      resp = await api.post('/portal/company', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    }

    const c = resp?.data?.company
    if (c) {
      Object.assign(form, {
        id: c.id,
        name: c.name ?? '',
        type: c.type ?? 'company',
        business_type: c.business_type ?? 'trader',

        email: c.email ?? '',
        phone: c.phone ?? '',
        website: c.website ?? '',
        facebook: c.facebook ?? '',
        zalo: c.zalo ?? '',
        linkedin: c.linkedin ?? '',

        country: c.country ?? 'VN',
        province: c.province ?? '',
        district: c.district ?? '',
        ward: c.ward ?? '',
        address: c.address ?? '',
        lat: c.lat,
        lng: c.lng,

        tax_code: c.tax_code ?? '',
        description: c.description ?? '',
        main_products: c.main_products ?? '',
        capacity_per_month: c.capacity_per_month,
        capacity_unit: c.capacity_unit ?? '',

        logo_path: c.logo_path ?? '',
        banner_path: c.banner_path ?? '',

        // NEW: đồng bộ lại license + trạng thái
        business_license_path: c.business_license_path ?? '',
        verification_status: c.verification_status ?? form.verification_status,
        rejection_reason: c.rejection_reason ?? '',
        blue_tick: !!c.blue_tick,
      })
      previewLogo.value     = buildPublicUrlFromPath(form.logo_path)
      previewBanner.value   = buildPublicUrlFromPath(form.banner_path)
      previewLicense.value  = buildPublicUrlFromPath(form.business_license_path)
      // Sau khi nộp license, BE sẽ đặt verification_status = 'pending'
    }

    successMsg.value = resp?.data?.message || 'Lưu hồ sơ doanh nghiệp thành công.'
  } catch (e) {
    if (e?.response?.status === 422 && e.response.data?.errors) {
      const server = e.response.data.errors
      Object.keys(server).forEach(k => setFieldError(k, server[k]))
      errorMsg.value = 'Vui lòng kiểm tra lại các trường thông tin.'
    } else {
      errorMsg.value = e?.response?.data?.message || 'Cập nhật thất bại.'
    }
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <VCard class="mb-6">
      <VCardItem>
        <VCardTitle>Thông tin doanh nghiệp</VCardTitle>
      </VCardItem>

      <VCardText>
        <VAlert
          v-if="successMsg"
          type="success"
          variant="tonal"
          class="mb-4"
        >
          {{ successMsg }}
        </VAlert>

        <VAlert
          v-if="errorMsg"
          type="error"
          variant="tonal"
          class="mb-4"
        >
          {{ errorMsg }}
        </VAlert>

        <VSkeletonLoader
          v-if="loading"
          type="list-item-two-line, image, list-item-two-line, image"
        />

        <template v-else>
          <VRow>
            <VCol cols="12" md="8">
              <VCard variant="outlined" class="mb-6">
                <VCardItem>
                  <VCardTitle>Thông tin cơ bản</VCardTitle>
                </VCardItem>
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="6">
                      <AppTextField
                        v-model="form.name"
                        label="Tên doanh nghiệp *"
                        :error-messages="errors.name"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <AppSelect
                        v-model="form.type"
                        :items="[{title:'Doanh nghiệp', value:'company'},{title:'Cá nhân', value:'individual'}]"
                        label="Loại hồ sơ *"
                        :error-messages="errors.type"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <AppSelect
                        v-model="form.business_type"
                        :items="[
                          {title:'Sản xuất', value:'manufacturer'},
                          {title:'Thương mại', value:'trader'},
                          {title:'Cả hai', value:'both'}
                        ]"
                        label="Hình thức kinh doanh"
                        :error-messages="errors.business_type"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <AppTextField
                        v-model="form.tax_code"
                        label="Mã số danh nghiệp"
                        :error-messages="errors.tax_code"
                      />
                    </VCol>
                    <VCol cols="12" md="12">
                      <AppTextField
                        v-model="form.description"
                        label="Mô tả"
                        placeholder="Mô tả ngắn về doanh nghiệp..."
                        :error-messages="errors.description"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>

              <VCard variant="outlined" class="mb-6">
                <VCardItem>
                  <VCardTitle>Liên hệ & hiện diện số</VCardTitle>
                </VCardItem>
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="6">
                      <AppTextField
                        v-model="form.email"
                        label="Email"
                        :error-messages="errors.email"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <AppTextField
                        v-model="form.phone"
                        label="Số điện thoại"
                        :error-messages="errors.phone"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <AppTextField
                        v-model="form.website"
                        label="Website"
                        placeholder="https://example.com"
                        :error-messages="errors.website"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <AppTextField
                        v-model="form.facebook"
                        label="Facebook URL"
                        placeholder="https://facebook.com/..."
                        :error-messages="errors.facebook"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <AppTextField
                        v-model="form.zalo"
                        label="Zalo"
                        :error-messages="errors.zalo"
                      />
                    </VCol>
                    <VCol cols="12" md="6">
                      <AppTextField
                        v-model="form.linkedin"
                        label="LinkedIn URL"
                        placeholder="https://linkedin.com/company/..."
                        :error-messages="errors.linkedin"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>

              <VCard variant="outlined" class="mb-6">
                <VCardItem>
                  <VCardTitle>Địa chỉ</VCardTitle>
                </VCardItem>
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="3">
                      <AppTextField
                        v-model="form.country"
                        label="Quốc gia"
                        :error-messages="errors.country"
                      />
                    </VCol>
                    <VCol cols="12" md="3">
                      <AppTextField
                        v-model="form.province"
                        label="Tỉnh/Thành"
                        :error-messages="errors.province"
                      />
                    </VCol>
                    <VCol cols="12" md="3">
                      <AppTextField
                        v-model="form.district"
                        label="Quận/Huyện"
                        :error-messages="errors.district"
                      />
                    </VCol>
                    <VCol cols="12" md="3">
                      <AppTextField
                        v-model="form.ward"
                        label="Phường/Xã"
                        :error-messages="errors.ward"
                      />
                    </VCol>
                    <VCol cols="12">
                      <AppTextField
                        v-model="form.address"
                        label="Địa chỉ"
                        :error-messages="errors.address"
                      />
                    </VCol>
                    <VCol cols="12" md="3">
                      <AppTextField
                        v-model="form.lat"
                        label="Vĩ độ (lat)"
                        type="number"
                        :error-messages="errors.lat"
                      />
                    </VCol>
                    <VCol cols="12" md="3">
                      <AppTextField
                        v-model="form.lng"
                        label="Kinh độ (lng)"
                        type="number"
                        :error-messages="errors.lng"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>

              <VCard variant="outlined" class="mb-6">
                <VCardItem>
                  <VCardTitle>Năng lực & Sản phẩm</VCardTitle>
                </VCardItem>
                <VCardText>
                  <VRow>
                    <VCol cols="12" md="6">
                      <AppTextField
                        v-model="form.main_products"
                        label="Sản phẩm chính"
                        :error-messages="errors.main_products"
                      />
                    </VCol>
                    <VCol cols="12" md="3">
                      <AppTextField
                        v-model="form.capacity_per_month"
                        label="Công suất/tháng"
                        type="number"
                        :error-messages="errors.capacity_per_month"
                      />
                    </VCol>
                    <VCol cols="12" md="3">
                      <AppTextField
                        v-model="form.capacity_unit"
                        label="Đơn vị (kg, tấn...)"
                        :error-messages="errors.capacity_unit"
                      />
                    </VCol>
                  </VRow>
                </VCardText>
              </VCard>
            </VCol>

            <VCol cols="12" md="4">
              <VCard variant="outlined" class="mb-6">
                <VCardItem>
                  <VCardTitle>Logo</VCardTitle>
                </VCardItem>
                <VCardText>
                  <div class="mb-4 d-flex align-center gap-4">
                    <VAvatar v-if="previewLogo" :image="previewLogo" size="80" rounded />
                    <div v-else class="text-disabled">Chưa có logo</div>
                  </div>

                  <VFileInput
                    label="Tải logo (JPG/PNG/WEBP ≤ 4MB)"
                    accept="image/png, image/jpeg, image/webp"
                    prepend-icon="tabler-upload"
                    @update:model-value="onLogoChange"
                    :error-messages="errors.logo"
                    show-size
                  />
                </VCardText>
              </VCard>

              <VCard variant="outlined" class="mb-6">
                <VCardItem>
                  <VCardTitle>Ảnh banner</VCardTitle>
                </VCardItem>
                <VCardText>
                  <div class="mb-4">
                    <VImg v-if="previewBanner" :src="previewBanner" height="120" cover class="rounded" />
                    <div v-else class="text-disabled">Chưa có banner</div>
                  </div>

                  <VFileInput
                    label="Tải banner (JPG/PNG/WEBP ≤ 8MB)"
                    accept="image/png, image/jpeg, image/webp"
                    prepend-icon="tabler-upload"
                    @update:model-value="onBannerChange"
                    :error-messages="errors.banner"
                    show-size
                  />
                </VCardText>
              </VCard>

              <!-- NEW: Giấy phép kinh doanh -->
              <VCard variant="outlined" class="mb-6">
                <VCardItem><VCardTitle>Giấy phép kinh doanh</VCardTitle></VCardItem>
                <VCardText>
                  <div class="mb-4">
                    <!-- Nếu là ảnh thì xem trước -->
                    <VImg
                      v-if="previewLicense && (!licenseMime || licenseMime.startsWith('image/'))"
                      :src="previewLicense"
                      height="120"
                      cover
                      class="rounded"
                    />
                    <!-- Nếu có path nhưng không phải ảnh (vd PDF) -->
                    <div v-else-if="form.business_license_path" class="text-body-2">
                      <a :href="buildPublicUrlFromPath(form.business_license_path)" target="_blank" rel="noopener">
                        Xem giấy phép đã nộp
                      </a>
                    </div>
                    <div v-else class="text-disabled">Chưa có giấy phép</div>
                  </div>

                  <VFileInput
                    label="Tải giấy phép (PDF/JPG/PNG/WEBP ≤ 5MB)"
                    accept="application/pdf, image/png, image/jpeg, image/webp"
                    prepend-icon="tabler-upload"
                    @update:model-value="onLicenseChange"
                    :error-messages="errors.business_license"
                    show-size
                  />

                  <!-- Trạng thái duyệt -->
                  <div class="mt-4">
                    <div class="text-caption text-medium-emphasis mb-1">Trạng thái xác minh</div>
                    <VChip
                      :color="form.verification_status === 'approved' ? 'success'
                              : form.verification_status === 'rejected' ? 'error'
                              : 'warning'"
                      variant="tonal"
                      class="mr-2"
                    >
                      {{ form.verification_status || 'pending' }}
                    </VChip>
                    <VIcon
                      v-if="form.blue_tick"
                      icon="tabler-check"
                      color="primary"
                      size="20"
                      class="ml-1"
                      title="Đã xác minh"
                    />
                    <div v-if="form.rejection_reason" class="text-error text-caption mt-2">
                      Lý do từ chối: {{ form.rejection_reason }}
                    </div>
                  </div>
                </VCardText>
              </VCard>
            </VCol>
          </VRow>

          <div class="d-flex justify-end mt-6">
            <VBtn
              color="primary"
              :loading="saving"
              @click="submit"
            >
              {{ form.id ? 'Lưu thay đổi' : 'Tạo hồ sơ' }}
            </VBtn>
          </div>
        </template>
      </VCardText>
    </VCard>
  </div>
</template>

<style scoped>
/* tuỳ chọn */
</style>
