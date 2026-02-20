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
      :sort-by="sortBy" :sort-order="sortOrder" :is-search-mode="isSearchActive"
      @view="openViewDrawerFetch" @edit="openEditDrawer" @delete="handleDelete" @toggle-status="handleToggleStatus" @prev-page="tableCurrentPage--" @next-page="tableCurrentPage++" @sort="handleSort" @per-page-change="(val) => { tablePerPage = val; tableCurrentPage = 1; }" />

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
  name: string
  description: string
  parent: string
  image: string | File
  status: boolean
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
  defaultForm: { name: '', description: '', parent: '', image: '', status: true },
  validationSchema: categorySchema,
  itemName: 'Kategori',
  icon: CategoryIcon,
})

// Varsayılan sıralama: A-Z (ascending)
sortBy.value = 'name'
sortOrder.value = 'asc'

// Custom delete handler with children check
async function handleDelete(id: string) {
  try {
    await handleDeleteBase(id)
    // Refresh both items and allCategories after successful deletion
    await fetchItems()
    await fetchAllCategories()
  } catch (error: any) {
    // Check if error is about children
    if (error?.data?.error === 'HAS_CHILDREN') {
      addToast(error.data.message, 'error')
    } else {
      // Re-throw other errors
      throw error
    }
  }
}

// Custom sort handler for hierarchy sorting
const handleSort = (field: 'name' | 'created' | 'hierarchy') => {
  if (field === 'hierarchy') {
    // Toggle sort order
    if (sortBy.value === 'hierarchy') {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = 'hierarchy'
      sortOrder.value = 'asc'
    }
    
    // Get all categories
    const categories = allCategories.value.length > 0 ? allCategories.value : items.value
    
    // Create a map for quick lookup
    const categoryMap = new Map(categories.map(c => [c.id, c]))
    
    // Get root categories and sort them
    const rootCategories = categories.filter(c => !c.parent || c.parent === '')
    rootCategories.sort((a, b) => {
      if (sortOrder.value === 'asc') {
        return a.name.localeCompare(b.name)
      } else {
        return b.name.localeCompare(a.name)
      }
    })
    
    // Recursively sort children for each category
    const sortChildren = (parentId: string): any[] => {
      const children = categories.filter(c => c.parent === parentId)
      // Sort children by name
      children.sort((a, b) => a.name.localeCompare(b.name))
      
      const result: any[] = []
      children.forEach(child => {
        result.push(child)
        result.push(...sortChildren(child.id))
      })
      return result
    }
    
    // Build final sorted array: root + its children, next root + its children, etc.
    const sortedItems: any[] = []
    rootCategories.forEach(root => {
      sortedItems.push(root)
      sortedItems.push(...sortChildren(root.id))
    })
    
    // Update allCategories array (this affects the table display)
    if (allCategories.value.length > 0) {
      allCategories.value = sortedItems
    } else {
      items.value = sortedItems
    }
  } else {
    setSort(field)
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
  // Build hierarchical options for select using all categories (not paginated)
  const categories = allCategories.value.length > 0 ? allCategories.value : items.value
  const result: { id: string; name: string; level: number; isLast: boolean; parentIds: string[] }[] = []
  const visited = new Set<string>()
  
  const addCategoryAndChildren = (category: any, level: number, isLast: boolean, parentIds: string[]) => {
    if (visited.has(category.id)) return
    if (category.id === selectedItem.value?.id) return // Skip current category (can't be its own parent)
    visited.add(category.id)
    
    result.push({
      id: category.id,
      name: category.name,
      level,
      isLast,
      parentIds: [...parentIds]
    })
    
    // Find and add children - sort by name A-Z
    const children = categories
      .filter(c => c.parent === category.id)
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    children.forEach((child, index) => {
      const isLastChild = index === children.length - 1
      addCategoryAndChildren(child, level + 1, isLastChild, [...parentIds, category.id])
    })
  }
  
  // Start with root categories (no parent) - sort by name A-Z
  const rootCategories = categories
    .filter(c => !c.parent || c.parent === '')
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
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
  const isNewFile = form.value.image instanceof File
  if (drawerMode.value === 'create') {
    const body = new FormData()
    body.append('name', form.value.name.trim())
    if (form.value.description) body.append('description', form.value.description.trim())
    if (form.value.parent) body.append('parent', form.value.parent)
    body.append('status', form.value.status.toString())
    if (form.value.image) {
      if (isNewFile) {
        body.append('image', form.value.image)
      } else {
        body.append('image_id', form.value.image)
      }
    }
    await handleSubmit(body)
    // Refresh all categories after successful creation
    await fetchAllCategories()
  } else if (drawerMode.value === 'edit') {
    const body = new FormData()
    body.append('name', form.value.name.trim())
    if (form.value.description) body.append('description', form.value.description.trim())
    if (form.value.parent) body.append('parent', form.value.parent)
    body.append('status', form.value.status.toString())
    if (form.value.image) {
      if (isNewFile) {
        body.append('image', form.value.image)
      } else {
        body.append('image_id', form.value.image)
      }
    } else {
      body.append('image', 'null')
    }
    await handleSubmit(body)
    // Refresh all categories after successful update
    await fetchAllCategories()
  }
}

async function handleToggleStatus(category: Category) {
  try {
    const body = new FormData()
    body.append('name', category.name)
    body.append('description', category.description || '')
    body.append('parent', category.parent || '')
    body.append('status', (!category.status).toString())
    if (category.image) {
      body.append('image_id', category.image)
    } else {
      body.append('image', 'null')
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

// Computed property to check if search is active
const isSearchActive = computed(() => {
  return !!(searchQuery.value && searchQuery.value.trim())
})

// Computed property for table display
// When searching, use items (search results), otherwise use allCategories
const allCategoriesForTable = computed(() => {
  if (isSearchActive.value) {
    // When searching, use the search results (items)
    return items.value
  }
  // When not searching, use all categories for proper hierarchy display
  return allCategories.value.length > 0 ? allCategories.value : items.value
})

// Build hierarchical tree from all categories
const hierarchicalCategories = computed(() => {
  const categories = allCategoriesForTable.value
  
  // When searching, show flat list without hierarchy
  if (searchQuery.value.trim()) {
    return categories.map((c: any) => ({
      id: c.id,
      name: c.name,
      parent: c.parent,
      image: c.image,
      status: c.status,
      level: 0,
      isLast: true,
      parentIds: []
    }))
  }
  
  // Normal mode: build hierarchy
  const result: { id: string; name: string; parent: string; image: string; status: boolean; level: number; isLast: boolean; parentIds: string[] }[] = []
  const visited = new Set<string>()
  
  const addCategoryAndChildren = (category: any, level: number, isLast: boolean, parentIds: string[]) => {
    if (visited.has(category.id)) return
    visited.add(category.id)
    
    result.push({
      id: category.id,
      name: category.name,
      parent: category.parent,
      image: category.image,
      status: category.status,
      level,
      isLast,
      parentIds: [...parentIds]
    })
    
    // Find and add children - sort children by name A-Z
    const children = categories
      .filter(c => c.parent === category.id)
      .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    children.forEach((child, index) => {
      const isLastChild = index === children.length - 1
      addCategoryAndChildren(child, level + 1, isLastChild, [...parentIds, category.id])
    })
  }
  
  // Start with root categories (no parent) - sort by name A-Z
  const rootCategories = categories
    .filter(c => !c.parent || c.parent === '')
    .sort((a, b) => a.name.localeCompare(b.name, 'tr'))
  rootCategories.forEach((category, index) => {
    const isLastRoot = index === rootCategories.length - 1
    addCategoryAndChildren(category, 0, isLastRoot, [])
  })
  
  // Handle orphaned categories
  categories.forEach(category => {
    if (!visited.has(category.id)) {
      result.push({
        id: category.id,
        name: category.name,
        parent: category.parent,
        image: category.image,
        status: category.status,
        level: 0,
        isLast: true,
        parentIds: []
      })
    }
  })
  
  return result
})

// Table pagination state
const tableCurrentPage = ref(1)
const tablePerPage = ref(10)

// Computed property for paginated display - uses hierarchical categories
const displayItems = computed(() => {
  const allItems = hierarchicalCategories.value
  // If "Tümü" is selected (999999), show all items
  if (tablePerPage.value >= 999999) {
    return allItems
  }
  const start = (tableCurrentPage.value - 1) * tablePerPage.value
  const end = start + tablePerPage.value
  return allItems.slice(start, end)
})

// Total pages for table
const tableTotalPages = computed(() => {
  return Math.ceil(hierarchicalCategories.value.length / tablePerPage.value)
})

onMounted(async () => {
  await fetchItems()
  // Fetch all categories for proper hierarchy display in table
  await fetchAllCategories()
})
</script>
