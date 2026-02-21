import { saveConfigs, getConfigs } from '#server/utils/settings'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const current = getConfigs()

  // İlk kurulumda pocketbaseUrl zorunlu
  if (!current.common.installed && !body.pocketbaseUrl) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'PocketBase URL zorunludur' },
    })
  }

  try {
    const updated = saveConfigs({
      db: {
        ...current.db,
        pocketbaseUrl: body.pocketbaseUrl || current.db.pocketbaseUrl
      },
      common: {
        ...current.common,
        installed: true,
        appName: body.companyName?.trim() || current.common.appName
      },
      admin: {
        ...current.admin,
        functionalCurrency: body.functionalCurrency || '',
        reportingCurrency: body.reportingCurrency || '',
        profitPercent: parseFloat(body.profitPercent) || 0,
        profitFixedMargin: body.profitFixedMargin ? parseFloat(body.profitFixedMargin) : null,
        profitFixedCurrency: body.profitFixedCurrency || '',
        defaultTaxes: body.taxes || [],
        defaultUnits: body.units || []
      }
    })

    return {
      success: true,
      data: {
        installed: updated.common.installed,
        pocketbaseUrl: updated.db.pocketbaseUrl,
        companyName: updated.common.appName,
        functionalCurrency: updated.admin.functionalCurrency,
        reportingCurrency: updated.admin.reportingCurrency
      }
    }
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Ayarlar kaydedilirken bir hata oluştu: ' + err.message },
    })
  }
})
