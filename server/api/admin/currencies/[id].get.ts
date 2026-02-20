import { createPBAdminClient } from '#server/utils/pocketbase'

export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Para birimi ID belirtilmelidir' },
    })
  }

  try {
    const record = await pb.collection('currencies').getOne(id)
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Para birimi getirilirken bir hata oluştu' },
    })
  }
})
