import { manufacturerSchema } from '../../../validations/manufacturers'

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

  try {
    const record = await pb.collection('manufacturers').create({
      company: body.company.trim(),
      owner: body.owner?.trim() || '',
      phone: body.phone?.trim() || '',
      tax_office: body.tax_office?.trim() || '',
      tax_id: body.tax_id?.trim() || '',
      adress: body.adress?.trim() || '',
    })
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Üretici oluşturulurken bir hata oluştu' },
    })
  }
})
