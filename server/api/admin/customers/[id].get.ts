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
    const record = await pb.collection('customers').getOne(id)
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 404,
      data: { error: 'NOT_FOUND', message: 'Müşteri bulunamadı' },
    })
  }
})
