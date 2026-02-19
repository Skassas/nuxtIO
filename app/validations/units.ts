import { z } from 'zod'

export const unitSchema = z.object({
  name: z.string().min(2, 'Birim adi en az 2 karakter olmalidir'),
  description: z.string().optional(),
})

export type UnitInput = z.infer<typeof unitSchema>
