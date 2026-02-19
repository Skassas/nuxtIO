<template>
  <div>
    <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
    <div class="mt-1 flex items-center gap-2">
      <button type="button" disabled class="flex h-10 w-8 items-center justify-center bg-transparent text-gray-400">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button type="button" @click="openFileManager" class="group relative block h-40 w-40 overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 dark:border-gray-600" style="border-radius: 4px">
        <img v-if="previewImage" :src="previewImage" alt="" class="h-full w-full object-cover" />
        <div v-else class="flex h-full w-full flex-col items-center justify-center text-gray-400 group-hover:text-blue-500">
          <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="mt-2 text-sm">Resim Ekle</span>
        </div>
        <button v-if="previewImage && !multiple" type="button" @click.stop="removeImage"
          class="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
          title="Resmi kaldır">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </button>

      <button v-if="!multiple || (multiple && selectedImages.length > 0)" type="button" disabled class="group relative block h-40 w-40 overflow-hidden border-2 border-dashed border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50" style="border-radius: 4px">
        <div class="flex h-full w-full flex-col items-center justify-center text-gray-300 dark:text-gray-600">
          <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span class="mt-2 text-sm">Resim Ekle</span>
        </div>
        <div class="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600">
          <svg class="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </button>

      <button type="button" disabled class="flex h-10 w-8 items-center justify-center bg-transparent text-gray-400">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    
    <div v-if="multiple && selectedImages.length > 0" class="mt-4 flex flex-wrap gap-2">
      <div v-for="(img, index) in selectedImages" :key="img.id" class="relative group">
        <img :src="getImageUrl(img.id)" alt="" class="h-16 w-16 object-cover border border-gray-300" style="border-radius: 4px" />
        <button type="button" @click="removeImageById(img.id)"
          class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100">
          <svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <FileManagerDrawer v-model="showFileManager" :select-mode="true" :selected-id="multiple ? null : (modelValue as string)" @select="handleFileSelect" />
  </div>
</template>

<script setup lang="ts">
import FileManagerDrawer from './FileManagerDrawer.vue'

interface ImageItem {
  id: string
}

const props = withDefaults(defineProps<{
  modelValue: string | string[] | null
  multiple?: boolean
  label?: string
  collection?: string
}>(), {
  multiple: false,
  label: 'Resim',
  collection: 'fm_files'
})

const emit = defineEmits<{
  'update:modelValue': [value: string | string[] | null]
}>()

const showFileManager = ref(false)
const previewImage = ref('')
const selectedImages = ref<ImageItem[]>([])

function openFileManager() {
  showFileManager.value = true
}

function getImageUrl(imageId: string) {
  return `/api/filemanager/files/${props.collection}/${imageId}`
}

function handleFileSelect(file: any) {
  if (!file) return
  
  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    if (!current.includes(file.id)) {
      current.push(file.id)
      selectedImages.value.push({ id: file.id })
    }
    emit('update:modelValue', current)
  } else {
    const imageId = file.id
    previewImage.value = getImageUrl(imageId)
    emit('update:modelValue', imageId)
  }
  
  setTimeout(() => {
    showFileManager.value = false
  }, 100)
}

function removeImage() {
  previewImage.value = ''
  emit('update:modelValue', null)
}

function removeImageById(id: string) {
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  const idx = current.indexOf(id)
  if (idx > -1) {
    current.splice(idx, 1)
    selectedImages.value = selectedImages.value.filter(img => img.id !== id)
    emit('update:modelValue', current)
  }
}

watch(() => props.modelValue, (newVal) => {
  if (!props.multiple) {
    if (newVal && typeof newVal === 'string') {
      previewImage.value = getImageUrl(newVal)
    } else {
      previewImage.value = ''
    }
  } else {
    if (Array.isArray(newVal)) {
      selectedImages.value = newVal.map(id => ({ id }))
    } else {
      selectedImages.value = []
    }
  }
}, { immediate: true })
</script>
