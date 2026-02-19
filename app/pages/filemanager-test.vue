<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">File Manager Test</h1>
    <button @click="show = true" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">File Manager Aç</button>
    <div v-if="selectedFile" class="mt-4 p-4 border rounded">
      <h2 class="font-semibold mb-2">Seçilen Dosya:</h2>
      <p>ID: {{ selectedFile.id }}</p>
      <p>Ad: {{ selectedFile.name }}.{{ selectedFile.ext }}</p>
      <img :src="getFileUrl(selectedFile)" :alt="selectedFile.name" class="mt-2 w-32 h-32 object-cover" />
    </div>
    <FileManagerDrawer v-model="show" select-mode @select="handleSelect" />
  </div>
</template>

<script setup lang="ts">
import FileManagerDrawer from '~/components/filemanager/FileManagerDrawer.vue'
import type { FmFile } from '~/composables/useFileManager'

const show = ref(false)
const selectedFile = ref<FmFile | null>(null)
const { getFileUrl } = useFileManager()

const handleSelect = (file: FmFile) => { selectedFile.value = file }
</script>
