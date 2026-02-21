<template>
  <div class="space-y-4">
    <div class="flex justify-center pb-3 border-b border-gray-200 dark:border-gray-700">
      <img v-if="category?.category_image" :src="getImageUrl(category.category_image)" alt="" class="h-40 w-40 object-cover border border-gray-300 dark:border-gray-600" style="border-radius: 4px" />
      <div v-else class="h-40 w-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600" style="border-radius: 4px">
        <ImageIcon class="h-16 w-16 text-gray-400" />
      </div>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Üst Kategori</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ category?.expand?.parent?.category_name || '-' }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Kategori Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ category?.category_name }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Açıklama</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ category?.category_description || '-' }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Durum</label>
      <p class="mt-1">
        <span :class="category?.category_status ? 'bg-green-500' : 'bg-gray-400'" class="px-2 py-1 rounded text-xs text-white font-medium">
          {{ category?.category_status ? 'Aktif' : 'Pasif' }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageIcon from '~/assets/svg/ImageIcon.vue'

export interface Category {
  id: string
  category_name: string
  category_description: string
  parent: string
  category_image: string
  category_status: boolean
  expand?: {
    parent?: {
      category_name: string
    }
  }
}

const props = defineProps<{
  category: Category | null
}>()

function getImageUrl(imageId: string) {
  return `/api/filemanager/files/fm_files/${imageId}`
}
</script>
