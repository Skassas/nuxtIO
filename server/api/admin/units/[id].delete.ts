export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Birim ID belirtilmelidir' },
    })
  }

  try {
    await pb.collection('units').delete(id)
    return { message: 'Birim basariyla silindi' }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Birim silinirken bir hata olustu' },
    })
  }
})
