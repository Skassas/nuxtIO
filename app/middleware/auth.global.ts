export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  if (to.path === '/dberror') {
    return
  }

  if (to.path.startsWith('/admin')) {
    try {
      const res = await $fetch<{ user: any }>('/api/auth/me')

      if (!res?.user) {
        return navigateTo('/login')
      }

      if (res.user.role !== 'admin') {
        const { addToast } = useToast()
        addToast('Bu sayfaya erisim yetkiniz bulunmamaktadir', 'error')
        return navigateTo('/login')
      }
    } catch (err: any) {
      const data = err?.data?.data || err?.data || {}

      if (data.error === 'DB_ERROR') {
        return navigateTo('/dberror')
      }

      return navigateTo('/login')
    }
  }

  if (to.path === '/login') {
    try {
      const res = await $fetch<{ user: any }>('/api/auth/me')
      if (res?.user && res.user.role === 'admin') {
        return navigateTo('/admin')
      }
    } catch {}
  }
})
