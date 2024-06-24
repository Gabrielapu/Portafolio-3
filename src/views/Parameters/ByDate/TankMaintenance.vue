<template>
  <ViewHeader 
    title="Mantención de tanques" 
    :subtitle="getSubtitle" 
    new-item-label="Nuevo mantenimiento"
    download-label="Descargar historial"
    @openModal="e => openTemplateModal(e)"
    @newItem="addItem"
  />
  <div>
    <Section>
      <template #content>
				<div class="flex flex-row justify-end gap-4">
          <div class="w-1/5">            
            <Select v-if ="!loadingSelect"
              placeholder-text="Planta"
              v-model="selectedPlant"
              :options="plantsStore.simplePlants"          
              @change="requestItems(FIRST_PAGE, selectedPlant)"
            />
          </div>
					<MonthSelector class="mb-3" @queryDate="date => selectedDate = date" />
				</div>
        <BaseTable
          :headers="headers"
          :data="data"
          :loading="loading"
          paginated
          :items-per-page="8"
          :items-amount="totalCount"
          :current-page="currentPage"
          hide-duplicate-button
          @change-page="page => requestItems(page, filters)"
          @toogle-delete-modal="rowData => deleteRow(rowData)"
          @toogle-edit-modal="rowData => editRow(rowData)"
        > 
          <template #plant="{ item }">
            {{ item.tank.plant.name }}
          </template>
          <template #tank="{ item }">
            {{ item.tank.name }}
          </template>
          <template #initial_date="{ item }">
            {{ dayjs(item.initial_date).format('DD/MM/YYYY') }}
          </template>
          <template #end_date="{ item }">
            {{ dayjs(item.end_date).format('DD/MM/YYYY') }}
          </template>
        </BaseTable>  
      </template>
    </Section>
  </div>

  <ManageTemplate 
    v-model="manageTemplateModal"
    label="Mantención de tanques"
    :action="templateAction"
    :loading="loadingTemplate"
    :disabled-button="getButtonStatus"
    @manage="manageTemplate"
    @addFile="file => fileToUpload = file"
  />
  <ManageTanksMaintenance
    v-if="crudModal" 
    v-model="crudModal" 
    :item="currentItem"
    :type="formType"
    :preSelectedPlant="selectedPlant"
    @reload="reload"
    @close="crudModal = false"
  />
</template>

<script setup>
import { reactive } from 'vue';

const dayjs = inject('dayjs')
let filters = ref({})
let data = reactive([])

const selectedDate = ref(null)
const selectedPlant = ref(null)
const loadingTemplate = ref(false)
const fileToUpload = ref(null)
const templateAction = ref(null)
const manageTemplateModal = ref(false)
const loadingSelect = ref(true)
const crudModal = ref(false)
let currentItem = reactive({})
const formType = ref('add')

const loading = ref(false)
const totalCount = ref(0)
const FIRST_PAGE = 1
const currentPage = ref(1)
const tankStore = usePlantTanksStore()

const plantsStore = usePlantsStore()
const parametersStore = useParametersStore()

onMounted( async () => {
  await updateViewHeader()
  await plantsStore.getPlantsSimpleList()
  selectedPlant.value = plantsStore.simplePlants[0].id
  requestItems(FIRST_PAGE, selectedPlant.value)
  loadingSelect.value = false
})

watch(selectedDate, () => {
  requestItems(FIRST_PAGE, selectedPlant.value)
})
const updateViewHeader = async() => {
  await parametersStore.getLastUpdatedTemplate("mantenimiento_tankes")
}

const getSubtitle = computed(() => {
  return parametersStore.lastUpdatedFile?.filename !== ''
    ? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - 
    Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
    : 'No se han cargado plantillas'
})
const headers = [
  { text: 'Planta', value: 'plant' },
  { text: 'Tanque', value: 'tank' },
  { text: 'Inicio mantención', value: 'initial_date' },
  { text: 'Termino mantención', value: 'end_date' },
  { text: 'Acciones', value: 'actions' },
]

const requestItems = async (page, plant) => {
  if (plant === null) return
  loading.value = true
  const date = selectedDate.value.year + '-' + selectedDate.value.month
  currentPage.value = page
	await tankStore.getTankMaintenanceList(date, plant, page, 8)
  data = [...tankStore.tankMaintenanceList.results]
  totalCount.value = tankStore.tankMaintenanceList.count
  loading.value = false
}

const openTemplateModal = async (action) => {
  if (action === 'upload') {
    manageTemplateModal.value = true
    templateAction.value = action
  }
  else {
    await tankStore.downloadTemplate()
  }
}

const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' 
    ? !fileToUpload.value : false
})

const manageTemplate = async () => {
  loadingTemplate.value = true
  templateAction.value === 'upload'
    ? await tankStore.uploadTemplate(fileToUpload.value)
    : await tankStore.downloadTemplate()
  if(templateAction.value === 'upload') {
    requestItems(FIRST_PAGE, selectedPlant.value)
    updateViewHeader()
  }
  loadingTemplate.value = false
  manageTemplateModal.value = false
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

const reload = () => {
  requestItems(FIRST_PAGE, selectedPlant.value)
}
</script>