<template>
  <BaseTable
    :headers="computedHeaders"
    :data="commitmentPipelineSupply"
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
    <template #input_product="{ item }">
      <p class="my-2"> {{ item.input_product.name }} </p>
    </template>
    <template #provider="{ item }">
      {{ item.provider.name }}
    </template>
    <template #plant="{ item }">
      {{ item.plant.name }}
    </template>
    <template #tons_pending="{ item }">
      {{ (item.tons - item.tons_sent) < 0 ? 0 : (item.tons - item.tons_sent) }}
    </template>
  </BaseTable>
  <ManagePipelineSupply
    v-if="crudModal" 
    v-model="crudModal" 
    :item="currentItem"
    :type="formType" 
    :selected-date="selectedDate"
    @reload="reload"
    @close="emit('closeModal')"
  />
</template>

<script setup>

const props = defineProps({
  selectedDate: { type: Object, default: '' },
  showCreate: { type: Boolean, default: false },
  showProgress: { type: Boolean, default: false },
})
const emit = defineEmits(['closeModal'])
let commitmentPipelineSupply = ref([])
let currentItem = reactive({})
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const crudModal = ref(false)
const formType = ref('add')
const store = useCommitedPipelineSuppliesStore()
const computedHeaders = computed(() => {
  let headers = [
    { text: 'Producto', value: 'input_product' },
    { text: 'Proveedor', value: 'provider' },
    { text: 'Planta', value: 'plant' },
    { text: 'Toneladas', value: 'tons' },
    { 
      text: 'Holgura inferior', 
      value: 'lower_clearance', 
      icon: 'uil:info-circle', 
      popperMessage: `Da flexibilidad para enviar menos toneladas. Ejemplo, 
        si se tienen que enviar 100 toneladas mensuales y hay una holgura inferior 
        de 20 toneladas, el modelo buscará enviar al menos 80 toneladas.`
    },
    { 
      text: 'Holgura superior', 
      value: 'upper_clearance', 
      icon: 'uil:info-circle', 
      popperMessage: `Da flexibilidad para enviar más toneladas. Ejemplo,  
        si se tienen que enviar 100 toneladas mensuales y hay una holgura superior 
        de 20 toneladas, el modelo buscará enviar un máximo de 120 toneladas.`
  },
    { text: 'Acciones', value: 'actions' },
  ]
  if (props.showProgress) {
    headers[3] = { text: 'Enviados', value: 'tons_sent'}
    headers[4] = { text: 'Comprometidos', value: 'tons'}
    headers[5] = { text: 'Pendientes', value: 'tons_pending'}
    headers[6] = { text: '', value: ''}
  }
  return headers;
})

watch(() => props.selectedDate, (date) => {
  const FIRST_PAGE = 1
  requestItems(FIRST_PAGE, date)
})
watch(() => props.showCreate, (newValue) => {
  if (newValue) {
    crudModal.value = newValue
    formType.value = 'add'
  }
})

const requestItems = async (page) => {
  loading.value = true
  await store.getCommitedPipelineSupplysList(page, props.selectedDate)
  commitmentPipelineSupply.value = store.commitedPipelineSuppliesList.results
  totalCount.value = store.commitedPipelineSuppliesList.count
  loading.value = false
}

const changePage = (page) => {
  currentPage.value = page
  requestItems(page, props.selectedDate)
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

defineExpose({ reload });
</script>