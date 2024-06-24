<template>
  <ViewHeader
    title="Ductos y programación" 
    :subtitle="getSubtitle" 
    new-item-label="Guardar cambios"
    new-item-icon="uil:save"
    :disable-new-item-button="!modifiedItems.length"
    @openModal="e => openTemplateModal(e)"
    @newItem="e => saveChanges('newItem', e)"
  />
  <div>
    <Section>
      <template #content>
        <div class="flex items-center justify-between mb-4">
          <Popper arrow placement="right" offsetSkid="60">
            <div class="full-center text-slate-600">
              <BaseIcon class="mr-1 cursor-pointer" name="uil:exclamation-circle" />
              <span class="font-medium">Acerca de</span>
            </div>
            <template #content>
              <p class="max-w-xs">
                En ductos y programación solo se pueden editar directamente los 
                parámetros posterior a la fecha de hoy, los anteriores son 
                considerados datos reales por lo que solo pueden ser modificados 
                mediante la carga de plantilla.
              </p>
            </template>
          </Popper>
          <MonthSelector @queryDate="date => requestItems(FIRST_PAGE, date)"/>
        </div>
        <BaseTable
          :headers="pipelines.headers"
          :data="pipelines.data"
          :loading="loading"
          paginated
          :items-per-page="8"
          :items-amount="totalCount"
          horizontalScroll
          :current-page="currentPage"
          @change-page="page => requestItems(page, filters)"
        > 
          <template v-for="column in specialHeaders" #[`${column.value}`]="{ item }">
            <div 
              v-if="!!item[column.value].asInput" 
              :class="{
                'w-10': item[column.value].value.toString().length < 3,
                'w-16': item[column.value].value.toString().length >= 3
              }"
            >
              <InputValidateField                 
                v-model="item[column.value].value"
                placeholder-text="Libre"
                @blur="addModifiedRow(item, item[column.value])"
              />
            </div>
            <p v-else-if="isPast(item, column)"
              class="my-4 mx-2 cursor-default"
            >
              {{ item[column.value].value}}
            </p>
            <div v-else 
              class="my-4 mx-2 cursor-pointer hover:scale-150 ease-in duration-100"
              @dblclick="enableInput(item, column)"
            >
              <p v-if="isFree(item, column)"> 
                Libre 
              </p>
              <p v-else
                class="font-semibold"
                @dblclick="enableInput(item, column)"
                :class="{ 'font-bold text-amber-500': item[column.value].edited }"
              >
                {{ item[column.value].value}}
              </p>
            </div>
          </template>
        </BaseTable>  
      </template>
    </Section>
  </div>
  <ManageTemplate 
    v-model="manageTemplateModal"
    label="demanda"
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
        :model-value="selectedDate" 
        label="Mes" 
        month-picker
        format="MM-yyyy"
        @update:model-value="date => selectedDate = date"
      />
    </template>
  </ManageTemplate>
</template>

<script setup>
const toast = inject('toast')
const dayjs = inject('dayjs')
const selectedDate = ref(null)
const loadingTemplate = ref(false)
const fileToUpload = ref(null)
const templateAction = ref(null)
const manageTemplateModal = ref(false)
let modifiedItems = ref([])
let pipelines = reactive([])
let specialHeaders = reactive([])
let filters = ref({})
const loading = ref(false)
const totalCount = ref(0)
const FIRST_PAGE = 1
const currentPage = ref(1)
const store = usePipelineSuppliesStore()
const parametersStore = useParametersStore()
const excludedHeaders = ['Planta', 'Producto', 'Proveedor']

onMounted( async () => {
  await updateViewHeader()
})
const updateViewHeader = async() => {
  await parametersStore.getLastUpdatedTemplate("calendario_ductos")
}

const getSubtitle = computed(() => {
  return parametersStore.lastUpdatedFile?.filename !== ''
    ? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
    : 'No se han cargado plantillas'
})

const enableInput = (item, column) => {
  item[column.value].asInput = true
}

const isFree = (item, column) => {
  return (item[column.value].value === "")
}

const isPast = (item, column) => {
  const currentDate = dayjs().startOf('day'); 
  const inputDate = dayjs(item[column.value].date, 'day');
  return  inputDate.isBefore(currentDate);
}

const requestItems = async (page, queryDate) => {
  selectedDate.value = {...queryDate}
  selectedDate.value.month = parseInt(selectedDate.value.month) - 1
  loading.value = true
  currentPage.value = page
  filters.value = queryDate
  await store.getPipelineSuppliesList(page, filters.value)
  pipelines = { ...store.pipelineSuppliesList.results }
  specialHeaders = pipelines.headers
    .filter(header => !excludedHeaders.includes(header.text) )
  totalCount.value = store.pipelineSuppliesList.count
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

const addModifiedRow = (row, item) => {
  if ( isNaN(item.value) || (item.value > 1700 || item.value < 0) ) {
    toast.error('El valor debe ser un numero entero o decimal entre 0 y 1700')
    item.value = '0'
  }

  item.edited = true
  item.asInput = false
  item.value = isNaN(item.value) || item.value === ''
    ? '0'
    : parseFloat(item.value)

  const presentItem = modifiedItems.value.includes(row.id)
  if(!presentItem) modifiedItems.value.push(row.id)
}

const saveChanges = async () => {
  const payload = {
    date: `${filters.value.year}-${filters.value.month}`,
    data: pipelines.data.filter(item => modifiedItems.value.includes(item.id))
  }
  const status = await store.updatePipelineSupplies(payload)
  if(status === 200) toast.success('Cambios guardados')
  await requestItems(FIRST_PAGE, filters.value)
}
</script>