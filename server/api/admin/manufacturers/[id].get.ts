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
    const record = await pb.collection('manufacturers').getOne(id)
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 404,
      data: { error: 'NOT_FOUND', message: 'Üretici bulunamadı' },
    })
  }
})
