<template>
  <ViewHeader 
    title="Inventarios iniciales" 
    :subtitle="getSubtitle" 
    hide-new-item-button
    @openModal="e => openTemplateModal(e)"
  />
  <div>
    <Section>
      <template #content>
        <div class="flex justify-end items-center">
          <div class="w-1/4">
            <DatePicker
              class="mb-4" 
              v-model="filterDate" 
              label="Filtro de fecha" 
              size="sm"
              :allowedDates="allowedDates"
            />
          </div>
        </div>
        <BaseTable
          :headers="headers"
          :data="cptArrivals"
          :loading="loading"
          paginated
          :items-per-page="pageSize"
          :items-amount="totalCount"
          :current-page="currentPage"
          @change-page="page => requestItems(page, filterDate)"
        />
      </template>
    </Section>
  </div>
  <ManageTemplate 
    v-model="manageTemplateModal"
    label="inventarios iniciales"
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
        label="Fecha"
        :allowedDates="computedAllowedDates"
      />
    </template>
  </ManageTemplate>
</template>

<script setup>
const dayjs = inject('dayjs')
let cptArrivals = reactive([])
const filterDate = ref()

const selectedDate = ref(null)
const loadingTemplate = ref(false)
const fileToUpload = ref(null)
const templateAction = ref(null)
const manageTemplateModal = ref(false)

const loading = ref(false)
const pageSize = 12
const totalCount = ref(0)
const FIRST_PAGE = 1
const currentPage = ref(1)
const store = useInitialInventoriesStore()
const parametersStore = useParametersStore()
const allowedDates = ref([])

const headers = [
  { text: 'Tanque', value: 'tank_name' },
  { text: 'Planta', value: 'plant_name' },
  { text: 'Producto', value: 'product_name' },
  { text: 'Tipo producto', value: 'product_type' },
  { text: 'Toneladas', value: 'tons' },
]

onMounted(async () => { 
  await store.getAllowedDates()
  allowedDates.value = store.allowedDates.active_dates.map(d => dayjs(d))
  filterDate.value = dayjs(store.allowedDates.recent_active_date)
  updateViewHeader()
})

watch(filterDate, () => {
  requestItems(FIRST_PAGE)
})

const computedAllowedDates = computed(() => {
  if (templateAction.value === 'upload') {
    return undefined
  }
  return allowedDates.value
})

const updateViewHeader = async() => {
  await parametersStore.getLastUpdatedTemplate("inventarios_iniciales")
}

const getSubtitle = computed(() => {
  return parametersStore.lastUpdatedFile?.filename !== ''
    ? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - 
    Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
    : 'No se han cargado plantillas'
})

const requestItems = async (page) => {
  loading.value = true
  currentPage.value = page
  selectedDate.value = new Date(filterDate.value)
  const date = dayjs(filterDate.value).format('YYYY-MM-DD')
  await store.getInitialInventoriesList(page, date, pageSize)
  cptArrivals = [...store.initialInventoriesList.results]
  totalCount.value = store.initialInventoriesList.count
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
  const date = dayjs(selectedDate.value).format('YYYY-MM-DD')
  templateAction.value === 'upload'
    ? await store.uploadTemplate(date, fileToUpload.value)
    : await store.downloadTemplate(date)
  if(templateAction.value === 'upload') {
    requestItems(FIRST_PAGE, filterDate.value)
    updateViewHeader()
  }
  loadingTemplate.value = false
  manageTemplateModal.value = false
}

</script>