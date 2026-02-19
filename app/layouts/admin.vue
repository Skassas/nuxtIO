<template>
  <div class="flex h-screen flex-col bg-gray-100 dark:bg-gray-900">
    <AdminTopBar @toggle-sidebar="sidebarOpen = !sidebarOpen" />
    <div class="flex flex-1 overflow-hidden">
      <AdminSidebar :open="sidebarOpen" @close="sidebarOpen = false" />
      <main class="flex-1 overflow-y-auto bg-gray-50 p-6 dark:bg-gray-800">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
</script>
