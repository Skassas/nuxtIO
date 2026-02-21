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
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Müşteri ID belirtilmelidir' },
    })
  }

  try {
    customerSchema.parse(body)
  } catch (error: any) {
    const firstError = error.errors[0]
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: firstError.message },
    })
  }

  const firstName = body.customer_first_name?.trim() || ''
  const lastName = body.customer_last_name?.trim() || ''
  const companyName = body.customer_company_name?.trim() || ''
  const phone = body.customer_phone?.trim() || ''
  const companyPhone = body.customer_company_phone?.trim() || ''
  
  const searchText = [
    firstName, lastName, companyName, phone, companyPhone
  ].filter(Boolean).join(' ')
  
  const searchIndex = normalizeForSearch(searchText)

  try {
    const record = await pb.collection('customers').update(id, {
      customer_type: body.customer_type,
      customer_tckn: body.customer_tckn?.trim() || '',
      customer_first_name: firstName,
      customer_last_name: lastName,
      customer_phone: phone,
      customer_billing_adress: body.customer_billing_adress?.trim() || '',
      customer_description: body.customer_description?.trim() || '',
      customer_company_name: companyName,
      customer_company_phone: companyPhone,
      customer_company_tax_city: body.customer_company_tax_city?.trim() || '',
      customer_company_tax_id: body.customer_company_tax_id?.trim() || '',
      customer_company_address: body.customer_company_address?.trim() || '',
      customer_company_description: body.customer_company_description?.trim() || '',
      search_index: searchIndex,
    })
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Müşteri güncellenirken bir hata oluştu' },
    })
  }
})
