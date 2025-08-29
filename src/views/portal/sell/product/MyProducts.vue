<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import api from '@/services/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const prefixWithPlus = n => (Number(n) > 0 ? `+${n}` : String(n))

/* =========================
   👉 Bảng dữ liệu
   ========================= */
const headers = [
    { title: 'Sản phẩm', key: 'product' },
    { title: 'Danh mục', key: 'category' },
    { title: 'Trạng thái', key: 'status' },
    { title: 'Hành động', key: 'actions', sortable: false },
]

// Filters
const selectedStatus = ref()
const selectedCategory = ref()   // (Client-side – demo; Backend chưa filter theo category)
const selectedStock = ref()
const searchQuery = ref('')

// Table state
const selectedRows = ref([])
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref(null)
const orderBy = ref(null)
const loading = ref(false)
const errorMsg = ref('')

// Server data
const rawItems = ref([])
const totalItems = ref(0)

const statusOptions = ref([
    { title: 'Đã duyệt', value: 'published' },
    { title: 'Chờ duyệt', value: 'pending' },
    { title: 'Bản nháp', value: 'draft' },
    { title: 'Đang duyệt', value: 'archived' },
])

// Demo categories (nếu muốn lấy từ API riêng thì thay thế)
const categories = ref([
  { title: 'Accessories', value: 'accessories' },
  { title: 'Home Decor', value: 'home-decor' },
  { title: 'Electronics', value: 'electronics' },
  { title: 'Shoes', value: 'shoes' },
  { title: 'Office', value: 'office' },
  { title: 'Games', value: 'games' },
])

const stockStatus = ref([
  { title: 'Còn hàng', value: 'in_stock' },
  { title: 'Hết hàng', value: 'out_of_stock' },
  { title: 'Đặt hàng trước', value: 'pre_order' },
])

const updateOptions = opt => {
  const first = opt.sortBy?.[0]
  sortBy.value = first?.key || null
  orderBy.value = first?.order || null
  // Khi đổi sort → về trang 1
  page.value = 1
}

/* =========================
   👉 Helpers hiển thị
   ========================= */
const resolveStatus = v => {
  if (v === 'published') return { text: 'Published', color: 'success' }
  if (v === 'draft')     return { text: 'Draft',     color: 'warning' }
  if (v === 'archived')  return { text: 'Archived',  color: 'secondary' }
  // nếu sau này dùng pending/approved/rejected:
  // if (v === 'pending')  return { text: 'Pending',   color: 'warning' }
  // if (v === 'approved') return { text: 'Approved',  color: 'success' }
  // if (v === 'rejected') return { text: 'Rejected',  color: 'error' }
  return { text: v, color: 'default' }
}

const resolveCategory = catName => {
  // demo icon màu theo tên
  const name = (catName || '').toLowerCase()
  if (name.includes('access'))     return { color: 'error',   icon: 'tabler-device-watch' }
  if (name.includes('decor'))      return { color: 'info',    icon: 'tabler-home' }
  if (name.includes('electronic')) return { color: 'primary', icon: 'tabler-device-imac' }
  if (name.includes('shoe'))       return { color: 'success', icon: 'tabler-shoe' }
  if (name.includes('office'))     return { color: 'warning', icon: 'tabler-briefcase' }
  if (name.includes('game'))       return { color: 'primary', icon: 'tabler-device-gamepad-2' }
  return { color: 'secondary', icon: 'tabler-tag' }
}

/* =========================
   👉 Fetch API (server-side)
   ========================= */
const fetchProducts = async () => {
  loading.value = true
  errorMsg.value = ''
  try {
    const { data } = await api.get('/products', {
      params: {
        q:         searchQuery.value || undefined,
        status:    selectedStatus.value || undefined,  // backend đã hỗ trợ
        stock:     selectedStock.value || undefined,   // nếu muốn: tự map client → server
        page:      page.value,
        per_page:  itemsPerPage.value,
        sortBy:    sortBy.value,
        orderBy:   orderBy.value,
      },
    })
    // Laravel paginator
    rawItems.value  = data.data || []
    totalItems.value = data.total || 0
  } catch (e) {
    errorMsg.value = e?.response?.data?.message || 'Không thể tải danh sách sản phẩm'
  } finally {
    loading.value = false
  }
}

// Tự động refetch khi filter/sort/paging thay đổi (debounce nhẹ search)
let searchTimer
watch([selectedStatus, selectedStock, itemsPerPage, page, sortBy, orderBy], fetchProducts, { immediate: true })
watch(searchQuery, () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    page.value = 1
    fetchProducts()
  }, 300)
})

/* =========================
   👉 Map data cho VDataTableServer
   ========================= */
const products = computed(() => {
  // map raw → items theo keys header
  return rawItems.value.map(p => {
    const image = p.images?.[0]?.url || null
    const categoryName = p.categories?.[0]?.name || '' // nếu API trả categories; nếu chưa có, để rỗng
    return {
      id: p.id,
      image,
      productName: p.name,
      productBrand: p.brand?.name || '',
      category: categoryName,
      stock: p.stock_status === 'in_stock',
      sku: p.sku || '',
      price: typeof p.price === 'number' ? p.price : (p.price ?? null),
      qty: p.stock_quantity ?? 0,
      status: p.status,      // draft|published|archived (hiện tại)
      raw: p,
    }
  })
})
const totalProduct = computed(() => totalItems.value)

/* =========================
   👉 Actions
   ========================= */
const deleteProduct = async id => {
  if (!confirm('Bạn chắc chắn muốn xoá sản phẩm này?')) return
  try {
    await api.delete(`/products/${id}`)
    // loại khỏi selectedRows nếu có
    const idx = selectedRows.value.findIndex(x => x === id)
    if (idx !== -1) selectedRows.value.splice(idx, 1)
    await fetchProducts()
  } catch (e) {
    alert(e?.response?.data?.message || 'Xoá thất bại')
  }
}

const goAddProduct = () => {
    router.push('/business/sell/products/create') // đổi route nếu trang create của bạn khác
}

const buildPublicUrlFromPath = path => {
  if (!path) return ''
  const base = import.meta.env.VITE_PUBLIC_BASE_URL || ''
  // Nếu BE đã map sẵn /storage hoặc /uploads thì base có thể để rỗng
  return `${base}${path}`
}
</script>

<template>
  <div>
    <!-- 👉 filters -->
    <VCard class="mb-6">
      <div class="d-flex flex-wrap gap-4 pa-3">
        <div class="d-flex align-center">
          <AppTextField v-model="searchQuery" placeholder="Tìm sản phẩm" style="inline-size: 200px;" class="me-3" />
          <AppSelect v-model="selectedStatus" placeholder="Tình trạng" :items="statusOptions" style="inline-size: 150px;" clearable clear-icon="tabler-x" class="me-3" />
          <AppSelect v-model="selectedCategory" placeholder="Danh mục" :items="categories" style="inline-size: 200px;" clearable clear-icon="tabler-x" />
        </div>
        <div class="d-flex align-center">
            
        </div>

        <VSpacer />
        <div class="d-flex gap-4 flex-wrap align-center">
          <AppSelect v-model="itemsPerPage" :items="[5, 10, 20, 25, 50]" />
          <VBtn variant="tonal" color="secondary" prepend-icon="tabler-upload">Export</VBtn>
          <VBtn color="primary" prepend-icon="tabler-plus" @click="goAddProduct">Tạo sản phẩm</VBtn>
        </div>
      </div>
    </VCard>

    <!-- 👉 Datatable -->
    <VCard>
      <VDataTableServer
        v-model:items-per-page="itemsPerPage"
        v-model:model-value="selectedRows"
        v-model:page="page"
        :headers="headers"
        show-select
        :items="products"
        :items-length="totalProduct"
        class="text-no-wrap"
        :loading="loading"
        loading-text="Đang tải dữ liệu..."
        @update:options="updateOptions"
      >
        <template #top>
          <VAlert v-if="errorMsg" type="error" variant="tonal" class="ma-4">{{ errorMsg }}</VAlert>
        </template>

        <!-- product -->
        <template #item.product="{ item }">
          <div class="d-flex align-center gap-x-4">
            <VAvatar v-if="item.image" size="38" variant="tonal" rounded :image="buildPublicUrlFromPath(item.image)" />
            <div class="d-flex flex-column">
              <span class="text-body-1 font-weight-medium text-high-emphasis">{{ item.productName }}</span>
              <span class="text-body-2">{{ item.productBrand }}</span>
            </div>
          </div>
        </template>

        <!-- category (demo) -->
        <template #item.category="{ item }">
          <VAvatar size="30" variant="tonal" :color="resolveCategory(item.category)?.color" class="me-4">
            <VIcon :icon="resolveCategory(item.category)?.icon" size="18" />
          </VAvatar>
          <span class="text-body-1 text-high-emphasis">{{ item.category || '-' }}</span>
        </template>

        <!-- stock -->
        <template #item.stock="{ item }">
          <VChip :color="item.stock ? 'success' : 'error'" label size="small">
            {{ item.stock ? 'In Stock' : 'Out' }}
          </VChip>
        </template>

        <!-- status -->
        <template #item.status="{ item }">
          <VChip v-bind="resolveStatus(item.status)" density="default" label size="small" />
        </template>

        <!-- price -->
        <template #item.price="{ item }">
          <span>{{ item.price != null ? Intl.NumberFormat().format(item.price) : '-' }}</span>
        </template>

        <!-- qty -->
        <template #item.qty="{ item }">
          <span>{{ item.qty }}</span>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <IconBtn @click="$router.push(`/business/sell/products/${item.id}/edit/`)">
            <VIcon icon="tabler-edit" />
          </IconBtn>

          <IconBtn>
            <VIcon icon="tabler-dots-vertical" />
            <VMenu activator="parent">
              <VList>
                <VListItem value="download" prepend-icon="tabler-download">Tải về</VListItem>
                <VListItem value="delete" prepend-icon="tabler-trash" @click="deleteProduct(item.id)">Xoá</VListItem>
                <VListItem value="duplicate" prepend-icon="tabler-copy">Nhân bản</VListItem>
              </VList>
            </VMenu>
          </IconBtn>
        </template>

        <!-- pagination -->
        <template #bottom>
          <TablePagination v-model:page="page" :items-per-page="itemsPerPage" :total-items="totalProduct" />
        </template>
      </VDataTableServer>
    </VCard>
  </div>
</template>
