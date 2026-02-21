<template>
  <div class="text-center">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">
      Kurulum
    </h1>
    <p class="text-gray-600 dark:text-gray-400 mb-8">
      Sistem ayarlarınızı yapılandırın
    </p>
  </div>

  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
    <div class="mb-8">
      <div class="flex items-center justify-center gap-2">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          class="flex items-center"
        >
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
            :class="currentStep >= index 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'"
          >
            {{ index + 1 }}
          </div>
          <div 
            v-if="index < steps.length - 1"
            class="w-16 h-0.5 mx-2"
            :class="currentStep > index 
              ? 'bg-blue-600' 
              : 'bg-gray-200 dark:bg-gray-700'"
          />
        </div>
      </div>
      <div class="flex justify-center mt-2">
        <span 
          v-for="(step, index) in steps" 
          :key="index"
          class="text-xs mx-1"
          :class="currentStep >= index ? 'text-blue-600' : 'text-gray-400'"
        >
          {{ step }}
        </span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <!-- Step 1: Firma Bilgileri -->
      <div v-show="currentStep === 0" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Firma Adı <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="form.companyName"
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
            v-model="form.companyPhone"
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
              v-model="form.companyTaxPlace"
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
              v-model="form.companyTaxNumber"
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
            v-model="form.companyAddress"
            rows="3"
            placeholder="Adres bilgisi"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <!-- Step 2: Para Birimleri -->
      <div v-show="currentStep === 1" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fonksiyonel Para Birimi <span class="text-red-500">*</span>
          </label>
          <select 
            v-model="form.functionalCurrency"
            required
            class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Para birimi seçin</option>
            <option v-for="curr in currencies" :key="curr.id" :value="curr.id">
              {{ curr.name }} ({{ curr.code }}) - {{ curr.value }}
            </option>
          </select>
          <p class="mt-1 text-xs text-gray-500">
            Ürün fiyatları bu para birimi cinsinden kaydedilir. Bu seçim sonradan değiştirilemez.
          </p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Raporlama Para Birimi <span class="text-red-500">*</span>
          </label>
          <select 
            v-model="form.reportingCurrency"
            required
            class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="">Para birimi seçin</option>
            <option v-for="curr in currencies" :key="curr.id" :value="curr.id">
              {{ curr.name }} ({{ curr.code }}) - {{ curr.value }}
            </option>
          </select>
          <p class="mt-1 text-xs text-gray-500">
            Fatura ve raporlarda görüntülenecek para birimi.
          </p>
        </div>
      </div>

      <!-- Step 3: Onay -->
      <div v-show="currentStep === 2" class="space-y-4">
        <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
          <h3 class="font-medium text-blue-900 dark:text-blue-200 mb-2">Kurulum Özeti</h3>
          <dl class="space-y-1 text-sm">
            <div class="flex justify-between">
              <dt class="text-gray-600 dark:text-gray-400">Firma Adı:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ form.companyName || '-' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600 dark:text-gray-400">Telefon:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ form.companyPhone || '-' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600 dark:text-gray-400">Vergi Dairesi:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ form.companyTaxPlace || '-' }}</dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600 dark:text-gray-400">Vergi No:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">{{ form.companyTaxNumber || '-' }}</dd>
            </div>
            <div class="flex justify-between pt-2 border-t border-blue-200 dark:border-blue-700">
              <dt class="text-gray-600 dark:text-gray-400">Fonksiyonel Para Birimi:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">
                {{ getCurrencyName(form.functionalCurrency) }}
              </dd>
            </div>
            <div class="flex justify-between">
              <dt class="text-gray-600 dark:text-gray-400">Raporlama Para Birimi:</dt>
              <dd class="font-medium text-gray-900 dark:text-white">
                {{ getCurrencyName(form.reportingCurrency) }}
              </dd>
            </div>
          </dl>
        </div>

        <div class="flex items-start gap-2">
          <input 
            v-model="form.confirmed"
            type="checkbox" 
            id="confirm"
            class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label for="confirm" class="text-sm text-gray-600 dark:text-gray-400">
            Kurulumu tamamladığımda yukarıdaki bilgilerin kaydedileceğini onaylıyorum. 
            <span class="text-red-500">Fonksiyonel para birimi sonradan değiştirilemez.</span>
          </label>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          v-if="currentStep > 0"
          type="button"
          @click="currentStep--"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Geri
        </button>
        <div v-else></div>
        
        <button 
          v-if="currentStep < steps.length - 1"
          type="button"
          @click="nextStep"
          class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          İleri
        </button>
        <button 
          v-else
          type="submit"
          :disabled="saving || !form.confirmed"
          class="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ saving ? 'Kaydediliyor...' : 'Kurulumu Tamamla' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'install'
})

const router = useRouter()

const steps = ['Firma Bilgileri', 'Para Birimleri', 'Onay']
const currentStep = ref(0)
const saving = ref(false)
const currencies = ref<any[]>([])

const form = reactive({
  companyName: '',
  companyPhone: '',
  companyTaxPlace: '',
  companyTaxNumber: '',
  companyAddress: '',
  functionalCurrency: '',
  reportingCurrency: '',
  confirmed: false
})

async function fetchCurrencies() {
  try {
    const data = await $fetch('/api/admin/currencies/all')
    currencies.value = data
  } catch (e) {
    console.error('Para birimleri yüklenirken hata:', e)
  }
}

function getCurrencyName(id: string) {
  if (!id) return '-'
  const curr = currencies.value.find(c => c.id === id)
  return curr ? `${curr.name} (${curr.code})` : '-'
}

function validateStep(step: number): boolean {
  if (step === 0) {
    return form.companyName.trim().length > 0
  }
  if (step === 1) {
    return form.functionalCurrency.length > 0 && form.reportingCurrency.length > 0
  }
  return true
}

function nextStep() {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

async function handleSubmit() {
  if (!form.confirmed) return
  
  saving.value = true
  try {
    await $fetch('/api/admin/settings', {
      method: 'POST',
      body: {
        companyName: form.companyName,
        companyPhone: form.companyPhone,
        companyTaxPlace: form.companyTaxPlace,
        companyTaxNumber: form.companyTaxNumber,
        companyAddress: form.companyAddress,
        functionalCurrency: form.functionalCurrency,
        reportingCurrency: form.reportingCurrency,
      }
    })
    
    router.push('/admin')
  } catch (e) {
    console.error('Kaydetme hatası:', e)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchCurrencies()
})
</script>
