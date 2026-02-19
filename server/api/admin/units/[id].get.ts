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
    const record = await pb.collection('units').getOne(id)
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 404,
      data: { error: 'NOT_FOUND', message: 'Birim bulunamadi' },
    })
  }
})
