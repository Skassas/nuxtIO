<template>
  <div>
    <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex-1 flex justify-center">
        <div class="relative w-full max-w-md">
          <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon class="h-4 w-4 text-gray-400" />
          </div>
          <input v-model="searchQuery" @keyup.enter="search" type="text" placeholder="Para birimi ara..."
            class="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-16 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400" />
          <button @click="search"
            class="absolute inset-y-0 right-0 rounded-r-lg bg-blue-600 px-3 text-sm font-medium text-white hover:bg-blue-700">
            Ara
          </button>
        </div>
      </div>
      <button @click="handleRefreshAll" :disabled="refreshingAll"
        class="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50">
        <RefreshIcon class="w-4 h-4" :class="{ 'animate-spin': refreshingAll }" />
        Kurları Güncelle
      </button>
      <button @click="openCreateDrawer"
        class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700">
        <PlusIcon />
        Yeni Para Birimi
      </button>
    </div>

    <CurrenciesTable :currencies="items" :loading="loading" :current-page="currentPage" :total-pages="totalPages" :per-page="perPage" :total-items="totalItems"
      :sort-by="sortBy" :sort-order="sortOrder" :refreshing-id="refreshingId"
      @view="openViewDrawerFetch" @edit="openEditDrawer" @delete="handleDelete" @refresh="handleRefresh" @prev-page="currentPage--" @next-page="currentPage++" @sort="setSort" />

    <AdminDrawer :isOpen="drawerOpen" :title="drawerTitle" :icon="drawerIcon" @close="closeDrawer">
      <CurrenciesView v-if="drawerMode === 'view'" :currency="selectedItem" />
      <CurrenciesForm v-else v-model="form" :errors="formErrors" :existing-codes="existingCurrencyCodes" @submit="handleSubmit" />
      <template #footer>
        <div class="flex justify-end gap-3">
          <template v-if="drawerMode === 'view'">
            <button type="button" @click="closeDrawer"
              class="px-4 py-1.5 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700">
              Kapat
            </button>
          </template>
          <template v-else>
            <button type="submit" form="currency-form" :disabled="saving"
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
import RefreshIcon from '~/assets/svg/RefreshIcon.vue'
import CurrencyIcon from '~/assets/svg/CurrencyIcon.vue'
import CurrenciesTable from './_CurrenciesTable.vue'
import CurrenciesForm from './_CurrenciesForm.vue'
import CurrenciesView from './_CurrenciesView.vue'
import type { Currency } from './_CurrenciesTable.vue'
import { currencySchema } from '~/validations/currencies'
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
  openViewDrawerFetch,
  openEditDrawer,
  closeDrawer,
  handleSubmit,
  handleDelete,
} = useCrud<Currency>({
  endpoint: 'currencies',
  defaultForm: { currencyName: '', currencyCode: '', currencySymbol: '', currencyValue: '', currencyAutoUpdate: true },
  validationSchema: currencySchema,
  itemName: 'Para Birimi',
  icon: CurrencyIcon,
})

import { useToast } from '~/composables/useToast'

const { addToast } = useToast()

const refreshingId = ref<string | null>(null)
const refreshingAll = ref(false)

async function handleRefreshAll() {
  refreshingAll.value = true
  try {
    const currenciesToUpdate = items.value.filter(c => c.currency_auto_update === true)
    console.log('Currencies to update:', currenciesToUpdate)
    let successCount = 0
    for (const currency of currenciesToUpdate) {
      try {
        await $fetch(`/api/admin/currencies/${currency.id}/refresh`, {
          method: 'POST',
        })
        successCount++
      } catch (e) {
        console.error(`Failed to refresh ${currency.currency_code}:`, e)
      }
    }
    addToast(`${successCount} döviz kuru güncellendi`, 'success')
    await fetchItems()
  } catch (error: any) {
    addToast(error?.data?.message || 'Güncelleme sırasında hata oluştu', 'error')
  } finally {
    refreshingAll.value = false
  }
}

async function handleRefresh(currency: Currency) {
  refreshingId.value = currency.id
  try {
    const updated = await $fetch(`/api/admin/currencies/${currency.id}/refresh`, {
      method: 'POST',
    })
    addToast('Döviz kuru güncellendi', 'success')
    await fetchItems()
    if (selectedItem.value?.id === currency.id) {
      selectedItem.value = updated as Currency
    }
  } catch (error: any) {
    addToast(error?.data?.message || 'Güncelleme sırasında hata oluştu', 'error')
  } finally {
    refreshingId.value = null
  }
}

onMounted(async () => {
  await fetchItems()
})

const existingCurrencyCodes = computed(() => items.value.map(c => c.currency_code))
</script>
