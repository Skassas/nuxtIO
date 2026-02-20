export function useNumericInput(defaultValue: string = '') {
  const inputValue = ref(defaultValue)

  const allowedKeys = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Home', 'End'
  ]

  function formatInput(value: string): string {
    return value.replace(/\D/g, '')
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
