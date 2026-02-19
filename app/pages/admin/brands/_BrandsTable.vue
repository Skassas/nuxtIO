<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 w-16">Sıra</th>
          <th class="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 w-20">Resim</th>
          <th class="px-4 py-2 font-medium text-gray-600 dark:text-gray-300">Marka Adı</th>
          <th class="px-4 py-2 font-medium text-gray-600 dark:text-gray-300">Açıklama</th>
          <th class="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 w-40 text-center"></th>
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
          <td class="px-4 py-2 text-gray-700 dark:text-gray-300">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-4 py-2">
            <img v-if="brand.image" :src="getImageUrl(brand.image)" alt="" class="h-8 w-8 rounded object-cover" />
            <div v-else class="h-8 w-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <ImageIcon class="text-gray-400" />
            </div>
          </td>
          <td class="px-4 py-2 font-medium text-gray-800 dark:text-white">{{ brand.name }}</td>
          <td class="px-4 py-2 text-gray-600 dark:text-gray-400">{{ brand.description || '-' }}</td>
          <td class="px-4 py-2">
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

  <div class="mt-4 flex items-center justify-end gap-2">
    <button :disabled="currentPage <= 1" @click="$emit('prevPage')"
      class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600 dark:text-gray-300">
      Onceki
    </button>
    <span class="text-sm text-gray-600 dark:text-gray-400">{{ currentPage }} / {{ totalPages }}</span>
    <button :disabled="currentPage >= totalPages" @click="$emit('nextPage')"
      class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600 dark:text-gray-300">
      Sonraki
    </button>
  </div>
</template>

<script setup lang="ts">
import ImageIcon from '~/assets/svg/ImageIcon.vue'

export interface Brand {
  id: string
  name: string
  description: string
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
}>()

defineEmits<{
  view: [brand: Brand]
  edit: [brand: Brand]
  delete: [id: string]
  prevPage: []
  nextPage: []
}>()

function getImageUrl(imageId: string) {
  return `/api/filemanager/files/brands/${imageId}`
}
</script>
