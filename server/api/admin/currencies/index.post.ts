import { currencySchema } from '../../../validations/currencies'

function normalizeForSearch(text: string): string {
  const turkishChars: Record<string, string> = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  }
  let normalized = text
  for (const [turkish, ascii] of Object.entries(turkishChars)) {
    normalized = normalized.replace(new RegExp(turkish, 'g'), ascii)
  }
  return normalized.toLowerCase()
}

export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const body = await readBody(event)

  console.log('[currencies post] body:', JSON.stringify(body))

  try {
    currencySchema.parse(body)
  } catch (error: any) {
    console.log('[currencies post] validation error:', error)
    const zodError = error.errors || error.issues || []
    const firstError = zodError[0]
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: firstError?.message || 'Validasyon hatası' },
    })
  }

  const name = body.currencyName?.trim() || ''
  const searchIndex = normalizeForSearch(name)

  try {
    const record = await pb.collection('currencies').create({
      currency_name: body.currencyName?.trim() || '',
      currency_code: body.currencyCode?.trim() || '',
      currency_symbol: body.currencySymbol?.trim() || '',
      currency_value: body.currencyValue?.trim() || '',
      search_index: searchIndex,
    })
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Para birimi oluşturulurken bir hata oluştu' },
    })
  }
})
