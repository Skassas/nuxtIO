<template>
  <form id="brand-form" @submit.prevent="$emit('submit', form)" class="space-y-4">
    <FileManagerGallery 
      v-model="form.image" 
      :multiple="false" 
      label="Marka Resmi"
      collection="brands"
    />
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Marka Adı <span
          class="text-red-500">*</span></label>
      <input :value="nameInput.inputValue.value" @input="(e) => { nameInput.handleInput(e); form.name = nameInput.inputValue.value }" @keydown="nameInput.handleKeyDown" type="text" required minlength="2" placeholder="Marka adını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :class="errors?.name ? 'border-red-500' : ''" />
      <p v-if="errors?.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</label>
      <textarea :value="descInput.inputValue.value" @input="(e) => { descInput.handleInput(e); form.description = descInput.inputValue.value }" @keydown="descInput.handleKeyDown" rows="4" placeholder="Açıklama girin (isteğe bağlı)"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
    </div>
  </form>
</template>

<script setup lang="ts">
import { brandSchema } from '~/validations/brands'
import type { BrandInput } from '~/validations/brands'
import FileManagerGallery from '~/components/filemanager/FileManagerGallery.vue'
import { useTurkishInput } from '~/composables/useTurkishInput'
import { useTextareaInput } from '~/composables/useTextareaInput'

const props = defineProps<{
  modelValue: BrandInput
  errors?: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: BrandInput]
  submit: [form: BrandInput]
}>()

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const nameInput = useTurkishInput(props.modelValue.name)
watch(() => form.value.name, (val) => {
  nameInput.inputValue.value = val
})
watch(nameInput.inputValue, (val) => {
  form.value.name = val
})

const descInput = useTextareaInput(props.modelValue.description)
watch(() => form.value.description, (val) => {
  descInput.inputValue.value = val
})
watch(descInput.inputValue, (val) => {
  form.value.description = val
})
</script>
