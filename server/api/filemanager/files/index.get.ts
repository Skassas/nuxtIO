export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const query = getQuery(event)
  const parent = query.parent as string | null

  try {
    let filter = ''
    if (parent === null || parent === 'null' || parent === '' || parent === undefined) {
      filter = 'parent = null'
    } else {
      filter = `parent = "${parent}"`
    }
    const result = await pb.collection('fm_files').getList(1, 100, {
      filter,
      sort: 'name',
    })
    return result
  } catch (err: any) {
    console.error('[fm_files/get] PB hata:', err?.message || err)
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: err?.message || 'Dosyalar getirilirken hata oluştu' },
    })
  }
})
