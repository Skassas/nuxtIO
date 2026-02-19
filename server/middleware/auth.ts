import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  const url = getRequestURL(event)

  if (url.pathname === '/api/auth/login') {
    return
  }

  if (!url.pathname.startsWith('/api/')) {
    return
  }

  const healthy = await checkHealth()
  if (!healthy) {
    throw createError({
      statusCode: 503,
      data: { error: 'DB_ERROR', message: 'Veritabani baglantisi kurulamadi' },
    })
  }

  const token = getCookie(event, 'pb_token')
  if (!token) {
    throw createError({
      statusCode: 401,
      data: { error: 'AUTH_REQUIRED', message: 'Sisteme giris yapmaniz gerekmektedir' },
    })
  }

  const pb = createPBClient()
  pb.authStore.save(token, { id: '' })

  try {
    const authResult = await pb.collection('users').authRefresh()
    const user = authResult.record

    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        data: { error: 'FORBIDDEN', message: 'Bu sayfaya erisim yetkiniz bulunmamaktadir' },
      })
    }

    event.context.user = user
    event.context.pb = pb
  } catch (err: any) {
    if (err.statusCode === 403) {
      throw err
    }
    throw createError({
      statusCode: 401,
      data: { error: 'AUTH_REQUIRED', message: 'Oturum suresi dolmus, lutfen tekrar giris yapin' },
    })
  }
})
