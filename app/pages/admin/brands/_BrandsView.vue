<template>
  <div class="space-y-4">
    <div class="flex justify-center pb-3 border-b border-gray-200 dark:border-gray-700">
      <img v-if="brand?.image" :src="getImageUrl(brand.image)" alt="" class="h-40 w-40 object-cover border border-gray-300 dark:border-gray-600" style="border-radius: 4px" />
      <div v-else class="h-40 w-40 bg-gray-200 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600" style="border-radius: 4px">
        <ImageIcon class="h-16 w-16 text-gray-400" />
      </div>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Marka Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ brand?.brand_name }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Açıklama</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ brand?.brand_description || '-' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageIcon from '~/assets/svg/ImageIcon.vue'

export interface Brand {
  id: string
  brand_name: string
  brand_description: string
  image: string
}

defineProps<{
  brand: Brand | null
}>()

function getImageUrl(imageId: string) {
  return `/api/filemanager/files/brands/${imageId}`
}
</script>
