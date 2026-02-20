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
    await pb.collection('currencies').delete(id)
    return { success: true }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Para birimi silinirken bir hata oluştu' },
    })
  }
})
