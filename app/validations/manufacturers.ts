import { z } from 'zod'

export const manufacturerSchema = z.object({
  manufacturer_company: z.string().min(5, 'Firma adı en az 5 karakter olmalıdır').max(100, 'Firma adı en fazla 100 karakter olabilir'),
  manufacturer_owner: z.string().optional(),
  manufacturer_phone: z.string().optional(),
  manufacturer_tax_office: z.string().optional(),
  manufacturer_tax_id: z.string().optional(),
  manufacturer_address: z.string().optional(),
})

export type ManufacturerInput = z.infer<typeof manufacturerSchema>
