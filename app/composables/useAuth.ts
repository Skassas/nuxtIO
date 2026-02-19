interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  avatar: string
}

const user = ref<AuthUser | null>(null)

export function useAuth() {
  const isLoggedIn = computed(() => !!user.value)
  const { addToast } = useToast()
  const router = useRouter()

  async function login(email: string, password: string) {
    try {
      const res = await $fetch<{ user: AuthUser }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      user.value = res.user
      addToast('Basariyla giris yapildi', 'success')
      await router.push('/admin')
    } catch (err: any) {
      const data = err?.data?.data || err?.data || {}
      if (data.error === 'DB_ERROR') {
        await router.push('/dberror')
        return
      }
      addToast(data.message || 'Giris yapilirken bir hata olustu', 'error')
      throw err
    }
  }

  async function logout() {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    user.value = null
    await router.push('/login')
  }

  async function fetchUser(): Promise<AuthUser | null> {
    try {
      const res = await $fetch<{ user: AuthUser }>('/api/auth/me')
      user.value = res.user
      return res.user
    } catch (err: any) {
      user.value = null
      return null
    }
  }

  return {
    user: readonly(user),
    isLoggedIn,
    login,
    logout,
    fetchUser,
  }
}
