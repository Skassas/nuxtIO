<template>
  <span class="inline-flex flex-col">
    <svg :class="['h-3 w-3', active && direction === 'asc' ? 'text-blue-600 font-bold' : 'text-gray-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 15l7-7 7 7" />
    </svg>
    <svg :class="['h-3 w-3 -mt-0.5', active && direction === 'desc' ? 'text-blue-600 font-bold' : 'text-gray-400']" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  active: boolean
  direction: 'asc' | 'desc' | null
}>()
</script>
