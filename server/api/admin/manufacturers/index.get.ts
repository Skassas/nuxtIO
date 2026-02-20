import { createPBAdminClient } from '#server/utils/pocketbase'

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

  const turkishChars: Record<string, string> = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  }
  
  let normalized = search.toLowerCase()
  for (const [turkish, ascii] of Object.entries(turkishChars)) {
    normalized = normalized.replace(new RegExp(turkish, 'g'), ascii)
  }

  try {
    const filter = search 
      ? `(search_index ~ "${search.toLowerCase()}" || search_index ~ "${normalized}")` 
      : ''
    
    const result = await pb.collection('manufacturers').getList(page, perPage, {
      sort,
      filter,
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
