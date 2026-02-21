import PocketBase from 'pocketbase'
import { getDbConfig } from './settings'

const config = useRuntimeConfig()

export function createPBClient(): PocketBase {
  return new PocketBase(getDbConfig().pocketbaseUrl)
}

export async function createPBAdminClient(): Promise<PocketBase> {
  const pb = new PocketBase(getDbConfig().pocketbaseUrl)
  await pb.admins.authWithPassword(config.pocketbaseAdminEmail, config.pocketbaseAdminPassword)
  return pb
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await $fetch<{ code: number }>(`${getDbConfig().pocketbaseUrl}/api/health`, {
      timeout: 5000,
    })
    return res?.code === 200
  } catch {
    return false
  }
}
