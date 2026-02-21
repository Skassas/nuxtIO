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
    
    // Debug log
    console.log('DEBUG [id].get - raw record:', record)
    console.log('DEBUG [id].get - currency_value:', record.currency_value, typeof record.currency_value)
    
    // PocketBase number alanları sayı olarak döndürebilir, string'e çevirelim
    // Ama formatı korumak için önce string kontrolü yapalım
    if (typeof record.currency_value === 'number') {
      // Sayıysa ve formatlanmış string bekleniyorsa, düzelt
      // Ancak veritabanında zaten formatlanmış string saklanıyor
      console.log('DEBUG [id].get - currency_value is number:', record.currency_value)
    }
    
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Para birimi getirilirken bir hata oluştu' },
    })
  }
})
