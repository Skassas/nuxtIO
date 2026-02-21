<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-16 uppercase text-xs text-center hidden md:table-cell">Sıra</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs align-middle" @click="$emit('sort', 'currency_name')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'currency_name'" :direction="sortBy === 'currency_name' ? sortOrder : null" class="w-4 h-4" />
              <span>Para Birimi</span>
            </span>
          </th>
          <th class="px-2 py-4 font-semibold text-gray-800 dark:text-gray-200 w-16 uppercase text-xs text-center" @click="$emit('sort', 'currency_code')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'currency_code'" :direction="sortBy === 'currency_code' ? sortOrder : null" class="w-3 h-3" />
              <span>U.Kodu</span>
            </span>
          </th>
          <th class="px-2 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs text-center hidden md:table-cell" @click="$emit('sort', 'currency_symbol')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'currency_symbol'" :direction="sortBy === 'currency_symbol' ? sortOrder : null" class="w-3 h-3" />
              <span>Sembolü</span>
            </span>
          </th>
          <th class="px-2 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs text-right hidden md:table-cell" @click="$emit('sort', 'currency_value')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 justify-end">
              <SortIcon :active="sortBy === 'currency_value'" :direction="sortBy === 'currency_value' ? sortOrder : null" class="w-3 h-3" />
              <span>Değeri</span>
            </span>
          </th>
          <th class="px-2 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs text-center hidden md:table-cell" @click="$emit('sort', 'currency_auto_update')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'currency_auto_update'" :direction="sortBy === 'currency_auto_update' ? sortOrder : null" class="w-3 h-3" />
              <span>Otomatik</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-40 text-center uppercase text-xs bg-transparent"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="loading" class="text-center">
          <td colspan="7" class="px-4 py-8 text-gray-500 dark:text-gray-400">Yükleniyor...</td>
        </tr>
        <tr v-else-if="!currencies.length" class="text-center">
          <td colspan="7" class="px-4 py-8 text-gray-500 dark:text-gray-400">Para birimi bulunamadı</td>
        </tr>
        <tr v-for="(currency, index) in currencies" :key="currency.id" class="hover:bg-gray-100 dark:hover:bg-gray-700">
          <td class="px-4 py-1 text-gray-700 dark:text-gray-300 text-center hidden md:table-cell">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-4 py-1 text-gray-800 dark:text-white">
            <div>{{ currency.currency_name }}</div>
            <div v-if="currency.updated" :class="formatDateTime(currency.updated).isToday ? 'text-xs text-green-600 dark:text-green-400' : 'text-xs text-red-500'">{{ formatDateTime(currency.updated).text }}</div>
          </td>
          <td class="px-2 py-1 text-gray-800 dark:text-white w-16 text-center hidden md:table-cell">{{ currency.currency_code }}</td>
          <td class="px-2 py-1 text-gray-800 dark:text-white text-center hidden md:table-cell">{{ currency.currency_symbol }}</td>
          <td class="px-2 py-1 text-gray-800 dark:text-white text-right hidden md:table-cell">{{ currency.currency_value }}₺</td>
          <td class="px-2 py-1 text-center hidden md:table-cell">
            <span :class="currency.currency_auto_update ? 'bg-green-500' : 'bg-red-500'" class="inline-flex justify-center items-center w-4 h-4 rounded text-white text-xs font-bold">
              {{ currency.currency_auto_update ? '✓' : '✕' }}
            </span>
          </td>
          <td class="px-4 py-1">
            <div class="flex items-center justify-center gap-1">
              <button @click="$emit('refresh', currency)" :disabled="refreshingId === currency.id"
                class="p-1.5 rounded text-green-600 hover:bg-green-100 dark:hover:bg-green-900 disabled:opacity-50" title="Yenile">
                <RefreshIcon :class="{ 'animate-spin': refreshingId === currency.id }" class="w-4 h-4" />
              </button>
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
import RefreshIcon from '~/assets/svg/RefreshIcon.vue'

export interface Currency {
  id: string
  currency_name: string
  currency_code: string
  currency_symbol: string
  currency_value: string
  currency_auto_update: boolean
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
  refreshingId?: string | null
}>()

defineEmits<{
  view: [currency: Currency]
  edit: [currency: Currency]
  delete: [id: string]
  refresh: [currency: Currency]
  prevPage: []
  nextPage: []
  sort: [field: string]
}>()

function formatDateTime(dateStr: string) {
  const date = new Date(dateStr)
  const today = new Date()
  const isToday = date.getDate() === today.getDate() && 
                  date.getMonth() === today.getMonth() && 
                  date.getFullYear() === today.getFullYear()
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return {
    text: `${day}.${month}.${year} ${hours}:${minutes}`,
    isToday
  }
}
</script>
