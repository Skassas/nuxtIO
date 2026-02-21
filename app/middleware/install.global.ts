export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) {
    return
  }

  // Install sayfası için yönlendirme yapma
  if (to.path === '/install') {
    return
  }

  // Login ve db error sayfalarını atla
  if (to.path === '/login' || to.path === '/dberror') {
    return
  }

  try {
    const settings = await $fetch<{ installed: boolean }>('/api/admin/settings')
    
    if (!settings.installed) {
      return navigateTo('/install')
    }
  } catch (err) {
    // Hata durumunda install sayfasına yönlendir
    return navigateTo('/install')
  }
})
