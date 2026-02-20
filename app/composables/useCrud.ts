import { z } from 'zod'
import type { Component } from 'vue'

function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}

function transformKeysToCamelCase<T>(obj: Record<string, any>): T {
  const result: any = {}
  for (const key in obj) {
    const camelKey = snakeToCamel(key)
    result[camelKey] = obj[key]
  }
  return result as T
}

interface UseCrudOptions<T> {
  endpoint: string
  defaultForm: T
  validationSchema: z.ZodSchema
  itemName: string
  icon?: Component
  perPage?: number
}

interface UseCrudReturn<T> {
  items: Ref<T[]>
  loading: Ref<boolean>
  searchQuery: Ref<string>
  currentPage: Ref<number>
  perPage: number
  totalPages: Ref<number>
  totalItems: Ref<number>
  sortBy: Ref<string>
  sortOrder: Ref<'asc' | 'desc'>
  drawerOpen: Ref<boolean>
  drawerMode: Ref<'create' | 'edit' | 'view'>
  selectedItem: Ref<T | null>
  form: Ref<T>
  formErrors: Ref<Record<string, string>>
  saving: Ref<boolean>
  drawerTitle: ComputedRef<string>
  drawerIcon: Component | undefined
  fetchItems: () => Promise<void>
  openCreateDrawer: () => void
  openViewDrawer: (item: T) => void
  openEditDrawer: (item: T) => void
  closeDrawer: () => void
  validateForm: () => boolean
  handleSubmit: (body?: any) => Promise<void>
  handleDelete: (id: string) => Promise<void>
}

export function useCrud<T extends Record<string, any>>(
  options: UseCrudOptions<T>
): UseCrudReturn<T> {
  const { apiFetch } = useApi()
  const { addToast } = useToast()

  const items = ref<T[]>([]) as Ref<T[]>
  const loading = ref(false)
  const searchQuery = ref('')
  const currentPage = ref(1)
  const perPage = options.perPage ?? 10
  const totalPages = ref(1)
  const totalItems = ref(0)
  const sortBy = ref<string>('name')
  const sortOrder = ref<'asc' | 'desc'>('asc')

  const drawerOpen = ref(false)
  const drawerMode = ref<'create' | 'edit' | 'view'>('create')
  const selectedItem = ref<T | null>(null)
  const form = ref({ ...options.defaultForm })
  const formErrors = ref<Record<string, string>>({})
  const saving = ref(false)

  const drawerTitle = computed(() => {
    if (drawerMode.value === 'create') return `Yeni ${options.itemName}`
    if (drawerMode.value === 'edit') return `${options.itemName} Düzenle`
    return `${options.itemName} Detayı`
  })

  let searchTimeout: ReturnType<typeof setTimeout>
  watch(searchQuery, (newVal) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      currentPage.value = 1
      fetchItems()
    }, 400)
  })

  watch(currentPage, () => fetchItems())

  async function search() {
    clearTimeout(searchTimeout)
    currentPage.value = 1
    await fetchItems()
  }

  async function fetchItems() {
    loading.value = true
    try {
      const res = await apiFetch<any>(`/api/admin/${options.endpoint}`, {
        params: { 
          page: currentPage.value, 
          perPage, 
          search: searchQuery.value.trim() || undefined,
        },
      })
      const itemsArray = res.items || []
      
      if (sortBy.value === 'name') {
        itemsArray.sort((a: T, b: T) => 
          String(a.name || '').localeCompare(String(b.name || ''), 'tr')
        )
        if (sortOrder.value === 'desc') {
          itemsArray.reverse()
        }
      } else if (sortBy.value === 'created') {
        itemsArray.sort((a: T, b: T) => {
          const dateA = new Date(a.created || 0).getTime()
          const dateB = new Date(b.created || 0).getTime()
          return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA
        })
      } else {
        itemsArray.sort((a: T, b: T) => {
          const valA = String(a[sortBy.value as keyof T] || '')
          const valB = String(b[sortBy.value as keyof T] || '')
          return sortOrder.value === 'asc' ? valA.localeCompare(valB, 'tr') : valB.localeCompare(valA, 'tr')
        })
      }
      
      items.value = itemsArray
      totalPages.value = res.totalPages || 1
      totalItems.value = res.totalItems || 0
    } catch {
    } finally {
      loading.value = false
    }
  }

  function setSort(field: string) {
    if (sortBy.value === field) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy.value = field
      sortOrder.value = 'asc'
    }
    fetchItems()
  }

  function openCreateDrawer() {
    drawerMode.value = 'create'
    selectedItem.value = null
    form.value = { ...options.defaultForm }
    formErrors.value = {}
    drawerOpen.value = true
  }

  function openViewDrawer(item: T) {
    drawerMode.value = 'view'
    selectedItem.value = item
    drawerOpen.value = true
  }

  async function openViewDrawerFetch(item: T & { id: string }) {
    drawerMode.value = 'view'
    loading.value = true
    try {
      const data = await $fetch(`/api/admin/${options.endpoint}/${item.id}`)
      selectedItem.value = data as T
    } catch (error) {
      addToast(`${options.itemName} bilgileri yüklenirken hata oluştu`, 'error')
    } finally {
      loading.value = false
    }
    drawerOpen.value = true
  }

  function openEditDrawer(item: T) {
    drawerMode.value = 'edit'
    selectedItem.value = item
    form.value = transformKeysToCamelCase(item as any)
    formErrors.value = {}
    drawerOpen.value = true
  }

  function closeDrawer() {
    drawerOpen.value = false
    selectedItem.value = null
    formErrors.value = {}
  }

  function validateForm(): boolean {
    try {
      options.validationSchema.parse(form.value)
      formErrors.value = {}
      return true
    } catch (error: any) {
      const errors: Record<string, string> = {}
      const issues = error.errors || error.issues || []
      issues.forEach((err: any) => {
        const field = err.path[0]
        errors[field] = err.message
      })
      formErrors.value = errors
      return false
    }
  }

  async function handleSubmit(body?: any) {
    if (!validateForm()) return
    saving.value = true
    try {
      if (drawerMode.value === 'create') {
        await apiFetch(`/api/admin/${options.endpoint}`, {
          method: 'POST',
          body: body || form.value,
          headers: body instanceof FormData ? {} : undefined,
        })
        addToast(`${options.itemName} başarıyla oluşturuldu`, 'success')
      } else if (drawerMode.value === 'edit' && selectedItem.value) {
        await apiFetch(`/api/admin/${options.endpoint}/${selectedItem.value.id}`, {
          method: 'PUT',
          body: body || form.value,
          headers: body instanceof FormData ? {} : undefined,
        })
        addToast(`${options.itemName} başarıyla güncellendi`, 'success')
      }
      closeDrawer()
      await fetchItems()
    } catch {
    } finally {
      saving.value = false
    }
  }

  async function handleDelete(id: string) {
    await apiFetch(`/api/admin/${options.endpoint}/${id}`, { method: 'DELETE' })
    addToast(`${options.itemName} başarıyla silindi`, 'success')
    await fetchItems()
  }

  return {
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
    drawerIcon: options.icon,
    fetchItems,
    search,
    setSort,
    openCreateDrawer,
    openViewDrawer,
    openViewDrawerFetch,
    openEditDrawer,
    closeDrawer,
    validateForm,
    handleSubmit,
    handleDelete,
  }
}
