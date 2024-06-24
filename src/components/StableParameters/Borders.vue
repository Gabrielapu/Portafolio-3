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
        <BaseTable
          :headers="headers"
          :data="crossings"
          :loading="loading"
          paginated
          :items-per-page="8"
          :items-amount="totalCount"
          :current-page="currentPage"
          hide-duplicate-button
          @change-page="changePage"
          @toogle-delete-modal="rowData => deleteRow(rowData)"
          @toogle-edit-modal="rowData => editRow(rowData)"
        >
          <template #crossing_provider_routes="{ item }">
            <div class="text-xs" v-if="!item.crossing_provider_routes.length"> Sin rutas </div>
            <Popper v-else arrow>
              <div class="full-center my-2">
                {{ item.crossing_provider_routes.length }}
                <BaseIcon class="ml-1 cursor-pointer" name="uil:exclamation-circle" />
              </div>
              <template #content>
                <div class="w-full">
                  <BaseTable
                    :headers="[
                      { text: 'Nombre', value: 'provider_name'},
                      { text: 'Tiempo de viaje (Días)&nbsp&nbsp', value: 'travel_time'}
                    ]"
                    :data="[...item.crossing_provider_routes]"
                    fit-content
                    hide-duplicate-button
                    hide-edit-button
                    hide-delete-button
                  />
                </div>
              </template>
            </Popper>
          </template>
          <template #crossing_plant_routes="{ item }">
            <div class="text-xs" v-if="!item.crossing_plant_routes.length"> Sin rutas </div>
            <Popper v-else arrow>
              <div class="full-center">
                {{ item.crossing_plant_routes.length }}
                <BaseIcon class="ml-1 cursor-pointer" name="uil:exclamation-circle" />
              </div>
              <template #content>
                <div class="w-full">
                  <BaseTable
                    :headers="[
                      { text: 'Nombre', value: 'plant_name'},
                      { text: 'Tiempo de viaje (Días)&nbsp&nbsp', value: 'travel_time'}
                    ]"
                    :data="[...item.crossing_plant_routes]"
                    fit-content
                    hide-duplicate-button
                    hide-edit-button
                    hide-delete-button
                  />
                </div>
              </template>
            </Popper>
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
  />
</template>

<script setup>
const emit = defineEmits(['reload'])
const loadingTemplate = ref(false)
const fileToUpload = ref(null)
const templateAction = ref(null)
const manageTemplateModal = ref(false)
let crossings = reactive([])
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const store = useBorderCrossingsStore()
const parametersStore = useParametersStore()
const PAGE_SIZE = 8
const headers = [
  { text: 'Paso fronterizo', value: 'name' },
  { text: 'Proveedor', value: 'crossing_provider_routes' },
  { text: 'Planta', value: 'crossing_plant_routes' },
]

const FIRST_PAGE = 1
onMounted(() => {
  requestItems(FIRST_PAGE)
  updateViewHeader()
})

const openTemplateModal = (action) => {
  manageTemplateModal.value = true
  templateAction.value = action
}

const getSubtitle = computed(() => {
	return parametersStore.lastUpdatedFile?.filename !== ''
		? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - 
		Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
		: 'No se han cargado plantillas'
})
const updateViewHeader = async() => {
	await parametersStore.getLastUpdatedTemplate("pasos_fronterizos_estables")
}
const requestItems = async (page = 1) => {
  loading.value = true
  crossings = []
  await store.getBorderCrossingsList(page, PAGE_SIZE);
  crossings = [...store.borderCrossingsList.results]
  totalCount.value = store.borderCrossingsList.count
  loading.value = false
}

const changePage = (page) => {
  currentPage.value = page
  requestItems(page)
}

const getButtonStatus = computed(() => {
  return templateAction.value === 'upload' 
    ? !fileToUpload.value
    : false
})

const manageTemplate = async () => {
  loadingTemplate.value = true
  templateAction.value === 'upload'
    ? await store.uploadStableBorderCrossingTemplate(fileToUpload.value)
    : await store.downloadStableBorderCrossingTemplate()
  if(templateAction.value === 'upload') {
    updateViewHeader()
    emit('reload')
  }
  loadingTemplate.value = false
  manageTemplateModal.value = false
}

defineExpose({ requestItems });
</script>