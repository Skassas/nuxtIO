import { createPBAdminClient } from '#server/utils/pocketbase'
import { formatCurrencyValue } from '#server/utils/currencyFormatter'

export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'ID zorunludur' },
    })
  }

  try {
    const currency = await pb.collection('currencies').getOne(id)
    const currencyCode = currency.currency_code
    
    if (currencyCode === 'TRY') {
      const record = await pb.collection('currencies').update(id, {
        currency_value: '1',
      })
      return record
    }
    
    const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml')
    const xmlText = await response.text()
    
    const currencyBlockMatch = xmlText.match(new RegExp(`<Currency[^>]*Kod="${currencyCode}"[^>]*>[\\s\\S]*?</Currency>`))
    
    if (!currencyBlockMatch) {
      throw createError({
        statusCode: 404,
        data: { error: 'NOT_FOUND', message: `Döviz kuru TCMB'de bulunamadı: ${currencyCode}` },
      })
    }
    
    const currencyBlock = currencyBlockMatch[0]
    
    const unitMatch = currencyBlock.match(/<Unit>(\d+)<\/Unit>/)
    const valueMatch = currencyBlock.match(/<BanknoteSelling>([^<]*)<\/BanknoteSelling>/)
    
    if (!unitMatch || !valueMatch || !valueMatch[1]) {
      throw createError({
        statusCode: 404,
        data: { error: 'NOT_FOUND', message: 'Döviz kuru bilgisi bulunamadı' },
      })
    }
    
    const unit = parseInt(unitMatch[1])
    const banknoteSellingStr = valueMatch[1].trim()
    const banknoteSelling = parseFloat(banknoteSellingStr.replace(',', '.'))
    
    if (isNaN(banknoteSelling)) {
      throw createError({
        statusCode: 400,
        data: { error: 'PARSE_ERROR', message: 'Kur değeri okunamadı' },
      })
    }
    
    const newValue = (banknoteSelling / unit).toFixed(4).replace(/\.?0+$/, '')
    
    // Para birimi değerini formatla (2 ondalık basamağa sınırla)
    const formattedValue = formatCurrencyValue(newValue, 2)
    
    const record = await pb.collection('currencies').update(id, {
      currency_value: formattedValue,
    })
    
    return record
  } catch (error: any) {
    console.error('Refresh error:', error)
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: error.message || 'Kur güncellenirken hata oluştu' },
    })
  }
})
