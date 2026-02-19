export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const query = getQuery(event)

  const page = Number(query.page) || 1
  const perPage = Number(query.perPage) || 20
  const search = (query.search as string) || ''
  const sort = (query.sort as string) || '-created'

  try {
    const result = await pb.collection('categories').getList(page, perPage, {
      sort,
      filter: search ? `name ~ "${search}" || description ~ "${search}"` : '',
      expand: 'parent',
    })
    return result
  } catch (err: any) {
    console.error('[categories/index.get] PB hata:', err?.message || err)
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: err?.message || 'Kategoriler getirilirken bir hata oluştu' },
    })
  }
})
