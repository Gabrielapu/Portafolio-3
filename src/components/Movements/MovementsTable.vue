<template>
  <BaseTable
    :headers="computedHeaders"
    :data="store.dispatchList.results"
    :loading="loading"
    hide-duplicate-button
    :items-per-page=8
    paginated
    :items-amount="totalCount"
    :current-page="currentPage"
    @change-page="changePage"
  >
    <template #border_crossing="{ item }">
      <p v-if="type === 'Importaciones'">{{ item.border_crossing?.name }}</p>
    </template>
    <template #carrier="{ item }">
      <p class="my-2">{{ item.carrier.name }}</p>
    </template>
    <template #input_product="{ item }">
      {{ item.input_product != null ? item.input_product?.name : item.elaborated_product?.name  }}
    </template>
    <template #destination_plant="{ item }">
      {{ item.destination_plant?.name }}
    </template>
    <template #loading_date="{ item }">
      {{ dayjs(item.loading_date).format('DD/MM/YYYY') }}
    </template>
    <template #estimated_arrival_date="{ item }">
      {{ dayjs(item.estimated_arrival_date).format('DD/MM/YYYY') }}
    </template>
  </BaseTable>
</template>

<script setup>
const props = defineProps({
  selectedMonth : {type : Object},
  type: {
    type: String,
    default: '',
    validator: (value) => ['Transferencia', 'Nacionales', 'Importaciones'].includes(value)
  }
})
const dayjs = inject('dayjs')
const FIRST_PAGE = 1
const loading = ref(false)
const store = useDispatchStore()
const totalCount = ref(0)
const currentPage = ref(1)
const PAGE_SIZE = 8
const types = {
  'Transferencia': { name: 'Transferencia' },
  'Nacionales': { name: 'Compra', international: false },
  'Importaciones': { name: 'Compra', international: true }
}
const importHeaders = [
  { text: 'Origen', value: 'origin_name'},
  { text: 'Pasos fronterizos', value: 'border_crossing'},
  { text: 'Planta', value: 'destination_plant'},
  { text: 'Producto', value: 'input_product'},
  { text: 'Transportista', value: 'carrier'},
  { text: 'Cantidad de camiones', value: 'truck_count'},
  { text: 'Fecha de carga', value: 'loading_date'},
  { text: 'Fecha estimada de llegada', value: 'estimated_arrival_date'},
]
const headers = [
  { text: 'Origen', value: 'origin_name'},
  { text: 'Planta', value: 'destination_plant'},
  { text: 'Producto', value: 'input_product'},
  { text: 'Transportista', value: 'carrier'},
  { text: 'Cantidad de camiones', value: 'truck_count'},
  { text: 'Fecha de carga', value: 'loading_date'},
  { text: 'Fecha estimada de llegada', value: 'estimated_arrival_date'},
]

watch(() => props.selectedMonth, () => {
  requestItems(FIRST_PAGE)
})

watch(() => props.type, () => {
  requestItems(FIRST_PAGE)
})

const computedHeaders = computed(() => {
  if(props.type === 'Importaciones'){
    return importHeaders
  }
  return headers
})

const requestItems = async (page) => {
  currentPage.value = page
  const year = props.selectedMonth.year
  const month = props.selectedMonth.month
  const origin = types[props.type].name
  const international = types[props.type].international
  loading.value = true
  await store.getDispatchList(page, PAGE_SIZE, month, year, origin, international)
  totalCount.value = store.dispatchList.count
  loading.value = false
}
const changePage = (page) => {
  requestItems(page)
}
const reload = () => {
  requestItems(FIRST_PAGE)
}
defineExpose({ reload });
</script>