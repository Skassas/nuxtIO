import { z } from 'zod'

export const categorySchema = z.object({
  name: z.string().min(2, 'Kategori adı en az 2 karakter olmalıdır'),
  description: z.string().optional(),
  parent: z.string().optional().nullable(),
  image: z.string().optional(),
  status: z.boolean().default(true),
})

export type CategoryInput = z.infer<typeof categorySchema>
