<template>
  <div class="space-y-4">
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Firma Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.manufacturer_company }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Yetkili Kişi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.manufacturer_owner || '-' }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Telefon</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ formatPhone(manufacturer?.manufacturer_phone) }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Vergi Dairesi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.manufacturer_tax_office || '-' }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Vergi Numarası</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.manufacturer_tax_id || '-' }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Adres</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.manufacturer_address || '-' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Manufacturer {
  id: string
  manufacturer_company: string
  manufacturer_owner: string
  manufacturer_phone: string
  manufacturer_tax_office: string
  manufacturer_tax_id: string
  manufacturer_address: string
}

defineProps<{
  manufacturer: Manufacturer | null
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
