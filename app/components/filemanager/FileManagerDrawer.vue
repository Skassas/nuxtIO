<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-[70]">
      <div class="absolute inset-0 bg-black/50" @click.self="close"></div>
      <div class="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b">
          <div class="flex items-center gap-2">
            <FilemanagerSvgFolder class="w-6 h-6 text-orange-500" />
            <h2 class="text-lg font-semibold">Dosya Yöneticisi</h2>
          </div>
          <button @click="close" class="p-1 hover:bg-gray-100 rounded">
            <FilemanagerSvgClose />
          </button>
        </div>

        <!-- Breadcrumb -->
        <div class="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b text-sm">
          <button @click="goBack" class="p-1 rounded" :class="breadcrumbs.length > 1 ? 'hover:bg-gray-200' : 'opacity-40 cursor-not-allowed'">
            <FilemanagerSvgArrowLeft />
          </button>
          <button @click="navigateToFolder(null, 'Ana Klasör')" class="flex items-center gap-0.5 px-2 py-1 hover:bg-gray-200 rounded" title="Ana Klasör">
            <FilemanagerSvgHome />
            <span>Ana Klasör</span>
          </button>
          <div class="flex items-center gap-0.5 flex-1 min-w-0">
            <template v-for="(crumb, idx) in breadcrumbs" :key="crumb.id">
              <span v-if="idx > 0 && crumb.name !== 'Ana Klasör'" class="text-gray-400 flex-shrink-0">/</span>
              <button v-if="crumb.name !== 'Ana Klasör'" @click="navigateToFolder(crumb.id, crumb.name)" class="hover:text-blue-600 truncate max-w-[150px]"
                :class="{ 'font-semibold text-blue-600': idx === breadcrumbs.length - 1 }" :title="crumb.name">{{ crumb.name }}</button>
            </template>
          </div>
        </div>

        <!-- File/Folder List -->
        <div class="flex-1 overflow-auto p-4">
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="flex flex-wrap gap-2">
            <!-- Folders -->
            <div v-for="folder in folders" :key="folder.id" class="relative">
              <div class="flex items-center p-2 rounded cursor-pointer group gap-0.5 w-28"
                :class="activeItem?.id === folder.id ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'"
                @click.stop="setActiveItem(folder, 'folder')" @dblclick.stop="navigateToFolder(folder.id, folder.name)" @contextmenu.prevent>
                <div class="flex flex-col items-center min-w-0">
                  <FilemanagerSvgFolder class="w-[4.5rem] h-[4.5rem] flex-shrink-0" />
                  <span class="text-xs text-center truncate w-full mt-1">{{ folder.name }}</span>
                </div>
                <div class="flex flex-col gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button @click.stop="navigateToFolder(folder.id, folder.name)" class="p-1 hover:bg-gray-200 rounded" title="Aç">
                    <FilemanagerSvgEye class="text-green-500 w-4 h-4" />
                  </button>
                  <button @click.stop="startRenameFolder(folder)" class="p-1 hover:bg-gray-200 rounded" title="İsmini Değiştir">
                    <FilemanagerSvgPencil class="text-blue-500 w-4 h-4" />
                  </button>
                  <button @click.stop="initDeleteFolder(folder)" class="p-1 hover:bg-gray-200 rounded text-red-500" title="Sil">
                    <FilemanagerSvgTrash class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Files -->
            <div v-for="file in files" :key="file.id" class="relative">
              <div class="flex items-center p-2 rounded cursor-pointer group gap-0.5 w-28"
                :class="activeItem?.id === file.id ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'"
                @click="handleFileClick(file)" @dblclick.stop="openPreview(file)" @contextmenu.prevent>
                <div class="flex flex-col items-center min-w-0 relative">
                  <img :src="getFileUrl(file)" :alt="file.name" class="w-[4.5rem] h-[4.5rem] object-cover rounded flex-shrink-0" @error="handleImageError($event)" />
                  <span class="text-xs text-center truncate w-full mt-1">{{ file.name }}.{{ file.ext }}</span>
                </div>
                <div class="flex flex-col gap-0.5 ml-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button @click.stop="selectFile(file, true)" class="p-1 hover:bg-gray-200 rounded" title="Ekle">
                    <FilemanagerSvgCheck class="text-green-500 w-4 h-4" />
                  </button>
                  <button @click.stop="startRenameFile(file)" class="p-1 hover:bg-gray-200 rounded" title="İsmini Değiştir">
                    <FilemanagerSvgPencil class="text-blue-500 w-4 h-4" />
                  </button>
                  <button @click.stop="confirmDeleteFile(file)" class="p-1 hover:bg-gray-200 rounded text-red-500" title="Sil">
                    <FilemanagerSvgTrash class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div v-if="folders.length === 0 && files.length === 0" class="w-full text-center text-gray-500 py-8">Bu klasör boş</div>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
          <div class="flex items-center gap-2">
            <button @click="showNewFolderModal = true" :disabled="isCreatingFolder" class="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-0.5 disabled:opacity-50">
              <FilemanagerSvgPlus />
              Yeni Klasör
            </button>
            <label :class="['px-3 py-1.5 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-0.5 cursor-pointer', { 'opacity-50 cursor-not-allowed': isUploading }]">
              <FilemanagerSvgUpload />
              Resim Yükle
              <input type="file" accept="image/*" class="hidden" :disabled="isUploading" @change="handleFileUpload" />
            </label>
          </div>
          <div class="flex items-center gap-2">
            <button @click="close" class="px-4 py-2 text-sm border rounded hover:bg-gray-100">Kapat</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Child Components -->
    <FilemanagerPreview :select-mode="selectMode" />
    <FilemanagerModals />
  </Teleport>
</template>

<script setup lang="ts">
import type { FmFile } from '~/composables/useFileManager'
import { useFileManagerDrawer } from '~/composables/useFileManagerDrawer'

const props = defineProps<{ modelValue: boolean; selectMode?: boolean; selectedId?: string | null }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; 'select': [file: FmFile | null] }>()

const {
  folders,
  files,
  loading,
  breadcrumbs,
  navigateToFolder,
  goBack,
  resetToRoot,
  loadCurrentFolder,
  getFileUrl,
  showNewFolderModal,
  isCreatingFolder,
  isUploading,
  activeItem,
  selectedFileId,
  selectedFile,
  handleFileUpload,
  handleImageError,
  openPreview,
  selectFile,
  setActiveItem,
  startRenameFolder,
  startRenameFile,
  confirmDeleteFile,
  initDeleteFolder,
  setSelectCallback,
  setCloseDrawerCallback,
} = useFileManagerDrawer()

const handleFileClick = (file: FmFile) => {
  if (activeItem.value?.id === file.id) {
    openPreview(file)
    activeItem.value = null
  } else {
    setActiveItem(file, 'file')
  }
}

const close = () => {
  const currentSelectedId = props.selectedId || selectedFileId.value
  if (currentSelectedId && !files.value.find(f => f.id === currentSelectedId)) {
    emit('select', null)
    selectedFileId.value = null
    selectedFile.value = null
  }
  emit('update:modelValue', false)
}

watch(() => props.modelValue, val => { 
  if (val) { 
    selectedFileId.value = null
    selectedFile.value = null
    resetToRoot()
    loadCurrentFolder() 
  } 
})

onMounted(() => { 
  document.addEventListener('click', () => activeItem.value = null)
  setSelectCallback((file: FmFile) => {
    emit('select', file)
  })
  setCloseDrawerCallback(() => {
    close()
  })
})
</script>
