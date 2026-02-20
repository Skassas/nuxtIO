export function useTurkishInput(defaultValue: string = '') {
  const inputValue = ref(defaultValue)

  const turkishUpperMap: Record<string, string> = {
    'ğ': 'Ğ', 'ü': 'Ü', 'ş': 'Ş', 'ö': 'Ö', 'ç': 'Ç', 'ı': 'I', 'i': 'İ'
  }

  const allowedKeys = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    ' ', '-', '_',
    'ğ', 'Ğ', 'ü', 'Ü', 'ş', 'Ş', 'ö', 'Ö', 'ç', 'Ç', 'ı', 'İ',
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'
  ]

  function toTurkishUpper(char: string): string {
    return turkishUpperMap[char] || char.toUpperCase()
  }

  function formatInput(value: string): string {
    let filtered = value.replace(/[^a-zA-Z0-9ğüşöçİĞÜŞÖÇ _-]/g, '')
    filtered = filtered.replace(/^\s+/g, '')
    filtered = filtered.toLowerCase()
    if (filtered.length > 0) {
      filtered = toTurkishUpper(filtered.charAt(0)) + filtered.slice(1)
    }
    return filtered
  }

  function handleInput(e: Event) {
    const input = e.target as HTMLInputElement
    inputValue.value = formatInput(input.value)
  }

  function handleKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement
    
    if (e.key === ' ') {
      const start = target.selectionStart || 0
      if (start === 0) {
        e.preventDefault()
      }
      return
    }
    
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
