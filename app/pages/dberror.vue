<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="text-center">
      <div class="mb-6 text-6xl text-red-500">
        <WarningIcon class="mx-auto h-20 w-20" />
      </div>
      <h1 class="mb-2 text-2xl font-bold text-gray-800 dark:text-white">Veritabanı Bağlantısı Kurulamadı</h1>
      <p class="mb-8 text-gray-500 dark:text-gray-400">PocketBase sunucusuna erişilemedi. Lütfen sunucunun çalıştığından emin olun.</p>
      <button
        @click="retry"
        class="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
      >
        Yeniden Dene
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import WarningIcon from '~/assets/svg/WarningIcon.vue'

definePageMeta({ layout: 'default' })

const router = useRouter()

async function retry() {
  try {
    await $fetch('/api/auth/me')
    await router.push('/admin')
  } catch (err: any) {
    const data = err?.data?.data || err?.data || {}
    if (data.error === 'DB_ERROR') {
      const { addToast } = useToast()
      addToast('Veritabanı hala erişilemez durumda', 'error')
    } else {
      await router.push('/login')
    }
  }
}
</script>
