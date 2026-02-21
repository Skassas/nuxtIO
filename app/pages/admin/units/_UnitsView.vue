<template>
  <div class="space-y-4">
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Birim Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ unit?.unit_name }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Açıklama</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ unit?.unit_decription || '-' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Unit {
  id: string
  unit_name: string
  unit_decription: string
}

defineProps<{
  unit: Unit | null
}>()
</script>
