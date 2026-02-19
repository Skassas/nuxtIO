import PocketBase from 'pocketbase'

const config = useRuntimeConfig()

export function createPBClient(): PocketBase {
  return new PocketBase(config.pocketbaseUrl)
}

export async function createPBAdminClient(): Promise<PocketBase> {
  const pb = new PocketBase(config.pocketbaseUrl)
  await pb.admins.authWithPassword(config.pocketbaseAdminEmail, config.pocketbaseAdminPassword)
  return pb
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await $fetch<{ code: number }>(`${config.pocketbaseUrl}/api/health`, {
      timeout: 5000,
    })
    return res?.code === 200
  } catch {
    return false
  }
}
