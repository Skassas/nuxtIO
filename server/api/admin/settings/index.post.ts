import { createPBAdminClient } from '#server/utils/pocketbase'

export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const body = await readBody(event)

  try {
    // Mevcut settings'i kontrol et
    const existingSettings = await pb.collection('settings').getList(1, 1, {
      sort: '-created',
    })

    let record
    
    if (existingSettings.totalItems > 0) {
      // Güncelle
      const existingId = existingSettings.items[0].id
      record = await pb.collection('settings').update(existingId, {
        company_name: body.companyName?.trim() || '',
        company_phone: body.companyPhone?.trim() || '',
        company_tax_place: body.companyTaxPlace?.trim() || '',
        company_tax_number: body.companyTaxNumber?.trim() || '',
        company_address: body.companyAddress?.trim() || '',
        company_logo: body.companyLogo || '',
        functional_currency: body.functionalCurrency || '',
        reporting_currency: body.reportingCurrency || '',
        installed: true,
      })
    } else {
      // Oluştur
      record = await pb.collection('settings').create({
        company_name: body.companyName?.trim() || '',
        company_phone: body.companyPhone?.trim() || '',
        company_tax_place: body.companyTaxPlace?.trim() || '',
        company_tax_number: body.companyTaxNumber?.trim() || '',
        company_address: body.companyAddress?.trim() || '',
        company_logo: body.companyLogo || '',
        functional_currency: body.functionalCurrency || '',
        reporting_currency: body.reportingCurrency || '',
        installed: true,
      })
    }

    return {
      success: true,
      data: record
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Ayarlar kaydedilirken bir hata oluştu' },
    })
  }
})
