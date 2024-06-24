<template>
  <ViewHeader 
    title="Productos input" 
    :subtitle="getSubtitle" 
    new-item-label="Nuevo producto de input"
    hide-download-template-button
    hide-upload-template-button
    @newItem="addItem"
  />
  <div>
    <Section>
      <template #content>
        <BaseTable
          :headers="headers"
          :data="inputProducts"
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
          <template #type_product="{ item }">
            {{ item.type_product.name }}
          </template>
        </BaseTable>
      </template>
    </Section>
    <ManageInputProducts
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

let inputProducts = reactive([])
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const formType = ref('add')
const crudModal = ref(false)
let currentItem = reactive({})
const ipStore = useInputProductStore()
const parametersStore = useParametersStore()
const headers = [
  { text: 'Nombre', value: 'name' },
  { text: 'Tipo de producto', value: 'type_product' },
  { text: 'Porcentaje propano', value: 'propane_percentage' },
  { text: 'Porcentaje butano', value: 'butane_percentage' },
  { text: 'Densidad', value: 'density' },
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
  inputProducts = []
  await ipStore.getInputProductsList(page)
  inputProducts = [...ipStore.inputProductsList.results]
  totalCount.value = ipStore.inputProductsList.count
  loading.value = false
}

const changePage = (page) => {
  currentPage.value = page
  requestItems(page)
}

const reload = async () => {
  if (currentPage.value > 1 && inputProducts.length === 1 && formType.value === 'delete') {
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