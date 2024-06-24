<template>
  <ViewHeader 
    title="Camiones en espera a fin de mes" 
    :subtitle="getSubtitle" 
    new-item-label="Nuevo rango"
    download-label="Descargar plantilla"
    @openModal="e => openTemplateModal(e)"
    @newItem="addItem"
  />
  <div>
    <Section>
      <template #content>
				<div class="flex flex-row justify-end">
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
            {{ item.plant.name }}
          </template>
          <template #elaborated_product="{ item }">
            <span v-if="item.is_input">
              {{ item.input_product.name }}
            </span>
            <span v-else>
              {{ item.elaborated_product.name }}
            </span>
          </template>
          <template #is_input="{ item }">
              {{ item.is_input ? 'Input' : 'Elaborado' }}
          </template>
        </BaseTable>  
      </template>
    </Section>
  </div>
  <ManageTemplate 
    v-model="manageTemplateModal"
    label="rango de camiones"
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
        :model-value="templateDate" 
        label="Mes" 
        month-picker
        format="MM-yyyy"
        @update:model-value="date => templateDate = date"
      />
    </template>
  </ManageTemplate>
  <ManageTrucksWaiting
    v-if="crudModal" 
    v-model="crudModal" 
    :item="currentItem"
    :type="formType"
    @reload="reload"
    @close="crudModal = false"
  />
</template>

<script setup>
let filters = ref({})
let data = reactive([])
let currentItem = reactive({})

const selectedDate = ref(null)
const templateDate = ref(null)
const loadingTemplate = ref(false)
const fileToUpload = ref(null)
const templateAction = ref(null)
const manageTemplateModal = ref(false)
const crudModal = ref(false)
const formType = ref('add')
const loading = ref(false)
const totalCount = ref(0)
const FIRST_PAGE = 1
const currentPage = ref(1)
const store = useTrucksRangeStore()
const parametersStore = useParametersStore()

const headers = [
  { text: 'Planta', value: 'plant' },
  { text: 'Producto', value: 'elaborated_product' },
  { text: 'Tipo de producto', value: 'is_input' },
  { text: 'Mínimo camiones', value: 'min_trucks' },
  { text: 'Máximo camiones', value: 'max_trucks' },
  { text: 'Acciones', value: 'actions' },
]

onMounted( async () => {
  await updateViewHeader()
})

watch(selectedDate, () => {
  requestItems(FIRST_PAGE)
})

const getSubtitle = computed(() => {
  return parametersStore.lastUpdatedFile?.filename !== ''
    ? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - 
    Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
    : 'No se han cargado plantillas'
})


const updateViewHeader = async() => {
  await parametersStore.getLastUpdatedTemplate("rango_camiones")
}

const requestItems = async (page) => {
  loading.value = true
  currentPage.value = page
  templateDate.value = {...selectedDate.value}
  templateDate.value.month = parseInt(templateDate.value.month) - 1;
  await store.getTrucksRangeList(page, selectedDate.value)
  data = [...store.trucksRangeList.results]
  totalCount.value = store.trucksRangeList.count
  loading.value = false
}

const openTemplateModal = (action) => {
  manageTemplateModal.value = true
  templateAction.value = action
}

const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' 
    ? !fileToUpload.value : !templateDate.value
})

const manageTemplate = async () => {
  loadingTemplate.value = true
  const { date } = useFormatMonthWith0(templateDate.value)
  if(templateAction.value === 'upload') {
    await store.uploadTemplate(fileToUpload.value, date)
    loadingTemplate.value = false
    updateViewHeader()
    reload()
  }
  if(templateAction.value === 'download') {
    await store.downloadTemplate(date)
    loadingTemplate.value = false
  }
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
  requestItems(FIRST_PAGE)
}
</script>