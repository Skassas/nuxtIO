export function usePriceInput(defaultValue: string = '', decimalPlaces: number = 2) {
  const inputValue = ref(defaultValue)

  const allowedKeys = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',',
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'
  ]

  function formatInput(value: string): string {
    let cleaned = value.replace(/[^0-9,]/g, '')
    
    const commaIndex = cleaned.indexOf(',')
    
    if (commaIndex !== -1) {
      const integerPart = cleaned.slice(0, commaIndex)
      let decimalPart = cleaned.slice(commaIndex + 1)
      if (decimalPart.length > decimalPlaces) {
        decimalPart = decimalPart.slice(0, decimalPlaces)
      }
      return formatTurkishNumber(integerPart) + ',' + decimalPart
    }
    
    cleaned = cleaned.replace(/,/g, '')
    if (cleaned.length > 0) {
      return formatTurkishNumber(cleaned)
    }
    return ''
  }

  function formatTurkishNumber(num: string): string {
    if (!num) return ''
    const reversed = num.split('').reverse().join('')
    const withDots = reversed.replace(/\d{3}/g, (match) => match + '.')
    return withDots.replace(/\.$/, '').split('').reverse().join('')
  }

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement
    inputValue.value = formatInput(input.value)
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (!allowedKeys.includes(e.key) && !e.key.startsWith('F')) {
      e.preventDefault()
    }
  }

  return {
    inputValue,
    formatInput,
    handleInput,
    handleKeyDown,
  }
}
