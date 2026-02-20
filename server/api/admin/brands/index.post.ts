import { brandSchema } from '../../../validations/brands'

function normalizeForSearch(text: string): string {
  const turkishChars: Record<string, string> = {
    'ç': 'c', 'Ç': 'C',
    'ğ': 'g', 'Ğ': 'G',
    'ı': 'i', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ş': 's', 'Ş': 'S',
    'ü': 'u', 'Ü': 'U'
  }
  let normalized = text
  for (const [turkish, ascii] of Object.entries(turkishChars)) {
    normalized = normalized.replace(new RegExp(turkish, 'g'), ascii)
  }
  return normalized.toLowerCase()
}

export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const formData = await readMultipartFormData(event)

  if (!formData) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Form verisi bulunamadı' },
    })
  }

  const nameField = formData.find(f => f.name === 'name')
  const name = nameField?.value ? nameField.value : (nameField?.data ? Buffer.from(nameField.data).toString('utf-8') : undefined)
  const descriptionField = formData.find(f => f.name === 'description')
  const description = descriptionField?.value ? descriptionField.value : (descriptionField?.data ? Buffer.from(descriptionField.data).toString('utf-8') : undefined)
  const image = formData.find(f => f.name === 'image')
  const imageId = formData.find(f => f.name === 'image_id')

  const formDataParsed = {
    name: name?.trim() || '',
    description: description?.trim() || '',
    image: '',
  }

  try {
    brandSchema.parse(formDataParsed)
  } catch (error: any) {
    const firstError = error.errors[0]
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: firstError.message },
    })
  }

  const searchIndex = normalizeForSearch(name || '')

  try {
    const data: Record<string, any> = {
      name: name?.trim(),
      description: description?.trim() || '',
      search_index: searchIndex,
    }

    if (image) {
      if (image.data && image.data.length > 0) {
        const fileBuffer = Buffer.from(image.data)
        const fileName = image.filename || 'upload.jpg'
        const blob = new Blob([fileBuffer])
        const fileFormData = new FormData()
        fileFormData.append('file', blob, fileName)
        fileFormData.append('name', fileName)
        
        const record = await pb.collection('fm_files').create(fileFormData)
        data.image = record.id
      }
    }
    
    if (imageId) {
      const imageIdValue = imageId.value ? imageId.value : (imageId.data ? Buffer.from(imageId.data).toString('utf-8') : undefined)
      if (imageIdValue && typeof imageIdValue === 'string' && imageIdValue.length > 0) {
        data.image = imageIdValue
      }
    }

    const record = await pb.collection('brands').create(data)
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Marka oluşturulurken bir hata oluştu' },
    })
  }
})
