export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body?.email || !body?.password) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'E-posta ve sifre alanlari zorunludur' },
    })
  }

  const healthy = await checkHealth()
  if (!healthy) {
    throw createError({
      statusCode: 503,
      data: { error: 'DB_ERROR', message: 'Veritabani baglantisi kurulamadi' },
    })
  }

  const pb = createPBClient()

  try {
    const authData = await pb.collection('users').authWithPassword(body.email, body.password)
    const user = authData.record

    if (user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        data: { error: 'FORBIDDEN', message: 'Bu sayfaya erisim yetkiniz bulunmamaktadir' },
      })
    }

    setCookie(event, 'pb_token', authData.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    }
  } catch (err: any) {
    if (err.statusCode === 403) {
      throw err
    }
    throw createError({
      statusCode: 401,
      data: { error: 'AUTH_FAILED', message: 'E-posta veya sifre hatali' },
    })
  }
})
