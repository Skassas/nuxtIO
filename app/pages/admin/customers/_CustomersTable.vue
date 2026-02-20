<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs text-center">Sıra</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs align-middle" @click="$emit('sort', 'first_name')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'first_name'" :direction="sortBy === 'first_name' ? sortOrder : null" class="w-4 h-4" />
              <span>Müşteri Bilgileri</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs">Telefon</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-32 uppercase text-xs text-center whitespace-nowrap" @click="$emit('sort', 'customer_type')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'customer_type'" :direction="sortBy === 'customer_type' ? sortOrder : null" class="w-4 h-4" />
              <span>MÜŞTERİ TİPİ</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-40 text-center uppercase text-xs"></th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
        <tr v-if="loading" class="text-center">
          <td colspan="5" class="px-4 py-8 text-gray-500 dark:text-gray-400">Yükleniyor...</td>
        </tr>
        <tr v-else-if="!customers.length" class="text-center">
          <td colspan="5" class="px-4 py-8 text-gray-500 dark:text-gray-400">Müşteri bulunamadı</td>
        </tr>
        <tr v-for="(customer, index) in customers" :key="customer.id" class="hover:bg-gray-100 dark:hover:bg-gray-700">
          <td class="px-4 py-1 text-gray-700 dark:text-gray-300 text-center">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-4 py-1 text-gray-800 dark:text-white">
            {{ customer.customer_type === 'individual' ? `${customer.first_name} ${customer.last_name}` : customer.company_name }}
          </td>
          <td class="px-4 py-1 text-gray-600 dark:text-gray-400">{{ formatPhone(customer.customer_type === 'individual' ? customer.phone : customer.company_phone) }}</td>
          <td class="px-4 py-1 text-center whitespace-nowrap">
            <span :class="customer.customer_type === 'individual' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'" class="inline-flex justify-center items-center px-2 py-1 rounded text-xs font-medium w-16">
              {{ customer.customer_type === 'individual' ? 'Bireysel' : 'Kurumsal' }}
            </span>
          </td>
          <td class="px-4 py-1">
            <div class="flex items-center justify-center gap-1">
              <ViewButton @click="$emit('view', customer)" />
              <EditButton @click="$emit('edit', customer)" />
              <DeleteButton :item-id="customer.id" :item-name="customer.customer_type === 'individual' ? `${customer.first_name} ${customer.last_name}` : customer.company_name" :on-delete="(id) => $emit('delete', id)" />
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

export interface Customer {
  id: string
  customer_type: 'individual' | 'corporate'
  tckn: string
  first_name: string
  last_name: string
  phone: string
  billing_address: string
  home_address: string
  description: string
  company_name: string
  company_phone: string
  company_tax_city: string
  company_tax_id: string
  company_description: string
  created: string
  updated: string
}

defineProps<{
  customers: Customer[]
  loading: boolean
  currentPage: number
  totalPages: number
  perPage: number
  totalItems: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>()

defineEmits<{
  view: [customer: Customer]
  edit: [customer: Customer]
  delete: [id: string]
  prevPage: []
  nextPage: []
  sort: [field: string]
}>()

function formatPhone(phone?: string) {
  if (!phone) return '-'
  const cleaned = phone.replace(/\D/g, '').slice(0, 10)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`
  }
  return phone
}
</script>
