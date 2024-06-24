<template>
  <ViewHeader 
    title="Proveedores" 
    :subtitle="getSubtitle" 
    new-item-label="Nuevo proveedor"
    hide-download-template-button
    hide-upload-template-button
    @newItem="addItem"
  />
  <div >
    <Section>
      <template #content>
        <BaseTable
          :headers="headers"
          :data="providers"
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
          <template #purchase_routes="{ item }">
            <div class="text-xs" v-if="!item.purchase_routes.length"> Sin rutas </div>
            <Popper v-else arrow>
              <div class="full-center">
                {{ item.purchase_routes.length }}
                <BaseIcon class="ml-1 cursor-pointer" name="uil:exclamation-circle" />
              </div>
              <template #content>
                <div class="w-full">
                  <BaseTable
                    :headers="[
                      { text: 'Plantas', value: 'name'}, 
                      { text: 'Tiempo de viaje (Días)&nbsp&nbsp', value: 'travel_time'}
                    ]"
                    :data="[...item.purchase_routes]"
                    fit-content
                    
                    hide-duplicate-button
                    hide-edit-button
                    hide-delete-button
                  />
                </div>
              </template>
            </Popper>
          </template> 
          
          <template #pipelines="{ item }">
            <div class="text-xs" v-if="!item.pipelines.length"> Sin ductos </div>
            <Popper v-else arrow>
              <div class="full-center">
                {{ item.pipelines.length }}
                <BaseIcon class="ml-1 cursor-pointer" name="uil:exclamation-circle" />
              </div>
              <template #content>
                <div class="w-full">
                  <BaseTable
                    :headers="[
                      { text: 'Ductos', value: 'name'},
                    ]"
                    :data="[...item.pipelines]"
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
    <ManageProviders
			v-if="crudModal" 
      v-model="crudModal" 
      :item="currentItem"
      :type="formType"
      @reload="reload"
      @close="crudModal = false"			
		/>
  </div>
</template>

<script setup>
const emit = defineEmits(['updateProviders'])
let providers = reactive([])
let currentItem = reactive({})
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const crudModal = ref(false)
const formType = ref('add')
const store = useProvidersStore()
const parametersStore = useParametersStore()
const headers = [
  { text: 'Nombre', value: 'name' },
  { text: 'Rutas', value: 'purchase_routes' },
  { text: 'Capacidad de carga (Camiones)', value: 'loading_capacity' },
  { text: 'Ductos', value: 'pipelines' },
  { text: 'Min. diario ducto (Tons.)', value: 'pipeline_minimum_daily' },
  { text: 'Max. diario ducto (Tons.)', value: 'pipeline_maximum_daily' },
  { text: 'Batch', value: 'batch_size' },
  { text: 'Acciones', value: 'actions' },
]

onMounted(() => {
  const FIRST_PAGE = 1
  requestItems(FIRST_PAGE)
  updateViewHeader()
})
const getSubtitle = computed(() => {
	return parametersStore.lastUpdatedFile?.filename !== ''
		? `Último archivo cargado: ${parametersStore.lastUpdatedFile?.filename} - 
		Fecha: ${parametersStore.lastUpdatedFile?.uploaded_at}`
		: 'No se han cargado plantillas'
})
const updateViewHeader = async() => {
	await parametersStore.getLastUpdatedTemplate("parametros_estables")
}

const requestItems = async (page) => {
  loading.value = true
  providers = []
  await store.getProvidersList(page)
  providers = [...store.providersList.results]
  totalCount.value = store.providersList.count
  loading.value = false
}
const requestCurrentPage = () => {
  requestItems(currentPage.value)
}
const changePage = (page) => {
  currentPage.value = page
  requestItems(page)
}

const reload = async () => {
  emit('updateProviders')
  await requestItems(currentPage.value)
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
defineExpose({ requestCurrentPage });
</script>