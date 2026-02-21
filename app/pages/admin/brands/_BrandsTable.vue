<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-16 uppercase text-xs text-center hidden md:table-cell">Sıra</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-24 uppercase text-xs text-left hidden md:table-cell">Resim</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs align-middle" @click="$emit('sort', 'brand_name')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'brand_name'" :direction="sortBy === 'brand_name' ? sortOrder : null" class="w-4 h-4" />
              <span>Marka Adı</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs hidden md:table-cell">Açıklama</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-40 text-center uppercase text-xs bg-transparent"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="loading" class="text-center">
          <td colspan="5" class="px-4 py-8 text-gray-500 dark:text-gray-400">Yükleniyor...</td>
        </tr>
        <tr v-else-if="!brands.length" class="text-center">
          <td colspan="5" class="px-4 py-8 text-gray-500 dark:text-gray-400">Marka bulunamadı</td>
        </tr>
        <tr v-for="(brand, index) in brands" :key="brand.id" class="hover:bg-gray-100 dark:hover:bg-gray-700">
          <td class="px-4 py-1 text-gray-700 dark:text-gray-300 text-center hidden md:table-cell">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-4 py-1 hidden md:table-cell">
            <img v-if="brand.image" :src="getImageUrl(brand.image)" alt="" class="h-8 w-8 rounded-lg border border-gray-200 object-cover dark:border-gray-600" />
            <div v-else class="h-8 w-8 rounded-lg border border-gray-200 bg-gray-200 dark:bg-gray-700 dark:border-gray-600 flex items-center justify-center">
              <ImageIcon class="text-gray-400 h-5 w-5" />
            </div>
          </td>
          <td class="px-4 py-1 text-gray-800 dark:text-white">{{ brand.brand_name }}</td>
          <td class="px-4 py-1 text-gray-600 dark:text-gray-400 hidden md:table-cell">{{ brand.brand_description || '-' }}</td>
          <td class="px-4 py-1">
            <div class="flex items-center justify-center gap-1">
              <ViewButton @click="$emit('view', brand)" />
              <EditButton @click="$emit('edit', brand)" />
              <DeleteButton :item-id="brand.id" :item-name="brand.name" :on-delete="(id) => $emit('delete', id)" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="mt-4 flex items-center justify-between">
    <span class="text-sm text-gray-600 dark:text-gray-400">Toplam: {{ totalItems }} kayıt</span>
    <div class="flex items-center gap-2">
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

export interface Brand {
  id: string
  brand_name: string
  brand_description: string
  image: string
  created: string
  updated: string
}

const props = defineProps<{
  brands: Brand[]
  loading: boolean
  currentPage: number
  totalPages: number
  perPage: number
  totalItems: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>()

defineEmits<{
  view: [brand: Brand]
  edit: [brand: Brand]
  delete: [id: string]
  prevPage: []
  nextPage: []
  sort: [field: string]
}>()

function getImageUrl(imageId: string) {
  return `/api/filemanager/files/brands/${imageId}`
}
</script>
