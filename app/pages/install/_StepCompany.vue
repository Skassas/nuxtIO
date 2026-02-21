<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Firma Adı <span class="text-red-500">*</span>
      </label>
      <input 
        v-model="formData.companyName"
        type="text" 
        required
        placeholder="Firma adını giriniz"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Telefon
      </label>
      <input 
        v-model="formData.companyPhone"
        type="text" 
        placeholder="Telefon numarası"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
    </div>
    
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Vergi Dairesi
        </label>
        <input 
          v-model="formData.companyTaxPlace"
          type="text" 
          placeholder="Vergi dairesi"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Vergi Numarası
        </label>
        <input 
          v-model="formData.companyTaxNumber"
          type="text" 
          placeholder="Vergi numarası"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        />
      </div>
    </div>
    
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Adres
      </label>
      <textarea 
        v-model="formData.companyAddress"
        rows="3"
        placeholder="Adres bilgisi"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormData {
  companyName: string
  companyPhone: string
  companyTaxPlace: string
  companyTaxNumber: string
  companyAddress: string
}

const props = defineProps<{
  formData: FormData
}>()
</script>
