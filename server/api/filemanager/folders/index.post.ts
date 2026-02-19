export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const body = await readBody(event)

  const name = body.name?.trim()
  if (!name) {
    throw createError({ statusCode: 400, data: { error: 'NAME_REQUIRED' } })
  }
  const cleanName = name.replace(/[^a-zA-Z0-9_ğüşöçİĞÜŞÖÇ ]/g, '')
  if (!cleanName || cleanName.length !== name.length) {
    throw createError({ statusCode: 400, data: { error: 'INVALID_NAME' } })
  }

  try {
    const parentValue = body.parent === '' || body.parent === null || body.parent === undefined ? null : body.parent
    const result = await pb.collection('fm_folders').create({
      parent: parentValue,
      name: cleanName,
    })
    return result
  } catch (err: any) {
    console.error('[fm_folders/create] PB hata:', err?.message || err)
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: err?.message || 'Klasör oluşturulurken hata oluştu' },
    })
  }
})
