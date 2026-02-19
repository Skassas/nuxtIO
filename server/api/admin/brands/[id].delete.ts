export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Marka ID belirtilmelidir' },
    })
  }

  try {
    await pb.collection('brands').delete(id)
    return { message: 'Marka basariyla silindi' }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Marka silinirken bir hata olustu' },
    })
  }
})
