<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Birim Adi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ unit?.name }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Aciklama</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ unit?.description || '-' }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Olusturulma Tarihi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ formatDate(unit?.created) }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Son Guncelleme</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ formatDate(unit?.updated) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Unit {
  id: string
  name: string
  description: string
  created: string
  updated: string
}

defineProps<{
  unit: Unit | null
}>()

function formatDate(dateStr?: string) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('tr-TR')
}
</script>
