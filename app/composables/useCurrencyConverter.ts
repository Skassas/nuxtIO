interface Currency {
  id: string
  code: string
  name: string
  symbol: string
  value: string
}

interface Settings {
  functionalCurrency: string
  reportingCurrency: string
}

export function useCurrencyConverter() {
  const settings = useState<Settings | null>('currency-settings', () => null)
  const currencies = useState<Currency[]>('currencies-list', () => [])
  const loading = ref(false)

  async function fetchSettings() {
    try {
      const data = await $fetch<Settings>('/api/admin/settings')
      settings.value = data
      return data
    } catch (e) {
      console.error('Settings fetch error:', e)
      return null
    }
  }

  async function fetchCurrencies() {
    try {
      const data = await $fetch<Currency[]>('/api/admin/currencies/all')
      currencies.value = data
      return data
    } catch (e) {
      console.error('Currencies fetch error:', e)
      return []
    }
  }

  function getCurrencyValue(currencyId: string): number {
    const curr = currencies.value.find(c => c.id === currencyId)
    if (!curr?.value) return 1
    
    const cleanValue = curr.value.replace(/\./g, '').replace(',', '.')
    return parseFloat(cleanValue) || 1
  }

  function getCurrencySymbol(currencyId: string): string {
    const curr = currencies.value.find(c => c.id === currencyId)
    return curr?.symbol || ''
  }

  function getCurrencyCode(currencyId: string): string {
    const curr = currencies.value.find(c => c.id === currencyId)
    return curr?.code || ''
  }

  function convertToReporting(functionalAmount: number): number {
    if (!settings.value) return functionalAmount
    
    const functionalValue = getCurrencyValue(settings.value.functionalCurrency)
    const reportingValue = getCurrencyValue(settings.value.reportingCurrency)
    
    if (functionalValue === reportingValue) return functionalAmount
    
    // Convert: amount / functionalValue * reportingValue
    return (functionalAmount / functionalValue) * reportingValue
  }

  function convertFromReporting(reportingAmount: number): number {
    if (!settings.value) return reportingAmount
    
    const functionalValue = getCurrencyValue(settings.value.functionalCurrency)
    const reportingValue = getCurrencyValue(settings.value.reportingCurrency)
    
    if (functionalValue === reportingValue) return reportingAmount
    
    // Convert: amount / reportingValue * functionalValue
    return (reportingAmount / reportingValue) * functionalValue
  }

  function formatWithReportingCurrency(amount: number): string {
    if (!settings.value) return amount.toString()
    
    const converted = convertToReporting(amount)
    const symbol = getCurrencySymbol(settings.value.reportingCurrency)
    const code = getCurrencyCode(settings.value.reportingCurrency)
    
    // Format as Turkish currency
    const formatted = formatTurkishCurrency(converted)
    return `${formatted} ${symbol}`
  }

  function formatTurkishCurrency(value: number): string {
    return value.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  async function init() {
    loading.value = true
    try {
      await Promise.all([
        fetchSettings(),
        fetchCurrencies()
      ])
    } finally {
      loading.value = false
    }
  }

  return {
    settings: readonly(settings),
    currencies: readonly(currencies),
    loading: readonly(loading),
    fetchSettings,
    fetchCurrencies,
    getCurrencyValue,
    getCurrencySymbol,
    getCurrencyCode,
    convertToReporting,
    convertFromReporting,
    formatWithReportingCurrency,
    formatTurkishCurrency,
    init
  }
}
