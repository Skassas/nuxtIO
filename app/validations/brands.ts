import { z } from 'zod'

export const brandSchema = z.object({
  brand_name: z.string().min(2, 'Marka adi en az 2 karakter olmalidir'),
  brand_description: z.string().optional(),
  image: z.string().optional(),
})

export type BrandInput = z.infer<typeof brandSchema>
