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
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Üretici ID belirtilmelidir' },
    })
  }

  try {
    manufacturerSchema.parse(body)
  } catch (error: any) {
    const firstError = error.errors[0]
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: firstError.message },
    })
  }

  const company = body.manufacturer_company?.trim() || ''
  const owner = body.manufacturer_owner?.trim() || ''
  const phone = body.manufacturer_phone?.trim() || ''
  
  const searchText = [company, owner, phone].filter(Boolean).join(' ')
  const searchIndex = normalizeForSearch(searchText)

  try {
    const record = await pb.collection('manufacturers').update(id, {
      manufacturer_company: company,
      manufacturer_owner: owner,
      manufacturer_phone: phone,
      manufacturer_tax_office: body.manufacturer_tax_office?.trim() || '',
      manufacturer_tax_id: body.manufacturer_tax_id?.trim() || '',
      manufacturer_address: body.manufacturer_address?.trim() || '',
      search_index: searchIndex,
    })
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Üretici güncellenirken bir hata oluştu' },
    })
  }
})
