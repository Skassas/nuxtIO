<template>
  <form id="unit-form" @submit.prevent="$emit('submit', form)" class="space-y-4">
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Birim Adı <span
          class="text-red-500">*</span></label>
      <input v-model="form.name" type="text" required minlength="2" placeholder="Birim adını girin"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        :class="errors?.name ? 'border-red-500' : ''" />
      <p v-if="errors?.name" class="mt-1 text-xs text-red-500">{{ errors.name }}</p>
    </div>
    <div>
      <label class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Açıklama</label>
      <textarea v-model="form.description" rows="4" placeholder="Açıklama girin (isteğe bağlı)"
        class="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"></textarea>
    </div>
  </form>
</template>

<script setup lang="ts">
import { unitSchema } from '~/validations/units'
import type { UnitInput } from '~/validations/units'

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
</script>
