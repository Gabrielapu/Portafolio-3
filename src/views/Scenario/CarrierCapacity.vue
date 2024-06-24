<template>
  <ViewHeader 
    :title="`Resultados escenarios ID: ${scenarioId}`" 
    subtitle="Resultados del escenario" 
    hide-new-item-button
    hide-upload-template-button 
    download-label="Descargar resumen" 
    @openModal="store.downloadResume(scenarioId)" 
  />
  <Section>
    <template #content>
      <div class="flex items-center justify-end">
        <div class="w-1/4">
          <Select 
            v-if="!loading" 
            class="mb-3" 
            v-model="selectedCarrier" 
            :options="simpleCarrierList"
            @change="requestItems(currentPage, selectedCarrier)"
          />
        </div>
      </div>
      <Card class="flex flex-col">
        <div class="flex justify-end font-semibold">
          Máximo de camiones de transportista: {{ maxTrucks }}
        </div>
        <div v-if="!loading" class="w-full">
          <apexchart 
            height="350px" 
            width="100%" 
            type="line" 
            :options="options" 
            :series="series"
          >
          </apexchart>
        </div>
        <Spinner v-else />
      </Card>
    </template>
  </Section>
</template>

<script setup>
const route = useRoute()
const simpleCarrierList = ref([])
const scenarioId = route.params.scenario_id
const loading = ref(true)
const selectedCarrier = ref(null)
const store = useScenarioStore()
const maxTrucks = ref(null)

const options = ref({
  chart: {
    zoom: {
      enabled: false
    },
    toolbar: {
      show: false,
    }
  },
  yaxis: {
    title: {
      text: 'Cantidad de camiones',
    },
  },
  xaxis: {
    categories: ["L", "M"],
    title: {
      text: 'Periodo',
    },
  },
  noData: {
    text: 'No hay datos disponibles'
  },
  stroke: {
    curve: 'smooth',
    width: [3],
  },
  markers: {
    size: [5],
  }
})
const series = ref([
  {
    name: "Cantidad de camiones",
    data: []
  }
])

onMounted(async () => {
  await store.getCarriers(scenarioId)
  simpleCarrierList.value = store.carriers.results
  selectedCarrier.value = simpleCarrierList.value[0].id
  loading.value = false
  requestItems()
})

const requestItems = async () => {
  loading.value = true
  await store.getCarrierCapacityResults(scenarioId, selectedCarrier.value)
  series.value[0].data = store.carrierCapacityResults.results.data.cantidades
  options.value.xaxis.categories = store.carrierCapacityResults.results.dates
  maxTrucks.value = store.carrierCapacityResults.results.maximum_of_trucks_of_carriers
  loading.value = false
}
</script>