import { createPBAdminClient } from '#server/utils/pocketbase'

export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()

  try {
    const currencies = await pb.collection('currencies').getFullList({
      sort: 'currency_name',
    })
    
    return currencies.map(c => ({
      id: c.id,
      code: c.currency_code,
      name: c.currency_name,
      symbol: c.currency_symbol,
      value: c.currency_value,
    }))
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Para birimleri getirilirken bir hata oluştu' },
    })
  }
})
