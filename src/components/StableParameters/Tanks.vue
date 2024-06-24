<template>
  <ViewHeader 
    title="Tanques de planta"  
    new-item-label="Nuevo tanque"
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
          :data="plantTanks"
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
    <ManageTanks 
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
let plantTanks = reactive([])
let currentItem = reactive({})
const simplePlantList = ref([])
const loading = ref(true)
const totalCount = ref(0)
const currentPage = ref(1)
const crudModal = ref(false)
const formType = ref('add')
const selectedPlant = ref(null)
const store = usePlantTanksStore()
const pStore = usePlantsStore()
const FIRST_PAGE = 1
const headers = [
  { text: 'Nombre', value: 'name' },
  { text: 'Capacidad (Metros cúbicos)', value: 'capacity' },
  { text: 'Acciones', value: 'actions' },
]

onMounted(async ()=> {
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
  await pStore.getPlantsSimpleList()
  simplePlantList.value = pStore.simplePlants  
}
const requestItems = async (page, plantId) => {
  loading.value = true
  plantTanks = []
  await store.getPlantTanksList(page, plantId)
  plantTanks = [...store.plantTanksList.results]
  totalCount.value = store.plantTanksList.count
  loading.value = false 
}
const changePage = (page) => {
  currentPage.value = page
  requestItems(page, selectedPlant.value)
}
const reload = async () => {
  if (currentPage.value > 1 && plantTanks.length === 1 && formType.value === 'delete') {
    currentPage.value -- 
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