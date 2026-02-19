import type { FmFile, FmFolder } from './useFileManager'

const { addToast } = useToast()

const showNewFolderModal = ref(false)
const newFolderName = ref('')
const isCreatingFolder = ref(false)
const isUploading = ref(false)
const isRenamingFolder = ref(false)
const isRenamingFile = ref(false)
const previewFile = ref<FmFile | null>(null)
const renameFolderModal = ref(false)
const folderToRename = ref<FmFolder | null>(null)
const renameFileModal = ref(false)
const fileToRename = ref<FmFile | null>(null)
const deleteFolderModal = ref(false)
const folderToDelete = ref<FmFolder | null>(null)
const folderDeleteError = ref('')
const deleteFileModal = ref(false)
const fileToDelete = ref<FmFile | null>(null)
const renameValue = ref('')
const renameFolderInput = ref<HTMLInputElement | null>(null)
const renameFileInput = ref<HTMLInputElement | null>(null)
const activeItem = ref<{ id: string; type: 'folder' | 'file' } | null>(null)
const currentImageIndex = ref(0)
const selectedFileId = ref<string | null>(null)
const selectedFile = ref<FmFile | null>(null)

let selectCallback: ((file: FmFile) => void) | null = null
let closeDrawerCallback: (() => void) | null = null

export const useFileManagerDrawer = () => {
  const {
    folders,
    files,
    loading,
    breadcrumbs,
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
    goBack,
    loadCurrentFolder,
  } = useFileManager()

  const closePreview = () => { previewFile.value = null; currentImageIndex.value = 0 }

  const createNewFolder = async () => {
    if (isCreatingFolder.value || !newFolderName.value.trim()) return
    isCreatingFolder.value = true
  
    const cleanName = newFolderName.value.trim().replace(/[^a-zA-Z0-9_ğüşöçİĞÜŞÖÇ ]/g, '')
    if (!cleanName) {
      addToast('Klasör adı geçersiz', 'error')
      isCreatingFolder.value = false
      return
    }
    if (checkDuplicateName(cleanName, 'folder')) {
      addToast('Bu isimde bir klasör zaten mevcut', 'error')
      isCreatingFolder.value = false
      return
    }
    try {
      await createFolder(cleanName)
      addToast('Klasör oluşturuldu', 'success')
    } catch (e: any) {
      addToast('Klasör oluşturulurken hata oluştu', 'error')
    }
    newFolderName.value = ''
    showNewFolderModal.value = false
    isCreatingFolder.value = false
  }

  const handleFileUpload = async (e: Event) => {
    const target = e.target as HTMLInputElement
    if (isUploading.value || !target.files?.[0]) return
    isUploading.value = true
  
    const rawFileName = target.files[0].name.replace(/\.[^/.]+$/, '')
    const cleanFileName = rawFileName.trim().replace(/[^a-zA-Z0-9_ğüşöçİĞÜŞÖÇ ]/g, '')
    if (!cleanFileName) {
      addToast('Dosya adı geçersiz', 'error')
      target.value = ''
      isUploading.value = false
      return
    }
    if (checkDuplicateName(cleanFileName, 'file')) {
      addToast('Bu isimde bir dosya zaten mevcut', 'error')
      target.value = ''
      isUploading.value = false
      return
    }
    try {
      await uploadFile(target.files[0], cleanFileName)
      addToast('Dosya yüklendi', 'success')
    } catch (e: any) {
      addToast('Dosya yüklenirken hata oluştu', 'error')
    }
    target.value = ''
    isUploading.value = false
  }

  const handleImageError = (e: Event) => {
    const img = e.target as HTMLImageElement
    img.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjZTllOWU5IiBzdHJva2U9IiM5Y2EzYWYiIHN0cm9rZS13aWR0aD0iMSI+PHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiPjwvcmVjdD48cGF0aCBkPSJNMTIgMmwyIDNhNCA0IDAgMCAxIDQgNGgtOGMtMS4xIDAtMiAuOS0yIDJyLjktMiAyLTJ6bTAgMTZhNCA0IDAgMSAxIDQtNGgtOHYtM2g4YTIgMiAwIDAgMiAydjJ6bTAgN2gtOHYzSDl2LTJoOHYyeiIvPjwvc3ZnPg=='
  }

  const prevImage = () => {
    if (currentImageIndex.value > 0) {
      currentImageIndex.value--
      previewFile.value = files.value[currentImageIndex.value]
    }
  }

  const nextImage = () => {
    if (currentImageIndex.value < files.value.length - 1) {
      currentImageIndex.value++
      previewFile.value = files.value[currentImageIndex.value]
    }
  }

  const openPreview = (file: FmFile) => { 
    currentImageIndex.value = Array.isArray(files.value) ? files.value.findIndex(f => f.id === file.id) : 0
    previewFile.value = file 
  }

  const selectFile = (file: FmFile, shouldCloseDrawer = false) => { 
    selectedFileId.value = file.id
    selectedFile.value = file
    closePreview()
    if (selectCallback) {
      selectCallback(file)
    }
    if (shouldCloseDrawer && closeDrawerCallback) {
      closeDrawerCallback()
    }
  }

  const setActiveItem = (item: FmFolder | FmFile, type: 'folder' | 'file') => {
    if (activeItem.value?.id === item.id && activeItem.value?.type === type) {
      activeItem.value = null
    } else {
      activeItem.value = { id: item.id, type }
    }
  }

  const startRenameFolder = (folder: FmFolder) => { folderToRename.value = folder; renameValue.value = folder.name; renameFolderModal.value = true; activeItem.value = null }
  const confirmRenameFolder = async () => { 
    if (isRenamingFolder.value || !folderToRename.value || !renameValue.value.trim()) return
    isRenamingFolder.value = true
  
    const cleanName = renameValue.value.trim().replace(/[^a-zA-Z0-9_ğüşöçİĞÜŞÖÇ ]/g, '')
    if (!cleanName) {
      addToast('Klasör adı geçersiz', 'error')
      isRenamingFolder.value = false
      return
    }
    if (checkDuplicateName(cleanName, 'folder')) {
      addToast('Bu isimde bir klasör zaten mevcut', 'error')
      isRenamingFolder.value = false
      return
    }
    try {
      await renameFolder(folderToRename.value.id, cleanName)
      addToast('Klasör adı değiştirildi', 'success')
    } catch (e: any) {
      addToast('Klasör adı değiştirilirken hata oluştu', 'error')
    }
    renameFolderModal.value = false
    folderToRename.value = null
    renameValue.value = ''
    isRenamingFolder.value = false
  }

  const startRenameFile = (file: FmFile) => { fileToRename.value = file; renameValue.value = file.name; renameFileModal.value = true; previewFile.value = null; activeItem.value = null }
  const confirmRenameFile = async () => { 
    if (isRenamingFile.value || !fileToRename.value || !renameValue.value.trim()) return
    isRenamingFile.value = true
  
    const cleanName = renameValue.value.trim().replace(/[^a-zA-Z0-9_ğüşöçİĞÜŞÖÇ ]/g, '')
    if (!cleanName) {
      addToast('Dosya adı geçersiz', 'error')
      isRenamingFile.value = false
      return
    }
    if (checkDuplicateName(cleanName, 'file')) {
      addToast('Bu isimde bir dosya zaten mevcut', 'error')
      isRenamingFile.value = false
      return
    }
    try {
      await renameFile(fileToRename.value.id, cleanName)
      addToast('Dosya adı değiştirildi', 'success')
    } catch (e: any) {
      addToast('Dosya adı değiştirilirken hata oluştu', 'error')
    }
    renameFileModal.value = false
    fileToRename.value = null
    renameValue.value = ''
    previewFile.value = null
    isRenamingFile.value = false
  }

  const initDeleteFolder = async (folder: FmFolder) => {
    folderToDelete.value = folder
    folderDeleteError.value = ''
    const isEmpty = await checkFolderEmpty(folder.id)
    if (!isEmpty) {
      folderDeleteError.value = 'Bu klasör dolu olduğu için silinemez. Önce içindeki dosyaları ve klasörleri taşıyın veya silin.'
    }
    deleteFolderModal.value = true
    activeItem.value = null
  }
  const confirmDeleteFolder = async () => { 
    if (folderToDelete.value && !folderDeleteError.value) { 
      try {
        await deleteFolder(folderToDelete.value.id)
        addToast('Klasör silindi', 'success')
        await loadCurrentFolder()
      } catch (e: any) {
        addToast('Klasör silinirken hata oluştu', 'error')
      }
      deleteFolderModal.value = false
      folderToDelete.value = null 
      folderDeleteError.value = ''
    } 
  }

  const confirmDeleteFile = (file: FmFile) => { fileToDelete.value = file; deleteFileModal.value = true; previewFile.value = null; activeItem.value = null }
  const confirmDeleteFileAction = async () => { 
    if (fileToDelete.value) { 
      try {
        await deleteFile(fileToDelete.value.id)
        addToast('Dosya silindi', 'success')
        await loadCurrentFolder()
        if (selectedFileId.value === fileToDelete.value.id) {
          selectedFileId.value = null
          selectedFile.value = null
        }
      } catch (e: any) {
        addToast('Dosya silinirken hata oluştu', 'error')
      }
      deleteFileModal.value = false
      fileToDelete.value = null 
    } 
  }

  const setSelectCallback = (callback: (file: FmFile) => void) => {
    selectCallback = callback
  }

  const setCloseDrawerCallback = (callback: () => void) => {
    closeDrawerCallback = callback
  }

  const reset = () => {
    selectedFileId.value = null
    selectedFile.value = null
    previewFile.value = null
    currentImageIndex.value = 0
  }

  return {
    folders,
    files,
    loading,
    breadcrumbs,
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
    goBack,
    loadCurrentFolder,
    showNewFolderModal,
    newFolderName,
    isCreatingFolder,
    isUploading,
    isRenamingFolder,
    isRenamingFile,
    previewFile,
    renameFolderModal,
    folderToRename,
    renameFileModal,
    fileToRename,
    deleteFolderModal,
    folderToDelete,
    folderDeleteError,
    deleteFileModal,
    fileToDelete,
    renameValue,
    renameFolderInput,
    renameFileInput,
    activeItem,
    currentImageIndex,
    selectedFileId,
    selectedFile,
    closePreview,
    createNewFolder,
    handleFileUpload,
    handleImageError,
    prevImage,
    nextImage,
    openPreview,
    selectFile,
    setActiveItem,
    startRenameFolder,
    confirmRenameFolder,
    startRenameFile,
    confirmRenameFile,
    initDeleteFolder,
    confirmDeleteFolder,
    confirmDeleteFile,
    confirmDeleteFileAction,
    setSelectCallback,
    setCloseDrawerCallback,
    reset,
  }
}
