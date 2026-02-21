<template>
  <form id="unit-form" @submit.prevent="$emit('submit', form)" class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Birim Adı <span
          class="text-red-500">*</span></label>
      <input :value="unit_nameInput.inputValue.value" @input="(e) => { unit_nameInput.handleInput(e); form.unit_name = unit_nameInput.inputValue.value }" @keydown="unit_nameInput.handleKeyDown" type="text" required minlength="2" placeholder="Birim adını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :class="errors?.unit_name ? 'border-red-500' : ''" />
      <p v-if="errors?.unit_name" class="mt-1 text-xs text-red-500">{{ errors.unit_name }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</label>
      <textarea :value="descInput.inputValue.value" @input="(e) => { descInput.handleInput(e); form.unit_decription = descInput.inputValue.value }" @keydown="descInput.handleKeyDown" rows="4" placeholder="Açıklama girin (isteğe bağlı)"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
    </div>
  </form>
</template>

<script setup lang="ts">
import { unitSchema } from '~/validations/units'
import type { UnitInput } from '~/validations/units'
import { useTurkishInput } from '~/composables/useTurkishInput'
import { useTextareaInput } from '~/composables/useTextareaInput'
import { useAutoFocus } from '~/composables/useAutoFocus'

useAutoFocus()

const props = defineProps<{
  modelValue: UnitInput
  errors?: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: UnitInput]
  submit: [form: UnitInput]
}>()

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const unit_nameInput = useTurkishInput(props.modelValue.unit_name || '', '')
watch(() => form.value.unit_name, (val) => {
  unit_nameInput.inputValue.value = val
})
watch(unit_nameInput.inputValue, (val) => {
  form.value.unit_name = val
})

const descInput = useTextareaInput(props.modelValue.unit_decription)
watch(() => form.value.unit_decription, (val) => {
  descInput.inputValue.value = val
})
watch(descInput.inputValue, (val) => {
  form.value.unit_decription = val
})
</script>
