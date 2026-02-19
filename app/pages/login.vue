<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
      <div class="mb-8 text-center">
        <h1 class="text-2xl font-bold text-gray-800 dark:text-white">NuxtIO</h1>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Yönetim paneline giriş yapın</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">E-posta</label>
          <input v-model="email" type="email" required placeholder="ornek@mail.com"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Şifre</label>
          <input v-model="password" type="password" required placeholder="Şifrenizi girin"
            class="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
        </div>

        <button type="submit" :disabled="loading"
          class="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50">
          {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const email = ref('kocburcu112@gmail.com')
const password = ref('12345678')
const loading = ref(false)
const { login } = useAuth()
const { addToast } = useToast()

async function handleLogin() {
  if (!email.value || !password.value) {
    addToast('E-posta ve şifre alanları zorunludur', 'warning')
    return
  }
  loading.value = true
  try {
    await login(email.value, password.value)
    const router = useRouter()
    await router.push('/admin')
  } catch {
  } finally {
    loading.value = false
  }
}
</script>
