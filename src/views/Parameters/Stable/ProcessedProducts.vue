<template>
  <ViewHeader 
    title="Productos elaborados" 
    :subtitle="getSubtitle" 
    new-item-label="Nuevo producto elaborado"
    hide-download-template-button
    hide-upload-template-button
    @newItem="addItem"
  />
  <div>
    <Section>
      <template #content>
        <BaseTable
          :headers="headers"
          :data="outputProducts"
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
          <template #possible_inputs="{ item }">
            <Popper arrow>
              <div class="full-center">
                {{ item.possible_inputs.length }}
                <BaseIcon class="ml-1 cursor-pointer" name="uil:exclamation-circle" />
              </div>
              <template #content>
                <div class="w-full">
                  <BaseTable
                    :headers="[{ text: 'Nombre', value: 'name'}]"
                    :data="[...item.possible_inputs]"
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
    <ManageProcessedProducts
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

let outputProducts = reactive([])
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const crudModal = ref(false)
let currentItem = reactive({})
const formType = ref('add')
const opStore = useOutputProductStore()
const parametersStore = useParametersStore()
const headers = [
  { text: 'Nombre', value: 'name' },
  { text: 'Tipo de producto', value: 'type_product' },
  { text: 'Posibles inputs', value: 'possible_inputs' },
  { text: 'Min. propano', value: 'min_propane' },
  { text: 'Max. propano', value: 'max_propane' },
  { text: 'Min. butano', value: 'min_butane' },
  { text: 'Max. butano', value: 'max_butane' },
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
  outputProducts = []
  await opStore.getOutputProductsList(page)
  outputProducts = [...opStore.outputProductsList.results]
  totalCount.value = opStore.outputProductsList.count
  loading.value = false
}

const changePage = (page) => {
  currentPage.value = page
  requestItems(page)
}

const reload = async () => {
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