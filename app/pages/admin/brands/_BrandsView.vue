<template>
  <div class="space-y-4">
    <div class="flex justify-center">
      <img v-if="brand?.image" :src="getImageUrl(brand.image)" alt="" class="h-40 w-40 object-cover border border-gray-300 dark:border-gray-600" style="border-radius: 4px" />
      <div v-else class="h-40 w-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600" style="border-radius: 4px">
        <ImageIcon class="h-16 w-16 text-gray-400" />
      </div>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Marka Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ brand?.name }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Açıklama</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ brand?.description || '-' }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Oluşturulma Tarihi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ formatDate(brand?.created) }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Son Güncelleme</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ formatDate(brand?.updated) }}</p>
    </div>
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

defineProps<{
  brand: Brand | null
}>()

function getImageUrl(imageId: string) {
  return `/api/filemanager/files/brands/${imageId}`
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('tr-TR')
}
</script>
