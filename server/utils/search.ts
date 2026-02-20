export function normalizeSearchTerm(term: string): string {
  const turkishChars: Record<string, string> = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  }
  
  let normalized = term
  for (const [turkish, ascii] of Object.entries(turkishChars)) {
    normalized = normalized.replace(new RegExp(turkish, 'g'), ascii)
  }
  return normalized.toLowerCase()
}

export function buildTurkishSearchFilter(search: string, fields: string[]): string {
  const normalized = normalizeSearchTerm(search)
  const lower = search.toLowerCase()
  const upper = search.toUpperCase()
  const normalizedUpper = normalized.toUpperCase()
  
  const conditions = fields.map(field => {
    return `(${field} ~ "${lower}" || ${field} ~ "${upper}" || ${field} ~ "${normalized}" || ${field} ~ "${normalizedUpper}")`
  })
  return conditions.join(' || ')
}
