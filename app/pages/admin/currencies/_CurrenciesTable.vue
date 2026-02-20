<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-16 uppercase text-xs text-center">Sıra</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs align-middle" @click="$emit('sort', 'name')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'name'" :direction="sortBy === 'name' ? sortOrder : null" class="w-4 h-4" />
              <span>Para Birimi</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs align-middle" @click="$emit('sort', 'currency_code')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'currency_code'" :direction="sortBy === 'currency_code' ? sortOrder : null" class="w-4 h-4" />
              <span>Uluslararası Kodu</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs align-middle" @click="$emit('sort', 'currency_symbol')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'currency_symbol'" :direction="sortBy === 'currency_symbol' ? sortOrder : null" class="w-4 h-4" />
              <span>Sembolü</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs">Değeri</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-40 text-center uppercase text-xs"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="loading" class="text-center">
          <td colspan="6" class="px-4 py-8 text-gray-500 dark:text-gray-400">Yükleniyor...</td>
        </tr>
        <tr v-else-if="!currencies.length" class="text-center">
          <td colspan="6" class="px-4 py-8 text-gray-500 dark:text-gray-400">Para birimi bulunamadı</td>
        </tr>
        <tr v-for="(currency, index) in currencies" :key="currency.id" class="hover:bg-gray-100 dark:hover:bg-gray-700">
          <td class="px-4 py-1 text-gray-700 dark:text-gray-300 text-center">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-4 py-1 text-gray-800 dark:text-white">{{ currency.currency_name }}</td>
          <td class="px-4 py-1 text-gray-800 dark:text-white">{{ currency.currency_code }}</td>
          <td class="px-4 py-1 text-gray-800 dark:text-white">{{ currency.currency_symbol }}</td>
          <td class="px-4 py-1 text-gray-800 dark:text-white">₺{{ currency.currency_value }}</td>
          <td class="px-4 py-1">
            <div class="flex items-center justify-center gap-1">
              <ViewButton @click="$emit('view', currency)" />
              <EditButton @click="$emit('edit', currency)" />
              <DeleteButton :item-id="currency.id" :item-name="currency.currency_name" :on-delete="(id) => $emit('delete', id)" />
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

export interface Currency {
  id: string
  currency_name: string
  currency_code: string
  currency_symbol: string
  currency_value: string
  created: string
  updated: string
}

defineProps<{
  currencies: Currency[]
  loading: boolean
  currentPage: number
  totalPages: number
  perPage: number
  totalItems: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>()

defineEmits<{
  view: [currency: Currency]
  edit: [currency: Currency]
  delete: [id: string]
  prevPage: []
  nextPage: []
  sort: [field: string]
}>()
</script>
