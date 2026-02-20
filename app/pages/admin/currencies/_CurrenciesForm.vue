<template>
  <form id="currency-form" @submit.prevent="handleSubmit" class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Para Birimi <span class="text-red-500">*</span></label>
      <div v-if="isEditMode" class="flex items-center rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400">
        {{ formData.currencyName }} ({{ formData.currencyCode }})
      </div>
      <select v-else v-model="selectedCurrency" :disabled="loading" required
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :class="errors?.currencyName ? 'border-red-500' : ''">
        <option v-if="loading" :value="null">Yükleniyor...</option>
        <option v-else :value="null">Para birimi seçin</option>
        <option v-for="curr in availableCurrencies" :key="curr.code" :value="curr">
          {{ curr.name }} ({{ curr.code }})
        </option>
      </select>
      <p v-if="errors?.currencyName" class="mt-1 text-xs text-red-500">{{ errors.currencyName }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Uluslararası Kodu</label>
      <input v-model="formData.currencyCode" type="text" readonly
        class="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Sembolü</label>
      <input v-model="formData.currencySymbol" type="text" readonly
        class="w-full rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed" />
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Değeri <span class="text-red-500">*</span></label>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₺</span>
        <input v-model="formData.currencyValue" type="text" required placeholder="Değeri girin"
          class="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.currencyValue ? 'border-red-500' : ''" />
      </div>
      <p v-if="errors?.currencyValue" class="mt-1 text-xs text-red-500">{{ errors.currencyValue }}</p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { currencySchema } from '~/validations/currencies'
import type { CurrencyInput } from '~/validations/currencies'
import { useAutoFocus } from '~/composables/useAutoFocus'

useAutoFocus()

interface TCurrency {
  code: string
  name: string
  symbol: string
  value: string
}

const props = defineProps<{
  modelValue: CurrencyInput
  errors?: Record<string, string>
  existingCodes?: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CurrencyInput]
  submit: [form: CurrencyInput]
}>()

const loading = ref(true)
const availableCurrencies = ref<TCurrency[]>([])
const selectedCurrency = ref<TCurrency | null>(null)
const isEditMode = computed(() => !!props.modelValue.id)

const formData = reactive({
  currencyName: '',
  currencyCode: '',
  currencySymbol: '',
  currencyValue: ''
})

watch(() => props.modelValue, (val) => {
  if (val.currencyCode && val.currencyName) {
    formData.currencyName = val.currencyName
    formData.currencyCode = val.currencyCode
    formData.currencySymbol = val.currencySymbol || ''
    formData.currencyValue = val.currencyValue || ''
  }
}, { immediate: true })

watch(selectedCurrency, (curr) => {
  if (curr) {
    formData.currencyName = curr.name
    formData.currencyCode = curr.code
    formData.currencySymbol = curr.symbol
    formData.currencyValue = curr.value || ''
  }
})

async function fetchCurrencies() {
  try {
    const data = await $fetch<TCurrency[]>('/api/admin/currencies/sync')
    const existingCodes = props.existingCodes || []
    availableCurrencies.value = data.filter(c => !existingCodes.includes(c.code))
    
    if (isEditMode.value && props.modelValue.currencyCode) {
      const currentCurrency = data.find(c => c.code === props.modelValue.currencyCode)
      if (currentCurrency) {
        availableCurrencies.value.unshift(currentCurrency)
        selectedCurrency.value = currentCurrency
      }
    }
  } catch (e) {
    console.error('Failed to fetch currencies:', e)
  } finally {
    loading.value = false
  }
}

function handleSubmit() {
  if (!selectedCurrency.value) {
    return
  }
  const form = {
    currencyName: formData.currencyName,
    currencyCode: formData.currencyCode,
    currencySymbol: formData.currencySymbol,
    currencyValue: formData.currencyValue,
    id: props.modelValue.id
  }
  emit('update:modelValue', form)
  emit('submit', form)
}

onMounted(() => {
  fetchCurrencies()
})
</script>
