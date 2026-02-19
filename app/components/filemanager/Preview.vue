<template>
  <Teleport to="body">
    <div v-if="previewFile" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/90"
      @click.self="closePreview" @keydown.escape="closePreview">
      <button @click="closePreview" class="absolute top-4 right-4 p-2 text-white hover:bg-white/20 rounded z-10">
        <FilemanagerSvgX />
      </button>
      
      <button v-if="files.length > 1" @click="prevImage" class="absolute left-4 p-2 text-white hover:bg-white/20 rounded">
        <FilemanagerSvgChevronLeft />
      </button>
      
      <button v-if="files.length > 1" @click="nextImage" class="absolute right-4 p-2 text-white hover:bg-white/20 rounded">
        <FilemanagerSvgChevronRight />
      </button>

      <div class="flex flex-col items-center max-w-[90vw] max-h-[90vh]">
        <img :src="getFileUrl(previewFile)" :alt="previewFile.name" class="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl" />
        <div class="mt-4 text-white text-center">
          <p class="text-lg font-medium">{{ previewFile.name }}.{{ previewFile.ext }}</p>
          <p class="text-sm text-gray-400">{{ currentImageIndex + 1 }} / {{ files.length }}</p>
        </div>
      </div>
      
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        <button v-if="props.selectMode" @click="handleSelectInPreview" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          Seç
        </button>
        <button @click="closePreview" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center gap-2">
          <FilemanagerSvgX class="w-4 h-4" />
          Kapat
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useFileManagerDrawer } from '~/composables/useFileManagerDrawer'

const props = defineProps<{ selectMode?: boolean }>()

const {
  files,
  previewFile,
  currentImageIndex,
  getFileUrl,
  closePreview,
  prevImage,
  nextImage,
  selectFile,
  setSelectCallback,
} = useFileManagerDrawer()

const handleSelectInPreview = () => {
  if (previewFile.value) {
    selectFile(previewFile.value, true)
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (!previewFile.value) return
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'ArrowRight') nextImage()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  setSelectCallback(() => {})
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>
