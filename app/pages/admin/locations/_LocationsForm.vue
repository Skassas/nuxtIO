<template>
  <form id="location-form" @submit.prevent="$emit('submit', form)" class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Mağaza Adı <span
          class="text-red-500">*</span></label>
      <input :value="nameInput.inputValue.value" @input="(e) => { nameInput.handleInput(e); form.location_name = nameInput.inputValue.value }" @keydown="nameInput.handleKeyDown" type="text" required minlength="2" placeholder="Mağaza adını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :class="errors?.location_name ? 'border-red-500' : ''" />
      <p v-if="errors?.location_name" class="mt-1 text-xs text-red-500">{{ errors.location_name }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</label>
      <textarea :value="descInput.inputValue.value" @input="(e) => { descInput.handleInput(e); form.location_description = descInput.inputValue.value }" @keydown="descInput.handleKeyDown" rows="4" placeholder="Açıklama girin (isteğe bağlı)"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
    </div>
  </form>
</template>

<script setup lang="ts">
import { locationSchema } from '~/validations/locations'
import type { LocationInput } from '~/validations/locations'
import { useTurkishInput } from '~/composables/useTurkishInput'
import { useTextareaInput } from '~/composables/useTextareaInput'
import { useAutoFocus } from '~/composables/useAutoFocus'

useAutoFocus()

const props = defineProps<{
  modelValue: LocationInput
  errors?: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LocationInput]
  submit: [form: LocationInput]
}>()

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const nameInput = useTurkishInput(props.modelValue.location_name || '', '')
watch(() => form.value.location_name, (val) => {
  nameInput.inputValue.value = val
})
watch(nameInput.inputValue, (val) => {
  form.value.location_name = val
})

const descInput = useTextareaInput(props.modelValue.location_description || '')
watch(() => form.value.location_description, (val) => {
  descInput.inputValue.value = val
})
watch(descInput.inputValue, (val) => {
  form.value.location_description = val
})
</script>
