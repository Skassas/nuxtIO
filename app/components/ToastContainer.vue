<template>
  <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="toastClass(toast.type)"
        class="flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg min-w-[300px] max-w-[420px]"
      >
        <ToastSuccessIcon v-if="toast.type === 'success'" />
        <ToastErrorIcon v-else-if="toast.type === 'error'" />
        <ToastWarningIcon v-else-if="toast.type === 'warning'" />
        <ToastInfoIcon v-else />
        <span class="flex-1 text-sm">{{ toast.message }}</span>
        <button class="ml-2 opacity-60 hover:opacity-100 p-1 rounded hover:bg-white/20 transition-colors" @click="removeToast(toast.id)">
          <ToastCloseIcon />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import ToastSuccessIcon from '~/assets/svg/ToastSuccessIcon.vue'
import ToastErrorIcon from '~/assets/svg/ToastErrorIcon.vue'
import ToastWarningIcon from '~/assets/svg/ToastWarningIcon.vue'
import ToastInfoIcon from '~/assets/svg/ToastInfoIcon.vue'
import ToastCloseIcon from '~/assets/svg/ToastCloseIcon.vue'

const { toasts, removeToast } = useToast()

function toastClass(type: string) {
  switch (type) {
    case 'success':
      return 'bg-green-500 text-white'
    case 'error':
      return 'bg-red-500 text-white'
    case 'warning':
      return 'bg-yellow-500 text-white'
    default:
      return 'bg-blue-500 text-white'
  }
}
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
