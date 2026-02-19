export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = event.context.params?.id

  if (!id) {
    throw createError({ statusCode: 400, data: { error: 'ID_REQUIRED' } })
  }

  try {
    await pb.collection('fm_folders').delete(id)
    return { success: true }
  } catch (err: any) {
    console.error('[fm_folders/delete] PB hata:', err?.message || err)
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: err?.message || 'Klasör silinirken hata oluştu' },
    })
  }
})
