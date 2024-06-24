<template>
  <ViewHeader 
    title="Plantas" 
    :subtitle="getSubtitle" 
    new-item-label="Nueva planta"
    hide-download-template-button
    hide-upload-template-button
    @newItem="addItem"
  />
  <div>
    <Section>
      <template #content>
        <BaseTable
          :headers="headers"
          :data="plants"
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
          <template #can_load="{ item }">
            <Badge
              size="sm"
              :color="item.can_load ? 'positive' : 'danger'"
              :text="item.can_load ? 'Si' : 'No'"
              uppercase
            />
          </template>
          <template #butane_max_percentage="{ item }">
            <p>{{ `${item.butane_max_percentage}%` }}</p>
          </template>
          <template #desired_minimum_inventory="{ item }">
            <p>{{ `${item.desired_minimum_inventory}%` }}</p>
          </template>
          <template #operational_minimum_inventory="{ item }">
            <p>{{ `${item.operational_minimum_inventory}%` }}</p>
          </template>
          <template #transfer_routes="{ item }">
            <div class="text-xs" v-if="!item.transfer_routes.length"> Sin rutas </div>
            <Popper v-else arrow>
              <div class="full-center">
                {{ item.transfer_routes.length }}
                <BaseIcon class="ml-1 cursor-pointer" name="uil:exclamation-circle" />
              </div>
              <template #content>
                <div class="w-full">
                  <BaseTable
                    :headers="[
                      { text: 'Nombre', value: 'name'}, 
                      { text: 'Tiempo de viaje (Días)&nbsp&nbsp', value: 'travel_time'}
                    ]"
                    :data="[...item.transfer_routes]"
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
    <ManagePlants
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
const emit = defineEmits(['updatePlants'])
let plants = reactive([])
const crudModal = ref(false)
let currentItem = reactive({})
const formType = ref('add')
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const pStore = usePlantsStore()
const parametersStore = useParametersStore()
const headers = [
  { text: 'Nombre', value: 'name' },
  { text: 'Rutas de transferencia', value: 'transfer_routes' },
  { text: 'Capacidad de descarga', value: 'discharge_capacity' },
  { text: 'Puede cargar', value: 'can_load' },
  { text: 'Butano max.', value: 'butane_max_percentage' },
  { text: 'Inv. mínimo deseable', value: 'desired_minimum_inventory' },
  { text: 'Inv. mínimo operacional', value: 'operational_minimum_inventory' },
  { text: 'Acciones', value: 'actions' },
]

onMounted(() => {
  const FIRST_PAGE = 1
  requestItems(FIRST_PAGE)
  updateViewHeader()
})

const requestCurrentPage = () => {
  requestItems(currentPage.value)
}
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
  plants = []
  await pStore.getPlantsList(page)
  plants = [...pStore.plantsList.results]
  totalCount.value = pStore.plantsList.count
  loading.value = false
}

const changePage = (page) => {
  currentPage.value = page
  requestItems(page)
}

const reload = async () => {
  emit('updatePlants')
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