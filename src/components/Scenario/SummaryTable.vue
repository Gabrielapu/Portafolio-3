<template>
  <BaseTable
    :headers="computedHeaders"
    :data="data"
    :loading="loading"
    hide-duplicate-button
  >
  </BaseTable>
</template>

<script setup>
  const props = defineProps({
    type: {
      type: String,
      default: '',
      validator: (value) => 
        ['initialTrucks', 'cpt', 'international', 'national', 'transfers', 'pipelines']
        .includes(value)
    }
  })

let data = ref([])
const loading = ref(false)
const route = useRoute()
const store = useScenarioStore()

const methodNames = {
  'initialTrucks': 'getInitialTrucksResults',
  'cpt': 'getCptArivalResults',
  'international': 'getPurchasesInternationalResults',
  'national': 'getPurchasesNationalResults',
  'transfers': 'getTransfersResults',
  'pipelines': 'getPipelinesResults',
}
const dataNames = {
  'initialTrucks': 'initialTrucksResults',
  'cpt': 'cptArrivalResults',
  'international': 'purchasesResults',
  'national': 'purchasesResults',
  'transfers': 'transfersResults',
  'pipelines': 'pipelinesResults',
}

const commonHeaders = [
  { text: 'Destino', value: 'destination' },
  { text: 'Origen', value: 'source' },
  { text: 'Producto', value: 'product' },
]

const computedHeaders = computed(() => {  
  if (props.type === 'pipelines' ) {
    return [
      ...commonHeaders,
      { text: 'Ductos', value: 'total_tons' },
    ]
  }

  if (props.type === 'international' || props.type === 'initialTrucks') {
    return [
      ...commonHeaders,
      { text: 'Camiones', value: 'trucks' }, 
      { text: 'Paso Fronterizo', value: 'border_crossing' }
    ]
  }
  else if (props.type === 'cpt') {
    return [
      ...commonHeaders,
      { text: 'Camiones', value: 'trucks' },
      { text: 'Paso Fronterizo', value: 'border_crossing' }
    ]
    
  }
  else
    return [
      ...commonHeaders,
      { text: 'Camiones', value: 'trucks' },
      { text: 'Transportista', value: 'carrier' },
    ]

})

onMounted(() => {
  requestItems()
})

watch(() => props.type, async (newType) => {
  requestItems()
});

const requestItems = async () => {
  loading.value = true
  data = []
  await store[methodNames[props.type]](route.params.scenario_id)
  if (Array.isArray(store[dataNames[props.type]])) {
    data = store[dataNames[props.type]]
  }
  loading.value = false
}
</script>