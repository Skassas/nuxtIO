<template>
  <div class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        PocketBase URL <span class="text-red-500">*</span>
      </label>
      <input 
        v-model="formData.pocketbaseUrl"
        type="text" 
        required
        placeholder="http://127.0.0.1:8090"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
      <p class="mt-1 text-xs text-gray-500">
        PocketBase sunucu adresi. Örn: http://127.0.0.1:8090
      </p>
    </div>

    <div class="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
      <p class="text-sm text-yellow-800 dark:text-yellow-200">
        <strong>Not:</strong> PocketBase çalışıyor olmalıdır. İlk kurulumdan sonra bu adres değiştirilemez.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormData {
  pocketbaseUrl: string
}

const props = defineProps<{
  formData: FormData
}>()
</script>
