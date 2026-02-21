import { z } from 'zod'

export const categorySchema = z.object({
  category_name: z.string().min(2, 'Kategori adı en az 2 karakter olmalıdır'),
  category_description: z.string().optional(),
  parent: z.string().optional().nullable(),
  category_image: z.string().optional(),
  category_status: z.boolean().default(true),
})

export type CategoryInput = z.infer<typeof categorySchema>
