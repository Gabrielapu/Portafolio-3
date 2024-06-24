<template>
  <ViewHeader 
    title="CPT" 
    :subtitle="getSubtitle" 
    hide-new-item-button
    @openModal="e => openTemplateModal(e)"
  />
  <div>
    <Section>
      <template #content>
        <MonthSelector class="mb-3" @queryDate="date => requestItems(FIRST_PAGE, date)" />
        <BaseTable
          :headers="headers"
          :data="cptArrivals"
          :loading="loading"
          paginated
          :items-per-page="8"
          :items-amount="totalCount"
          :current-page="currentPage"
          @change-page="page => requestItems(page, filters)"
        > 
          <template #border_crossing="{ item }">
            {{ item.border_crossing.name }}
          </template>
          <template #provider="{ item }">
            {{ item.provider.name }}
          </template>
          <template #input_product="{ item }">
            {{ item.input_product.name }}
          </template>
          <template #plant="{ item }">
            {{ item.plant.name }}
          </template>
          <template #loading_date="{ item }">
            {{ dayjs(item.loading_date).format('DD/MM/YYYY') }}
          </template>
          <template #estimated_arrival_date="{ item }">
            {{ dayjs(item.estimated_arrival_date).format('DD/MM/YYYY') }}
          </template>
        </BaseTable>  
      </template>
    </Section>
  </div>
  <ManageTemplate 
    v-model="manageTemplateModal"
    label="CPT"
    :action="templateAction"
    :loading="loadingTemplate"
    :disabled-button="getButtonStatus"
    @manage="manageTemplate"
    @addFile="file => fileToUpload = file"
  >
    <template #inputs>
      <DatePicker
        :class="{
          'mb-3': templateAction === 'upload'
        }"
        v-model="selectedDate" 
        label="Mes" 
        month-picker
        format="MM-yyyy"
      />
    </template>
  </ManageTemplate>
</template>

<script setup>
const dayjs = inject('dayjs')
let cptArrivals = reactive([])
let filters = ref({})

const selectedDate = ref(null)
const loadingTemplate = ref(false)
const fileToUpload = ref(null)
const templateAction = ref(null)
const manageTemplateModal = ref(false)

const loading = ref(false)
const totalCount = ref(0)
const FIRST_PAGE = 1
const currentPage = ref(1)
const store = useCptArrivalsStore()
const parametersStore = useParametersStore()
onMounted( async () => {
  await updateViewHeader()
})
const updateViewHeader = async() => {
  await parametersStore.getLastUpdatedTemplate("cpt")
}
const getSubtitle = computed(() => {
  return parametersStore.lastUpdatedFile?.filename !== ''
    ? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - 
    Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
    : 'No se han cargado plantillas'
})
const headers = [
  { text: 'Proveedor', value: 'provider' },
  { text: 'Paso fronterizo', value: 'border_crossing' },
  { text: 'Producto de input', value: 'input_product' },
  { text: 'Planta', value: 'plant' },
  { text: 'Cantidad de camiones', value: 'truck_count' },
  { text: 'Carga', value: 'loading_date' },
  { text: 'Llegada estimada', value: 'estimated_arrival_date' },
]

const requestItems = async (page, queryDate) => {
  selectedDate.value = {...queryDate}
  selectedDate.value.month = parseInt(selectedDate.value.month) - 1
  loading.value = true
  currentPage.value = page
  filters.value = queryDate
  await store.getCptArrivalsList(page, filters.value)
  cptArrivals = [...store.cptArrivalsList.results]
  totalCount.value = store.cptArrivalsList.count
  loading.value = false
}

const openTemplateModal = (action) => {
  manageTemplateModal.value = true
  templateAction.value = action
}

const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' 
    ? !fileToUpload.value || !selectedDate.value
    : !selectedDate.value
})

const manageTemplate = async () => {
  loadingTemplate.value = true
  const { date } = useFormatMonthWith0(selectedDate.value)
  templateAction.value === 'upload'
    ? await store.uploadTemplate(date, fileToUpload.value)
    : await store.downloadTemplate(date)
  if(templateAction.value === 'upload') {
    requestItems(FIRST_PAGE, filters.value)
    updateViewHeader()
  }
  loadingTemplate.value = false
  manageTemplateModal.value = false
}

</script>