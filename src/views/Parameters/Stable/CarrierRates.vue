<template>
  <ViewHeader 
    title="Tarifas"  
    :subtitle="getSubtitle" 
    new-item-label="Nueva tarifa"
    @newItem="addItem"
    @openModal="e => openTemplateModal(e)"
  />
  <div>
    <Section>
      <template #content>
        <div class="flex items-center justify-end">
          <div class="w-1/5">
            <Select 
              v-if="!loading"
              class="mb-3" 
              v-model="selectedCarrier" 
              :options="simpleCarrierList"
              @change="changeSelection"
            />
          </div>
        </div>
        <BaseTable
          :headers="headers"
          :data="rates"
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
  </div>
  <ManageCarrierRates 
    v-if="crudModal" 
    v-model="crudModal" 
    :item="currentItem" 
    :type="formType"
    @reload="reload" 
    @close="crudModal = false" 
    :carrier="selectedCarrier"
  />

  <ManageTemplate 
    v-model="manageTemplateModal"
    label="tarifas transportistas"
    :action="templateAction"
    :loading="loadingTemplate"
    :disabled-button="getButtonStatus"
    @manage="manageTemplate"
    @addFile="file => fileToUpload = file"
  />
</template>

<script setup>

let rates = reactive([])
const crudModal = ref(false)
const formType = ref('add')
let currentItem = reactive({})
const simpleCarrierList = ref([])
const loading = ref(true)
const totalCount = ref(0)
const currentPage = ref(1)
const selectedCarrier = ref(null)
const FIRST_PAGE = 1
const store = useRatesStore()
const cStore = useCarriersStore()
const fileToUpload = ref(null)
const templateAction = ref(null)
const loadingTemplate = ref(false)
const parametersStore = useParametersStore()
const manageTemplateModal = ref(false)
const headers = [
  { text: 'Tipo de flete', value: 'freight_type' },
  { text: 'Origen', value: 'source' },
  { text: 'Paso fronterizo', value: 'border_crossing' },
  { text: 'Destino', value: 'destination' },
  { text: 'USD', value: 'usd' },
  { text: 'Valor', value: 'value' },
  { text: 'Acciones', value: 'actions' },
]

onMounted(async ()=> {  
  await cStore.getCarriersSimpleList()
  simpleCarrierList.value = cStore.carriersSimpleList
  selectedCarrier.value = simpleCarrierList.value[0].id
  requestItems(FIRST_PAGE, simpleCarrierList.value[0].id)
  loading.value = false
  updateViewHeader()
})
const getSubtitle = computed(() => {
	return parametersStore.lastUpdatedFile?.filename !== ''
		? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - 
		Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
		: 'No se han cargado plantillas'
})
const updateViewHeader = async() => {
  await parametersStore.getLastUpdatedTemplate("tarifas")
}
const requestItems = async (page, carrierId) => {
  loading.value = true 
  rates = []
  await store.getRatesList(page, carrierId)
  rates = [...store.ratesList.results]
  totalCount.value = store.ratesList.count
  loading.value = false
}
const changePage = (page) => {
  currentPage.value = page
  requestItems(page, selectedCarrier.value)
}

const reload = async () => {
  await requestItems(currentPage.value, selectedCarrier.value)
  updateViewHeader()
}

const changeSelection = () => {
  currentPage.value = FIRST_PAGE
  requestItems(currentPage.value, selectedCarrier.value)
}

const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' && !fileToUpload.value
})

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
const openTemplateModal = async (action) => {
  if (action === 'upload') {
    manageTemplateModal.value = true
    templateAction.value = action
  }
  else await store.downloadTemplate(selectedCarrier.value)
}
const manageTemplate = async () => {
  loadingTemplate.value = true
  templateAction.value === 'upload'
    ? await store.uploadTemplate(fileToUpload.value)
    : await store.downloadTemplate(selectedCarrier.value)
  if(templateAction.value === 'upload') {
    reload()
  } 
  loadingTemplate.value = false
  manageTemplateModal.value = false
}

</script>