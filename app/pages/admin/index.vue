<template>
  <div></div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' })

onMounted(() => {
  navigateTo('/admin/units', { replace: true })
})
</script>
