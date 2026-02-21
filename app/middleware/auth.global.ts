export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  if (to.path === '/dberror') {
    return
  }

  if (to.path === '/install' || to.path.startsWith('/install/')) {
    return
  }

  if (to.path === '/login') {
    try {
      const res = await $fetch<{ user: any }>('/api/auth/me')
      if (res?.user && res.user.role === 'admin') {
        return navigateTo('/admin')
      }
    } catch {}
    return
  }

  if (to.path.startsWith('/admin')) {
    const checkRes = await $fetch<{ installed: boolean }>('/api/check-installed').catch(() => ({ installed: false }))
    
    if (!checkRes.installed) {
      return navigateTo('/install')
    }

    try {
      const res = await $fetch<{ user: any }>('/api/auth/me')

      if (!res?.user) {
        return navigateTo('/login')
      }

      if (res.user.role !== 'admin') {
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
})
