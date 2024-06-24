<template>
  <ViewHeader 
    title="Plan de escenario" 
    :subtitle="`Escenarios ID: ${scenarioId}`"
    :subtitle2="`Fecha de inicio: ${initialDate.format('DD/MM/YYYY')} - Fecha de término: ${endDate.format('DD/MM/YYYY')}`"
    hide-upload-template-button 
    hide-new-item-button 
    download-label="PUBLICAR COMO PLAN DE ABASTECIMIENTO"
    :loading-download="publishing" 
    :disabled-download="publishing || store.isOfficial" 
    @openModal="publishAsSupplyPlan"
  >
    <template #badge>
      <Badge 
        v-if="store.isOfficial" 
        :icon="scenarioStatus.Official.icon" 
        :icon-classes="scenarioStatus.Official.classes"
        iconSize="md" 
        size="sm" 
        :color="scenarioStatus.Official.color" 
        :text="scenarioStatus.Official.text" 
      />
    </template>
  </ViewHeader>
  <Section>
    <template #content>
      <div class="flex items-center justify-end">
        <div class="w-1/5">
          <Select 
            v-if="!loading" 
            class="mb-3" 
            v-model="plant" 
            :options="plantList" 
            @change="requestItems(plant)" 
          />
        </div>
      </div>
      <div class="animate-pulse" v-if="loading">
        <div class="h-4 bg-gray-200 mt-3 mb-6 rounded"></div>
        <div class="h-4 bg-gray-300 mb-6 rounded"></div>
        <div class="h-4 bg-gray-200 mb-6 rounded"></div>
        <div class="h-4 bg-gray-300 mb-6 rounded"></div>
      </div>
      <template v-else>
        <!-- Inventario -->
        <BaseTable 
          v-if="inventoryData" 
          class="mb-5" 
          :table-title="inventoryTitle" 
          :headers="inventoryHeader"
          :data="inventoryData" 
          :loading="loading" 
          hide-duplicate-button 
          horizontal-scroll 
          fit-content 
        />
        <!-- Cargas -->
        <BaseTable 
          v-if="loadsData" 
          class="mb-5" 
          :table-title="loadsTitle" 
          :headers="loadsHeader" 
          :data="loadsData"
          :loading="loading" 
          hide-duplicate-button 
          horizontal-scroll 
          fit-content 
        />
        <!-- Descargas -->
        <BaseTable 
          v-if="downloadsData" 
          class="mb-5" 
          :table-title="downloadsTitle" 
          :headers="downloadsHeader"
          :data="downloadsData" 
          :loading="loading" 
          hide-duplicate-button 
          horizontal-scroll 
          fit-content 
        />
        <!-- Llegadas -->
        <BaseTable 
          v-if="arrivalsData" 
          class="mb-5"  
          :table-title="arrivalsTitle" 
          :headers="arrivalsHeader" 
          :data="arrivalsData"
          :loading="loading" 
          hide-duplicate-button 
          horizontal-scroll 
          fit-content 
        />
        <!-- Uso material -->
        <BaseTable 
          v-if="generalUsageData" 
          class="mb-5" 
          :table-title="generalUsageTitle" 
          :headers="generalUsageHeader"
          :data="generalUsageData" 
          :loading="loading" 
          hide-duplicate-button 
          horizontal-scroll 
          fit-content 
        />
        <!-- Producción -->
        <BaseTable 
          v-if="productionData" 
          :table-title="productionTitle" 
          :headers="productionHeader" 
          :data="productionData"
          :loading="loading" 
          hide-duplicate-button 
          horizontal-scroll 
          fit-content 
        />
      </template>
    </template>
  </Section>
</template>

<script setup>
const route = useRoute()
const plantList = ref([])
const scenarioId = route.params.scenario_id
const loading = ref(true)
const publishing = ref(false)
const plant = ref(null)
const store = useScenarioStore()
const scenarioStatus = useScenarioStatus()
let scenario = reactive({});
const dayjs = inject("dayjs");
let scenarioPlanList = ref([])

let inventoryTitle = ref("")
let inventoryHeader = ref([])
let inventoryData = ref([])

let loadsTitle = ref("")
let loadsHeader = ref([])
let loadsData = ref([])

let downloadsTitle = ref("")
let downloadsHeader = ref([])
let downloadsData = ref([])

let arrivalsTitle = ref("")
let arrivalsHeader = ref([])
let arrivalsData = ref([])

let generalUsageTitle = ref("")
let generalUsageHeader = ref([])
let generalUsageData = ref([])

let productionTitle = ref("")
let productionHeader = ref([])
let productionData = ref([])

let initialDate = dayjs();
let endDate = dayjs();

onMounted(async () => {
  await store.getPlantList(scenarioId)
  plantList.value = store.plantList
  plant.value = plantList.value[0].id
  loading.value = false
  requestItems()
})

const requestItems = async () => {
  loading.value = true
  await store.getScenario(scenarioId)
  scenario = { ...store.scenario }
  let status = await store.getScenarioPlanList(scenarioId, plant.value)
  loading.value = !(status !== 200)
  scenarioPlanList = store.scenarioPlanList

  // Datos de inventarios totales
  if (scenarioPlanList.inventories) {
    inventoryHeader = scenarioPlanList.inventories[0].headers
    inventoryData = scenarioPlanList.inventories[0].data[0].products
    inventoryData.push(scenarioPlanList.inventories[0].data[0].totals[0])
    inventoryData.push(scenarioPlanList.inventories[0].data[0].capacities[0])
    inventoryTitle = scenarioPlanList.inventories[0].title
  }
  // Datos de cargas
  if (scenarioPlanList.loads) {
    loadsHeader = scenarioPlanList.loads[0].headers
    loadsData = scenarioPlanList.loads[0].data
    loadsTitle = scenarioPlanList.loads[0].title
  }
  // Datos de descargas
  if (scenarioPlanList.downloads) {
    downloadsHeader = scenarioPlanList.downloads[0].headers
    downloadsData = scenarioPlanList.downloads[0].data
    downloadsTitle = scenarioPlanList.downloads[0].title
  }
  // Datos de llegadas
  if (scenarioPlanList.arrivals) {
    arrivalsHeader = scenarioPlanList.arrivals[0].headers
    arrivalsData = scenarioPlanList.arrivals[0].data
    arrivalsTitle = scenarioPlanList.arrivals[0].title
  }
  // // Datos de Uso material
  if (scenarioPlanList.general_usage) {
    generalUsageHeader = scenarioPlanList.general_usage[0].headers
    generalUsageData = scenarioPlanList.general_usage[0].data
    generalUsageTitle = scenarioPlanList.general_usage[0].title
  }
  // // Datos de Producción
  if (scenarioPlanList.production) {
    productionHeader = scenarioPlanList.production[0].headers
    productionData = scenarioPlanList.production[0].data
    productionTitle = scenarioPlanList.production[0].title
  }
  // Datos de Utilización de producto
  if (scenarioPlanList.arrivals) {
    arrivalsHeader = scenarioPlanList.arrivals[0].headers
    arrivalsData = scenarioPlanList.arrivals[0].data
    arrivalsTitle = scenarioPlanList.arrivals[0].title
  }
  // Datos de Uso material
  if (scenarioPlanList.general_usage) {
    generalUsageHeader = scenarioPlanList.general_usage[0].headers
    generalUsageData = scenarioPlanList.general_usage[0].data
    generalUsageTitle = scenarioPlanList.general_usage[0].title
  }
  // // Datos de Producción
  if (scenarioPlanList.production) {
    productionHeader = scenarioPlanList.production[0].headers
    productionData = scenarioPlanList.production[0].data
    productionTitle = scenarioPlanList.production[0].title
  }
  initialDate = dayjs(scenario.initial_date);
  endDate = initialDate.add(scenario.duration, "days");
  loading.value = false
}

const publishAsSupplyPlan = async () => {
  publishing.value = true
  await store.publishAsPlan({ "scenario": scenarioId })
  await store.getScenario(scenarioId)
  scenario = { ...store.scenario }
  publishing.value = false
}
</script>