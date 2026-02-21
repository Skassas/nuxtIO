import { createPBAdminClient } from '#server/utils/pocketbase'

export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()

  try {
    const settings = await pb.collection('settings').getList(1, 1, {
      sort: '-created',
    })
    
    if (settings.totalItems > 0) {
      const setting = settings.items[0]
      return {
        installed: setting.installed,
        companyName: setting.company_name,
        companyPhone: setting.company_phone,
        companyTaxPlace: setting.company_tax_place,
        companyTaxNumber: setting.company_tax_number,
        companyAddress: setting.company_address,
        companyLogo: setting.company_logo,
        functionalCurrency: setting.functional_currency,
        reportingCurrency: setting.reporting_currency,
      }
    }
    
    return { installed: false }
  } catch (err: any) {
    return { installed: false }
  }
})
