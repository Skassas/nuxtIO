import { z } from 'zod'

export const currencySchema = z.object({
  currencyName: z.string().min(2, 'Para birimi en az 2 karakter olmalıdır'),
  currencyCode: z.string().min(3, 'Kod en az 3 karakter olmalıdır').max(3, 'Kod en fazla 3 karakter olmalıdır'),
  currencySymbol: z.string().min(1, 'Sembol gereklidir'),
  currencyValue: z.string().min(1, 'Değer gereklidir'),
  currencyAutoUpdate: z.boolean().default(true),
})

export type CurrencyInput = z.infer<typeof currencySchema> & { id?: string }
