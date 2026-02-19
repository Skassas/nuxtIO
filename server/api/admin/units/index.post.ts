import { unitSchema } from '../../../validations/units'

export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const body = await readBody(event)

  try {
    unitSchema.parse(body)
  } catch (error: any) {
    const firstError = error.errors[0]
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: firstError.message },
    })
  }

  try {
    const record = await pb.collection('units').create({
      name: body.name.trim(),
      description: body.description?.trim() || '',
    })
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Birim olusturulurken bir hata olustu' },
    })
  }
})
