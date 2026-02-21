<template>
  <div v-if="loading" class="flex items-center justify-center py-12">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
  <div v-else>
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
          <template v-for="(step, index) in stepList" :key="index">
            <div class="flex items-center">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                :class="currentStep >= index
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300'">
                {{ index + 1 }}
              </div>
              <div v-if="index < stepList.length - 1" class="w-16 h-0.5 mx-2" :class="currentStep > index
                ? 'bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-700'" />
            </div>
          </template>
        </div>
        <div class="flex justify-center mt-2">
          <template v-for="(step, index) in stepList" :key="index">
            <span class="text-xs mx-1" :class="currentStep >= index ? 'text-blue-600' : 'text-gray-400'">
              <!-- {{ step }} -->
            </span>
          </template>
        </div>
      </div>

      <form @submit.prevent="handleSubmit">
        <div v-if="currentStep === 0">
          <_StepDb :form-data="form" />
        </div>
        <div v-else-if="currentStep === 1">
          <_StepCompany :form-data="form" />
        </div>

        <div class="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button v-if="currentStep > 0" type="button" @click="currentStep--"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">
            Geri
          </button>
          <div v-else></div>

          <button v-if="currentStep < stepList.length - 1" type="button" :disabled="checking" @click="nextStep"
            class="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {{ checking ? 'Kontrol ediliyor...' : 'Devam' }}
          </button>
          <button v-else type="submit" :disabled="saving"
            class="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ saving ? 'Kaydediliyor...' : 'Kurulumu Tamamla' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import _StepDb from './_StepDb.vue'
import _StepCompany from './_StepCompany.vue'

definePageMeta({
  layout: 'install'
})

const router = useRouter()
const { addToast } = useToast()

const stepList = ['Veritabanı', 'Firma Bilgileri']
const currentStep = ref(0)
const saving = ref(false)
const checking = ref(false)
const loading = ref(true)

const form = reactive({
  pocketbaseUrl: '',
  companyName: '',
  companyPhone: '',
  companyTaxPlace: '',
  companyTaxNumber: '',
  companyAddress: ''
})

async function loadSettings() {
  loading.value = true
  try {
    const data = await $fetch<{ installed: boolean; pocketbaseUrl: string }>('/api/check-installed')

    if (data.installed) {
      router.replace('/admin')
      return
    }

    form.pocketbaseUrl = data.pocketbaseUrl || ''
  } catch (e) {
    console.log('Ayarlar yüklenemedi')
  } finally {
    loading.value = false
  }
}

async function nextStep() {
  if (currentStep.value === 0) {
    if (!form.pocketbaseUrl.trim()) {
      addToast('PocketBase URL zorunludur', 'warning')
      return
    }

    checking.value = true
    try {
      const result = await $fetch<{ healthy: boolean; error?: string }>('/api/health', {
        query: { url: form.pocketbaseUrl }
      })

      if (!result.healthy) {
        addToast(result.error || 'Sunucu sağlıksız veya ulaşılamıyor', 'error')
        checking.value = false
        return
      }

      await $fetch('/api/install/save-db', {
        method: 'POST',
        body: { pocketbaseUrl: form.pocketbaseUrl }
      })

      currentStep.value++
    } catch (e) {
      addToast('Sunucu kontrolü başarısız', 'error')
    } finally {
      checking.value = false
    }
  }
}

async function handleSubmit() {
  if (!form.companyName.trim()) {
    addToast('Firma adı zorunludur', 'warning')
    return
  }
  
  saving.value = true
  try {
    await $fetch('/api/install/complete', {
      method: 'POST',
      body: {
        companyName: form.companyName,
        companyPhone: form.companyPhone,
        companyTaxPlace: form.companyTaxPlace,
        companyTaxNumber: form.companyTaxNumber,
        companyAddress: form.companyAddress
      }
    })

    router.push('/admin')
  } catch (e) {
    addToast('Kaydedilirken hata oluştu', 'error')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>
