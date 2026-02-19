import { z } from 'zod'

export const brandSchema = z.object({
  name: z.string().min(2, 'Marka adi en az 2 karakter olmalidir'),
  description: z.string().optional(),
  image: z.string().optional(),
})

export type BrandInput = z.infer<typeof brandSchema>
