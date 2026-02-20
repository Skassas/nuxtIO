import { customerSchema } from '../../../validations/customers'

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
    customerSchema.parse(body)
  } catch (error: any) {
    const firstError = error.errors[0]
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: firstError.message },
    })
  }

  const firstName = body.first_name?.trim() || ''
  const lastName = body.last_name?.trim() || ''
  const companyName = body.company_name?.trim() || ''
  const phone = body.phone?.trim() || ''
  const companyPhone = body.company_phone?.trim() || ''
  
  const searchText = [
    firstName, lastName, companyName, phone, companyPhone
  ].filter(Boolean).join(' ')
  
  const searchIndex = normalizeForSearch(searchText)

  try {
    const record = await pb.collection('customers').create({
      customer_type: body.customer_type,
      tckn: body.tckn?.trim() || '',
      first_name: firstName,
      last_name: lastName,
      phone: phone,
      billing_address: body.billing_address?.trim() || '',
      description: body.description?.trim() || '',
      company_name: companyName,
      company_phone: companyPhone,
      company_tax_city: body.company_tax_city?.trim() || '',
      company_tax_id: body.company_tax_id?.trim() || '',
      company_description: body.company_description?.trim() || '',
      search_index: searchIndex,
    })
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Müşteri oluşturulurken bir hata oluştu' },
    })
  }
})
