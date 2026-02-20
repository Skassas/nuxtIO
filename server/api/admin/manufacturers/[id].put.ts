import { manufacturerSchema } from '../../../validations/manufacturers'

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

  try {
    const record = await pb.collection('manufacturers').update(id, {
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
      data: { error: 'SERVER_ERROR', message: 'Üretici güncellenirken bir hata oluştu' },
    })
  }
})
