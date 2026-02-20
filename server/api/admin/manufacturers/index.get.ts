export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  
  try {
    await pb.collections.refresh()
  } catch (e) {
    console.log('Collection refresh error:', e)
  }
  
  const allCollections = await pb.collections.getFullList()
  console.log('Available collections:', allCollections.map(c => c.name))
  
  const query = getQuery(event)

  const page = Number(query.page) || 1
  const perPage = Number(query.perPage) || 10
  const search = (query.search as string) || ''
  const sort = (query.sort as string) || '-created'

  try {
    const result = await pb.collection('manufacturers').getList(page, perPage, {
      sort,
      filter: search ? `company ~ "${search}" || owner ~ "${search}"` : '',
    })
    return result
  } catch (err: any) {
    console.error('[manufacturers/index.get] PB hata:', err?.message || err)
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Üreticiler getirilirken bir hata oluştu' },
    })
  }
})
