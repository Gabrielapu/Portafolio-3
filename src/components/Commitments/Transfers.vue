<template>
  <BaseTable
    :headers="computedHeaders"
    :data="commitmentTransfer"
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
    <template #carrier="{ item }">
      {{ item.carrier ? item.carrier.name : '' }}
    </template>
    <template #elaborated_product="{ item }">
      <span v-if="item.is_input">
        {{ item.input_product.name }}
      </span>
      <span v-else>
        {{ item.elaborated_product.name }}
      </span>
    </template>
    <template #origin_plant="{ item }">
      {{ item.origin_plant ? item.origin_plant.name : '' }}
    </template>
    <template #destination_plant="{ item }">
      {{ item.destination_plant ? item.destination_plant.name : '' }}
    </template>
    <template #trips_pending="{ item }">
      {{ (item.trips - item.trips_done) < 0 ? 0 : (item.trips - item.trips_done) }}
    </template>
  </BaseTable>
  <ManageTransfers 
    v-if="crudModal" 
    v-model="crudModal" 
    :item="currentItem"
    :type="formType" 
    :selected-date = selectedDate
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
const FIRST_PAGE = 1
let commitmentTransfer = ref([])
let currentItem = reactive({})
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const crudModal = ref(false)
const formType = ref('add')
const emit = defineEmits(['closeModal'])
const store = useCommitedTransferTripsStore()

const computedHeaders = computed(() => {
  let headers = [
    { text: 'Tipo de producto', value: 'product_type' },
    { text: 'Producto', value: 'elaborated_product' },
    { text: 'Transportista', value: 'carrier' },
    { text: 'Planta origen', value: 'origin_plant' },
    { text: 'Planta destino', value: 'destination_plant' },
    { text: 'Viajes', value: 'trips' },
    { 
      text: 'Holgura inferior', 
      value: 'lower_clearance', 
      icon: 'uil:info-circle', 
      popperMessage: `Da flexibilidad para enviar menos camiones. Ejemplo, 
        si se tienen que cumplir 10 viajes mensuales y hay una holgura inferior de 
        2 viajes, el modelo buscará cumplir con al menos 8 viajes.`
    },
    { 
      text: 'Holgura superior', 
      value: 'upper_clearance', 
      icon: 'uil:info-circle', 
      popperMessage: `Da flexibilidad para enviar más camiones. Ejemplo, 
        si se tienen que cumplir 10 viajes mensuales y hay una holgura superior de 
        2 viajes, el modelo buscará cumplir con un máximo de 12 viajes`
    },
    { text: 'Acciones', value: 'actions' },
  ]
  if (props.showProgress) {
    headers[5] = { text: 'Enviados', value: 'trips_done'}
    headers[6] = { text: 'Comprometidos', value: 'trips'}
    headers[7] = { text: 'Pendientes', value: 'trips_pending'}
  }
  return headers;
})

watch(() => props.selectedDate, (date) => {
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
  currentPage.value = page
  await store.getCommitedTransferTripsList(page, props.selectedDate)
  commitmentTransfer.value = store.commitedTransferTripsList.results
  totalCount.value = store.commitedTransferTripsList.count
  loading.value = false
}

const changePage = (page) => {
  requestItems(page, props.selectedDate)
}

const reload = async () => {
  await requestItems(FIRST_PAGE)
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