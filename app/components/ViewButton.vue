<template>
  <button class="rounded p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700" @click="$emit('click')"
    title="Görüntüle">
    <EyeIcon />
  </button>
</template>

<script setup lang="ts">
import EyeIcon from '~/assets/svg/EyeIcon.vue'

defineEmits<{
  click: []
}>()
</script>
