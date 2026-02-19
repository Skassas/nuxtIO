export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()

  try {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({ statusCode: 400, data: { error: 'NO_DATA' } })
    }

    const fields: Record<string, string> = {}
    let fileField: { name: string; data: Buffer; filename: string; type: string } | null = null
    
    for (const part of formData) {
      if (part.name === 'file' && part.filename) {
        fileField = {
          name: part.name,
          data: part.data,
          filename: part.filename,
          type: part.type || 'application/octet-stream'
        }
      } else if (part.name === 'parent') {
        const val = part.data.toString()
        fields.parent = val === '' || val === 'null' ? null : val
      } else {
        fields[part.name] = part.data.toString()
      }
    }

    const name = fields.name?.trim()
    if (!name) {
      throw createError({ statusCode: 400, data: { error: 'NAME_REQUIRED' } })
    }
    const cleanName = name.replace(/[^a-zA-Z0-9_ğüşöçİĞÜŞÖÇ ]/g, '')
    if (!cleanName || cleanName.length !== name.length) {
      throw createError({ statusCode: 400, data: { error: 'INVALID_NAME' } })
    }
    fields.name = cleanName

    const record: Record<string, any> = { ...fields }
    
    if (fileField) {
      const blob = new Blob([fileField.data], { type: fileField.type })
      record.file = new File([blob], fileField.filename, { type: fileField.type })
    }

    const result = await pb.collection('fm_files').create(record)
    return result
  } catch (err: any) {
    console.error('[fm_files/create] PB hata:', err?.message || err)
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: err?.message || 'Dosya yüklenirken hata oluştu' },
    })
  }
})
