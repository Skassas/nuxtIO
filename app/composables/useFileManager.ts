export interface FmFolder {
  id: string
  parent: string | null
  name: string
}

export interface FmFile {
  id: string
  parent: string
  name: string
  ext: string
  file: string
  created: string
  updated: string
}

const folders = ref<FmFolder[]>([])
const files = ref<FmFile[]>([])
const currentFolderId = ref<string | null>(null)
const loading = ref(false)
const breadcrumbs = ref<{ id: string | null; name: string }[]>([{ id: null, name: 'Ana Klasör' }])

export function useFileManager() {

  const fetchFolders = async (parentId: string | null = null) => {
    const query = parentId ? `?parent=${parentId}` : ''
    const result = await $fetch<{ items: FmFolder[] }>(`/api/filemanager/folders${query}`)
    folders.value = result.items
  }

  const fetchFiles = async (parentId: string | null = null) => {
    const query = parentId ? `?parent=${parentId}` : ''
    const result = await $fetch<{ items: FmFile[] }>(`/api/filemanager/files${query}`)
    files.value = result.items
  }

  const loadCurrentFolder = async () => {
    loading.value = true
    await Promise.all([fetchFolders(currentFolderId.value), fetchFiles(currentFolderId.value)])
    loading.value = false
  }

  const navigateToFolder = async (folderId: string | null, folderName: string = 'Ana Klasör') => {
    currentFolderId.value = folderId
    const idx = breadcrumbs.value.findIndex(b => b.id === folderId)
    if (idx !== -1) {
      breadcrumbs.value = breadcrumbs.value.slice(0, idx + 1)
    } else {
      breadcrumbs.value.push({ id: folderId, name: folderName })
    }
    await loadCurrentFolder()
  }

  const createFolder = async (name: string) => {
    await $fetch('/api/filemanager/folders', {
      method: 'POST',
      body: {
        parent: currentFolderId.value,
        name
      }
    })
    await loadCurrentFolder()
  }

  const renameFolder = async (folderId: string, newName: string) => {
    await $fetch(`/api/filemanager/folders/${folderId}`, {
      method: 'PUT',
      body: { name: newName }
    })
    await loadCurrentFolder()
  }

  const deleteFolder = async (folderId: string) => {
    await $fetch(`/api/filemanager/folders/${folderId}`, { method: 'DELETE' })
    await loadCurrentFolder()
  }

  const checkFolderEmpty = async (folderId: string): Promise<boolean> => {
    const foldersResult = await $fetch<{ items: FmFolder[] }>(`/api/filemanager/folders?parent=${folderId}`)
    const filesResult = await $fetch<{ items: FmFile[] }>(`/api/filemanager/files?parent=${folderId}`)
    return foldersResult.items.length === 0 && filesResult.items.length === 0
  }

  const checkDuplicateName = (name: string, type: 'folder' | 'file'): boolean => {
    if (type === 'folder') {
      return folders.value.some(f => f.name.toLowerCase() === name.toLowerCase())
    } else {
      return files.value.some(f => f.name.toLowerCase() === name.toLowerCase())
    }
  }

  const resetToRoot = () => {
    currentFolderId.value = null
    breadcrumbs.value = [{ id: null, name: 'Ana Klasör' }]
  }

  const uploadFile = async (file: File, customName?: string) => {
    const formData = new FormData()
    const fileName = customName || file.name.replace(/\.[^/.]+$/, '')
    formData.append('file', file)
    formData.append('parent', currentFolderId.value ?? 'null')
    formData.append('name', fileName)
    formData.append('ext', file.name.split('.').pop() || '')

    await $fetch('/api/filemanager/files', {
      method: 'POST',
      body: formData
    })
    await loadCurrentFolder()
  }

  const renameFile = async (fileId: string, newName: string) => {
    await $fetch(`/api/filemanager/files/${fileId}`, {
      method: 'PUT',
      body: { name: newName }
    })
    await loadCurrentFolder()
  }

  const deleteFile = async (fileId: string) => {
    await $fetch(`/api/filemanager/files/${fileId}`, { method: 'DELETE' })
    await loadCurrentFolder()
  }

  const getFileUrl = (file: FmFile) => {
    return `/api/filemanager/files/preview/${file.id}`
  }

  const goBack = async () => {
    if (breadcrumbs.value.length > 1) {
      breadcrumbs.value.pop()
      const prev = breadcrumbs.value[breadcrumbs.value.length - 1]
      currentFolderId.value = prev.id
      await loadCurrentFolder()
    }
  }

  onMounted(() => loadCurrentFolder())

  return {
    folders,
    files,
    currentFolderId,
    loading,
    breadcrumbs,
    loadCurrentFolder,
    navigateToFolder,
    createFolder,
    renameFolder,
    deleteFolder,
    checkFolderEmpty,
    checkDuplicateName,
    resetToRoot,
    uploadFile,
    renameFile,
    deleteFile,
    getFileUrl,
    goBack
  }
}
