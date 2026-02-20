<template>
  <form id="customer-form" @submit.prevent="$emit('submit', form)" class="space-y-4">
    <div v-if="!isEdit" class="mb-4">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Müşteri Tipi</label>
      <div class="flex gap-6">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" v-model="form.customer_type" value="individual" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Bireysel</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="radio" v-model="form.customer_type" value="corporate" class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
          <span class="text-sm text-gray-700 dark:text-gray-300">Kurumsal</span>
        </label>
      </div>
    </div>

    <div v-else class="mb-4">
      <label class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Müşteri Tipi</label>
      <div class="flex gap-6">
        <span :class="form.customer_type === 'individual' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'" class="px-2 py-1 rounded text-xs font-medium">
          {{ form.customer_type === 'individual' ? 'Bireysel' : 'Kurumsal' }}
        </span>
      </div>
    </div>

    <div v-if="form.customer_type === 'individual'" class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">TC Kimlik No <span class="text-red-500">*</span></label>
        <input :value="tcknInput.inputValue.value" @input="(e) => { tcknInput.handleInput(e); form.tckn = tcknInput.inputValue.value }" @keydown="tcknInput.handleKeyDown" type="text" required minlength="11" maxlength="11" placeholder="TC Kimlik No girin"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.tckn ? 'border-red-500' : ''" />
        <p v-if="errors?.tckn" class="mt-1 text-xs text-red-500">{{ errors.tckn }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Adı <span class="text-red-500">*</span></label>
        <input :value="firstNameInput.inputValue.value" @input="(e) => { firstNameInput.handleInput(e); form.first_name = firstNameInput.inputValue.value }" @keydown="firstNameInput.handleKeyDown" type="text" required placeholder="Adı girin"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.first_name ? 'border-red-500' : ''" />
        <p v-if="errors?.first_name" class="mt-1 text-xs text-red-500">{{ errors.first_name }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Soyadı <span class="text-red-500">*</span></label>
        <input :value="lastNameInput.inputValue.value" @input="(e) => { lastNameInput.handleInput(e); form.last_name = lastNameInput.inputValue.value }" @keydown="lastNameInput.handleKeyDown" type="text" required placeholder="Soyadı girin"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.last_name ? 'border-red-500' : ''" />
        <p v-if="errors?.last_name" class="mt-1 text-xs text-red-500">{{ errors.last_name }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Telefon <span class="text-red-500">*</span></label>
        <input v-model="phoneDisplay" @input="handlePhoneInput" type="text" placeholder="(5__) ___ __ __"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.phone ? 'border-red-500' : ''" />
        <p v-if="errors?.phone" class="mt-1 text-xs text-red-500">{{ errors.phone }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Fatura Adresi <span class="text-red-500">*</span></label>
        <textarea :value="billingAddressInput.inputValue.value" @input="(e) => { billingAddressInput.handleInput(e); form.billing_address = billingAddressInput.inputValue.value }" @keydown="billingAddressInput.handleKeyDown" rows="3" placeholder="Fatura adresini girin"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.billing_address ? 'border-red-500' : ''"></textarea>
        <p v-if="errors?.billing_address" class="mt-1 text-xs text-red-500">{{ errors.billing_address }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</label>
        <textarea v-model="form.description" rows="3" placeholder="Açıklama girin (isteğe bağlı)"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
      </div>
    </div>

    <div v-if="form.customer_type === 'corporate'" class="space-y-4">
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Firma Adı <span class="text-red-500">*</span></label>
        <input :value="companyNameInput.inputValue.value" @input="(e) => { companyNameInput.handleInput(e); form.company_name = companyNameInput.inputValue.value }" @keydown="companyNameInput.handleKeyDown" type="text" required placeholder="Firma adını girin"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.company_name ? 'border-red-500' : ''" />
        <p v-if="errors?.company_name" class="mt-1 text-xs text-red-500">{{ errors.company_name }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Firma Telefonu <span class="text-red-500">*</span></label>
        <input v-model="companyPhoneDisplay" @input="handleCompanyPhoneInput" type="text" placeholder="(5__) ___ __ __"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.company_phone ? 'border-red-500' : ''" />
        <p v-if="errors?.company_phone" class="mt-1 text-xs text-red-500">{{ errors.company_phone }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Vergi Dairesi <span class="text-red-500">*</span></label>
        <input :value="companyTaxCityInput.inputValue.value" @input="(e) => { companyTaxCityInput.handleInput(e); form.company_tax_city = companyTaxCityInput.inputValue.value }" @keydown="companyTaxCityInput.handleKeyDown" type="text" required maxlength="100" placeholder="Vergi dairesini girin"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.company_tax_city ? 'border-red-500' : ''" />
        <p v-if="errors?.company_tax_city" class="mt-1 text-xs text-red-500">{{ errors.company_tax_city }}</p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Vergi Numarası <span class="text-red-500">*</span></label>
        <input :value="companyTaxIdInput.inputValue.value" @input="(e) => { companyTaxIdInput.handleInput(e); form.company_tax_id = companyTaxIdInput.inputValue.value }" @keydown="companyTaxIdInput.handleKeyDown" type="text" required placeholder="Vergi numarasını girin"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</label>
        <textarea v-model="form.company_description" rows="3" placeholder="Açıklama girin (isteğe bağlı)"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
      </div>
    </div>
  </form>
</template>

<script setup lang="ts">
import { customerSchema } from '~/validations/customers'
import type { CustomerInput } from '~/validations/customers'
import { useTurkishInput } from '~/composables/useTurkishInput'
import { useTurkishLettersOnly } from '~/composables/useTurkishLettersOnly'
import { useTextareaInput } from '~/composables/useTextareaInput'
import { useNumericInput } from '~/composables/useNumericInput'

const props = defineProps<{
  modelValue: CustomerInput
  errors?: Record<string, string>
  isEdit?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CustomerInput]
  submit: [form: CustomerInput]
}>()

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const firstNameInput = useTurkishInput(props.modelValue.first_name || '')
watch(() => form.value.first_name, (val) => {
  firstNameInput.inputValue.value = val
})
watch(firstNameInput.inputValue, (val) => {
  form.value.first_name = val
})

const lastNameInput = useTurkishInput(props.modelValue.last_name || '')
watch(() => form.value.last_name, (val) => {
  lastNameInput.inputValue.value = val
})
watch(lastNameInput.inputValue, (val) => {
  form.value.last_name = val
})

const billingAddressInput = useTextareaInput(props.modelValue.billing_address || '')
watch(() => form.value.billing_address, (val) => {
  billingAddressInput.inputValue.value = val
})
watch(billingAddressInput.inputValue, (val) => {
  form.value.billing_address = val
})

const companyNameInput = useTurkishInput(props.modelValue.company_name || '')
watch(() => form.value.company_name, (val) => {
  companyNameInput.inputValue.value = val
})
watch(companyNameInput.inputValue, (val) => {
  form.value.company_name = val
})

const companyTaxCityInput = useTurkishLettersOnly(props.modelValue.company_tax_city || '')
watch(() => form.value.company_tax_city, (val) => {
  companyTaxCityInput.inputValue.value = val
})
watch(companyTaxCityInput.inputValue, (val) => {
  form.value.company_tax_city = val
})

const tcknInput = useNumericInput(props.modelValue.tckn || '')
watch(() => form.value.tckn, (val) => {
  tcknInput.inputValue.value = val
})
watch(tcknInput.inputValue, (val) => {
  form.value.tckn = val
})

const companyTaxIdInput = useNumericInput(props.modelValue.company_tax_id || '')
watch(() => form.value.company_tax_id, (val) => {
  companyTaxIdInput.inputValue.value = val
})
watch(companyTaxIdInput.inputValue, (val) => {
  form.value.company_tax_id = val
})

const phoneDisplay = ref(props.modelValue.phone || '')
const companyPhoneDisplay = ref(props.modelValue.company_phone || '')

watch(() => props.modelValue.phone, (val) => {
  if (!val) phoneDisplay.value = ''
})
watch(() => props.modelValue.company_phone, (val) => {
  if (!val) companyPhoneDisplay.value = ''
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

function handleCompanyPhoneInput(e: Event) {
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
  
  companyPhoneDisplay.value = formatted
  form.value.company_phone = value
}
</script>
