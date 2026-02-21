<template>
  <div></div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

const { data } = await useFetch('/api/check-installed')

if (data.value?.installed) {
  await navigateTo('/admin', { replace: true })
} else {
  await navigateTo('/install', { replace: true })
}
</script>
