<template>
  <BaseTable
    :headers="computedHeaders"
    :data="commitmentSupplier"
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
      <p class="my-2">{{ item.input_product ? item.input_product.name : '' }}</p>
    </template>
    <template #provider="{ item }">
      {{ item.provider ? item.provider.name : '' }}
    </template>
    <template #carrier="{ item }">
      {{ item.carrier ? item.carrier.name : '' }}
    </template>
    <template #plant="{ item }">
      {{ item.plant ? item.plant.name : '' }}
    </template>
    <template #trips_pending="{ item }">
      {{ (item.trips - item.trips_done) < 0 ? 0 : (item.trips - item.trips_done) }}
    </template>
  </BaseTable>
  <ManageNationals
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
let commitmentSupplier = ref([])
let currentItem = reactive({})
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const crudModal = ref(false)
const formType = ref('add')
const store = useCommitedProviderTripsStore()
const emit = defineEmits(['closeModal'])
const IS_INTERNATIONAL = false

const computedHeaders = computed(() => {
  const headers = [
    { text: 'Producto', value: 'input_product' },
    { text: 'Transportista', value: 'carrier' },
    { text: 'Proveedor', value: 'provider' },
    { text: 'Planta destino', value: 'plant' },
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
    headers[4] = { text: 'Enviados', value: 'trips_done'}
    headers[5] = { text: 'Comprometidos', value: 'trips'}
    headers[6] = { text: 'Pendientes', value: 'trips_pending'}
    headers[7] = { text: '', value: ''}
  }
  return headers
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
  await store.getCommitedProviderTripsList(page, props.selectedDate, IS_INTERNATIONAL)
  commitmentSupplier.value = store.commitedProviderTripsList.results
  totalCount.value = store.commitedProviderTripsList.count
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
