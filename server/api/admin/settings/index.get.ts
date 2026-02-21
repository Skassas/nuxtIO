import { getConfigs, isInstalled } from '#server/utils/settings'

export default defineEventHandler(async (event) => {
  const configs = getConfigs()
  
  if (!isInstalled()) {
    return {
      installed: false,
      pocketbaseUrl: configs.db.pocketbaseUrl,
      companyName: '',
      companyPhone: '',
      companyTaxPlace: '',
      companyTaxNumber: '',
      companyAddress: '',
      companyLogo: '',
      functionalCurrency: '',
      reportingCurrency: '',
      profitPercent: 0,
      profitFixedMargin: null,
      profitFixedCurrency: '',
      defaultTaxes: [],
      defaultUnits: [],
    }
  }
  
  return {
    installed: configs.common.installed,
    pocketbaseUrl: configs.db.pocketbaseUrl,
    companyName: configs.common.appName,
    companyPhone: '',
    companyTaxPlace: '',
    companyTaxNumber: '',
    companyAddress: '',
    companyLogo: '',
    functionalCurrency: configs.admin.functionalCurrency,
    reportingCurrency: configs.admin.reportingCurrency,
    profitPercent: configs.admin.profitPercent,
    profitFixedMargin: configs.admin.profitFixedMargin,
    profitFixedCurrency: configs.admin.profitFixedCurrency,
    defaultTaxes: configs.admin.defaultTaxes,
    defaultUnits: configs.admin.defaultUnits,
  }
})
