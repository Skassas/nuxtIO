<template>
  <div class="space-y-4">
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Mağaza Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ location?.location_name }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Açıklama</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ location?.location_description || '-' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Location {
  id: string
  location_name: string
  location_description: string
}

defineProps<{
  location: Location | null
}>()
</script>
