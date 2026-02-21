<template>
  <div class="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
    <table class="w-full text-left text-sm">
      <thead class="bg-gray-50 dark:bg-gray-700">
        <tr>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs text-center hidden md:table-cell">Sıra</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs align-middle" @click="$emit('sort', 'customer_first_name')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'customer_first_name'" :direction="sortBy === 'customer_first_name' ? sortOrder : null" class="w-4 h-4" />
              <span>Müşteri Bilgileri</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 uppercase text-xs hidden md:table-cell">Telefon</th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-32 uppercase text-xs text-center whitespace-nowrap hidden md:table-cell" @click="$emit('sort', 'customer_type')">
            <span class="inline-flex items-center gap-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400">
              <SortIcon :active="sortBy === 'customer_type'" :direction="sortBy === 'customer_type' ? sortOrder : null" class="w-4 h-4" />
              <span>MÜŞTERİ TİPİ</span>
            </span>
          </th>
          <th class="px-4 py-4 font-semibold text-gray-800 dark:text-gray-200 w-40 text-center uppercase text-xs bg-transparent"></th>
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
          <td class="px-4 py-1 text-gray-700 dark:text-gray-300 text-center hidden md:table-cell">{{ (currentPage - 1) * perPage + index + 1 }}</td>
          <td class="px-4 py-1 text-gray-800 dark:text-white">
            {{ customer.customer_type === 'individual' ? `${customer.customer_first_name} ${customer.customer_last_name}` : customer.customer_company_name }}
          </td>
          <td class="px-4 py-1 text-gray-600 dark:text-gray-400 hidden md:table-cell">{{ formatPhone(customer.customer_type === 'individual' ? customer.customer_phone : customer.company_customer_phone) }}</td>
          <td class="px-4 py-1 text-center whitespace-nowrap hidden md:table-cell">
            <span :class="customer.customer_type === 'individual' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'" class="inline-flex justify-center items-center px-2 py-1 rounded text-xs font-medium w-16">
              {{ customer.customer_type === 'individual' ? 'Bireysel' : 'Kurumsal' }}
            </span>
          </td>
          <td class="px-4 py-1">
            <div class="flex items-center justify-center gap-1">
              <ViewButton @click="$emit('view', customer)" />
              <EditButton @click="$emit('edit', customer)" />
              <DeleteButton :item-id="customer.id" :item-name="customer.customer_type === 'individual' ? `${customer.customer_first_name} ${customer.customer_last_name}` : customer.customer_company_name" :on-delete="(id) => $emit('delete', id)" />
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
  customer_tckn: string
  customer_first_name: string
  customer_last_name: string
  customer_phone: string
  customer_billing_adress: string
  home_address: string
  customer_description: string
  customer_company_name: string
  company_customer_phone: string
  customer_company_tax_city: string
  customer_company_tax_id: string
  company_customer_description: string
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

function formatPhone(customer_phone?: string) {
  if (!customer_phone) return '-'
  const cleaned = customer_phone.replace(/\D/g, '').slice(0, 10)
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`
  }
  return customer_phone
}
</script>
