import { z } from 'zod'

export const customerSchema = z.object({
  customer_type: z.enum(['individual', 'corporate']),
  customer_tckn: z.string().optional(),
  customer_first_name: z.string().optional(),
  customer_last_name: z.string().optional(),
  customer_phone: z.string().optional(),
  customer_billing_adress: z.string().optional(),
  customer_description: z.string().optional(),
  customer_company_name: z.string().optional(),
  customer_company_phone: z.string().optional(),
  customer_company_tax_city: z.string().optional(),
  customer_company_tax_id: z.string().optional(),
  customer_company_address: z.string().optional(),
  customer_company_description: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.customer_type === 'individual') {
    if (!data.customer_tckn || data.customer_tckn.length !== 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'TC Kimlik No 11 karakter olmalıdır',
        path: ['customer_tckn'],
      })
    }
    if (!data.customer_first_name || data.customer_first_name.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Ad zorunludur',
        path: ['customer_first_name'],
      })
    }
    if (!data.customer_last_name || data.customer_last_name.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Soyad zorunludur',
        path: ['customer_last_name'],
      })
    }
    if (!data.customer_phone || data.customer_phone.length !== 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Telefon 10 karakter olmalıdır',
        path: ['customer_phone'],
      })
    }
    if (!data.customer_billing_adress || data.customer_billing_adress.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Fatura adresi zorunludur',
        path: ['customer_billing_adress'],
      })
    }
  } else if (data.customer_type === 'corporate') {
    if (!data.customer_company_name || data.customer_company_name.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Firma adı zorunludur',
        path: ['customer_company_name'],
      })
    }
    if (!data.customer_company_phone || data.customer_company_phone.length !== 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Telefon 10 karakter olmalıdır',
        path: ['customer_company_phone'],
      })
    }
    if (!data.customer_company_tax_city || data.customer_company_tax_city.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vergi dairesi zorunludur',
        path: ['customer_company_tax_city'],
      })
    }
    if (!data.customer_company_tax_id || data.customer_company_tax_id.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Vergi numarası zorunludur',
        path: ['customer_company_tax_id'],
      })
    }
  }
})

export type CustomerInput = z.infer<typeof customerSchema>
