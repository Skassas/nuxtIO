import { z } from 'zod'

export const taxSchema = z.object({
  tax_name: z.string().min(2, 'Vergi adı en az 2 karakter olmalıdır'),
  tax_ratio: z.string().min(1, 'Vergi oranı gereklidir').max(4, 'Vergi oranı en fazla 4 karakter olmalıdır'),
  tax_description: z.string().optional(),
})

export type TaxInput = z.infer<typeof taxSchema>
