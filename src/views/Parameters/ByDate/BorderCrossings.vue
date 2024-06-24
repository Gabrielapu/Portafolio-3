<template>
  <ViewHeader 
    title="Pasos fronterizos" 
    :subtitle="getSubtitle" 
    hide-new-item-button
    @openModal="e => openTemplateModal(e)"
  />
  <div>
    <Section>
      <template #content>
        <MonthSelector class="mb-3" @queryDate="date => selectedDate = date" />
        <BaseTable
          :headers="borderCrossings.headers"
          :data="borderCrossings.data"
          :loading="loading"
          paginated
          :items-amount="totalCount"
          :current-page="currentPage"
          hide-duplicate-button
          horizontal-scroll
          @change-page="changePage"
        >
          <template v-for="column in borderCrossings.headers?.slice(1)" #[`${column.value}`]="{ item }">    
            <Badge 
              :text="item[column.value]?.value ? 'A' : 'C'"
              :color="item[column.value]?.value ? 'positive' : 'danger'"
              size="sm"
              :padding="false"
            />
          </template>
        </BaseTable>
      </template>
    </Section>
  </div>
  <ManageTemplate 
    v-model="manageTemplateModal"
    label="pasos fronterizos"
    :action="templateAction"
    :loading="loadingTemplate"
    :disabled-button="getButtonStatus"
    @manage="manageTemplate"
    @addFile="file => fileToUpload = file"
  >
    <template #inputs>
      <DatePicker        
        class="mb-3"
        v-model="templateDate" 
        label="Mes"
        month-picker
        format="MM-yyyy"
        @update:model-value="date => templateDate = date"
      />
    </template>
  </ManageTemplate>
</template>

<script setup>

const templateDate = ref(null)
const loadingTemplate = ref(false)
const fileToUpload = ref(null)
const templateAction = ref(null)
const manageTemplateModal = ref(false)
const selectedDate = ref(null)

const borderCrossings = ref([])
const FIRST_PAGE = 1
const PAGE_SIZE = 8
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const parametersStore = useParametersStore()
const store = useBorderCrossingsStore()


const getSubtitle = computed(() => {
	return parametersStore.lastUpdatedFile?.filename !== ''
		? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - 
		Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
		: 'No se han cargado plantillas'
})
const updateViewHeader = async() => {
	await parametersStore.getLastUpdatedTemplate("pasos_fronterizos")
}
onMounted(() => {
  updateViewHeader()
})

watch(selectedDate, () => {
  requestItems(selectedDate.value, FIRST_PAGE)
})

const requestItems = async (date, page) => {
  templateDate.value = {...date}
  templateDate.value.month = parseInt(templateDate.value.month) - 1
  loading.value = true
  borderCrossings.value = []
  await store.getBorderCrossings(date, page, PAGE_SIZE)
  borderCrossings.value = store.borderCrossingsCalendarList.results
  totalCount.value = store.borderCrossingsCalendarList.count
  loading.value = false
}

const changePage = (page) => {
  currentPage.value = page
  requestItems(selectedDate.value, page)
}

const openTemplateModal = (action) => {
  manageTemplateModal.value = true
  templateAction.value = action
}

const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' 
    ? !templateDate.value || !fileToUpload.value
    : !templateDate.value
})

const manageTemplate = async () => {
  loadingTemplate.value = true
  let { date } = useFormatMonthWith0(templateDate.value)
  templateAction.value === 'upload'
    ? await store.uploadTemplate(date, fileToUpload.value)
    : await store.downloadTemplate(date)
  if(templateAction.value === 'upload') {
    requestItems(selectedDate.value, FIRST_PAGE)
    updateViewHeader()
    fileToUpload.value = null
  }
  loadingTemplate.value = false
  manageTemplateModal.value = false
}
</script>