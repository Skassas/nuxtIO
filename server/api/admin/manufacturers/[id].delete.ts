export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Üretici ID belirtilmelidir' },
    })
  }

  try {
    await pb.collection('manufacturers').delete(id)
    return { message: 'Üretici başarıyla silindi' }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Üretici silinirken bir hata oluştu' },
    })
  }
})
