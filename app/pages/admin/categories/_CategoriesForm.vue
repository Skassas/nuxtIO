<template>
  <form id="category-form" @submit.prevent="$emit('submit', form)" class="space-y-4">
    <FileManagerGallery 
      v-model="form.image" 
      :multiple="false" 
      label="Kategori Resmi"
      collection="categories"
    />
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Üst Kategori <span class="text-red-500">*</span></label>
      <select v-model="form.parent" :disabled="loading" required
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white font-mono disabled:opacity-50 disabled:cursor-not-allowed"
        :class="errors?.parent ? 'border-red-500' : ''">
        <option v-if="loading" value="">Kategoriler yükleniyor...</option>
        <option v-else value="">Bir Kategori Seçin</option>
        <option v-for="cat in hierarchicalOptions" :key="cat.id" :value="cat.id">
          {{ cat.indentation }}{{ cat.name }}
        </option>
      </select>
      <p v-if="errors?.parent" class="mt-1 text-xs text-red-500">{{ errors.parent }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Kategori Adı <span class="text-red-500">*</span></label>
      <input v-model="form.name" type="text" required minlength="2" placeholder="Kategori adını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :class="errors?.name ? 'border-red-500' : ''" />
      <p v-if="errors?.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</label>
      <textarea v-model="form.description" rows="4" placeholder="Açıklama girin (isteğe bağlı)"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
    </div>
    <div class="flex items-center gap-2">
      <input v-model="form.status" type="checkbox" id="status"
        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
      <label for="status" class="text-sm font-medium text-gray-700 dark:text-gray-300">Aktif</label>
    </div>
  </form>
</template>

<script setup lang="ts">
import type { CategoryInput } from '~/validations/categories'
import FileManagerGallery from '~/components/filemanager/FileManagerGallery.vue'

interface CategoryOption {
  id: string
  name: string
  level: number
  isLast: boolean
  parentIds: string[]
}

const props = defineProps<{
  modelValue: CategoryInput
  errors?: Record<string, string>
  availableCategories: CategoryOption[]
  loading?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CategoryInput]
  submit: [form: CategoryInput]
}>()

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Generate tree indentation for options (with only branch/corner symbols, no vertical lines)
const hierarchicalOptions = computed(() => {
  return props.availableCategories.map(cat => ({
    ...cat,
    indentation: getIndentationString(cat)
  }))
})

function getIndentationString(item: CategoryOption): string {
  if (item.level === 0) return ''
  
  // Level 1: 2 nbsp + L, Level 2: 6 nbsp + L, Level 3: 10 nbsp + L...
  // Her level için 4 nbsp artış
  const spaceCount = 2 + (item.level - 1) * 4
  const spaces = '\u00A0'.repeat(spaceCount)
  return spaces + '└─\u00A0'
}
</script>
