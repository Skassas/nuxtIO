/**
 * Para birimi değerini formatlar (Server-side usePriceInput eşdeğeri)
 * Türkçe format: 1.234.567,89 (nokta=binlik ayraç, virgül=ondalık)
 */
export function formatCurrencyValue(value: string | number | null | undefined, decimalPlaces: number = 2): string {
  if (value === null || value === undefined || value === '') return ''

  const stringValue = String(value).trim()
  if (!stringValue) return ''

  // Para birimi sembolünü kaldır
  const cleanValue = stringValue.replace(/[^0-9.,]/g, '')
  if (!cleanValue) return ''

  // Virgül varsa: Türkçe format
  const commaIndex = cleanValue.indexOf(',')
  if (commaIndex !== -1) {
    const beforeComma = cleanValue.substring(0, commaIndex).replace(/\./g, '')
    const afterComma = cleanValue.substring(commaIndex + 1).replace(/[^0-9]/g, '')
    
    const integer = beforeComma.replace(/^0+/, '') || '0'
    const decimal = afterComma.substring(0, decimalPlaces)
    
    if (integer === '0' && decimal === '') return ''
    
    return addThousandSeparators(integer) + ',' + decimal.padEnd(decimalPlaces, '0')
  }

  // Virgül yok - sadece noktalar var
  const dotMatches = cleanValue.match(/\./g)
  if (!dotMatches) {
    // Hiç nokta yok
    const digits = cleanValue.replace(/[^0-9]/g, '')
    const integer = digits.replace(/^0+/, '') || '0'
    if (integer === '0') return ''
    return addThousandSeparators(integer) + ',' + '0'.repeat(decimalPlaces)
  }

  // Tek nokta ve ondalık kısım var (Sync API formatı)
  const lastDotIndex = cleanValue.lastIndexOf('.')
  const afterLastDot = cleanValue.substring(lastDotIndex + 1).replace(/[^0-9]/g, '')
  const beforeLastDot = cleanValue.substring(0, lastDotIndex).replace(/\./g, '')
  
  if (dotMatches.length === 1 && afterLastDot.length > 0 && afterLastDot.length <= 4 && beforeLastDot.length > 0) {
    // İngilizce ondalık formatı (örn: 51.5523)
    const integer = beforeLastDot.replace(/^0+/, '') || '0'
    const decimal = afterLastDot.substring(0, decimalPlaces)
    return addThousandSeparators(integer) + ',' + decimal.padEnd(decimalPlaces, '0')
  }

  // Hepsi binlik ayraç
  const allDigits = cleanValue.replace(/\./g, '').replace(/[^0-9]/g, '')
  const integer = allDigits.replace(/^0+/, '') || '0'
  if (integer === '0') return ''
  return addThousandSeparators(integer) + ',' + '0'.repeat(decimalPlaces)
}

function addThousandSeparators(num: string): string {
  if (!num || num === '0') return '0'
  const digits = num.replace(/\D/g, '')
  if (!digits || digits === '0') return '0'

  let result = ''
  let count = 0
  for (let i = digits.length - 1; i >= 0; i--) {
    if (count > 0 && count % 3 === 0) {
      result = '.' + result
    }
    result = digits[i] + result
    count++
  }
  return result
}
