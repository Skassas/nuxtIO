import { z } from 'zod'

export const locationSchema = z.object({
  name: z.string().min(2, 'Mağaza adı en az 2 karakter olmalıdır'),
  description: z.string().optional(),
})

export type LocationInput = z.infer<typeof locationSchema>
