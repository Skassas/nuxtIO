export function useAutoFocus() {
  onMounted(() => {
    nextTick(() => {
      const firstInput = document.querySelector('#tax-form input:not([type="hidden"])') ||
                        document.querySelector('#unit-form input:not([type="hidden"])') ||
                        document.querySelector('#brand-form input:not([type="hidden"])') ||
                        document.querySelector('#category-form input:not([type="hidden"])') ||
                        document.querySelector('#manufacturer-form input:not([type="hidden"])') ||
                        document.querySelector('#customer-form input:not([type="hidden"])')
      if (firstInput instanceof HTMLElement) {
        firstInput.focus()
      }
    })
  })
}
