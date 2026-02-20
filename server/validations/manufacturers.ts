import { z } from 'zod'

export const manufacturerSchema = z.object({
  company: z.string().min(5, 'Firma adı en az 5 karakter olmalıdır').max(100, 'Firma adı en fazla 100 karakter olabilir'),
  owner: z.string().optional(),
  phone: z.string().optional(),
  tax_office: z.string().optional(),
  tax_id: z.string().optional(),
  adress: z.string().optional(),
})

export type ManufacturerInput = z.infer<typeof manufacturerSchema>
