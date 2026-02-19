<template>
  <div v-if="open" class="fixed inset-0 z-40 bg-black/50 lg:hidden" @click="$emit('close')"></div>

  <aside :class="[
    'fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-slate-800 text-gray-100 transition-transform duration-300 lg:static lg:translate-x-0',
    open ? 'translate-x-0' : '-translate-x-full'
  ]">
    <div class="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 px-4">
      <span class="text-lg font-bold text-white">Yonetim Paneli</span>
      <button @click="$emit('close')" class="rounded p-1 text-slate-400 hover:text-white lg:hidden">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="flex-1 overflow-y-auto py-4">
      <div v-for="group in menuGroups" :key="group.title" class="mb-2">
        <div class="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {{ group.title }}
        </div>
        <div v-for="item in group.items" :key="item.path" class="relative" @mouseenter="openSub = item.path"
          @mouseleave="openSub = null">
          <NuxtLink :to="item.path"
            class="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-slate-700"
            :class="isActive(item.path) ? 'bg-slate-700 border-l-4 border-blue-400 text-white' : 'text-slate-300'"
            @click="closeMobile">
            <span v-html="item.icon" class="h-5 w-5 flex-shrink-0"></span>
            <span>{{ item.label }}</span>
            <svg v-if="item.children" class="ml-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </NuxtLink>
          <div v-if="item.children && openSub === item.path"
            class="absolute left-full top-0 z-50 ml-0 w-48 rounded-r-lg bg-slate-700 py-1 shadow-lg">
            <NuxtLink v-for="child in item.children" :key="child.path" :to="child.path"
              class="block px-4 py-2 text-sm text-slate-300 hover:bg-slate-600 hover:text-white"
              :class="isActive(child.path) ? 'bg-slate-600 text-white' : ''" @click="closeMobile">
              {{ child.label }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()

const route = useRoute()
const openSub = ref<string | null>(null)

function closeMobile() {
  if (window.innerWidth < 1024) {
    emit('close')
  }
}

interface MenuItem {
  label: string
  path: string
  icon: string
  children?: { label: string; path: string }[]
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

const menuGroups: MenuGroup[] = [
  {
    title: 'Katalog',
    items: [
      {
        label: 'Kategoriler',
        path: '/admin/categories',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>',
      },
      {
        label: 'Birimler',
        path: '/admin/units',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>',
      },
      {
        label: 'Markalar',
        path: '/admin/brands',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"/></svg>',
      },
    ],
  },
]

function isActive(path: string) {
  return route.path === path
}
</script>
