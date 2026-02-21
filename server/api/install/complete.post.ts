import { saveConfigs } from '#server/utils/settings'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  if (!body.companyName) {
    throw createError({
      statusCode: 400,
      message: 'Firma adı gerekli'
    })
  }

  saveConfigs({
    common: { 
      appName: body.companyName,
      installed: true 
    }
  })

  return { success: true }
})
