export default defineEventHandler(async (event) => {
  const collection = getRouterParam(event, 'collection')
  const fileId = getRouterParam(event, 'fileId')

  if (!collection || !fileId) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Collection ve fileId belirtilmelidir' },
    })
  }

  const pb = await createPBAdminClient()

  try {
    const fmFileRecord = await pb.collection('fm_files').getOne(fileId)
    const fileFieldName = fmFileRecord.file
    
    if (!fileFieldName) {
      throw createError({
        statusCode: 404,
        data: { error: 'FILE_NOT_FOUND', message: 'Dosya bulunamadi - file alani bos' },
      })
    }
    
    const fileUrl = pb.files.getURL(fmFileRecord, fileFieldName)
    
    const response = await fetch(fileUrl)
    
    if (!response.ok) {
      throw createError({
        statusCode: response.status,
        data: { error: 'FILE_NOT_FOUND', message: 'Dosya bulunamadi' },
      })
    }

    const arrayBuffer = await response.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const contentType = response.headers.get('content-type') || 'application/octet-stream'

    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=31536000')
    
    return buffer
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: err?.message || 'Dosya getirilirken hata olustu' },
    })
  }
})
