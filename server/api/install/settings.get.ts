import { getConfigs } from '#server/utils/settings'

export default defineEventHandler(async (event) => {
  const configs = getConfigs()
  
  return {
    pocketbaseUrl: configs.db.pocketbaseUrl,
    companyName: configs.common.appName,
  }
})
