<template>
  <form id="tax-form" @submit.prevent="$emit('submit', form)" class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Vergi Adı <span
          class="text-red-500">*</span></label>
      <input :value="nameInput.inputValue.value" @input="(e) => { nameInput.handleInput(e); form.name = nameInput.inputValue.value }" @keydown="nameInput.handleKeyDown" type="text" required minlength="2" placeholder="Vergi adını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :class="errors?.name ? 'border-red-500' : ''" />
      <p v-if="errors?.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Vergi Oranı <span
          class="text-red-500">*</span></label>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">%</span>
        <input :value="ratioInput.inputValue.value" @input="(e) => { ratioInput.handleInput(e); form.ratio = ratioInput.inputValue.value }" @keydown="ratioInput.handleKeyDown" type="text" required maxlength="4" placeholder="0"
          class="w-full rounded-lg border border-gray-300 pl-8 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.ratio ? 'border-red-500' : ''" />
      </div>
      <p v-if="errors?.ratio" class="mt-1 text-xs text-red-500">{{ errors.ratio }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</label>
      <textarea :value="descInput.inputValue.value" @input="(e) => { descInput.handleInput(e); form.description = descInput.inputValue.value }" @keydown="descInput.handleKeyDown" rows="4" placeholder="Açıklama girin (isteğe bağlı)"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
    </div>
  </form>
</template>

<script setup lang="ts">
import { taxSchema } from '~/validations/taxes'
import type { TaxInput } from '~/validations/taxes'
import { useTurkishInput } from '~/composables/useTurkishInput'
import { useTextareaInput } from '~/composables/useTextareaInput'
import { useNumericInput } from '~/composables/useNumericInput'
import { useAutoFocus } from '~/composables/useAutoFocus'

useAutoFocus()

const props = defineProps<{
  modelValue: TaxInput
  errors?: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: TaxInput]
  submit: [form: TaxInput]
}>()

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const nameInput = useTurkishInput(props.modelValue.name || '', '%')
watch(() => form.value.name, (val) => {
  nameInput.inputValue.value = val
})
watch(nameInput.inputValue, (val) => {
  form.value.name = val
})

const ratioInput = useNumericInput(props.modelValue.ratio || '')
watch(() => form.value.ratio, (val) => {
  ratioInput.inputValue.value = val
})
watch(ratioInput.inputValue, (val) => {
  form.value.ratio = val
})

const descInput = useTextareaInput(props.modelValue.description || '')
watch(() => form.value.description, (val) => {
  descInput.inputValue.value = val
})
watch(descInput.inputValue, (val) => {
  form.value.description = val
})
</script>
