<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 w-16">Sıra</th>
          <th class="px-4 py-2 font-medium text-gray-600 dark:text-gray-300">Birim Adı</th>
          <th class="px-4 py-2 font-medium text-gray-600 dark:text-gray-300">Açıklama</th>
          <th class="px-4 py-2 font-medium text-gray-600 dark:text-gray-300 w-40 text-center"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="loading" class="text-center">
          <td colspan="4" class="px-4 py-8 text-gray-500 dark:text-gray-400">Yükleniyor...</td>
        </tr>
        <tr v-else-if="!units.length" class="text-center">
          <td colspan="4" class="px-4 py-8 text-gray-500 dark:text-gray-400">Birim bulunamadı</td>
        </tr>
        <tr v-for="(unit, index) in units" :key="unit.id" class="hover:bg-gray-100 dark:hover:bg-gray-700">
          <td class="px-4 py-2 text-gray-700 dark:text-gray-300">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-4 py-2 font-medium text-gray-800 dark:text-white">{{ unit.name }}</td>
          <td class="px-4 py-2 text-gray-600 dark:text-gray-400">{{ unit.description || '-' }}</td>
          <td class="px-4 py-2">
            <div class="flex items-center justify-center gap-1">
              <ViewButton @click="$emit('view', unit)" />
              <EditButton @click="$emit('edit', unit)" />
              <DeleteButton :item-id="unit.id" :item-name="unit.name" :on-delete="(id) => $emit('delete', id)" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="mt-4 flex items-center justify-end gap-2">
    <button :disabled="currentPage <= 1" @click="$emit('prevPage')"
      class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600 dark:text-gray-300">
      Onceki
    </button>
    <span class="text-sm text-gray-600 dark:text-gray-400">{{ currentPage }} / {{ totalPages }}</span>
    <button :disabled="currentPage >= totalPages" @click="$emit('nextPage')"
      class="rounded-lg border border-gray-300 px-3 py-1.5 text-sm disabled:opacity-50 dark:border-gray-600 dark:text-gray-300">
      Sonraki
    </button>
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
  units: Unit[]
  loading: boolean
  currentPage: number
  totalPages: number
  perPage: number
}>()

defineEmits<{
  view: [unit: Unit]
  edit: [unit: Unit]
  delete: [id: string]
  prevPage: []
  nextPage: []
}>()
</script>
