<template>
  <div class="space-y-4">
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Firma Adı</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.company }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Yetkili Kişi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.owner || '-' }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Telefon</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ formatPhone(manufacturer?.phone) }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Vergi Dairesi</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.tax_office || '-' }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Vergi Numarası</label>
      <p class="mt-1 text-gray-800 dark:text-white">{{ manufacturer?.tax_id || '-' }}</p>
    </div>
    <div>
      <label class="text-sm font-medium text-gray-500 dark:text-gray-400">Adres</label>
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
