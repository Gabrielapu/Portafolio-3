<template>
  <ViewHeader
    title="Demanda" 
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
                Para editar la demanda directamente haga doble click sobre la celda de la 
                tabla que desea editar, solo los valores por fecha y el cumplimiento es 
                editable directamente. Los productos y plantas deben ser cargados y validados 
                desde la carga de plantilla.
              </p>
            </template>
          </Popper>
          <MonthSelector @queryDate="date => requestItems(FIRST_PAGE, date)"/>
        </div>
        <BaseTable
          :headers="demands.headers"
          :data="demands.data"
          :loading="loading"
          paginated
          :items-per-page="8"
          :items-amount="totalCount"
          horizontalScroll
          :current-page="currentPage"
          @change-page="page => requestItems(page, filters)"
        > 
          <template #compliance="{ item }">
            <div v-if="!!item.compliance.asInput" class="w-12">
              <InputValidateField                 
                v-model="item.compliance.value"
                placeholder-text="0"
                @blur="addModifiedRow(item, item.compliance, true)"
              />
            </div>
            <p 
              v-else
              class="my-4 mx-2 cursor-pointer hover:scale-150 ease-in duration-100"
              @dblclick="item.compliance.asInput = true"
              :class="{ 'font-bold text-amber-500': item.compliance.edited }"
            >
              {{ `${item.compliance.value}%` }}
            </p>
          </template>
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
                placeholder-text="0"
                @blur="addModifiedRow(item, item[column.value])"
              />
            </div>
            <p 
              v-else
              class="my-4 mx-2 cursor-pointer hover:scale-150 ease-in duration-100"
              @dblclick="item[column.value].asInput = true"
              :class="{ 'font-bold text-amber-500': item[column.value].edited }"
            >
              {{ item[column.value].value }}
            </p>
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
const selectedDate = ref(null)
const loadingTemplate = ref(false)
const fileToUpload = ref(null)
const templateAction = ref(null)
const manageTemplateModal = ref(false)

let modifiedItems = ref([])
let demands = reactive([])
let specialHeaders = reactive([])
let filters = ref({})
const loading = ref(false)
const totalCount = ref(0)
const FIRST_PAGE = 1
const currentPage = ref(1)
const store = useGeneralDemandStore()
const parametersStore = useParametersStore()
const excludedHeaders = ['Planta', 'Producto', 'Cumplimiento', 'Producto alternativo']

onMounted( async () => {
  await updateViewHeader()
})
const updateViewHeader = async() => {
  await parametersStore.getLastUpdatedTemplate("demanda")
}

const getSubtitle = computed(() => {
  return parametersStore.lastUpdatedFile?.filename !== ''
    ? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
    : 'No se han cargado plantillas'
})
const requestItems = async (page, queryDate) => {
  loading.value = true
  selectedDate.value = {...queryDate}
  selectedDate.value.month = parseInt(selectedDate.value.month) - 1
  currentPage.value = page
  filters.value = queryDate
  await store.getGeneralDemandsList(page, filters.value)
  demands = { ...store.generalDemandsList.results }
  specialHeaders = demands.headers
    .filter(header => !excludedHeaders.includes(header.text) )
  totalCount.value = store.generalDemandsList.count
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

const addModifiedRow = (row, item, compliance) => {
  if(compliance && !/^(?:100|[1-9][0-9]?|0)$/.test(item.value)) {
    toast.error('El valor debe ser un valor entre 0 y 100.')
    return
  }
  if(!(/^[0-9]+(?:[.][0-9]+)?$/.test(item.value))) {
    toast.error('El valor debe ser un numero entero o decimal con punto mayor o igual a 0. (Ej: 3.4)')
    return
  } 
  item.edited = true
  item.asInput = false
  item.value = parseFloat(item.value)
  const presentItem = modifiedItems.value.includes(row.id)
  if(!presentItem) modifiedItems.value.push(row.id)
}

const saveChanges = async () => {
  const payload = {
    date: `${filters.value.year}-${filters.value.month}`,
    data: demands.data.filter(item => modifiedItems.value.includes(item.id))
  }
  const status = await store.updateDemands(payload)
  if(status === 200) toast.success('Cambios guardados')
  await requestItems(FIRST_PAGE, filters.value)
}
</script>