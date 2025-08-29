<!-- src/views/portal/sell/product/ProductForm.vue -->
<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

// Router
const route = useRoute()
const router = useRouter()
const productId = computed(() => route.params.id ?? null)
const isEdit = computed(() => !!productId.value)

// =============================
// State
// =============================
const loadingInit = ref(true)
const saving = ref(false)
const notify = ref({ type: 'success', message: '', show: false })

const form = ref({
  id: null,
  name: '',
  sku: '',
  type: 'sell',                 // sell | buy
  product_type: 'simple',       // simple|variable|service|bundle
  short_description: '',
  description: '',
  price: null,
  price_min: null,
  price_max: null,
  currency: 'VND',

  // Số lượng & tồn kho
  min_quantity: null,
  available_quantity: null,
  stock_quantity: null,
  stock_status: 'in_stock',

  // Trạng thái hiển thị
  status: 'draft',

  // Liên kết
  brand_id: null,
  category_id: null,            // CHỈ 1 danh mục
  tag_names: [],

  // Đơn vị hiển thị số lượng
  unit: 'Tấn',

  // Thuộc tính tự do
  attributes: [{ key: '', value: '' }],

  // Checkbox điều khoản
  agree_terms: true,
  agree_sourcing_ai: true,
})

// Media (mới + cũ)
const mainImageFile = ref(null)       // ảnh chính mới (File)
const mainImagePreview = ref('')      // preview ảnh chính mới
const mainImageOldUrl = ref('')       // ảnh chính cũ (URL)

const galleryOld = ref([])            // ảnh phụ cũ: [{id,url,checked:false}]
const removeImageIds = ref([])        // id ảnh cũ sẽ xóa
const galleryNewFiles = ref([])       // File[]
const galleryNewPreviews = ref([])    // preview ảnh mới

// Dropdown
const categories = ref([])            // danh mục phẳng [{title,value}]
const brands = ref([])                // [{title,value}]
const units = ref([
  { title: 'Tấn', value: 'Tấn' },
  { title: 'Kg', value: 'Kg' },
  { title: 'Gram', value: 'Gram' },
  { title: 'Lít', value: 'Lít' },
  { title: 'Mét', value: 'Mét' },
  { title: 'Chiếc', value: 'Chiếc' },
  { title: 'Hộp', value: 'Hộp' },
  { title: 'Thùng', value: 'Thùng' },
])
const currencies = ref([{ title: 'VND', value: 'VND' }])

const statusOptions = [
  { title: 'Nháp', value: 'draft' },
  { title: 'Công bố', value: 'published' },
  { title: 'Lưu trữ', value: 'archived' },
]
const stockOptions = [
  { title: 'Còn hàng', value: 'in_stock' },
  { title: 'Hết hàng', value: 'out_of_stock' },
  { title: 'Đặt trước', value: 'pre_order' },
]
const productTypes = [
  { title: 'Đơn giản', value: 'simple' },
  { title: 'Biến thể', value: 'variable' },
  { title: 'Dịch vụ', value: 'service' },
  { title: 'Gói/bundle', value: 'bundle' },
]

// =============================
// Helpers
// =============================
const openNotify = (type, message) => {
  notify.value = { type, message, show: true }
  setTimeout(() => (notify.value.show = false), 4000)
}

const flattenCats = (nodes, dst = [], prefix = '') => {
  (nodes || []).forEach(n => {
    dst.push({ title: `${prefix}${n.name}`, value: n.id })
    if (n.children?.length) flattenCats(n.children, dst, `${prefix}— `)
  })
  return dst
}

// Ảnh chính (mới)
const onMainImageChange = (file) => {
  if (mainImagePreview.value) URL.revokeObjectURL(mainImagePreview.value)
  if (file) {
    mainImageFile.value = file
    mainImagePreview.value = URL.createObjectURL(file)
  } else {
    mainImageFile.value = null
    mainImagePreview.value = ''
  }
}

// Ảnh phụ (mới)
const onFilesChange = filesInput => {
  galleryNewPreviews.value.forEach(u => URL.revokeObjectURL(u))
  galleryNewPreviews.value = []
  galleryNewFiles.value = []
  const arr = Array.isArray(filesInput) ? filesInput : (filesInput ? [filesInput] : [])
  galleryNewFiles.value = arr
  arr.forEach(f => galleryNewPreviews.value.push(URL.createObjectURL(f)))
}

// Đánh dấu xoá ảnh cũ
const toggleRemoveOld = (img) => {
  img.checked = !img.checked
  removeImageIds.value = galleryOld.value.filter(i => i.checked).map(i => i.id)
}

const addAttribute = () => form.value.attributes.push({ key: '', value: '' })
const removeAttribute = (i) => { if (form.value.attributes.length > 1) form.value.attributes.splice(i, 1) }

// Validate theo chính sách AFT
const validate = () => {
  if (!form.value.name?.trim()) return 'Vui lòng nhập tên sản phẩm'
  if (!form.value.category_id) return 'Vui lòng chọn danh mục sản phẩm'
  // Ảnh: tạo mới bắt buộc ≥ 1 ảnh; khi sửa có thể dùng ảnh cũ
  const hasOld = !!mainImageOldUrl.value || galleryOld.value.length > 0
  const hasNew = !!mainImageFile.value || (galleryNewFiles.value?.length > 0)
  if (!isEdit.value && !hasNew) return 'Vui lòng tải lên ít nhất 1 hình ảnh sản phẩm'
  if (isEdit.value && !hasOld && !hasNew) return 'Vui lòng thêm ít nhất 1 hình ảnh sản phẩm'
  // Khoảng giá
  if (form.value.price_min && form.value.price_max &&
      Number(form.value.price_min) > Number(form.value.price_max)) {
    return 'Khoảng giá không hợp lệ (giá tối thiểu phải <= giá tối đa)'
  }
  // Số lượng
  if (form.value.min_quantity && Number(form.value.min_quantity) < 0) return 'Số lượng tối thiểu không hợp lệ'
  if (form.value.available_quantity && Number(form.value.available_quantity) < 0) return 'Số lượng có sẵn không hợp lệ'
  // Điều khoản AFT là bắt buộc
  if (!form.value.agree_terms) return 'Bạn cần đồng ý Điều khoản sử dụng của AFT'
  return ''
}

// =============================
// Load init data (+ load product when edit)
// =============================
const loadInit = async () => {
  try {
    const [catRes, brandRes] = await Promise.all([
      api.get('/portal/product-categories', { params: { only_roots: 1, with_children: 1, per_page: 200 } }),
      api.get('/portal/brands').catch(() => ({ data: { data: [] } })),
    ])
    categories.value = flattenCats(catRes.data?.data ?? [], [])
    brands.value = (brandRes.data?.data ?? []).map(b => ({ title: b.name, value: b.id }))

    if (isEdit.value) {
      const pr = await api.get(`/products/${productId.value}`)
      const p = pr.data?.data ?? pr.data

      form.value = {
        ...form.value,
        id: p.id,
        name: p.name || '',
        sku: p.sku || '',
        type: p.type || 'sell',
        product_type: p.product_type || 'simple',
        short_description: p.short_description || '',
        description: p.description || '',
        price: p.price,
        price_min: p.price_min,
        price_max: p.price_max,
        currency: p.currency || 'VND',
        stock_quantity: p.stock_quantity,
        stock_status: p.stock_status || 'in_stock',
        status: p.status || 'draft',
        brand_id: p.brand_id || null,
        category_id: (p.categories && p.categories[0]?.id) || null,
        tag_names: (p.tags || []).map(t => t.name),
        unit: 'Tấn',
        min_quantity: null,
        available_quantity: null,
        attributes: [{ key:'', value:'' }],
        agree_terms: true,
        agree_sourcing_ai: true,
      }

      // Meta
      const meta = p.meta || []
      const findMeta = k => meta.find(m => m.meta_key === k)?.meta_value
      form.value.unit = findMeta('unit') || 'Tấn'
      form.value.min_quantity = findMeta('min_quantity') ?? null
      form.value.available_quantity = findMeta('available_quantity') ?? null

      const attrPairs = meta
        .filter(m => !['unit','min_quantity','available_quantity'].includes(m.meta_key))
        .map(m => ({ key: m.meta_key, value: String(m.meta_value ?? '') }))
      if (attrPairs.length) form.value.attributes = attrPairs

      // Images
      const imgs = p.images || []
      const thumb = imgs.find(i => i.role === 'thumbnail')
      mainImageOldUrl.value = thumb?.url || ''
      mainImageFile.value = null
      mainImagePreview.value = ''
      galleryOld.value = imgs.filter(i => i.role !== 'thumbnail').map(i => ({ id: i.id, url: i.url, checked: false }))
      removeImageIds.value = []
      galleryNewFiles.value = []
      galleryNewPreviews.value = []
    }
  } catch (e) {
    console.error(e)
    openNotify('error', 'Không tải được dữ liệu khởi tạo')
  } finally {
    loadingInit.value = false
  }
}
onMounted(loadInit)

// =============================
// Submit (create or update)
// =============================
const doSubmit = async (desiredStatus) => {
  const msg = validate()
  if (msg) { openNotify('error', msg); return }

  saving.value = true
  try {
    const fd = new FormData()

    // Trường cơ bản
    fd.append('name', form.value.name)
    if (form.value.sku) fd.append('sku', form.value.sku)
    fd.append('type', form.value.type)
    fd.append('product_type', form.value.product_type)

    // Mô tả
    if (form.value.short_description) fd.append('short_description', form.value.short_description)
    if (form.value.description) fd.append('description', form.value.description)

    // Giá
    if (form.value.price !== null && form.value.price !== '') fd.append('price', form.value.price)
    if (form.value.price_min !== null && form.value.price_min !== '') fd.append('price_min', form.value.price_min)
    if (form.value.price_max !== null && form.value.price_max !== '') fd.append('price_max', form.value.price_max)
    fd.append('currency', form.value.currency || 'VND')

    // Số lượng & kho
    if (form.value.min_quantity !== null && form.value.min_quantity !== '') fd.append('min_quantity', form.value.min_quantity)
    if (form.value.available_quantity !== null && form.value.available_quantity !== '') fd.append('available_quantity', form.value.available_quantity)
    if (form.value.stock_quantity !== null && form.value.stock_quantity !== '') fd.append('stock_quantity', form.value.stock_quantity)
    fd.append('stock_status', form.value.stock_status)

    // Trạng thái (FE gửi mong muốn; BE vẫn có thể ép về pending nếu sửa)
    fd.append('status', desiredStatus ?? form.value.status)

    // Liên kết
    if (form.value.brand_id) fd.append('brand_id', form.value.brand_id)
    if (form.value.category_id) fd.append('category_id', form.value.category_id)
    form.value.tag_names.forEach((t, i) => fd.append(`tag_names[${i}]`, t))

    // Thuộc tính → meta
    form.value.attributes.forEach((attr, i) => {
      if (attr.key && attr.value) {
        fd.append(`attributes[${i}][key]`, attr.key)
        fd.append(`attributes[${i}][value]`, attr.value)
      }
    })
    // Meta cố định
    fd.append('unit', form.value.unit || 'Tấn')

    // Ảnh
    if (mainImageFile.value) fd.append('main_image', mainImageFile.value)
    galleryNewFiles.value.forEach((f, i) => fd.append(`additional_images[${i}]`, f))
    removeImageIds.value.forEach((id, i) => fd.append(`remove_image_ids[${i}]`, id))

    if (isEdit.value) {
      // Update
      await api.post(`/products/${productId.value}?_method=PUT`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      openNotify('success', 'Cập nhật sản phẩm thành công. Sản phẩm sẽ được AFT duyệt trước khi hiển thị!')
    } else {
      // Create
      await api.post('/products', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      openNotify('success', 'Tạo sản phẩm thành công. Sản phẩm sẽ được AFT duyệt trước khi hiển thị!')
    }

    await nextTick()
    router.push({ name: 'portal-products-my' })
  } catch (e) {
    console.error(e)
    const msg = e?.response?.data?.message || (isEdit.value ? 'Cập nhật sản phẩm thất bại' : 'Tạo sản phẩm thất bại')
    openNotify('error', msg)
  } finally {
    saving.value = false
  }
}

const discard = () => router.back()
const saveDraft = () => doSubmit('draft')
const publishNow = () => doSubmit('published')

const statusText = computed(() => statusOptions.find(s => s.value === form.value.status)?.title)

const buildPublicUrlFromPath = path => {
  if (!path) return ''
  const base = import.meta.env.VITE_PUBLIC_BASE_URL || ''
  // Nếu BE đã map sẵn /storage hoặc /uploads thì base có thể để rỗng
  return `${base}${path}`
}
</script>

<template>
  <div>
    <!-- Header actions -->
    <div class="d-flex flex-wrap justify-start justify-sm-space-between gap-y-4 gap-x-6 mb-6">
      <div class="d-flex flex-column justify-center">
        <h4 class="text-h4 font-weight-medium">
          {{ isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới' }}
        </h4>
        <div class="text-body-1">
          {{ isEdit ? 'Cập nhật & gửi duyệt' : 'Cung cấp thông tin đầy đủ để AFT duyệt nhanh hơn' }}
        </div>
      </div>

      <div class="d-flex gap-4 align-center flex-wrap">
        <VBtn variant="tonal" color="secondary" @click="discard">Quay lại</VBtn>
        <VBtn variant="tonal" color="primary" :loading="saving" @click="saveDraft">
          {{ isEdit ? 'Lưu nháp' : 'Lưu nháp' }}
        </VBtn>
        <VBtn :loading="saving" @click="publishNow">
          {{ isEdit ? 'Cập nhật & gửi duyệt' : 'Gửi duyệt' }}
        </VBtn>
      </div>
    </div>

    <VAlert
      v-if="notify.show"
      class="mb-4"
      :type="notify.type"
      :title="notify.type === 'success' ? 'Thành công' : 'Lỗi'"
      :text="notify.message"
      closable
      @click:close="notify.show=false"
    />

    <VRow>
      <VCol md="8">
        <!-- Thông tin -->
        <VCard class="mb-6" title="Thông tin sản phẩm">
          <VCardText>
            <VRow>
              <VCol cols="12" md="6">
                <AppTextField
                  v-model="form.name"
                  label="Tên sản phẩm *"
                  placeholder="Ví dụ: Gạo ST25 hữu cơ"
                  :disabled="loadingInit || saving"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppSelect
                  v-model="form.category_id"
                  :items="categories"
                  label="Danh mục sản phẩm *"
                  placeholder="Chọn danh mục"
                  :disabled="saving || loadingInit"
                />
              </VCol>

              <VCol cols="12" md="6">
                <AppTextField v-model="form.sku" label="SKU" placeholder="Mã nội bộ (tuỳ chọn)" :disabled="saving" />
              </VCol>

              <VCol cols="12" md="6">
                <AppSelect
                  v-model="form.product_type"
                  :items="productTypes"
                  label="Loại sản phẩm"
                  :disabled="saving"
                />
              </VCol>

              <VCol cols="12">
                <AppTextField v-model="form.short_description" label="Mô tả ngắn" placeholder="Tóm tắt nổi bật…" :disabled="saving" />
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Ảnh đại diện -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title>
              Ảnh đại diện
              <span class="text-caption text-medium-emphasis">
                (JPG/PNG). Ảnh rõ nét giúp tăng tỉ lệ duyệt & chuyển đổi.
              </span>
            </template>
          </VCardItem>
          <VCardText>
            <div class="d-flex gap-4 align-center">
              <VFileInput
                label="Chọn ảnh"
                accept="image/*"
                prepend-icon="tabler-upload"
                show-size
                :disabled="saving"
                @update:model-value="onMainImageChange"
                style="max-width: 300px;"
              />
              <VAvatar v-if="mainImagePreview" size="84" rounded :image="mainImagePreview" />
              <VAvatar v-else-if="mainImageOldUrl" size="84" rounded :image="buildPublicUrlFromPath(mainImageOldUrl)" />
              <div v-else class="text-medium-emphasis">Chưa có ảnh</div>
            </div>
          </VCardText>
        </VCard>

        <!-- Ảnh phụ -->
        <VCard class="mb-6">
          <VCardItem>
            <template #title>
              Thư viện ảnh
              <span class="text-caption text-medium-emphasis"> (khuyến khích thêm ≥ 2 ảnh)</span>
            </template>
          </VCardItem>
          <VCardText>
            <!-- Cũ -->
            <div v-if="isEdit" class="mb-3">
              <div class="text-sm mb-2">Ảnh hiện có:</div>
              <div class="d-flex flex-wrap gap-4">
                <div v-for="img in galleryOld" :key="img.id" class="d-flex flex-column align-center">
                  <VAvatar size="84" rounded :image="buildPublicUrlFromPath(img.url)" />
                  <VCheckbox density="compact" v-model="img.checked" label="Xoá" @change="toggleRemoveOld(img)" />
                </div>
                <div v-if="!galleryOld.length" class="text-medium-emphasis">Không có ảnh phụ</div>
              </div>
            </div>
            <VDivider class="my-3"/>
            <!-- Mới -->
            <VFileInput
              label="Thêm ảnh mới"
              multiple
              accept="image/*"
              prepend-icon="tabler-upload"
              show-size
              :disabled="saving"
              @update:model-value="onFilesChange"
            />
            <div class="d-flex flex-wrap gap-4 mt-4">
              <VAvatar v-for="(src, i) in galleryNewPreviews" :key="i" size="84" rounded :image="src" />
            </div>
          </VCardText>
        </VCard>

        <!-- Giá & Số lượng -->
        <VCard class="mb-6" title="Giá & Số lượng">
          <VCardText>
            <VRow>
              <VCol cols="12" md="4">
                <AppTextField v-model="form.price" label="Giá niêm yết" placeholder="VD: 12000" :disabled="saving" type="number"/>
                <div class="price-hint">Đơn vị: {{ form.currency }}</div>
              </VCol>

              <VCol cols="12" md="4">
                <AppTextField v-model="form.price_min" label="Giá tối thiểu" placeholder="VD: 10000" :disabled="saving" type="number"/>
              </VCol>

              <VCol cols="12" md="4">
                <AppTextField v-model="form.price_max" label="Giá tối đa" placeholder="VD: 15000" :disabled="saving" type="number"/>
              </VCol>

              <VCol cols="12" md="4">
                <AppSelect v-model="form.currency" :items="currencies" label="Tiền tệ" :disabled="saving" />
              </VCol>

              <VCol cols="12" md="4">
                <AppSelect v-model="form.unit" :items="units" label="Đơn vị số lượng" :disabled="saving" />
              </VCol>

              <VCol cols="12" md="4">
                <AppTextField v-model="form.min_quantity" label="MOQ - Tối thiểu đặt hàng" placeholder="VD: 10" :disabled="saving" type="number"/>
              </VCol>

              <VCol cols="12" md="4">
                <AppTextField v-model="form.available_quantity" label="Số lượng có sẵn" placeholder="VD: 500" :disabled="saving" type="number"/>
              </VCol>

              <VCol cols="12" md="4">
                <AppTextField v-model="form.stock_quantity" label="Quản trị tồn (tuỳ chọn)" placeholder="VD: 500" :disabled="saving" type="number"/>
              </VCol>

              <VCol cols="12" md="4">
                <AppSelect v-model="form.stock_status" :items="stockOptions" label="Trạng thái hàng" :disabled="saving"/>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Thuộc tính -->
        <VCard class="mb-6" title="Thuộc tính (tuỳ chọn)">
          <VCardText>
            <VRow>
              <template v-for="(attr, index) in form.attributes" :key="index">
                <VCol cols="12" md="5">
                  <AppTextField v-model="attr.key" placeholder="Thuộc tính (VD: Xuất xứ)" :disabled="saving" />
                </VCol>
                <VCol cols="12" md="6">
                  <AppTextField v-model="attr.value" placeholder="Giá trị (VD: Việt Nam)" :disabled="saving" />
                </VCol>
                <VCol cols="12" md="1" class="d-flex align-center">
                  <VIcon
                    v-if="form.attributes.length > 1"
                    icon="tabler-x"
                    size="20"
                    style="cursor: pointer"
                    @click="removeAttribute(index)"
                  />
                </VCol>
              </template>

              <VCol cols="12">
                <VBtn variant="text" size="small" color="success" class="ms-0" @click="addAttribute">
                  Thêm thuộc tính
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

        <!-- Mô tả -->
        <VCard class="mb-6" title="Mô tả chi tiết">
          <VCardText>
            <ProductDescriptionEditor
              v-model="form.description"
              placeholder="Mô tả chi tiết: quy cách, kích thước, bao bì, chứng nhận,…"
              class="border rounded"
              variant="plain"
              :disabled="saving"
            />
          </VCardText>
        </VCard>

        <!-- Điều khoản -->
        <VCard class="mb-6">
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VCheckbox v-model="form.agree_terms" color="success" :disabled="saving">
                  <template #label>
                    <span class="text-sm">
                      Tôi đã đọc và đồng ý với
                      <RouterLink to="/terms" class="text-primary" target="_blank"> Điều khoản sử dụng </RouterLink>
                      và
                      <RouterLink to="/privacy" class="text-primary" target="_blank"> Chính sách quyền riêng tư </RouterLink>
                      của AFT.
                    </span>
                  </template>
                </VCheckbox>
                <VCheckbox v-model="form.agree_sourcing_ai" color="success" :disabled="saving">
                  <template #label>
                    <span class="text-sm">
                      Cho phép AFT Sourcing AI hỗ trợ phân phối nội dung sản phẩm đến người mua phù hợp (khuyến nghị).
                      <RouterLink to="/ai-policy" class="text-primary" target="_blank"> Tìm hiểu thêm </RouterLink>
                    </span>
                  </template>
                </VCheckbox>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>

      <VCol md="4" cols="12">
        <VCard :title="isEdit ? 'Trạng thái & Kho' : 'Cách AFT duyệt sản phẩm'" class="mb-6">
          <VCardText v-if="isEdit">
            <AppSelect v-model="form.status" :items="statusOptions" label="Trạng thái"/>
            <VDivider class="my-4"/>
            <AppSelect v-model="form.stock_status" :items="stockOptions" label="Tình trạng kho"/>
            <AppTextField v-model="form.stock_quantity" class="mt-4" type="number" label="Số lượng kho"/>
          </VCardText>
          <VCardText v-else>
            <ul class="ps-4">
              <li><strong>Ảnh rõ nét</strong>, mô tả minh bạch</li>
              <li><strong>Giá / MOQ</strong> hợp lý, thông tin liên hệ chính xác</li>
              <li>Tránh nội dung trùng lặp hoặc gây hiểu nhầm</li>
            </ul>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <VOverlay :model-value="loadingInit || saving" class="align-center justify-center">
      <VProgressCircular indeterminate />
    </VOverlay>
  </div>
</template>

<style lang="scss" scoped>
.price-hint { font-size: 0.75rem; color: rgba(var(--v-theme-on-surface), 0.6); margin-top: 4px; }
</style>

<style lang="scss">
.inventory-card {
  .v-tabs.v-tabs-pill {
    .v-slide-group-item--active.v-tab--selected.text-primary { h6 { color: #fff !important; } }
  }
  .v-radio-group, .v-checkbox {
    .v-selection-control { align-items: start !important; }
    .v-label.custom-input { border: none !important; }
  }
}
</style>
