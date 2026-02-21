<template>
  <div class="space-y-4">
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Vergi Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ tax?.tax_name }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">% Veri Oranı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ tax?.tax_ratio }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Açıklama</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ tax?.tax_description || '-' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Tax {
  id: string
  tax_name: string
  tax_ratio: string
  tax_description: string
}

defineProps<{
  tax: Tax | null
}>()
</script>
