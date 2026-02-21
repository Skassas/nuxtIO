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
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"> Değeri <span class="text-red-500">*</span></label>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₺</span>
        <input 
          :value="currencyValueInput.inputValue.value" 
          @input="currencyValueInput.handleInput" 
          @blur="handleBlur"
          @keydown="currencyValueInput.handleKeyDown"
          @keypress="currencyValueInput.handleKeyPress"
          @paste="currencyValueInput.handlePaste"
          type="text" required placeholder="Değeri girin"
          inputmode="decimal"
          autocomplete="off"
          class="w-full rounded-lg border border-gray-300 py-2 pl-8 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.currencyValue ? 'border-red-500' : ''" />
      </div>
      <p v-if="errors?.currencyValue" class="mt-1 text-xs text-red-500">{{ errors.currencyValue }}</p>
    </div>
    <div class="flex items-center gap-2">
      <input v-model="formData.currencyAutoUpdate" type="checkbox" id="auto_update"
        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
      <label for="auto_update" class="text-sm font-medium text-gray-700 dark:text-gray-300">Otomatik Güncelle</label>
    </div>
  </form>
</template>

<script setup lang="ts">
import { currencySchema } from '~/validations/currencies'
import type { CurrencyInput } from '~/validations/currencies'
import { useAutoFocus } from '~/composables/useAutoFocus'
import { usePriceInput } from '~/composables/usePriceInput'

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

const currencyValueInput = usePriceInput('', 2, false)

const formData = reactive({
  currencyName: '',
  currencyCode: '',
  currencySymbol: '',
  currencyValue: '',
  currencyAutoUpdate: true
})

// Props'tan gelen değerleri forma yükle - sadece ilk yüklemede veya ID değiştiğinde çalışsın
const lastProcessedId = ref<string | null>(null)

watch(() => props.modelValue, (val) => {
  // Sadece ID değiştiğinde veya ilk yüklemede çalışsın
  if (lastProcessedId.value === val.id) return
  lastProcessedId.value = val.id || null
  
  if (val.currencyCode && val.currencyName) {
    formData.currencyName = val.currencyName
    formData.currencyCode = val.currencyCode
    formData.currencySymbol = val.currencySymbol || ''
    formData.currencyAutoUpdate = val.currencyAutoUpdate !== undefined ? val.currencyAutoUpdate : true
    
    // Değeri formatla ve input'a ata - ham değeri kullan
    const rawValue = String(val.currencyValue || '')
    formData.currencyValue = rawValue
    currencyValueInput.setValue(rawValue)
  }
}, { immediate: true })

// Para birimi seçildiğinde - sadece ekleme modunda (edit modunda değilse) çalışsın
watch(selectedCurrency, (curr) => {
  if (curr && !isEditMode.value) {
    formData.currencyName = curr.name
    formData.currencyCode = curr.code
    formData.currencySymbol = curr.symbol
    formData.currencyValue = curr.value || ''
    currencyValueInput.setValue(curr.value || '')
  }
})

// Input değeri değiştiğinde form verisini güncelle
watch(currencyValueInput.inputValue, (val) => {
  formData.currencyValue = val
})

// Blur event handler - kuruş tamamlama için
function handleBlur(e: Event) {
  currencyValueInput.handleBlur()
  // Blur sonrası değeri form'a ata
  formData.currencyValue = currencyValueInput.inputValue.value
}

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
  
  // usePriceInput'tan ham değeri al ve formatInput ile normalize et
  // Bu fonksiyon zaten 2 ondalık basamağa indiriyor
  const rawValue = currencyValueInput.getRawValue() // Örn: "51.5523" veya "5606.2345"
  const formattedValue = currencyValueInput.formatInput(rawValue) // Örn: "51,55" veya "5.606,23"
  
  const form = {
    currencyName: formData.currencyName,
    currencyCode: formData.currencyCode,
    currencySymbol: formData.currencySymbol,
    currencyValue: formattedValue,
    currencyAutoUpdate: formData.currencyAutoUpdate,
    id: props.modelValue.id
  }
  emit('update:modelValue', form)
  emit('submit', form)
}

onMounted(() => {
  fetchCurrencies()
})
</script>
