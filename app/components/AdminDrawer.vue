<template>
  <Teleport to="body">
    <Transition name="drawer">
      <div v-if="isOpen" class="fixed inset-0 z-[60]">
        <div class="absolute inset-0 bg-black/50" @click.self></div>
        <div class="absolute right-0 top-0 h-screen w-full max-w-[24rem] flex flex-col bg-white shadow-xl dark:bg-gray-800">
          <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-700">
            <h2 class="text-lg font-semibold text-gray-800 dark:text-white">{{ title }}</h2>
            <button @click="$emit('close')"
              class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-6">
            <slot />
          </div>
          <div v-if="$slots.footer" class="border-t border-gray-200 px-6 py-3 dark:border-gray-700">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isOpen: boolean
  title: string
}>()

defineEmits<{
  close: []
}>()
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.3s ease;
}

.drawer-enter-active>div:last-child,
.drawer-leave-active>div:last-child {
  transition: transform 0.3s ease;
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-from>div:last-child {
  transform: translateX(100%);
}

.drawer-leave-to>div:last-child {
  transform: translateX(100%);
}
</style>
