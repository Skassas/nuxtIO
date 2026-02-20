<template>
  <div class="space-y-4">
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Firma Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.company }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Yetkili Kişi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.owner || '-' }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Telefon</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ formatPhone(manufacturer?.phone) }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Vergi Dairesi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.tax_office || '-' }}</p>
    </div>
    <div class="pb-3 border-b border-gray-200 dark:border-gray-700">
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Vergi Numarası</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.tax_id || '-' }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-blue-600 dark:text-blue-400">Adres</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.adress || '-' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface Manufacturer {
  id: string
  company: string
  owner: string
  phone: string
  tax_office: string
  tax_id: string
  adress: string
}

defineProps<{
  manufacturer: Manufacturer | null
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
