<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" @click="$emit('sort', 'hierarchy')">
            <span class="inline-flex items-center gap-1">
              <SortIcon :active="sortBy === 'hierarchy'" :direction="sortBy === 'hierarchy' ? sortOrder : null" class="w-4 h-4" />
              <span>Kategori Düzeni</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 w-24 uppercase text-xs text-left">Resim</th>
          <th class="px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 w-24 uppercase text-xs text-center">Durum</th>
          <th class="px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 w-40 text-center uppercase text-xs"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="loading" class="text-center">
          <td colspan="4" class="px-4 py-8 text-gray-500 dark:text-gray-400">Yükleniyor...</td>
        </tr>
        <tr v-else-if="!hierarchicalCategories.length" class="text-center">
          <td colspan="4" class="px-4 py-8 text-gray-500 dark:text-gray-400">Kategori bulunamadı</td>
        </tr>
        <tr v-for="item in hierarchicalCategories" :key="item.id" class="hover:bg-gray-100 dark:hover:bg-gray-700">
          <td class="px-4" :class="paddingClass">
            <div class="flex items-center" :class="{ 'font-bold': !isSearchMode && item.level === 0 }">
              <span v-if="!isSearchMode && item.level > 0" class="text-gray-800 dark:text-white font-mono mr-1" v-html="getIndentationString(item)"></span>
              <span class="text-gray-800 dark:text-white">{{ item.name }}</span>
            </div>
          </td>
          <td class="px-4" :class="paddingClass">
            <img v-if="item.image" :src="getFileUrl(item.image)" alt="" class="h-10 w-10 rounded-lg border border-gray-200 object-cover dark:border-gray-600" />
            <div v-else class="h-10 w-10 rounded-lg border border-gray-200 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 flex items-center justify-center">
              <ImageIcon class="text-gray-400 h-5 w-5" />
            </div>
          </td>
          <td class="px-4 text-center" :class="paddingClass">
            <button @click="$emit('toggleStatus', item)" :class="item.status ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'" class="px-3 py-1.5 rounded text-xs text-white font-medium transition-colors min-w-[60px]">
              {{ item.status ? 'Aktif' : 'Pasif' }}
            </button>
          </td>
          <td class="px-4" :class="paddingClass">
            <div class="flex items-center justify-center gap-1">
              <ViewButton @click="$emit('view', item)" />
              <EditButton @click="$emit('edit', item)" />
              <DeleteButton :item-id="item.id" :item-name="item.name" :on-delete="(id) => $emit('delete', id)" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="mt-4 flex items-center justify-between">
    <span class="text-sm text-gray-600 dark:text-gray-400">Toplam: {{ totalItems }} kayıt</span>
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 mr-4">
        <label class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Göster:</label>
        <select :value="perPage" @change="handlePerPageChange"
          class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white">
          <option :value="10">10</option>
          <option :value="20">20</option>
          <option :value="30">30</option>
          <option :value="40">40</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
          <option :value="999999">Tümü</option>
        </select>
      </div>
      <button :disabled="currentPage <= 1" @click="$emit('prevPage')"
        class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:border-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500">
        Önceki
      </button>
      <span class="text-sm text-gray-600 dark:text-gray-400">{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages" @click="$emit('nextPage')"
        class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:border-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500">
        Sonraki
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageIcon from '~/assets/svg/ImageIcon.vue'
import SortIcon from '~/assets/svg/SortIcon.vue'

export interface Category {
  id: string
  name: string
  description: string
  parent: string
  image: string
  status: boolean
  created: string
  updated: string
  level?: number
  isLast?: boolean
  parentIds?: string[]
  expand?: {
    parent?: {
      id: string
      name: string
    }
  }
}

const props = defineProps<{
  categories: Category[]
  loading: boolean
  currentPage: number
  totalPages: number
  perPage: number
  totalItems: number
  sortBy: 'name' | 'created' | 'hierarchy'
  sortOrder: 'asc' | 'desc'
  isSearchMode?: boolean
}>()

const emit = defineEmits<{
  view: [category: Category]
  edit: [category: Category]
  delete: [id: string]
  toggleStatus: [category: Category]
  prevPage: []
  nextPage: []
  sort: [field: 'name' | 'created' | 'hierarchy']
  perPageChange: [value: number]
}>()

// Categories are already hierarchical from parent component
interface HierarchicalCategory extends Category {
  level: number
  isLast: boolean
  parentIds: string[]
}

const hierarchicalCategories = computed((): HierarchicalCategory[] => {
  // Parent component already sends hierarchical data with level, isLast, parentIds
  return props.categories as HierarchicalCategory[]
})

// Dynamic padding class based on perPage
const paddingClass = computed(() => {
  return 'py-[0.2rem]'
})

// Handle per page change
function handlePerPageChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (value === '999999') {
    // "Tümü" seçildi, tüm kayıtları göster
    emit('perPageChange', 999999)
  } else {
    emit('perPageChange', Number(value))
  }
}

// Generate tree indentation string with L shape
function getIndentationString(item: HierarchicalCategory): string {
  if (item.level === 0) return ''
  
  // Level 1: 2 nbsp + L, Level 2: 6 nbsp + L, Level 3: 10 nbsp + L...
  // Her level için 4 nbsp artış
  const spaceCount = 2 + (item.level - 1) * 4
  const spaces = '&nbsp;'.repeat(spaceCount)
  return spaces + '└─&nbsp;'
}

function getFileUrl(fileId: string) {
  return `/api/filemanager/files/fm_files/${fileId}`
}
</script>
