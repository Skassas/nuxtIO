<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex-1 flex justify-center">
        <div class="relative w-full max-w-md">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon class="h-4 w-4 text-gray-400" />
          </div>
          <input v-model="searchQuery" @keyup.enter="search" type="text" placeholder="Kategori ara..."
            class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-16 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
          <button @click="search"
            class="absolute inset-y-0 right-0 rounded-r-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700">
            Ara
          </button>
        </div>
      </div>
      <button @click="openCreateDrawer"
        class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
        <PlusIcon />
        Yeni Kategori
      </button>
    </div>

    <CategoriesTable :categories="displayItems" :loading="loading" :current-page="tableCurrentPage" :total-pages="tableTotalPages" :per-page="tablePerPage" :total-items="allCategoriesForTable.length"
      :is-search-mode="isSearchActive"
      @view="openViewDrawerFetch" @edit="openEditDrawer" @delete="handleDelete" @toggle-status="handleToggleStatus" @prev-page="tableCurrentPage--" @next-page="tableCurrentPage++" @per-page-change="(val) => { tablePerPage = val; tableCurrentPage = 1; }" />

    <AdminDrawer :isOpen="drawerOpen" :title="drawerTitle" :icon="drawerIcon" @close="closeDrawer">
      <CategoriesView v-if="drawerMode === 'view'" :category="selectedItem" />
      <CategoriesForm v-else v-model="form" :errors="formErrors" :available-categories="availableCategories" :loading="loadingCategories" @submit="handleCategorySubmit" />
      <template #footer>
        <div class="flex justify-end gap-3">
          <template v-if="drawerMode === 'view'">
            <button type="button" @click="closeDrawer"
              class="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Kapat
            </button>
          </template>
          <template v-else>
            <button type="submit" form="category-form" :disabled="saving"
              class="w-24 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {{ saving ? 'Kaydediliyor...' : drawerMode === 'edit' ? 'Güncelle' : 'Kaydet' }}
            </button>
            <button type="button" @click="closeDrawer"
              class="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              İptal
            </button>
          </template>
        </div>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import PlusIcon from '~/assets/svg/PlusIcon.vue'
import SearchIcon from '~/assets/svg/SearchIcon.vue'
import CategoryIcon from '~/assets/svg/CategoryIcon.vue'
import CategoriesTable from './_CategoriesTable.vue'
import CategoriesForm from './_CategoriesForm.vue'
import CategoriesView from './_CategoriesView.vue'
import type { Category } from './_CategoriesTable.vue'
import { categorySchema } from '~/validations/categories'
import { useCrud } from '~/composables/useCrud'

const { addToast } = useToast()

definePageMeta({ layout: 'admin' })

interface CategoryForm {
  category_name: string
  category_description: string
  parent: string
  category_image: string | File
  category_status: boolean
}

const {
  items,
  loading,
  searchQuery,
  currentPage,
  perPage,
  totalPages,
  totalItems,
  sortBy,
  sortOrder,
  drawerOpen,
  drawerMode,
  selectedItem,
  form,
  formErrors,
  saving,
  drawerTitle,
  drawerIcon,
  fetchItems,
  search,
  setSort,
  openCreateDrawer: openCreateDrawerBase,
  openViewDrawerFetch,
  openEditDrawer: openEditDrawerBase,
  closeDrawer,
  handleSubmit,
  handleDelete: handleDeleteBase,
} = useCrud<CategoryForm & Category>({
  endpoint: 'categories',
  defaultForm: { category_name: '', category_description: '', parent: '', category_image: '', category_status: true },
  validationSchema: categorySchema,
  itemName: 'Kategori',
  icon: CategoryIcon,
})

// Varsayılan sıralama: A-Z (ascending)
sortBy.value = 'category_name'
sortOrder.value = 'asc'

// Custom delete handler with children check
async function handleDelete(id: string) {
  try {
    await handleDeleteBase(id)
    await fetchItems()
    await fetchAllCategories()
  } catch (error: any) {
    if (error?.data?.error === 'HAS_CHILDREN') {
      addToast(error.data.message, 'error')
    } else {
      throw error
    }
  }
}

const allCategories = ref<Category[]>([])
const loadingCategories = ref(false)

async function fetchAllCategories() {
  loadingCategories.value = true
  try {
    const res = await $fetch<any>('/api/admin/categories', {
      params: { perPage: 1000 },
    })
    allCategories.value = res.items || []
  } catch {
    allCategories.value = []
  } finally {
    loadingCategories.value = false
  }
}

const availableCategories = computed(() => {
  const categories = allCategories.value.length > 0 ? allCategories.value : items.value
  const result: { id: string; category_name: string; level: number; isLast: boolean; parentIds: string[] }[] = []
  const visited = new Set<string>()
  
  const addCategoryAndChildren = (category: any, level: number, isLast: boolean, parentIds: string[]) => {
    if (visited.has(category.id)) return
    if (category.id === selectedItem.value?.id) return
    visited.add(category.id)
    
    result.push({
      id: category.id,
      category_name: category.category_name,
      level,
      isLast,
      parentIds: [...parentIds]
    })
    
    const children = categories
      .filter(c => c.parent === category.id)
      .sort((a, b) => a.category_name.localeCompare(b.category_name, 'tr'))
    children.forEach((child, index) => {
      const isLastChild = index === children.length - 1
      addCategoryAndChildren(child, level + 1, isLastChild, [...parentIds, category.id])
    })
  }
  
  const rootCategories = categories
    .filter(c => !c.parent || c.parent === '')
    .sort((a, b) => a.category_name.localeCompare(b.category_name, 'tr'))
  rootCategories.forEach((category, index) => {
    const isLastRoot = index === rootCategories.length - 1
    addCategoryAndChildren(category, 0, isLastRoot, [])
  })
  
  return result
})

async function openCreateDrawer() {
  openCreateDrawerBase()
  await fetchAllCategories()
}

async function openEditDrawer(item: CategoryForm & Category) {
  openEditDrawerBase(item)
  await fetchAllCategories()
}

async function handleCategorySubmit() {
  const isNewFile = form.value.category_image instanceof File
  if (drawerMode.value === 'create') {
    const body = new FormData()
    body.append('category_name', form.value.category_name.trim())
    if (form.value.category_description) body.append('category_description', form.value.category_description.trim())
    if (form.value.parent) body.append('parent', form.value.parent)
    body.append('category_status', form.value.category_status.toString())
    if (form.value.category_image) {
      if (isNewFile) {
        body.append('category_image', form.value.category_image)
      } else {
        body.append('image_id', form.value.category_image)
      }
    }
    await handleSubmit(body)
    await fetchAllCategories()
  } else if (drawerMode.value === 'edit') {
    const body = new FormData()
    body.append('category_name', form.value.category_name.trim())
    if (form.value.category_description) body.append('category_description', form.value.category_description.trim())
    if (form.value.parent) body.append('parent', form.value.parent)
    body.append('category_status', form.value.category_status.toString())
    if (form.value.category_image) {
      if (isNewFile) {
        body.append('category_image', form.value.category_image)
      } else {
        body.append('image_id', form.value.category_image)
      }
    } else {
      body.append('category_image', 'null')
    }
    await handleSubmit(body)
    await fetchAllCategories()
  }
}

async function handleToggleStatus(category: Category) {
  try {
    const body = new FormData()
    body.append('category_name', category.category_name)
    body.append('category_description', category.category_description || '')
    body.append('parent', category.parent || '')
    body.append('category_status', (!category.category_status).toString())
    if (category.category_image) {
      body.append('image_id', category.category_image)
    } else {
      body.append('category_image', 'null')
    }
    
    await $fetch(`/api/admin/categories/${category.id}`, {
      method: 'PUT',
      body
    })
    
    await fetchItems()
  } catch (error) {
    console.error('Status güncellenirken hata:', error)
  }
}

const isSearchActive = computed(() => {
  return !!(searchQuery.value && searchQuery.value.trim())
})

const allCategoriesForTable = computed(() => {
  if (isSearchActive.value) {
    return items.value
  }
  return allCategories.value.length > 0 ? allCategories.value : items.value
})

const hierarchicalCategories = computed(() => {
  const categories = allCategoriesForTable.value
  
  if (searchQuery.value.trim()) {
    return categories.map((c: any) => ({
      id: c.id,
      category_name: c.category_name,
      parent: c.parent,
      category_image: c.category_image,
      category_status: c.category_status,
      level: 0,
      isLast: true,
      parentIds: []
    }))
  }
  
  const result: { id: string; category_name: string; parent: string; category_image: string; category_status: boolean; level: number; isLast: boolean; parentIds: string[] }[] = []
  const visited = new Set<string>()
  
  const addCategoryAndChildren = (category: any, level: number, isLast: boolean, parentIds: string[]) => {
    if (visited.has(category.id)) return
    visited.add(category.id)
    
    result.push({
      id: category.id,
      category_name: category.category_name,
      parent: category.parent,
      category_image: category.category_image,
      category_status: category.category_status,
      level,
      isLast,
      parentIds: [...parentIds]
    })
    
    const children = categories
      .filter(c => c.parent === category.id)
      .sort((a, b) => a.category_name.localeCompare(b.category_name, 'tr'))
    children.forEach((child, index) => {
      const isLastChild = index === children.length - 1
      addCategoryAndChildren(child, level + 1, isLastChild, [...parentIds, category.id])
    })
  }
  
  const rootCategories = categories
    .filter(c => !c.parent || c.parent === '')
    .sort((a, b) => a.category_name.localeCompare(b.category_name, 'tr'))
  rootCategories.forEach((category, index) => {
    const isLastRoot = index === rootCategories.length - 1
    addCategoryAndChildren(category, 0, isLastRoot, [])
  })
  
  categories.forEach(category => {
    if (!visited.has(category.id)) {
      result.push({
        id: category.id,
        category_name: category.category_name,
        parent: category.parent,
        category_image: category.category_image,
        category_status: category.category_status,
        level: 0,
        isLast: true,
        parentIds: []
      })
    }
  })
  
  return result
})

const tableCurrentPage = ref(1)
const tablePerPage = ref(10)

const displayItems = computed(() => {
  const allItems = hierarchicalCategories.value
  if (tablePerPage.value >= 999999) {
    return allItems
  }
  const start = (tableCurrentPage.value - 1) * tablePerPage.value
  const end = start + tablePerPage.value
  return allItems.slice(start, end)
})

const tableTotalPages = computed(() => {
  return Math.ceil(hierarchicalCategories.value.length / tablePerPage.value)
})

onMounted(async () => {
  await fetchItems()
  await fetchAllCategories()
})
</script>
