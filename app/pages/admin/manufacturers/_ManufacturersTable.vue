<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-16 uppercase text-xs text-center hidden md:table-cell">Sıra</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs align-middle" @click="$emit('sort', 'manufacturer_company')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'manufacturer_company'" :direction="sortBy === 'manufacturer_company' ? sortOrder : null" class="w-4 h-4" />
              <span>Firma Adı</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs align-middle hidden md:table-cell" @click="$emit('sort', 'manufacturer_owner')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'manufacturer_owner'" :direction="sortBy === 'manufacturer_owner' ? sortOrder : null" class="w-4 h-4" />
              <span>Yetkili Kişi</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs hidden md:table-cell">Telefon</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-40 text-center uppercase text-xs bg-transparent"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="loading" class="text-center">
          <td colspan="5" class="px-4 py-8 text-gray-500 dark:text-gray-400">Yükleniyor...</td>
        </tr>
        <tr v-else-if="!manufacturers.length" class="text-center">
          <td colspan="5" class="px-4 py-8 text-gray-500 dark:text-gray-400">Üretici bulunamadı</td>
        </tr>
        <tr v-for="(manufacturer, index) in manufacturers" :key="manufacturer.id" class="hover:bg-gray-100 dark:hover:bg-gray-700">
          <td class="px-4 py-1 text-gray-700 dark:text-gray-300 text-center hidden md:table-cell">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-4 py-1 text-gray-800 dark:text-white">{{ manufacturer.manufacturer_company }}</td>
          <td class="px-4 py-1 text-gray-600 dark:text-gray-400 hidden md:table-cell">{{ manufacturer.manufacturer_owner || '-' }}</td>
          <td class="px-4 py-1 text-gray-600 dark:text-gray-400 hidden md:table-cell">{{ formatPhone(manufacturer.manufacturer_phone) }}</td>
          <td class="px-4 py-1">
            <div class="flex items-center justify-center gap-1">
              <ViewButton @click="$emit('view', manufacturer)" />
              <EditButton @click="$emit('edit', manufacturer)" />
              <DeleteButton :item-id="manufacturer.id" :item-name="manufacturer.manufacturer_company" :on-delete="(id) => $emit('delete', id)" />
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

export interface Manufacturer {
  id: string
  manufacturer_company: string
  manufacturer_owner: string
  manufacturer_phone: string
  manufacturer_tax_office: string
  manufacturer_tax_id: string
  manufacturer_address: string
  created: string
  updated: string
}

defineProps<{
  manufacturers: Manufacturer[]
  loading: boolean
  currentPage: number
  totalPages: number
  perPage: number
  totalItems: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>()

defineEmits<{
  view: [manufacturer: Manufacturer]
  edit: [manufacturer: Manufacturer]
  delete: [id: string]
  prevPage: []
  nextPage: []
  sort: [field: string]
}>()

function formatPhone(manufacturer_phone?: string) {
  if (!manufacturer_phone) return '-'
  const cleaned = manufacturer_phone.replace(/\D/g, '').slice(0, 10)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`
  }
  return manufacturer_phone
}
</script>
