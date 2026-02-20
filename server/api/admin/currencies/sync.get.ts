export default defineEventHandler(async (event) => {
  try {
    const response = await fetch('https://www.tcmb.gov.tr/kurlar/today.xml')
    const xmlText = await response.text()
    
    const symbolMap: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CHF': 'Fr',
      'CAD': 'C$',
      'AUD': 'A$',
      'SEK': 'kr',
      'NOK': 'kr',
      'DKK': 'kr',
    }

    const currencies: any[] = []
    
    const currencyRegex = /<Currency[^>]*Kod="(\w+)"[^>]*>/g
    let match
    
    while ((match = currencyRegex.exec(xmlText)) !== null) {
      const code = match[1]
      const currencyBlock = xmlText.substring(match.index, xmlText.indexOf('</Currency>', match.index) + 11)
      
      const unitMatch = currencyBlock.match(/<Unit>(\d+)<\/Unit>/)
      const nameMatch = currencyBlock.match(/<Isim>([^<]+)<\/Isim>/)
      const valueMatch = currencyBlock.match(/<BanknoteSelling>([^<]*)<\/BanknoteSelling>/)
      
      if (unitMatch && nameMatch && valueMatch && valueMatch[1]) {
        const unit = parseInt(unitMatch[1])
        const rawName = nameMatch[1].trim()
        const banknoteSellingStr = valueMatch[1].trim()
        
        if (banknoteSellingStr) {
          const banknoteSelling = parseFloat(banknoteSellingStr.replace(',', '.'))
          if (!isNaN(banknoteSelling)) {
            const value = (banknoteSelling / unit).toFixed(4).replace(/\.?0+$/, '')
            const name = formatTurkishName(rawName)
            
            currencies.push({
              code,
              name,
              symbol: symbolMap[code] || code,
              value
            })
          }
        }
      }
    }
    
    currencies.unshift({
      code: 'TRY',
      name: 'Türk Lirası',
      symbol: '₺',
      value: '1'
    })
    
    return currencies
  } catch (error) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Kurlar alınırken bir hata oluştu' },
    })
  }
})

function formatTurkishName(name: string): string {
  const turkishUpper: Record<string, string> = {
    'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G', 'h': 'H', 'ı': 'I', 'i': 'İ', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O', 'ö': 'Ö', 'p': 'P', 'r': 'R', 's': 'S', 'ş': 'Ş', 't': 'T', 'u': 'U', 'ü': 'Ü', 'v': 'V', 'y': 'Y', 'z': 'Z',
    'q': 'Q', 'w': 'W', 'x': 'X', 'ğ': 'Ğ', 'ç': 'Ç'
  }
  
  const turkishLower: Record<string, string> = {
    'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd', 'E': 'e', 'F': 'f', 'G': 'g', 'H': 'h', 'İ': 'i', 'I': 'ı', 'J': 'j', 'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n', 'O': 'o', 'Ö': 'ö', 'P': 'p', 'R': 'r', 'S': 's', 'Ş': 'ş', 'T': 't', 'U': 'u', 'Ü': 'ü', 'V': 'v', 'Y': 'y', 'Z': 'z',
    'Q': 'q', 'W': 'w', 'X': 'x', 'Ğ': 'ğ', 'Ç': 'ç'
  }
  
  const words = name.split(' ')
  const formatted = words.map(word => {
    if (word.length === 0) return word
    
    const firstChar = word[0]
    const upperFirst = turkishUpper[firstChar] || firstChar.toUpperCase()
    
    const rest = word.slice(1).split('').map(c => turkishLower[c] || c.toLowerCase()).join('')
    
    return upperFirst + rest
  }).join(' ')
  
  return formatted
}
