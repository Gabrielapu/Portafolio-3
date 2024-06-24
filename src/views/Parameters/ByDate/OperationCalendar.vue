<template>
  <ViewHeader 
    title="Calendario operación" 
    :subtitle="getSubtitle" 
    new-item-label="Guardar cambios"
    new-item-icon="uil:save"
    @newItem="saveCalendarChanges()"
    @openModal="e => openTemplateModal(e)"
  />
  <div>
    <Section>
      <template #content>
        <div class="flex items-center justify-between">
          <div class="full-center">
            <Button 
              label="Por plantas" 
              color="primary"
              :text-only="activeTable !== 'plants'"
              :shadow="false"
              size="sm" 
              class="mr-1"
              @click.native="activeTable = 'plants'"
            />
            <Button 
              label="Por proveedores" 
              color="primary" 
              :text-only="activeTable !== 'providers'"
              :shadow="false"
              size="sm" 
              class="mr-1"
              @click.native="activeTable = 'providers'"
            />
          </div>
          <div class="full-center">
            <MonthSelector @queryDate="date => changeDate(date)" />
          </div>
        </div>
        <div  class="mt-4">
          <div v-show="activeTable === 'plants'">
            <PlantOperation 
              ref="plantOperation" 
              :reload="reload" 
              :selected-date="selectedMonth"
            />
          </div>          
          <div v-show="activeTable === 'providers'"> 
            <ProviderOperation 
              ref="providerOperation" 
              :reload="reload" 
              :selected-date="selectedMonth"
            />
          </div>
        </div>
      </template>
    </Section>
  </div>
  <ManageTemplate 
    v-model="manageTemplateModal"
    label="operación"
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
const plantOperation = ref(null)
const providerOperation = ref(null)

const activeTable = ref('providers')
const selectedMonth = ref({})
const reload = ref(false)
const selectedDate = ref(null)
const loadingTemplate = ref(false)
const fileToUpload = ref(null)
const templateAction = ref(null)
const manageTemplateModal = ref(false)
const store = useOperationStore()
const parametersStore = useParametersStore()

onMounted( async () => {
	await updateViewHeader()
})
const getSubtitle = computed(() => {
	return parametersStore.lastUpdatedFile?.filename !== ''
		? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - 
		Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
		: 'No se han cargado plantillas'
})
const updateViewHeader = async() => {
	await parametersStore.getLastUpdatedTemplate("calendario_operacion")
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
const changeDate = (date) => {
  selectedMonth.value = date
  selectedDate.value = {...date}
  selectedDate.value.month = parseInt(selectedDate.value.month) - 1
}
const saveCalendarChanges = () => {
  if(activeTable.value === 'providers') {
    providerOperation.value.saveChanges()
  }
  if(activeTable.value === 'plants') {
    plantOperation.value.saveChanges()
  }
}

const manageTemplate = async () => {
  loadingTemplate.value = true
  reload.value = false
  const { date } = useFormatMonthWith0(selectedDate.value)
  templateAction.value === 'upload'
    ? await store.uploadTemplate(date, fileToUpload.value)
    : await store.downloadTemplate(date)
  loadingTemplate.value = false
  if(templateAction.value === 'upload') updateViewHeader()
  reload.value = true
  manageTemplateModal.value = false
}
</script>