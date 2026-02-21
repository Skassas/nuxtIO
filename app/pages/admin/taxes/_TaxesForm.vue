<template>
  <form id="tax-form" @submit.prevent="$emit('submit', form)" class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Vergi Adı <span
          class="text-red-500">*</span></label>
      <input :value="tax_nameInput.inputValue.value" @input="(e) => { tax_nameInput.handleInput(e); form.tax_name = tax_nameInput.inputValue.value }" @keydown="tax_nameInput.handleKeyDown" type="text" required minlength="2" placeholder="Vergi adını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :class="errors?.tax_name ? 'border-red-500' : ''" />
      <p v-if="errors?.tax_name" class="mt-1 text-xs text-red-500">{{ errors.tax_name }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Vergi Oranı <span
          class="text-red-500">*</span></label>
      <div class="relative">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">%</span>
        <input :value="tax_ratioInput.inputValue.value" @input="(e) => { tax_ratioInput.handleInput(e); form.tax_ratio = tax_ratioInput.inputValue.value }" @keydown="tax_ratioInput.handleKeyDown" type="text" required maxlength="4" placeholder="0"
          class="w-full rounded-lg border border-gray-300 pl-8 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          :class="errors?.tax_ratio ? 'border-red-500' : ''" />
      </div>
      <p v-if="errors?.tax_ratio" class="mt-1 text-xs text-red-500">{{ errors.tax_ratio }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</label>
      <textarea :value="descInput.inputValue.value" @input="(e) => { descInput.handleInput(e); form.tax_description = descInput.inputValue.value }" @keydown="descInput.handleKeyDown" rows="4" placeholder="Açıklama girin (isteğe bağlı)"
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

const tax_nameInput = useTurkishInput(props.modelValue.tax_name || '', '%')
watch(() => form.value.tax_name, (val) => {
  tax_nameInput.inputValue.value = val
})
watch(tax_nameInput.inputValue, (val) => {
  form.value.tax_name = val
})

const tax_ratioInput = useNumericInput(props.modelValue.tax_ratio || '')
watch(() => form.value.tax_ratio, (val) => {
  tax_ratioInput.inputValue.value = val
})
watch(tax_ratioInput.inputValue, (val) => {
  form.value.tax_ratio = val
})

const descInput = useTextareaInput(props.modelValue.tax_description || '')
watch(() => form.value.tax_description, (val) => {
  descInput.inputValue.value = val
})
watch(descInput.inputValue, (val) => {
  form.value.tax_description = val
})
</script>
