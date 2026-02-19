<template>
  <Teleport to="body">
    <!-- Yeni Klasör Modal -->
    <div v-if="showNewFolderModal" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Yeni Klasör</h3>
        <input v-model="newFolderName" type="text" placeholder="Klasör adı"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="createNewFolder" />
        <div class="flex justify-end gap-2 mt-4">
          <button @click="showNewFolderModal = false" class="px-4 py-2 text-sm border rounded hover:bg-gray-100">İptal</button>
          <button @click="createNewFolder" :disabled="isCreatingFolder" class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">Oluştur</button>
        </div>
      </div>
    </div>

    <!-- Klasör İsmini Değiştir Modal -->
    <div v-if="renameFolderModal" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Klasör İsmini Değiştir</h3>
        <input ref="renameFolderInput" v-model="renameValue" type="text"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="confirmRenameFolder" />
        <div class="flex justify-end gap-2 mt-4">
          <button @click="renameFolderModal = false" class="px-4 py-2 text-sm border rounded hover:bg-gray-100">İptal</button>
          <button @click="confirmRenameFolder" :disabled="isRenamingFolder" class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">Kaydet</button>
        </div>
      </div>
    </div>

    <!-- Dosya İsmini Değiştir Modal -->
    <div v-if="renameFileModal" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Dosya İsmini Değiştir</h3>
        <input ref="renameFileInput" v-model="renameValue" type="text"
          class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="confirmRenameFile" />
        <div class="flex justify-end gap-2 mt-4">
          <button @click="renameFileModal = false" class="px-4 py-2 text-sm border rounded hover:bg-gray-100">İptal</button>
          <button @click="confirmRenameFile" :disabled="isRenamingFile" class="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">Kaydet</button>
        </div>
      </div>
    </div>

    <!-- Klasör Sil Modal -->
    <div v-if="deleteFolderModal" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Klasör Sil</h3>
        <p v-if="folderDeleteError" class="text-red-600 mb-4">{{ folderDeleteError }}</p>
        <p v-else class="text-gray-600">"{{ folderToDelete?.name }}" klasörünü silmek istediğinizden emin misiniz?</p>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="deleteFolderModal = false; folderDeleteError = ''" class="px-4 py-2 text-sm border rounded hover:bg-gray-100">İptal</button>
          <button v-if="!folderDeleteError" @click="confirmDeleteFolder" class="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">Sil</button>
        </div>
      </div>
    </div>

    <!-- Dosya Sil Modal -->
    <div v-if="deleteFileModal" class="fixed inset-0 z-[80] flex items-center justify-center bg-black/50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 class="text-lg font-semibold mb-4">Dosya Sil</h3>
        <p class="text-gray-600 break-all">"{{ fileToDelete?.name }}.{{ fileToDelete?.ext }}" dosyasını silmek istediğinizden emin misiniz?</p>
        <div class="flex justify-end gap-2 mt-4">
          <button @click="deleteFileModal = false" class="px-4 py-2 text-sm border rounded hover:bg-gray-100">İptal</button>
          <button @click="confirmDeleteFileAction" class="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700">Sil</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useFileManagerDrawer } from '~/composables/useFileManagerDrawer'

const {
  showNewFolderModal,
  newFolderName,
  isCreatingFolder,
  renameFolderModal,
  renameValue,
  isRenamingFolder,
  renameFolderInput,
  renameFileModal,
  isRenamingFile,
  renameFileInput,
  deleteFolderModal,
  folderToDelete,
  folderDeleteError,
  deleteFileModal,
  fileToDelete,
  createNewFolder,
  confirmRenameFolder,
  confirmRenameFile,
  confirmDeleteFolder,
  confirmDeleteFileAction,
  setSelectCallback,
} = useFileManagerDrawer()

onMounted(() => {
  setSelectCallback(() => {})
})

watch(renameFolderModal, val => {
  if (val) nextTick(() => renameFolderInput.value?.select())
})

watch(renameFileModal, val => {
  if (val) nextTick(() => renameFileInput.value?.select())
})
</script>
