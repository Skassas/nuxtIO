export function useApi() {
  const { addToast } = useToast()
  const router = useRouter()

  async function apiFetch<T>(url: string, options: any = {}): Promise<T> {
    try {
      return await $fetch<T>(url, options)
    } catch (err: any) {
      const data = err?.data?.data || err?.data || {}
      const errorCode = data.error

      if (errorCode === 'DB_ERROR') {
        await router.push('/dberror')
        throw err
      }

      if (errorCode === 'AUTH_REQUIRED') {
        addToast(data.message || 'Sisteme giris yapmaniz gerekmektedir', 'error')
        await router.push('/login')
        throw err
      }

      if (errorCode === 'FORBIDDEN') {
        addToast(data.message || 'Bu sayfaya erisim yetkiniz bulunmamaktadir', 'error')
        throw err
      }

      addToast(data.message || 'Bir hata olustu', 'error')
      throw err
    }
  }

  return { apiFetch }
}
