import { getConfigs } from '#server/utils/settings'

export default defineEventHandler(async () => {
  try {
    const configs = getConfigs()
    return {
      installed: configs.common.installed,
      pocketbaseUrl: configs.db.pocketbaseUrl
    }
  } catch (e) {
    return { installed: false, pocketbaseUrl: '' }
  }
})
