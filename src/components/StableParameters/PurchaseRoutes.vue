<template>
  <ViewHeader 
    title="Rutas de proveedor"
    new-item-label="Nueva ruta"
    @newItem="addItem"
    hideDownloadTemplateButton
    hideUploadTemplateButton
  />
  <div>
    <Section>
      <template #content>
        <div class="flex items-center justify-end">
          <div class="w-1/5">
            <Select 
              v-if="!loading"
              class="mb-3" 
              v-model="selectedProvider" 
              :options="simpleProviderList"
              @change="requestItems(currentPage, selectedProvider)"
            />
          </div>
        </div>
        <BaseTable
          :headers="headers"
          :data="purchaseRoutes"
          :loading="loading"
          paginated
          :items-per-page="8"
          :items-amount="totalCount"
          :current-page="currentPage"
          hide-duplicate-button
          @change-page="changePage"
          @toogle-delete-modal="rowData => deleteRow(rowData)" 
          @toogle-edit-modal="rowData => editRow(rowData)"
        />
      </template>
    </Section>
    <ManagePurchaseRoutes
    v-if="crudModal" 
      v-model="crudModal" 
      :item="currentItem" 
      :type="formType"
      :selected-provider="selectedProvider" 
      @reload="reload" 
      @close="crudModal = false"     
    />

  </div>
</template>

<script setup>
const emit = defineEmits(['newRoute'])
let purchaseRoutes = reactive([])
const crudModal = ref(false)
let currentItem = reactive({})
const formType = ref('add')
const simpleProviderList = ref([])
const loading = ref(true)
const totalCount = ref(0)
const currentPage = ref(1)
const selectedProvider = ref(null)
const FIRST_PAGE = 1
const store = usePurchaseRoutesStore()
const cStore = useProvidersStore()
const headers = [
  { text: 'Planta de destino', value: 'destination' },
  { text: 'Tiempo de viaje (días)', value: 'travel_time' },
  { text: 'Acciones', value: 'actions' },
]

onMounted(async ()=> {  
  await requestProvidersList()
  selectedProvider.value = simpleProviderList.value[0].id
  await requestItems(FIRST_PAGE, simpleProviderList.value[0].id)
  loading.value = false
})

const requestItems = async (page, purchaseRouteId) => {
  loading.value = true
  purchaseRoutes = []
  await store.getPurchaseRoutesList(page, purchaseRouteId)
  purchaseRoutes = [...store.purchaseRoutesList.results]
  totalCount.value = store.purchaseRoutesList.count
  loading.value = false
}

const changePage = (page) => {
  currentPage.value = page
  requestItems(page, selectedProvider.value)
}

const reload = async () => {
  emit('newRoute')
  if (currentPage.value > 1 && purchaseRoutes.length === 1 && formType.value === 'delete') {
    currentPage.value--
  }
  await requestItems(currentPage.value, selectedProvider.value)
}
const updateProvidersList = async () => {
  loading.value = true
  await requestProvidersList()
  if (!simpleProviderList.value.some(item => item.id === selectedProvider.value)) {
    selectedProvider.value = simpleProviderList.value[0].id
    requestItems(FIRST_PAGE, selectedProvider.value)
  }
  loading.value = false
}
const requestProvidersList = async () => {
  await cStore.getNationalProvidersList()
  simpleProviderList.value = cStore.providersNationalSimpleList
}
const deleteRow = (rowData) => {
  currentItem = rowData
  crudModal.value = true
  formType.value = 'delete'
}
const editRow = (rowData) => {
  currentItem = rowData
  crudModal.value = true
  formType.value = 'edit'
}
const addItem = () => {
  crudModal.value = true
  formType.value = 'add'
}
defineExpose({ updateProvidersList });
</script>