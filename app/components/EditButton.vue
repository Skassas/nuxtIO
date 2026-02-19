<template>
  <button class="rounded p-2 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-gray-700" @click="$emit('click')"
    title="Değiştir">
    <PencilIcon />
  </button>
</template>

<script setup lang="ts">
import PencilIcon from '~/assets/svg/PencilIcon.vue'

defineEmits<{
  click: []
}>()
</script>
