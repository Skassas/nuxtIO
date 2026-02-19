<template>
  <div class="flex items-center justify-center py-20">
    <div class="text-center">
      <CategoryIcon class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600" />
      <h2 class="mt-4 text-xl font-semibold text-gray-700 dark:text-gray-300">Kategoriler</h2>
      <p class="mt-2 text-gray-500 dark:text-gray-400">Bu sayfa yakın zamanda eklenecektir.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoryIcon from '~/assets/svg/CategoryIcon.vue'

definePageMeta({ layout: 'admin' })
</script>
