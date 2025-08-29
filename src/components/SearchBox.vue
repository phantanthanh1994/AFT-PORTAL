<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api' // axios/ofetch instance của bạn

// Props tùy chọn
const props = defineProps({
  // endpoint lấy danh mục (đổi theo backend)
  categoriesEndpoint: { type: String, default: '/api/get_product_category' },
  // route đích khi tìm kiếm (mặc định dùng 1 trang results .html)
  resultsPath: { type: String, default: '/search.html' },
  // tên tham số query cho category & keyword
  categoryParam: { type: String, default: 'category_id' },
  keywordParam: { type: String, default: 'q' },
})

const router = useRouter()

// State
const categories = ref([{ id: '', name: 'Tất cả danh mục' }])
const selectedCategory = ref('')
const keyword = ref('')

// Load danh mục từ API
const loadCategories = async () => {
  try {
    const { data } = await api.get(props.categoriesEndpoint)
    // chuẩn hoá [{id, name}]
    console.log(data);
    const list = Array.isArray(data) ? data : (data?.data || [])
    const mapped = list.map(it => ({
        id: it.id ?? it.value ?? it.slug ?? '',
        name: it.name ?? it.title ?? it.label ?? '—',
    }))
    categories.value = [{ id: '', name: 'Tất cả sản phẩm' }, ...mapped]
  } catch {
    // fallback giữ duy nhất "Tất cả danh mục"
    categories.value = [{ id: '', name: 'Tất cả sản phẩm' }]
  }
}

onMounted(loadCategories)

const doSearch = () => {
  const query = {}
  if (selectedCategory.value) query[props.categoryParam] = selectedCategory.value
  if (keyword.value?.trim()) query[props.keywordParam] = keyword.value.trim()

  router.push({ path: props.resultsPath, query })
}
</script>

<template>
    <div class="search-onefield">
        <AppTextField
            v-model="keyword"
            placeholder="Bạn đang tìm gì... "
            clearable
            hide-details
            density="comfortable"
            variant="outlined"
            class="w-100"
            @keyup.enter="doSearch"
        >
            <template #prepend-inner>
              <AppSelect
                v-model="selectedCategory"
                :items="categories"
                item-title="name"
                item-value="id"
                placeholder="Danh mục"
                class="cat-select no-border-select d-none d-md-block"
              />
              <span class="divider d-none d-md-block" />
            </template>
            <template #append-inner>
              <VBtn size="small" color="primary d-none d-md-block" @click="doSearch">
                <VIcon icon="tabler-search" />
              </VBtn>
              <VBtn size="small" color="white d-md-none" @click="doSearch">
                <VIcon icon="tabler-search" />
              </VBtn>
            </template>
        </AppTextField>
    </div>
</template>

<style scoped>
    .g-3 { gap: .75rem; }
    .search-onefield{
        background: #fff;
        display: flex;
        flex: auto;
        overflow: hidden;
        border-radius: 7px;
        .cat-select {
            min-width: 160px;
            margin-inline-end: 8px;
            :deep(.v-field) {
                border-width: 0;
            }
        }
        .divider {
            inline-size: 1px;
            block-size: 24px;
            background: rgba(0,0,0,.12);
            margin-inline: 6px;
        }
        
    }
</style>
