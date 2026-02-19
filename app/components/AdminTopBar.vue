<template>
  <header
    class="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-700 dark:bg-gray-900">
    <div class="flex items-center gap-3">
      <button @click="$emit('toggleSidebar')"
        class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden">
        <MenuIcon class="h-5 w-5" />
      </button>
      <span class="text-lg font-bold text-gray-800 dark:text-white">NuxtIO</span>
    </div>

    <div class="flex items-center gap-3">
      <button @click="toggleTheme"
        class="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
        <SunIcon v-if="isDark" class="h-5 w-5" />
        <MoonIcon v-else class="h-5 w-5" />
      </button>

      <div class="relative" ref="dropdownRef">
        <button @click="dropdownOpen = !dropdownOpen"
          class="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
            {{ userInitial }}
          </div>
          <span class="hidden text-sm font-medium text-gray-700 dark:text-gray-200 sm:inline">
            {{ user?.name || 'Kullanıcı' }}

          </span>
          <ChevronDownIcon class="h-4 w-4 text-gray-500" />
        </button>

        <div v-if="dropdownOpen"
          class="absolute right-0 mt-1 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800">
          <button @click="handleProfile"
            class="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">
            <UserIcon class="h-4 w-4" />
            Bilgilerimi Güncelle
          </button>
          <button @click="handleLogout"
            class="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700">
            <LogoutIcon class="h-4 w-4" />
            Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import MenuIcon from '~/assets/svg/MenuIcon.vue'
import SunIcon from '~/assets/svg/SunIcon.vue'
import MoonIcon from '~/assets/svg/MoonIcon.vue'
import ChevronDownIcon from '~/assets/svg/ChevronDownIcon.vue'
import UserIcon from '~/assets/svg/UserIcon.vue'
import LogoutIcon from '~/assets/svg/LogoutIcon.vue'

defineEmits<{ toggleSidebar: [] }>()

const { user, logout } = useAuth()

const isDark = ref(false)
const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const userInitial = computed(() => {
  const name = user.value?.name || ''
  return name.charAt(0).toUpperCase() || 'K'
})

function toggleTheme() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

function handleProfile() {
  dropdownOpen.value = false
  const { addToast } = useToast()
  addToast('Profil güncelleme sayfası yakın zamanda eklenecektir', 'info')
}

async function handleLogout() {
  dropdownOpen.value = false
  await logout()
}

function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

onMounted(() => {
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    isDark.value = true
    document.documentElement.classList.add('dark')
  }
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
