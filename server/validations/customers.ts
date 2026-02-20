import { z } from 'zod'

export const customerSchema = z.object({
  customer_type: z.enum(['individual', 'corporate']),
  tckn: z.string().optional(),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  phone: z.string().optional(),
  billing_address: z.string().optional(),
  description: z.string().optional(),
  company_name: z.string().optional(),
  company_phone: z.string().optional(),
  company_tax_city: z.string().optional(),
  company_tax_id: z.string().optional(),
  company_description: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.customer_type === 'individual') {
    if (!data.tckn || data.tckn.length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'TC Kimlik No 11 karakter olmalıdır',
        path: ['tckn'],
      })
    }
    if (!data.first_name || data.first_name.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ad zorunludur',
        path: ['first_name'],
      })
    }
    if (!data.last_name || data.last_name.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Soyad zorunludur',
        path: ['last_name'],
      })
    }
    if (!data.phone || data.phone.length !== 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Telefon 10 karakter olmalıdır',
        path: ['phone'],
      })
    }
    if (!data.billing_address || data.billing_address.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Fatura adresi zorunludur',
        path: ['billing_address'],
      })
    }
  } else if (data.customer_type === 'corporate') {
    if (!data.company_name || data.company_name.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Firma adı zorunludur',
        path: ['company_name'],
      })
    }
    if (!data.company_phone || data.company_phone.length !== 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Telefon 10 karakter olmalıdır',
        path: ['company_phone'],
      })
    }
    if (!data.company_tax_city || data.company_tax_city.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vergi dairesi zorunludur',
        path: ['company_tax_city'],
      })
    }
    if (!data.company_tax_id || data.company_tax_id.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vergi numarası zorunludur',
        path: ['company_tax_id'],
      })
    }
  }
})

export type CustomerInput = z.infer<typeof customerSchema>
