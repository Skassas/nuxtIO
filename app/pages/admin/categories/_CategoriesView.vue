<template>
  <div class="space-y-4">
    <div class="flex justify-center">
      <img v-if="category?.image" :src="getImageUrl(category.image)" alt="" class="h-40 w-40 object-cover border border-gray-300 dark:border-gray-600" style="border-radius: 4px" />
      <div v-else class="h-40 w-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600" style="border-radius: 4px">
        <ImageIcon class="h-16 w-16 text-gray-400" />
      </div>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Üst Kategori</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ category?.expand?.parent?.name || '-' }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Kategori Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ category?.name }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Açıklama</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ category?.description || '-' }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Durum</label>
      <p class="mt-1">
        <span :class="category?.status ? 'bg-green-500' : 'bg-gray-400'" class="px-2 py-1 rounded text-xs text-white font-medium">
          {{ category?.status ? 'Aktif' : 'Pasif' }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageIcon from '~/assets/svg/ImageIcon.vue'

export interface Category {
  id: string
  name: string
  description: string
  parent: string
  image: string
  status: boolean
  expand?: {
    parent?: {
      name: string
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
