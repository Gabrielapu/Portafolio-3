<template>
    <ViewHeader 
      title="Registro de despachos" 
      :subtitle="getSubtitle" 
      hide-new-item-button
      @openModal="e => openTemplateModal(e)"
    />
    <Section>
      <template #content>
        <div class="flex items-center justify-between">
          <div class="full-center">
            <Button 
              label="Nacionales" 
              color="primary" 
              :text-only="activeTable !== 'Nacionales'"
              :shadow="false"
              size="sm" 
              class="mr-1"
              @click.native="activeTable = 'Nacionales'"
            />
            <Button 
              label="Importaciones" 
              color="primary" 
              :text-only="activeTable !== 'Importaciones'"
              :shadow="false"
              size="sm" 
              class="mr-1"
              @click.native="activeTable = 'Importaciones'"
            />
            <Button 
              label="Transferencias" 
              color="primary"
              :text-only="activeTable !== 'Transferencia'"
              :shadow="false"
              size="sm" 
              class="mr-1"
              @click.native="activeTable = 'Transferencia'"
            />            
          </div>
          <MonthSelector @queryDate="date => selectedDate = date" class="flex-justify-end"/>        
        </div>
        <div class="mt-4">
          <MovementsTable ref="table" :selected-month="selectedDate" :type="activeTable"/>
        </div>
      </template>
    </Section>
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
          v-model="templateDate" 
          label="Mes" 
          month-picker
          format="MM-yyyy"
        />
      </template>
    </ManageTemplate>
  </template>
  
<script setup>

const activeTable = ref('Nacionales')
const dayjs = inject('dayjs')
const manageTemplateModal = ref(false)
const templateAction = ref(null)
const loadingTemplate = ref(false)
const selectedDate = ref(null)
const templateDate = ref(null)
const fileToUpload = ref(null)
const store = useDispatchStore()
const table = ref(null)
const parametersStore = useParametersStore()

onMounted(() => {
  updateViewHeader()
})

const getSubtitle = computed(() => {
	return parametersStore.lastUpdatedFile?.filename !== ''
		? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - 
		Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
		: 'No se han cargado plantillas'
})
const updateViewHeader = async() => {
	await parametersStore.getLastUpdatedTemplate("registro_movimientos")
}

const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' 
    ? !fileToUpload.value || !selectedDate.value
    : !selectedDate.value
})

const openTemplateModal = (action) => {
  manageTemplateModal.value = true
  templateAction.value = action
  templateDate.value = {...selectedDate.value}
  templateDate.value.month = parseInt(templateDate.value.month) - 1
}

const manageTemplate = async () => {
  loadingTemplate.value = true
  const date = dayjs(templateDate.value).format('YYYY-MM')
  templateAction.value === 'upload'
    ? await store.uploadTemplate(date, fileToUpload.value)
    : await store.downloadTemplate(date)
  if(templateAction.value === 'upload') {
    table.value.reload()
    updateViewHeader()
  }
  loadingTemplate.value = false
  manageTemplateModal.value = false
}

</script>