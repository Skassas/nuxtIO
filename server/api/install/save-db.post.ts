import { saveConfigs } from '#server/utils/settings'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.pocketbaseUrl) {
    throw createError({
      statusCode: 400,
      message: 'URL gerekli'
    })
  }

  saveConfigs({
    db: { pocketbaseUrl: body.pocketbaseUrl }
  })

  return { success: true }
})
