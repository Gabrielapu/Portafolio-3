<template>
  <ViewHeader
    title="Rutas de planta" 
    new-item-label="Nueva ruta" 
    hide-download-template-button
    hide-upload-template-button 
    @newItem="addItem"
  >
    <template #filters>
      <Select 
        v-if="!loading" 
        v-model="selectedPlant" 
        :options="simplePlantList"
        @change="requestItems(FIRST_PAGE, selectedPlant)" 
      />
    </template>
  </ViewHeader>
  <div>
    <Section>
      <template #content>
        <BaseTable 
          :headers="headers" 
          :data="plantRoutes" 
          :loading="loading" 
          paginated 
          :items-per-page="8"
          :items-amount="totalCount" 
          :current-page="currentPage" 
          hide-duplicate-button 
          @change-page="changePage"
          @toogle-delete-modal="rowData => deleteRow(rowData)" 
          @toogle-edit-modal="rowData => editRow(rowData)"
        >
          <template #destination_plant="{ item }">
            {{ item.destination_plant.name }}
          </template>
        </BaseTable>
      </template>
    </Section>
    <ManageRoutes 
      v-if="crudModal" 
      v-model="crudModal" 
      :item="currentItem" 
      :type="formType"
      :selected-plant="selectedPlant" 
      @reload="reload" 
      @close="crudModal = false" 
    />
  </div>
</template>

<script setup>
const emit = defineEmits(['newRoute'])
let plantRoutes = reactive([])
let currentItem = reactive({})
const simplePlantList = ref([])
const loading = ref(true)
const totalCount = ref(0)
const currentPage = ref(1)
const crudModal = ref(false)
const formType = ref('add')
const selectedPlant = ref(null)
const store = usePlantRoutesStore()
const pStore = usePlantsStore()
const FIRST_PAGE = 1
const headers = [
  { text: 'Planta de destino', value: 'destination_plant' },
  { text: 'Tiempo de viaje (días)', value: 'travel_time' },
  { text: 'Acciones', value: 'actions' },
]

onMounted(async () => {
  await requestPlantsList()
  selectedPlant.value = simplePlantList.value[0]?.id || ''
  requestItems(FIRST_PAGE, selectedPlant.value)
  loading.value = false
})

const updatePlantsList = async () => {
  loading.value = true
  await requestPlantsList()
  if (!simplePlantList.value.some(item => item.id === selectedPlant.value)) {
    selectedPlant.value = simplePlantList.value[0]?.id
    requestItems(FIRST_PAGE, selectedPlant.value)
  }
  loading.value = false
}
const requestPlantsList = async () => {
  await pStore.getLoaderPlantsList()
  simplePlantList.value = pStore.loaderPlants
}
const requestItems = async (page, plantId) => {
  loading.value = true
  plantRoutes = []
  await store.getPlantRoutesList(page, plantId)
  plantRoutes = [...store.plantRoutesList.results]
  totalCount.value = store.plantRoutesList.count
  loading.value = false
}

const changePage = (page) => {
  currentPage.value = page
  requestItems(page, selectedPlant.value)
}

const reload = async () => {
  emit('newRoute')
  if (currentPage.value > 1 && plantRoutes.length === 1 && formType.value === 'delete') {
    currentPage.value--
  }
  await requestItems(currentPage.value, selectedPlant.value)
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
defineExpose({ updatePlantsList });
</script>