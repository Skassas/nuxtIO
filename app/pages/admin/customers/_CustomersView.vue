<template>
  <div class="space-y-4">
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Müşteri Tipi</label>
      <p class="mt-1">
        <span :class="customer?.customer_type === 'individual' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'" class="px-2 py-1 rounded text-xs font-medium">
          {{ customer?.customer_type === 'individual' ? 'Bireysel' : 'Kurumsal' }}
        </span>
      </p>
    </div>

    <div v-if="customer?.customer_type === 'individual'" class="space-y-4">
      <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">TC Kimlik No</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ customer?.tckn || '-' }}</p>
      </div>
      <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Ad Soyad</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ customer?.first_name }} {{ customer?.last_name }}</p>
      </div>
      <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Telefon</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ formatPhone(customer?.phone) }}</p>
      </div>
      <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Fatura Adresi</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ customer?.billing_address || '-' }}</p>
      </div>
      <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Ev Adresi</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ customer?.home_address || '-' }}</p>
      </div>
      <div>
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Açıklama</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ customer?.description || '-' }}</p>
      </div>
    </div>

    <div v-if="customer?.customer_type === 'corporate'" class="space-y-4">
      <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Firma Adı</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ customer?.company_name }}</p>
      </div>
      <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Telefon</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ formatPhone(customer?.company_phone) }}</p>
      </div>
      <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Vergi Dairesi</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ customer?.company_tax_city || '-' }}</p>
      </div>
      <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Vergi Numarası</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ customer?.company_tax_id || '-' }}</p>
      </div>
      <div>
        <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Açıklama</label>
        <p class="mt-1 text-gray-800 dark:text-white">{{ customer?.company_description || '-' }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
}

defineProps<{
  customer: Customer | null
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
