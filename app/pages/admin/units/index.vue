<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex-1 flex justify-center">
        <div class="relative w-full max-w-md">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon class="h-4 w-4 text-gray-400" />
          </div>
          <input v-model="searchQuery" @keyup.enter="search" type="text" placeholder="Birim ara..."
            class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-16 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
          <button @click="search"
            class="absolute inset-y-0 right-0 rounded-r-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700">
            Ara
          </button>
        </div>
      </div>
      <button @click="openCreateDrawer"
        class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
        <PlusIcon />
        Yeni Birim
      </button>
    </div>

    <UnitsTable :units="items" :loading="loading" :current-page="currentPage" :total-pages="totalPages" :per-page="perPage" :total-items="totalItems"
      :sort-by="sortBy" :sort-order="sortOrder"
      @view="openViewDrawer" @edit="openEditDrawer" @delete="handleDelete" @prev-page="currentPage--" @next-page="currentPage++" @sort="setSort" />

    <AdminDrawer :isOpen="drawerOpen" :title="drawerTitle" :icon="drawerIcon" @close="closeDrawer">
      <UnitsView v-if="drawerMode === 'view'" :unit="selectedItem" />
      <UnitsForm v-else v-model="form" :errors="formErrors" @submit="handleSubmit" />
      <template #footer>
        <div class="flex justify-end gap-3">
          <template v-if="drawerMode === 'view'">
            <button type="button" @click="closeDrawer"
              class="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Kapat
            </button>
          </template>
          <template v-else>
            <button type="submit" form="unit-form" :disabled="saving"
              class="w-24 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
              {{ saving ? 'Kaydediliyor...' : drawerMode === 'edit' ? 'Güncelle' : 'Kaydet' }}
            </button>
            <button type="button" @click="closeDrawer"
              class="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              İptal
            </button>
          </template>
        </div>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import PlusIcon from '~/assets/svg/PlusIcon.vue'
import SearchIcon from '~/assets/svg/SearchIcon.vue'
import UnitIcon from '~/assets/svg/UnitIcon.vue'
import UnitsTable from './_UnitsTable.vue'
import UnitsForm from './_UnitsForm.vue'
import UnitsView from './_UnitsView.vue'
import type { Unit } from './_UnitsTable.vue'
import { unitSchema } from '~/validations/units'
import { useCrud } from '~/composables/useCrud'

definePageMeta({ layout: 'admin' })

const {
  items,
  loading,
  searchQuery,
  currentPage,
  perPage,
  totalPages,
  totalItems,
  sortBy,
  sortOrder,
  drawerOpen,
  drawerMode,
  selectedItem,
  form,
  formErrors,
  saving,
  drawerTitle,
  drawerIcon,
  fetchItems,
  search,
  setSort,
  openCreateDrawer,
  openViewDrawer,
  openEditDrawer,
  closeDrawer,
  handleSubmit,
  handleDelete,
} = useCrud<Unit>({
  endpoint: 'units',
  defaultForm: { unit_name: '', unit_decription: '' },
  validationSchema: unitSchema,
  itemName: 'Birim',
  icon: UnitIcon,
  defaultSortBy: 'unit_name',
})

onMounted(async () => {
  await fetchItems()
})
</script>
