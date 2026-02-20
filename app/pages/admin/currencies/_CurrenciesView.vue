<template>
  <div class="space-y-4">
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Para Birimi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ currency?.currency_name }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Uluslararası Kodu</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ currency?.currency_code }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Sembolü</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ currency?.currency_symbol }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Değeri</label>
      <p class="mt-1 text-gray-800 dark:text-white">₺{{ currency?.currency_value }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Currency {
  id: string
  currency_name: string
  currency_code: string
  currency_symbol: string
  currency_value: string
}

defineProps<{
  currency: Currency | null
}>()
</script>
