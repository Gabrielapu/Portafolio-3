<template>
  <ViewHeader 
    title="Transportistas" 
    :subtitle="getSubtitle" 
    new-item-label="Nuevo transportista"
    hide-download-template-button
    hide-upload-template-button
    @newItem="addItem"
  />
  <div>
    <Section>
      <template #content>
        <BaseTable
          :headers="headers"
          :data="carriers"
          paginated
          :loading="loading"
          :items-per-page="8"
          :items-amount="totalCount"
          :current-page="currentPage"
          hide-duplicate-button
          @change-page="changePage"
          @toogle-delete-modal="rowData => deleteRow(rowData)"
          @toogle-edit-modal="rowData => editRow(rowData)"
        >
          <template #truck_fixed_cost="{ item }">
            {{ `$${useThousandSeparator(item.truck_fixed_cost)}` }}
          </template>   
          <template #truck_waiting_cost="{ item }">
            {{ `$${useThousandSeparator(item.truck_waiting_cost)}` }}
          </template> 
        </BaseTable>
      </template>
    </Section>
    <ManageCarriers
      v-if="crudModal" 
      v-model="crudModal" 
      :item="currentItem"
      :type="formType"
      @reload="reload"
      @close="crudModal = false"
    />
    <DeleteModal
      v-model="deleteModal"
      :current-item="currentItem"
      label="transportista"
      :store-name="cStore"
      delete-method="deleteCarrier"
      @reload="reload"
    />
  </div>
</template>

<script setup>
import useThousandSeparator from '@/composables/useThousandSeparator'

let carriers = reactive([])
let currentItem = reactive({})
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const crudModal = ref(false)
const formType = ref('add')
const deleteModal = ref(false)
const cStore = useCarriersStore()
const parametersStore = useParametersStore()
const headers = [
  { text: 'Nombre', value: 'name' },
  { text: 'Camiones flota', value: 'fleet_trucks' },
  { text: 'Costo camión fijo', value: 'truck_fixed_cost' },
  { text: 'Costo espera camión', value: 'truck_waiting_cost' },
  { text: 'Acciones', value: 'actions' },
]

onMounted(() => {
  const FIRST_PAGE = 1
  requestItems(FIRST_PAGE)
  updateViewHeader()
})

const requestItems = async (page) => {
  loading.value = true
  carriers = []
  await cStore.getCarriersList(page)
  carriers = [...cStore.carriersList.results]
  totalCount.value = cStore.carriersList.count
  loading.value = false
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
const changePage = (page) => {
  currentPage.value = page
  requestItems(page)
}

const reload = async () => {
  if (currentPage.value > 1 && carriers.length === 1 && formType.value === 'delete') {
    currentPage.value -- 
  }
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
</script>