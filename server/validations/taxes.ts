import { z } from 'zod'

export const taxSchema = z.object({
  name: z.string().min(2, 'Vergi adı en az 2 karakter olmalıdır'),
  ratio: z.string().min(1, 'Vergi oranı gereklidir').max(4, 'Vergi oranı en fazla 4 karakter olmalıdır'),
  description: z.string().optional(),
})

export type TaxInput = z.infer<typeof taxSchema>
