export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Müşteri ID belirtilmelidir' },
    })
  }

  try {
    await pb.collection('customers').delete(id)
    return { message: 'Müşteri başarıyla silindi' }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Müşteri silinirken bir hata oluştu' },
    })
  }
})
