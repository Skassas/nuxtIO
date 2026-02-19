<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 w-16 uppercase text-xs text-center">Sıra</th>
          <th class="px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs align-middle" @click="$emit('sort', 'name')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'name'" :direction="sortBy === 'name' ? sortOrder : null" class="w-4 h-4" />
              <span>Birim Adı</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 uppercase text-xs">Açıklama</th>
          <th class="px-4 py-4 font-semibold text-gray-600 dark:text-gray-300 w-40 text-center uppercase text-xs"></th>
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
          <td class="px-4 py-2 text-gray-700 dark:text-gray-300 text-center">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-4 py-2 text-gray-800 dark:text-white">{{ unit.name }}</td>
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

  <div class="mt-4 flex items-center justify-between">
    <span class="text-sm text-gray-600 dark:text-gray-400">Toplam: {{ totalItems }} kayıt</span>
    <div class="flex items-center gap-2">
      <button :disabled="currentPage <= 1" @click="$emit('prevPage')"
        class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:border-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500">
        Önceki
      </button>
      <span class="text-sm text-gray-600 dark:text-gray-400">{{ currentPage }} / {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages" @click="$emit('nextPage')"
        class="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:disabled:border-gray-600 dark:disabled:bg-gray-800 dark:disabled:text-gray-500">
        Sonraki
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import SortIcon from '~/assets/svg/SortIcon.vue'

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
  totalItems: number
  sortBy: 'name' | 'created'
  sortOrder: 'asc' | 'desc'
}>()

defineEmits<{
  view: [unit: Unit]
  edit: [unit: Unit]
  delete: [id: string]
  prevPage: []
  nextPage: []
  sort: [field: 'name' | 'created']
}>()
</script>
