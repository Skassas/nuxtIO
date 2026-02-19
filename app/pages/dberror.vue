<template>
  <div class="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="text-center">
      <div class="mb-6 text-6xl text-red-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 class="mb-2 text-2xl font-bold text-gray-800 dark:text-white">Veritabani Baglantisi Kurulamadi</h1>
      <p class="mb-8 text-gray-500 dark:text-gray-400">PocketBase sunucusuna erisilemedi. Lutfen sunucunun calistigindan emin olun.</p>
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
      addToast('Veritabani hala erisilemez durumda', 'error')
    } else {
      await router.push('/login')
    }
  }
}
</script>
