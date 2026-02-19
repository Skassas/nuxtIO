<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex-1 flex justify-center">
        <input v-model="searchQuery" type="text" placeholder="Marka ara..."
          class="w-full max-w-md rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
      </div>
      <button @click="openCreateDrawer"
        class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
        <PlusIcon />
        Yeni Marka
      </button>
    </div>

    <BrandsTable :brands="brands" :loading="loading" :current-page="currentPage" :total-pages="totalPages" :per-page="perPage"
      @view="openViewDrawer" @edit="openEditDrawer" @delete="handleDelete" @prev-page="currentPage--" @next-page="currentPage++" />

    <AdminDrawer :isOpen="drawerOpen" :title="drawerTitle" @close="closeDrawer">
      <BrandsView v-if="drawerMode === 'view'" :brand="selectedBrand" />
      <BrandsForm v-else v-model="form" :errors="formErrors" @submit="handleSubmit" />
      <template #footer>
        <div class="flex justify-end gap-3">
          <template v-if="drawerMode === 'view'">
            <button type="button" @click="closeDrawer"
              class="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Kapat
            </button>
          </template>
          <template v-else>
            <button type="submit" form="brand-form" :disabled="saving"
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
import BrandsTable from './_BrandsTable.vue'
import BrandsForm from './_BrandsForm.vue'
import BrandsView from './_BrandsView.vue'
import type { Brand } from './_BrandsTable.vue'
import { brandSchema } from '~/validations/brands'

definePageMeta({ layout: 'admin' })

const { apiFetch } = useApi()
const { addToast } = useToast()

const brands = ref<Brand[]>([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const perPage = 9
const totalPages = ref(1)

const drawerOpen = ref(false)
const drawerMode = ref<'create' | 'edit' | 'view'>('create')
const selectedBrand = ref<Brand | null>(null)
const form = ref({ name: '', description: '', image: '' })
const formErrors = ref<Record<string, string>>({})
const saving = ref(false)

const drawerTitle = computed(() => {
  if (drawerMode.value === 'create') return 'Yeni Marka'
  if (drawerMode.value === 'edit') return 'Markayi Duzenle'
  return 'Marka Detayi'
})

let searchTimeout: ReturnType<typeof setTimeout>
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchBrands()
  }, 400)
})

watch(currentPage, () => fetchBrands())

async function fetchBrands() {
  loading.value = true
  try {
    const res = await apiFetch<any>('/api/admin/brands', {
      params: { page: currentPage.value, perPage, search: searchQuery.value },
    })
    brands.value = (res.items || []).sort((a: Brand, b: Brand) => a.name.localeCompare(b.name, 'tr'))
    totalPages.value = res.totalPages || 1
  } catch {
  } finally {
    loading.value = false
  }
}

function openCreateDrawer() {
  drawerMode.value = 'create'
  selectedBrand.value = null
  form.value = { name: '', description: '', image: '' }
  formErrors.value = {}
  drawerOpen.value = true
}

function openViewDrawer(brand: Brand) {
  drawerMode.value = 'view'
  selectedBrand.value = brand
  drawerOpen.value = true
}

function openEditDrawer(brand: Brand) {
  drawerMode.value = 'edit'
  selectedBrand.value = brand
  form.value = { name: brand.name, description: brand.description, image: brand.image }
  formErrors.value = {}
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
  selectedBrand.value = null
  formErrors.value = {}
}

function validateForm(): boolean {
  try {
    brandSchema.parse(form.value)
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
    const isNewFile = form.value.image instanceof File
    if (drawerMode.value === 'create') {
      const body = new FormData()
      body.append('name', form.value.name.trim())
      if (form.value.description) body.append('description', form.value.description.trim())
      if (form.value.image) {
        if (isNewFile) {
          body.append('image', form.value.image)
        } else {
          body.append('image_id', form.value.image)
        }
      }
      await apiFetch('/api/admin/brands', { 
        method: 'POST', 
        body,
        headers: {} 
      })
      addToast('Marka basariyla olusturuldu', 'success')
    } else if (drawerMode.value === 'edit' && selectedBrand.value) {
      const body = new FormData()
      body.append('name', form.value.name.trim())
      if (form.value.description) body.append('description', form.value.description.trim())
      if (form.value.image) {
        if (isNewFile) {
          body.append('image', form.value.image)
        } else {
          body.append('image_id', form.value.image)
        }
      } else {
        body.append('image', 'null')
      }
      await apiFetch(`/api/admin/brands/${selectedBrand.value.id}`, { 
        method: 'PUT', 
        body,
        headers: {} 
      })
      addToast('Marka basariyla guncellendi', 'success')
    }
    closeDrawer()
    await fetchBrands()
  } catch {
  } finally {
    saving.value = false
  }
}

async function handleDelete(id: string) {
  await apiFetch(`/api/admin/brands/${id}`, { method: 'DELETE' })
  addToast('Marka basariyla silindi', 'success')
  await fetchBrands()
}

onMounted(async () => {
  await fetchBrands()
})
</script>
