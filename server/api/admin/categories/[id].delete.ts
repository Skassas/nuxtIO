export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Kategori ID belirtilmelidir' },
    })
  }

  try {
    // Check if category has children
    const children = await pb.collection('categories').getList(1, 1, {
      filter: `parent = "${id}"`
    })

    if (children.totalItems > 0) {
      throw createError({
        statusCode: 400,
        data: { error: 'HAS_CHILDREN', message: 'Bu kategorinin alt kategorileri bulunmaktadır. Öncelikle alt kategorileri silmelisiniz.' },
      })
    }

    await pb.collection('categories').delete(id)
    return { message: 'Kategori başarıyla silindi' }
  } catch (err: any) {
    // Re-throw if it's already a createError
    if (err.statusCode) {
      throw err
    }
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Kategori silinirken bir hata oluştu' },
    })
  }
})
