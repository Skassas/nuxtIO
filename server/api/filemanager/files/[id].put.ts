export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) {
    throw createError({ statusCode: 400, data: { error: 'ID_REQUIRED' } })
  }

  const name = body.name?.trim()
  if (!name) {
    throw createError({ statusCode: 400, data: { error: 'NAME_REQUIRED' } })
  }
  const cleanName = name.replace(/[^a-zA-Z0-9_ğüşöçİĞÜŞÖÇ ]/g, '')
  if (!cleanName || cleanName.length !== name.length) {
    throw createError({ statusCode: 400, data: { error: 'INVALID_NAME' } })
  }

  try {
    const result = await pb.collection('fm_files').update(id, { name: cleanName })
    return result
  } catch (err: any) {
    console.error('[fm_files/update] PB hata:', err?.message || err)
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: err?.message || 'Dosya güncellenirken hata oluştu' },
    })
  }
})
