export function usePriceInput(defaultValue: string = '', decimalPlaces: number = 2, allowZero: boolean = false) {
  const inputValue = ref('')

  // İzin verilen tuşlar: rakamlar, virgül, nokta, silme/navigasyon tuşları
  const allowedKeys = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '.',
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'
  ]

  /**
   * Sayısal değeri parse eder ve tam/kuruş kısımlarını döndürür
   * Türkçe format: 1.234.567,89 (nokta=binlik ayraç, virgül=ondalık)
   * İngilizce format: 1,234,567.89 veya 1234567.89
   */
  function parseNumericValue(value: string): { integer: string; decimal: string; isValid: boolean } {
    if (!value || value.trim() === '') {
      return { integer: '', decimal: '', isValid: false }
    }

    const trimmed = value.trim()
    
    // Para birimi sembolünü kaldır (₺, $, €, vb.)
    const cleanValue = trimmed.replace(/[^0-9.,]/g, '')
    
    if (!cleanValue) {
      return { integer: '', decimal: '', isValid: false }
    }

    // Virgül varsa: Türkçe format (virgül = ondalık ayırıcı)
    const commaIndex = cleanValue.indexOf(',')
    
    if (commaIndex !== -1) {
      const beforeCommaRaw = cleanValue.substring(0, commaIndex)
      const beforeComma = beforeCommaRaw.replace(/\./g, '') // Noktaları kaldır (binlik ayraç)
      const afterComma = cleanValue.substring(commaIndex + 1).replace(/[^0-9]/g, '')
      
      return { 
        integer: beforeComma.replace(/^0+/, '') || '0', 
        decimal: afterComma.substring(0, decimalPlaces), 
        isValid: true 
      }
    }

    // Virgül yok - sadece noktalar var
    const dotMatches = cleanValue.match(/\./g)
    if (!dotMatches) {
      // Hiç nokta yok - sadece rakamlar
      const digits = cleanValue.replace(/[^0-9]/g, '')
      return { 
        integer: digits.replace(/^0+/, '') || '0', 
        decimal: '', 
        isValid: digits.length > 0 
      }
    }

    // Nokta(lar) var - son noktayı kontrol et
    const lastDotIndex = cleanValue.lastIndexOf('.')
    const afterLastDot = cleanValue.substring(lastDotIndex + 1).replace(/[^0-9]/g, '')
    const beforeLastDot = cleanValue.substring(0, lastDotIndex).replace(/\./g, '')
    
    // Sync API'den gelen değerlerde nokta ondalık ayraç olarak kullanılıyor
    // Örn: "51.5523" -> 51.5523 (ondalık nokta)
    // Eğer tek nokta varsa ve sonrasında 1-4 basamak varsa, ondalık olarak kabul et
    if (dotMatches.length === 1 && afterLastDot.length > 0 && afterLastDot.length <= 4 && beforeLastDot.length > 0) {
      // İngilizce ondalık formatı (Sync API)
      return { 
        integer: beforeLastDot.replace(/^0+/, '') || '0', 
        decimal: afterLastDot.substring(0, decimalPlaces), 
        isValid: true 
      }
    }
    
    // Eski mantık: Son noktadan sonra 1-2 basamak varsa ondalık olarak kabul et
    if (afterLastDot.length > 0 && afterLastDot.length <= decimalPlaces && beforeLastDot.length > 0) {
      // İngilizce ondalık formatı: 1234.56
      return { 
        integer: beforeLastDot.replace(/^0+/, '') || '0', 
        decimal: afterLastDot, 
        isValid: true 
      }
    }

    // Hepsi binlik ayraç
    const allDigits = cleanValue.replace(/\./g, '').replace(/[^0-9]/g, '')
    return { 
      integer: allDigits.replace(/^0+/, '') || '0', 
      decimal: '', 
      isValid: allDigits.length > 0 
    }
  }

  /**
   * Binlik ayraçları (Türk formatı: nokta) ekler.
   * Örnek: "1234567" → "1.234.567"
   */
  function addThousandSeparators(num: string): string {
    if (!num || num === '0') return '0'
    const digits = num.replace(/\D/g, '')
    if (!digits) return '0'
    if (digits === '0') return '0'

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

  /**
   * Tam formatlama: binlik ayraçları + kuruş kısmını tamamlama.
   * Blur'da veya dışarıdan gelen değerleri formatlamak için kullanılır.
   */
  function formatInput(value: any): string {
    if (value === null || value === undefined || value === '') return ''

    const stringValue = String(value).trim()
    if (!stringValue) return ''

    const parsed = parseNumericValue(stringValue)
    if (!parsed.isValid) return ''

    // 0 kontrolü - sadece 0 veya boşsa boş döndür (allowZero false ise)
    if (!allowZero && parsed.integer === '0' && (parsed.decimal === '' || parsed.decimal === '00')) {
      return ''
    }
    
    // 0,00 formatı (allowZero true ise)
    if (parsed.integer === '0' && parsed.decimal === '') {
      return '0,00'
    }

    // Binlik ayraçları ekle
    const formattedInt = addThousandSeparators(parsed.integer)
    
    // Kuruş kısmını tamamla
    let formattedDecimal = parsed.decimal
    if (formattedDecimal.length === 0) {
      formattedDecimal = '00'
    } else if (formattedDecimal.length === 1) {
      formattedDecimal = formattedDecimal + '0'
    }

    return formattedInt + ',' + formattedDecimal
  }

  /**
   * Canlı formatlama - yazım sırasında kullanılır
   * Sadece binlik ayraçları ekler, kuruş kısmına dokunmaz
   */
  function formatLive(value: string): string {
    if (!value || value.trim() === '') return ''

    const trimmed = value.trim()
    
    // Para birimi sembollerini ve diğer karakterleri kaldır
    const cleanValue = trimmed.replace(/[^0-9.,]/g, '')
    if (!cleanValue) return ''
    
    // Virgül varsa
    const commaIndex = cleanValue.indexOf(',')
    if (commaIndex !== -1) {
      const beforeComma = cleanValue.substring(0, commaIndex).replace(/\./g, '')
      const afterComma = cleanValue.substring(commaIndex + 1).replace(/[^0-9]/g, '').substring(0, decimalPlaces)
      
      // Sıfır ile başlama kontrolü (sadece "0," izinli)
      let cleanInt = beforeComma.replace(/^0+/, '')
      if (cleanInt === '' && beforeComma.length > 0) {
        // Kullanıcı "0," yazıyor
        cleanInt = '0'
      }
      
      // allowZero false ise ve sadece 0 varsa boş döndür
      if (!allowZero && cleanInt === '0' && afterComma === '') {
        return ''
      }
      
      const formattedInt = addThousandSeparators(cleanInt)
      return afterComma ? formattedInt + ',' + afterComma : formattedInt + ','
    }

    // Virgül yok - sadece tam kısım
    const cleaned = cleanValue.replace(/[^0-9]/g, '')
    if (!cleaned) return ''
    
    // Sıfır ile başlama kontrolü
    const cleanInt = cleaned.replace(/^0+/, '') || '0'
    
    // allowZero false ise ve sadece 0 varsa boş döndür
    if (!allowZero && cleanInt === '0') {
      return ''
    }
    
    return addThousandSeparators(cleanInt)
  }

  /**
   * Ham değeri (sadece rakamlar ve virgül) döndürür
   * API'ye göndermek için kullanılır
   */
  function getRawValue(): string {
    const val = inputValue.value
    if (!val) return ''
    
    // Binlik ayraçlarını (nokta) kaldır, virgülü noktaya çevir
    return val.replace(/\./g, '').replace(',', '.')
  }

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement
    const rawValue = input.value
    const cursorPos = input.selectionStart || 0

    // Formatla
    const formatted = formatLive(rawValue)
    inputValue.value = formatted
    
    // Cursor pozisyonunu düzelt
    nextTick(() => {
      if (!input || !document.activeElement || document.activeElement !== input) return
      
      // Basit yaklaşım: cursor'u input'un sonuna konumlandır
      // Bu kullanıcının yazmaya devam etmesini sağlar
      const newPos = formatted.length
      input.setSelectionRange(newPos, newPos)
    })
  }

  function handleKeyDown(e: KeyboardEvent) {
    const input = e.target as HTMLInputElement

    // Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X vb. kombinasyonlara izin ver
    if (e.ctrlKey || e.metaKey) return

    const isSpecialKey = allowedKeys.includes(e.key) || e.key.startsWith('F')

    if (!isSpecialKey) {
      e.preventDefault()
      return
    }

    // Nokta tuşu kontrolü - virgül ekle
    if (e.key === '.') {
      e.preventDefault()
      const currentValue = input.value
      const cursorPos = input.selectionStart || 0
      const selectionEnd = input.selectionEnd || 0
      
      // Zaten virgül varsa işlem yapma
      if (currentValue.includes(',')) return
      
      // Cursor pozisyonuna virgül ekle
      const newValue = currentValue.substring(0, cursorPos) + ',' + currentValue.substring(selectionEnd)
      const formatted = formatLive(newValue)
      inputValue.value = formatted
      
      nextTick(() => {
        // Virgülden sonraki pozisyona cursor'u konumlandır
        const commaIndex = formatted.indexOf(',')
        const newCursorPos = commaIndex !== -1 ? commaIndex + 1 : formatted.length
        input.setSelectionRange(newCursorPos, newCursorPos)
      })
      return
    }

    // 0 ile başlama engeli
    if (e.key === '0') {
      const currentValue = input.value
      const selectionStart = input.selectionStart || 0
      const selectionEnd = input.selectionEnd || 0

      // Tüm metin seçiliyse veya input boşsa
      if ((selectionStart === 0 && selectionEnd === currentValue.length) || currentValue === '') {
        e.preventDefault()
        return
      }

      // Cursor en baştaysa ve input boş değilse
      if (selectionStart === 0 && currentValue.length > 0) {
        // Virgülden önceki karakterler
        const commaIndex = currentValue.indexOf(',')
        const intPart = commaIndex !== -1 ? currentValue.substring(0, commaIndex).replace(/\./g, '') : currentValue.replace(/\./g, '')
        
        if (intPart === '0' || intPart === '') {
          e.preventDefault()
          return
        }
      }
    }

    // Virgül kuralları
    if (e.key === ',') {
      const currentValue = input.value

      // Boş input'a veya başa virgül basılamaz
      if (!currentValue || (input.selectionStart || 0) === 0) {
        // Başta virgül varsa, "0," yap
        if (!currentValue) {
          e.preventDefault()
          inputValue.value = '0,'
          nextTick(() => {
            input.setSelectionRange(2, 2)
          })
        } else {
          e.preventDefault()
        }
        return
      }

      // Zaten virgül varsa ikinci virgüle izin verme
      if (currentValue.includes(',')) {
        e.preventDefault()
        return
      }
    }

    // Backspace ve Delete için özel işlem - seçili metin varsa izin ver
    if ((e.key === 'Backspace' || e.key === 'Delete') && input.selectionStart !== input.selectionEnd) {
      // Seçili metin var, normal silme işlemi yapılacak
      // handleInput event'i tetiklenecek ve format uygulanacak
      return
    }
    
    // Kuruş kısmı 2 basamakla sınırlı - 3. basamağı engelle
    if (e.key >= '0' && e.key <= '9') {
      const currentValue = input.value
      const cursorPos = input.selectionStart || 0
      
      // Virgül varsa ve cursor virgülden sonraysa
      const commaIndex = currentValue.indexOf(',')
      if (commaIndex !== -1 && cursorPos > commaIndex) {
        // Virgülden sonraki basamak sayısını hesapla
        const decimalDigits = currentValue.substring(commaIndex + 1).replace(/[^0-9]/g, '')
        
        // Eğer zaten 2 basamak varsa ve seçili metin yoksa, yeni rakamı engelle
        if (decimalDigits.length >= decimalPlaces && !(input.selectionStart !== input.selectionEnd)) {
          e.preventDefault()
          return
        }
      }
    }
  }

  function handleKeyPress(e: KeyboardEvent) {
    const char = String.fromCharCode(e.which)
    // Sadece rakam, virgül ve noktaya izin ver
    if (!/^[0-9,\.]$/.test(char)) {
      e.preventDefault()
    }
  }

  function handlePaste(e: ClipboardEvent) {
    e.preventDefault()
    const pastedText = e.clipboardData?.getData('text') || ''
    const formatted = formatInput(pastedText)
    inputValue.value = formatted
  }

  function handleBlur() {
    const value = inputValue.value
    if (!value) return

    // Blur'da tam formatlama uygula (kuruş tamamlama dahil)
    const formatted = formatInput(value)
    inputValue.value = formatted
  }

  function validate(): boolean {
    const val = inputValue.value
    if (!val) return false
    
    const parsed = parseNumericValue(val)
    if (!parsed.isValid) return false
    
    // 0 kontrolü
    if (!allowZero && parsed.integer === '0' && (parsed.decimal === '' || parsed.decimal === '00')) {
      return false
    }
    
    return true
  }

  // Initial değer varsa formatla
  if (defaultValue) {
    inputValue.value = formatInput(defaultValue)
  }

  return {
    inputValue: readonly(inputValue),
    formatInput,
    getRawValue,
    handleInput,
    handleKeyDown,
    handleKeyPress,
    handlePaste,
    handleBlur,
    validate,
    setValue: (val: string) => {
      inputValue.value = formatInput(val)
    }
  }
}
