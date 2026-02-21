import { categorySchema } from '../../../../app/validations/categories'

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

  const nameField = formData.find(f => f.name === 'category_name')
  const name = nameField?.value ? nameField.value : (nameField?.data ? Buffer.from(nameField.data).toString('utf-8') : undefined)
  const descriptionField = formData.find(f => f.name === 'category_description')
  const description = descriptionField?.value ? descriptionField.value : (descriptionField?.data ? Buffer.from(descriptionField.data).toString('utf-8') : undefined)
  const parentField = formData.find(f => f.name === 'parent')
  const parent = parentField?.value ? parentField.value : (parentField?.data ? Buffer.from(parentField.data).toString('utf-8') : undefined)
  const statusField = formData.find(f => f.name === 'category_status')
  const status = statusField?.value ? statusField.value : (statusField?.data ? Buffer.from(statusField.data).toString('utf-8') : 'true')
  const image = formData.find(f => f.name === 'category_image')
  const imageId = formData.find(f => f.name === 'image_id')

  const formDataParsed = {
    category_name: name?.trim() || '',
    category_description: description?.trim() || '',
    parent: parent?.trim() || '',
    category_image: '',
    category_status: status === 'true',
  }

  try {
    categorySchema.parse(formDataParsed)
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
      category_name: name?.trim(),
      category_description: description?.trim() || '',
      parent: parent?.trim() || null,
      category_status: status === 'true',
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
        data.category_image = record.id
      }
    }
    
    if (imageId) {
      const imageIdValue = imageId.value ? imageId.value : (imageId.data ? Buffer.from(imageId.data).toString('utf-8') : undefined)
      if (imageIdValue && typeof imageIdValue === 'string' && imageIdValue.length > 0) {
        data.category_image = imageIdValue
      }
    }

    const record = await pb.collection('categories').create(data)
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Kategori oluşturulurken bir hata oluştu' },
    })
  }
})
