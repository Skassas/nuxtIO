<template>
  <div class="space-y-4">
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Para Birimi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ currency?.currency_name }}</p>
      <p v-if="currency?.updated" :class="isToday(currency.updated) ? 'mt-1 text-xs text-green-600 dark:text-green-400' : 'mt-1 text-xs text-red-500'">En son {{ formatDate(currency.updated) }} tarihinde, saat {{ formatTime(currency.updated) }} de güncellendi</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">U. Kodu</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ currency?.currency_code }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Sembolü</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ currency?.currency_symbol }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Değeri</label>
      <p class="mt-1 text-gray-800 dark:text-white">₺{{ currency?.currency_value }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Otomatik Güncelleme</label>
      <p class="mt-1 flex items-center gap-2">
        <span :class="currency?.currency_auto_update ? 'bg-green-500' : 'bg-red-500'" class="inline-flex justify-center items-center w-5 h-5 rounded text-white text-xs font-bold">
          {{ currency?.currency_auto_update ? '✓' : '✕' }}
        </span>
        <span :class="currency?.currency_auto_update ? 'text-green-600 dark:text-green-400' : 'text-red-500'">
          {{ currency?.currency_auto_update ? 'Açık' : 'Kapalı' }}
        </span>
      </p>
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
  currency_auto_update: boolean
  updated: string
}

defineProps<{
  currency: Currency | null
}>()

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}.${minutes}`
}

function isToday(dateStr: string): boolean {
  const date = new Date(dateStr)
  const today = new Date()
  return date.getDate() === today.getDate() && 
         date.getMonth() === today.getMonth() && 
         date.getFullYear() === today.getFullYear()
}
</script>
