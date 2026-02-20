export function useTextareaInput(defaultValue: string = '') {
  const inputValue = ref(defaultValue)

  const turkishUpperMap: Record<string, string> = {
    'ğ': 'Ğ', 'ü': 'Ü', 'ş': 'Ş', 'ö': 'Ö', 'ç': 'Ç', 'ı': 'I', 'i': 'İ'
  }

  function toTurkishUpper(char: string): string {
    return turkishUpperMap[char] || char.toUpperCase()
  }

  function formatInput(value: string): string {
    if (!inputValue.value && value.startsWith(' ')) {
      return ''
    }
    
    let filtered = value.replace(/^\s+/g, '')
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
    if (e.key === ' ') {
      const target = e.target as HTMLInputElement
      const start = target.selectionStart || 0
      if (start === 0) {
        e.preventDefault()
      }
    }
  }

  return {
    inputValue,
    formatInput,
    handleInput,
    handleKeyDown,
  }
}
