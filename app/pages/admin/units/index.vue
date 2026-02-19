<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex-1 flex justify-center">
        <input v-model="searchQuery" type="text" placeholder="Birim ara..."
          class="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
      </div>
      <button @click="openCreateDrawer"
        class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
        <PlusIcon />
        Yeni Birim
      </button>
    </div>

    <UnitsTable :units="units" :loading="loading" :current-page="currentPage" :total-pages="totalPages" :per-page="perPage"
      @view="openViewDrawer" @edit="openEditDrawer" @delete="handleDelete" @prev-page="currentPage--" @next-page="currentPage++" />

    <AdminDrawer :isOpen="drawerOpen" :title="drawerTitle" @close="closeDrawer">
      <UnitsView v-if="drawerMode === 'view'" :unit="selectedUnit" />
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
              {{ saving ? 'Kaydediliyor...' : drawerMode === 'edit' ? 'Guncelle' : 'Kaydet' }}
            </button>
            <button type="button" @click="closeDrawer"
              class="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Iptal
            </button>
          </template>
        </div>
      </template>
    </AdminDrawer>
  </div>
</template>

<script setup lang="ts">
import PlusIcon from '~/assets/svg/PlusIcon.vue'
import UnitsTable from './_UnitsTable.vue'
import UnitsForm from './_UnitsForm.vue'
import UnitsView from './_UnitsView.vue'
import type { Unit } from './_UnitsTable.vue'
import { unitSchema } from '~/validations/units'

definePageMeta({ layout: 'admin' })

const { apiFetch } = useApi()
const { addToast } = useToast()

const units = ref<Unit[]>([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 9
const totalPages = ref(1)

const drawerOpen = ref(false)
const drawerMode = ref<'create' | 'edit' | 'view'>('create')
const selectedUnit = ref<Unit | null>(null)
const form = ref({ name: '', description: '' })
const formErrors = ref<Record<string, string>>({})
const saving = ref(false)

const drawerTitle = computed(() => {
  if (drawerMode.value === 'create') return 'Yeni Birim'
  if (drawerMode.value === 'edit') return 'Birimi Duzenle'
  return 'Birim Detayi'
})

let searchTimeout: ReturnType<typeof setTimeout>
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchUnits()
  }, 400)
})

watch(currentPage, () => fetchUnits())

async function fetchUnits() {
  loading.value = true
  try {
    const res = await apiFetch<any>('/api/admin/units', {
      params: { page: currentPage.value, perPage, search: searchQuery.value },
    })
    units.value = (res.items || []).sort((a: Unit, b: Unit) => a.name.localeCompare(b.name, 'tr'))
    totalPages.value = res.totalPages || 1
  } catch {
  } finally {
    loading.value = false
  }
}

function openCreateDrawer() {
  drawerMode.value = 'create'
  selectedUnit.value = null
  form.value = { name: '', description: '' }
  formErrors.value = {}
  drawerOpen.value = true
}

function openViewDrawer(unit: Unit) {
  drawerMode.value = 'view'
  selectedUnit.value = unit
  drawerOpen.value = true
}

function openEditDrawer(unit: Unit) {
  drawerMode.value = 'edit'
  selectedUnit.value = unit
  form.value = { name: unit.name, description: unit.description }
  formErrors.value = {}
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
  selectedUnit.value = null
  formErrors.value = {}
}

function validateForm(): boolean {
  try {
    unitSchema.parse(form.value)
    formErrors.value = {}
    return true
  } catch (error: any) {
    const errors: Record<string, string> = {}
    error.errors.forEach((err: any) => {
      const field = err.path[0]
      errors[field] = err.message
    })
    formErrors.value = errors
    return false
  }
}

async function handleSubmit() {
  if (!validateForm()) return
  saving.value = true
  try {
    if (drawerMode.value === 'create') {
      await apiFetch('/api/admin/units', { method: 'POST', body: form.value })
      addToast('Birim basariyla olusturuldu', 'success')
    } else if (drawerMode.value === 'edit' && selectedUnit.value) {
      await apiFetch(`/api/admin/units/${selectedUnit.value.id}`, { method: 'PUT', body: form.value })
      addToast('Birim basariyla guncellendi', 'success')
    }
    closeDrawer()
    await fetchUnits()
  } catch {
  } finally {
    saving.value = false
  }
}

async function handleDelete(id: string) {
  await apiFetch(`/api/admin/units/${id}`, { method: 'DELETE' })
  addToast('Birim basariyla silindi', 'success')
  await fetchUnits()
}

onMounted(async () => {
  await fetchUnits()
})
</script>
