<template>
  <div class="relative flex items-center justify-center">

    <button ref="buttonRef" @mousedown="startTimer" @mouseup="cancelTimer" @mouseleave="cancelTimer"
      @touchstart.prevent="startTimer" @touchend.prevent="cancelTimer" @touchcancel="cancelTimer"
      class="relative z-10 rounded p-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
      :title="`Silmek için ${deleteDuration / 1000} saniye basılı tutun`">
      <div v-if="isHolding" class="absolute" style="width: 40px; height: 40px; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        <svg class="h-10 w-10 -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="3"
            class="text-gray-200 dark:text-gray-700" />
          <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
            class="text-red-500 transition-all duration-100" :stroke-dasharray="100.53"
            :stroke-dashoffset="100.53 - (progress / deleteDuration) * 100.53" />
        </svg>
      </div>
      <TrashIcon />
    </button>
  </div>
</template>

<script setup lang="ts">
import TrashIcon from '~/assets/svg/TrashIcon.vue'

const config = useRuntimeConfig()

const props = withDefaults(defineProps<{
  duration?: number
  itemId: string
  itemName?: string
  onDelete: (id: string) => Promise<void>
}>(), {
  duration: 0,
  itemName: ''
})

const buttonRef = ref<HTMLElement | null>(null)
const isHolding = ref(false)
const progress = ref(0)

const deleteDuration = computed(() => props.duration || config.public.deleteButtonDuration || 4000)

let timer: ReturnType<typeof setTimeout> | null = null
let interval: ReturnType<typeof setInterval> | null = null

function startTimer() {
  isHolding.value = true
  progress.value = 0

  const startTime = Date.now()
  interval = setInterval(() => {
    progress.value = Date.now() - startTime
  }, 50)

  timer = setTimeout(async () => {
    isHolding.value = false
    progress.value = 0
    clearInterval(interval!)
    interval = null
    timer = null

    try {
      await props.onDelete(props.itemId)
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }, deleteDuration.value)
}

function cancelTimer() {
  isHolding.value = false
  progress.value = 0

  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

onUnmounted(() => {
  cancelTimer()
})
</script>
