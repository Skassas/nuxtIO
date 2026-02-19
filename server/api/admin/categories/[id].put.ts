import { categorySchema } from '../../../../app/validations/categories'

export default defineEventHandler(async (event) => {
  const pb = await createPBAdminClient()
  const id = getRouterParam(event, 'id')
  const formData = await readMultipartFormData(event)

  if (!id) {
    throw createError({
      statusCode: 400,
      data: { error: 'VALIDATION_ERROR', message: 'Kategori ID belirtilmelidir' },
    })
  }

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
  const parentField = formData.find(f => f.name === 'parent')
  const parent = parentField?.value ? parentField.value : (parentField?.data ? Buffer.from(parentField.data).toString('utf-8') : undefined)
  const statusField = formData.find(f => f.name === 'status')
  const status = statusField?.value ? statusField.value : (statusField?.data ? Buffer.from(statusField.data).toString('utf-8') : 'true')
  const image = formData.find(f => f.name === 'image')
  const imageId = formData.find(f => f.name === 'image_id')

  const formDataParsed = {
    name: name?.trim() || '',
    description: description?.trim() || '',
    parent: parent?.trim() || '',
    image: '',
    status: status === 'true',
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

  try {
    console.log('Güncellenecek kategori ID:', id)
    console.log('Gelen parent değeri:', parent)
    
    const data: Record<string, any> = {
      name: name?.trim(),
      description: description?.trim() || '',
      parent: parent?.trim() || null,
      status: status === 'true',
    }
    
    console.log('Gönderilecek data:', data)

    if (image) {
      const imageValue = image.value ? image.value : (image.data ? Buffer.from(image.data).toString('utf-8') : undefined)
      if (imageValue === 'null' || imageValue === '') {
        data.image = null
      } else if (image.data && image.data.length > 0) {
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
      } else if (imageIdValue === '') {
        data.image = null
      }
    }

    // Güncellemeden önce alt kategorileri kontrol et
    const beforeUpdate = await pb.collection('categories').getList(1, 100, {
      filter: `parent = "${id}"`
    })
    console.log('Güncellemeden önce alt kategoriler:', beforeUpdate.items.map((c: any) => ({ id: c.id, name: c.name, parent: c.parent })))
    
    const record = await pb.collection('categories').update(id, data)
    
    // Güncellemeden sonra alt kategorileri kontrol et
    const afterUpdate = await pb.collection('categories').getList(1, 100, {
      filter: `parent = "${id}"`
    })
    console.log('Güncellemeden sonra aynı ID ile alt kategoriler:', afterUpdate.items.map((c: any) => ({ id: c.id, name: c.name, parent: c.parent })))
    
    // Tüm kategorileri kontrol et - parent'i null olanlar
    const nullParents = await pb.collection('categories').getList(1, 100, {
      filter: 'parent = null'
    })
    console.log('Parent\'i null olan kategoriler:', nullParents.items.map((c: any) => ({ id: c.id, name: c.name, parent: c.parent })))
    
    return record
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      data: { error: 'SERVER_ERROR', message: 'Kategori güncellenirken bir hata oluştu' },
    })
  }
})
