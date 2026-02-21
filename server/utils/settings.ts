import { readBody, createError } from 'h3'
import fs from 'fs'
import path from 'path'

const configFilePath = path.resolve(process.cwd(), 'app_config.json')

interface DbConfig {
  pocketbaseUrl: string
}

interface CommonConfig {
  appName: string
  installed: boolean
}

interface AdminConfig {
  functionalCurrency: string
  reportingCurrency: string
  profitPercent: number
  profitFixedMargin: number | null
  profitFixedCurrency: string
  defaultTaxes: string[]
  defaultUnits: string[]
}

interface CatalogConfig {
  currency: string
  tax: string
}

export interface AppConfigs {
  db: DbConfig
  common: CommonConfig
  admin: AdminConfig
  catalog: CatalogConfig
}

const defaultConfigs: AppConfigs = {
  db: {
    pocketbaseUrl: 'http://127.0.0.1:8090'
  },
  common: {
    appName: 'NuxtIO',
    installed: false
  },
  admin: {
    functionalCurrency: '',
    reportingCurrency: '',
    profitPercent: 0,
    profitFixedMargin: null,
    profitFixedCurrency: '',
    defaultTaxes: [],
    defaultUnits: []
  },
  catalog: {
    currency: '',
    tax: ''
  }
}

function ensureConfigFile() {
  if (!fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, JSON.stringify(defaultConfigs, null, 2))
  }
}

export function getConfigs(): AppConfigs {
  try {
    ensureConfigFile()
    const data = fs.readFileSync(configFilePath, 'utf-8')
    return { ...defaultConfigs, ...JSON.parse(data) }
  } catch (err) {
    return defaultConfigs
  }
}

export function saveConfigs(configs: Partial<AppConfigs>): AppConfigs {
  ensureConfigFile()
  const current = getConfigs()
  const updated = {
    db: { ...current.db, ...configs.db },
    common: { ...current.common, ...configs.common },
    admin: { ...current.admin, ...configs.admin },
    catalog: { ...current.catalog, ...configs.catalog }
  }
  fs.writeFileSync(configFilePath, JSON.stringify(updated, null, 2))
  return updated
}

export function isInstalled(): boolean {
  return getConfigs().common.installed
}

export function getDbConfig(): DbConfig {
  return getConfigs().db
}
