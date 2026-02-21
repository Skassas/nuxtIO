import { z } from 'zod'

export const locationSchema = z.object({
  location_name: z.string().min(2, 'Mağaza adı en az 2 karakter olmalıdır'),
  location_description: z.string().optional(),
  category_status: z.boolean().optional(),
  category_image: z.string().optional(),
})

export type LocationInput = z.infer<typeof locationSchema>
