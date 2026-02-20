export function useTurkishInput(defaultValue: string = '', extraChars: string = '') {
  const inputValue = ref(defaultValue)

  const turkishUpperMap: Record<string, string> = {
    'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D', 'e': 'E', 'f': 'F', 'g': 'G', 'h': 'H', 'ı': 'I', 'i': 'İ', 'j': 'J', 'k': 'K', 'l': 'L', 'm': 'M', 'n': 'N', 'o': 'O', 'ö': 'Ö', 'p': 'P', 'r': 'R', 's': 'S', 'ş': 'Ş', 't': 'T', 'u': 'U', 'ü': 'Ü', 'v': 'V', 'y': 'Y', 'z': 'Z',
    'q': 'Q', 'w': 'W', 'x': 'X',
    'ğ': 'Ğ', 'ç': 'Ç'
  }

  const turkishLowerMap: Record<string, string> = {
    'A': 'a', 'B': 'b', 'C': 'c', 'D': 'd', 'E': 'e', 'F': 'f', 'G': 'g', 'H': 'h', 'İ': 'i', 'J': 'j', 'K': 'k', 'L': 'l', 'M': 'm', 'N': 'n', 'O': 'o', 'Ö': 'ö', 'P': 'p', 'R': 'r', 'S': 's', 'Ş': 'ş', 'T': 't', 'U': 'u', 'Ü': 'ü', 'V': 'v', 'Y': 'y', 'Z': 'z',
    'Q': 'q', 'W': 'w', 'X': 'x',
    'Ğ': 'ğ', 'Ç': 'ç',
    'I': 'ı'
  }

  const baseAllowedKeys = [
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    ' ', '-', '_',
    'ğ', 'Ğ', 'ü', 'Ü', 'ş', 'Ş', 'ö', 'Ö', 'ç', 'Ç', 'ı', 'İ',
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'
  ]

  const extraCharsArray = extraChars.split('').filter(c => c.trim())
  const allowedKeys = [...baseAllowedKeys, ...extraCharsArray]

  function toTurkishUpper(char: string): string {
    return turkishUpperMap[char] || char.toUpperCase()
  }

  function toTurkishLower(char: string): string {
    return turkishLowerMap[char] || char.toLowerCase()
  }

  function formatInput(value: string): string {
    let regexPattern: string
    if (extraChars) {
      const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const extraEscaped = extraChars.split('').map(escapeRegExp).join('')
      regexPattern = `[^a-zA-Z0-9ğüşöçİĞÜŞÖÇıİ ${extraEscaped}_-]`
    } else {
      regexPattern = '[^a-zA-Z0-9ğüşöçİĞÜŞÖÇıİ _-]'
    }
    
    let filtered = value.replace(new RegExp(regexPattern), '')
    filtered = filtered.replace(/^\s+/g, '')
    filtered = filtered.split('').map(c => toTurkishLower(c)).join('')
    if (filtered.length > 0) {
      filtered = toTurkishUpper(filtered.charAt(0)) + filtered.slice(1)
    }
    filtered = filtered.replace(/\s([a-zıi\u0131ğüşöç])/g, (_, char) => ' ' + toTurkishUpper(char))
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
