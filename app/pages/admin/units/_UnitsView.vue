<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Birim Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ unit?.name }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Açıklama</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ unit?.description || '-' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Unit {
  id: string
  name: string
  description: string
}

defineProps<{
  unit: Unit | null
}>()
</script>
