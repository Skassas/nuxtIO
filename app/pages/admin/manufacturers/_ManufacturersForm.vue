<template>
  <form id="manufacturer-form" @submit.prevent="$emit('submit', form)" class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Firma Adı <span
          class="text-red-500">*</span></label>
      <input :value="companyInput.inputValue.value" @input="(e) => { companyInput.handleInput(e); form.company = companyInput.inputValue.value }" @keydown="companyInput.handleKeyDown" type="text" required minlength="5" maxlength="100" placeholder="Firma adını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :class="errors?.company ? 'border-red-500' : ''" />
      <p v-if="errors?.company" class="mt-1 text-xs text-red-500">{{ errors.company }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Yetkili Kişi</label>
      <input :value="ownerInput.inputValue.value" @input="(e) => { ownerInput.handleInput(e); form.owner = ownerInput.inputValue.value }" @keydown="ownerInput.handleKeyDown" type="text" placeholder="Yetkili kişiyi girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Telefon</label>
      <input v-model="phoneDisplay" @input="handlePhoneInput" type="text" placeholder="(5__) ___ __ __"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Vergi Dairesi</label>
      <input :value="taxOfficeInput.inputValue.value" @input="(e) => { taxOfficeInput.handleInput(e); form.tax_office = taxOfficeInput.inputValue.value }" @keydown="taxOfficeInput.handleKeyDown" type="text" placeholder="Vergi dairesini girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Vergi Numarası</label>
      <input :value="taxIdInput.inputValue.value" @input="(e) => { taxIdInput.handleInput(e); form.tax_id = taxIdInput.inputValue.value ? Number(taxIdInput.inputValue.value) : null }" @keydown="taxIdInput.handleKeyDown" type="text" placeholder="Vergi numarasını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Adres</label>
      <textarea v-model="form.adress" rows="3" placeholder="Adresi girin"
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

const companyInput = useTurkishInput(props.modelValue.company || '', '')
watch(() => form.value.company, (val) => {
  companyInput.inputValue.value = val
})
watch(companyInput.inputValue, (val) => {
  form.value.company = val
})

const ownerInput = useTurkishInput(props.modelValue.owner || '', '')
watch(() => form.value.owner, (val) => {
  ownerInput.inputValue.value = val
})
watch(ownerInput.inputValue, (val) => {
  form.value.owner = val
})

const taxOfficeInput = useTurkishLettersOnly(props.modelValue.tax_office || '')
watch(() => form.value.tax_office, (val) => {
  taxOfficeInput.inputValue.value = val
})
watch(taxOfficeInput.inputValue, (val) => {
  form.value.tax_office = val
})

const taxIdInput = useNumericInput(props.modelValue.tax_id?.toString() || '')
watch(() => form.value.tax_id, (val) => {
  taxIdInput.inputValue.value = val?.toString() || ''
})
watch(taxIdInput.inputValue, (val) => {
  form.value.tax_id = val ? Number(val) : null
})

const phoneDisplay = ref(props.modelValue.phone || '')

watch(() => props.modelValue.phone, (val) => {
  if (!val) phoneDisplay.value = ''
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
  
  phoneDisplay.value = formatted
  form.value.phone = value
}
</script>
