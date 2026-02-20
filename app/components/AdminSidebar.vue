<template>
  <div v-if="open" class="fixed inset-0 z-40 bg-black/50 lg:hidden" @click="$emit('close')"></div>

  <aside :class="[
    'fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-slate-800 text-gray-100 transition-transform duration-300 lg:static lg:translate-x-0',
    open ? 'translate-x-0' : '-translate-x-full'
  ]">
    <div class="flex h-14 shrink-0 items-center justify-between border-b border-slate-700 px-4">
      <span class="text-lg font-bold text-white">Yönetim Paneli</span>
      <button @click="$emit('close')" class="rounded p-1 text-slate-400 hover:text-white lg:hidden">
        <CloseIcon class="h-5 w-5" />
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
            <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
            <span>{{ item.label }}</span>
            <ChevronRightIcon v-if="item.children" class="ml-auto h-4 w-4" />
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
import CategoryIcon from '~/assets/svg/CategoryIcon.vue'
import UnitIcon from '~/assets/svg/UnitIcon.vue'
import TagIcon from '~/assets/svg/TagIcon.vue'
import ManufacturerIcon from '~/assets/svg/ManufacturerIcon.vue'
import CustomerIcon from '~/assets/svg/CustomerIcon.vue'
import CloseIcon from '~/assets/svg/CloseIcon.vue'
import ChevronRightIcon from '~/assets/svg/ChevronRightIcon.vue'

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
  icon: typeof CategoryIcon
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
        icon: CategoryIcon,
      },
      {
        label: 'Birimler',
        path: '/admin/units',
        icon: UnitIcon,
      },
      {
        label: 'Markalar',
        path: '/admin/brands',
        icon: TagIcon,
      },
      {
        label: 'Üreticiler',
        path: '/admin/manufacturers',
        icon: ManufacturerIcon,
      },
      {
        label: 'Müşteriler',
        path: '/admin/customers',
        icon: CustomerIcon,
      },
    ],
  },
]

function isActive(path: string) {
  return route.path === path
}
</script>
