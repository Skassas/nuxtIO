<template>
  <form id="manufacturer-form" @submit.prevent="$emit('submit', form)" class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Firma Adı <span
          class="text-red-500">*</span></label>
      <input :value="manufacturer_companyInput.inputValue.value" @input="(e) => { manufacturer_companyInput.handleInput(e); form.manufacturer_company = manufacturer_companyInput.inputValue.value }" @keydown="manufacturer_companyInput.handleKeyDown" type="text" required minlength="5" maxlength="100" placeholder="Firma adını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :class="errors?.manufacturer_company ? 'border-red-500' : ''" />
      <p v-if="errors?.manufacturer_company" class="mt-1 text-xs text-red-500">{{ errors.manufacturer_company }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Yetkili Kişi</label>
      <input :value="manufacturer_ownerInput.inputValue.value" @input="(e) => { manufacturer_ownerInput.handleInput(e); form.manufacturer_owner = manufacturer_ownerInput.inputValue.value }" @keydown="manufacturer_ownerInput.handleKeyDown" type="text" placeholder="Yetkili kişiyi girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Telefon</label>
      <input v-model="manufacturer_phoneDisplay" @input="handlePhoneInput" type="text" placeholder="(5__) ___ __ __"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Vergi Dairesi</label>
      <input :value="taxOfficeInput.inputValue.value" @input="(e) => { taxOfficeInput.handleInput(e); form.manufacturer_tax_office = taxOfficeInput.inputValue.value }" @keydown="taxOfficeInput.handleKeyDown" type="text" placeholder="Vergi dairesini girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Vergi Numarası</label>
      <input :value="taxIdInput.inputValue.value" @input="(e) => { taxIdInput.handleInput(e); form.manufacturer_tax_id = taxIdInput.inputValue.value ? Number(taxIdInput.inputValue.value) : null }" @keydown="taxIdInput.handleKeyDown" type="text" placeholder="Vergi numarasını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Adres</label>
      <textarea v-model="form.manufacturer_address" rows="3" placeholder="Adresi girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
    </div>
  </form>
</template>

<script setup lang="ts">
import { manufacturerSchema } from '~/validations/manufacturers'
import type { ManufacturerInput } from '~/validations/manufacturers'
import { useTurkishInput } from '~/composables/useTurkishInput'
import { useTurkishLettersOnly } from '~/composables/useTurkishLettersOnly'
import { useNumericInput } from '~/composables/useNumericInput'
import { useAutoFocus } from '~/composables/useAutoFocus'

useAutoFocus()

const props = defineProps<{
  modelValue: ManufacturerInput
  errors?: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: ManufacturerInput]
  submit: [form: ManufacturerInput]
}>()

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const manufacturer_companyInput = useTurkishInput(props.modelValue.manufacturer_company || '', '')
watch(() => form.value.manufacturer_company, (val) => {
  manufacturer_companyInput.inputValue.value = val
})
watch(manufacturer_companyInput.inputValue, (val) => {
  form.value.manufacturer_company = val
})

const manufacturer_ownerInput = useTurkishInput(props.modelValue.manufacturer_owner || '', '')
watch(() => form.value.manufacturer_owner, (val) => {
  manufacturer_ownerInput.inputValue.value = val
})
watch(manufacturer_ownerInput.inputValue, (val) => {
  form.value.manufacturer_owner = val
})

const taxOfficeInput = useTurkishLettersOnly(props.modelValue.manufacturer_tax_office || '')
watch(() => form.value.manufacturer_tax_office, (val) => {
  taxOfficeInput.inputValue.value = val
})
watch(taxOfficeInput.inputValue, (val) => {
  form.value.manufacturer_tax_office = val
})

const taxIdInput = useNumericInput(props.modelValue.manufacturer_tax_id?.toString() || '')
watch(() => form.value.manufacturer_tax_id, (val) => {
  taxIdInput.inputValue.value = val?.toString() || ''
})
watch(taxIdInput.inputValue, (val) => {
  form.value.manufacturer_tax_id = val ? Number(val) : null
})

const manufacturer_phoneDisplay = ref(props.modelValue.manufacturer_phone || '')

watch(() => props.modelValue.manufacturer_phone, (val) => {
  if (!val) manufacturer_phoneDisplay.value = ''
})

function handlePhoneInput(e: Event) {
  const input = e.target as HTMLInputElement
  let value = input.value.replace(/\D/g, '').slice(0, 10)
  
  let formatted = ''
  for (let i = 0; i < value.length; i++) {
    if (i === 0) formatted += '('
    if (i === 3) formatted += ') '
    if (i === 6) formatted += ' '
    if (i === 8) formatted += ' '
    formatted += value[i]
  }
  
  manufacturer_phoneDisplay.value = formatted
  form.value.manufacturer_phone = value
}
</script>
