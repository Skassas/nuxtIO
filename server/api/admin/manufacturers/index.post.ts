import { manufacturerSchema } from '../../../validations/manufacturers'

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

  try {
    manufacturerSchema.parse(body)
  } catch (error: any) {
    const firstError = error.errors[0]
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: firstError.message },
    })
  }

  const company = body.company?.trim() || ''
  const owner = body.owner?.trim() || ''
  const phone = body.phone?.trim() || ''
  
  const searchText = [company, owner, phone].filter(Boolean).join(' ')
  const searchIndex = normalizeForSearch(searchText)

  try {
    const record = await pb.collection('manufacturers').create({
      company: company,
      owner: owner,
      phone: phone,
      tax_office: body.tax_office?.trim() || '',
      tax_id: body.tax_id?.trim() || '',
      adress: body.adress?.trim() || '',
      search_index: searchIndex,
    })
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Üretici oluşturulurken bir hata oluştu' },
    })
  }
})
