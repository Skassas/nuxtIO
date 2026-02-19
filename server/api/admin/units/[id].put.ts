import { unitSchema } from '../../../validations/units'

export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Birim ID belirtilmelidir' },
    })
  }

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
    const record = await pb.collection('units').update(id, {
      name: body.name.trim(),
      description: body.description?.trim() || '',
    })
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Birim guncellenirken bir hata olustu' },
    })
  }
})
