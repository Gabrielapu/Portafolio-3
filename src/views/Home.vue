<template>
  <div>
    <BaseHeader title="Plan de abastecimiento" subtitle="Resumen del plan de abastecimiento" />
    <Section>
      <template #content>
        <div class="flex items-center justify-end">
          <div class="flex justify-end w-1/3">
            <Select 
              v-if="selectedPlant" 
              class="mb-3 mr-3" 
              v-model="selectedPlant" 
              :options="selectPlantList"
              @change="setFilters()" 
            />
            <MonthSelector 
              class="mb-3" 
              @queryDate="({ month, year }) => setFilters(`${year}-${month}`)" 
            />
          </div>
        </div>
        <Card v-show="!hasData && !loading" class="h-60">
          <template #default>
            <div class="w-full text-center text-xl">
              No hay datos
            </div>
          </template>
        </Card>
        <div class="animate-pulse" v-if="loading">
          <div class="h-4 bg-gray-200 mt-3 mb-6 rounded"></div>
          <div class="h-4 bg-gray-300 mb-6 rounded"></div>
          <div class="h-4 bg-gray-200 mb-6 rounded"></div>
          <div class="h-4 bg-gray-300 mb-6 rounded"></div>
        </div>
        <template v-else>
          <!-- Cargas proveedores y transferencias -->
          <BaseTable 
            v-show="loadsOfficial.data?.length" 
            class="mb-5" 
            :headers="loadsOfficial.headers"
            :data="loadsOfficial.data" 
            :table-title="loadsOfficial.title" 
            fit-content 
            horizontal-scroll 
          />
          <!-- Llegadas -->
          <BaseTable 
            v-show="arrivalsOfficial.data?.length" 
            class="mb-5" 
            :headers="arrivalsOfficial.headers"
            :data="arrivalsOfficial.data" 
            :table-title="arrivalsOfficial.title" 
            fit-content 
            horizontal-scroll 
          />
          <!-- Descargas -->
          <BaseTable 
            v-show="downloadsOfficial.data?.length" 
            class="mb-5" 
            :headers="downloadsOfficial.headers"
            :data="downloadsOfficial.data" 
            :table-title="downloadsOfficial.title" 
            fit-content 
            horizontal-scroll
          />
          <!-- 'Abastecimiento por ducto' -->
          <BaseTable 
            v-show="ductsOfficial.data?.length" 
            class="mb-5" 
            :headers="ductsOfficial.headers"
            :data="ductsOfficial.data" 
            :table-title="ductsOfficial.title" 
            fit-content 
            horizontal-scroll 
          />
          <!-- 'Cargas para transferencias' -->
          <BaseTable 
            v-show="outgoingOfficial.data?.length" 
            :headers="outgoingOfficial.headers"
            :data="outgoingOfficial.data" 
            :table-title="outgoingOfficial.title" 
            fit-content 
            horizontal-scroll 
          />
        </template>
      </template>
    </Section>
  </div>
</template>

<script setup>
const filters = reactive({
  plant: null,
  date: null
})
const dayjs = inject('dayjs');
const loading = ref(false)
const hasData = ref(false)
const selectPlantList = ref([])
const loadsOfficial = ref({})
const arrivalsOfficial = ref({})
const downloadsOfficial = ref({})
const ductsOfficial = ref({})
const outgoingOfficial = ref({})
const selectedPlant = ref("")

const supplyStore = useSupplyPlanStore()
const plantStore = usePlantsStore()

onBeforeMount(async () => {
  await plantStore.getPlantsSimpleList();
  selectPlantList.value = plantStore.simplePlants
  selectedPlant.value = selectPlantList.value[0].id

  const month = dayjs().month()
  const year = dayjs().year()
  const { date } = useFormatMonthWith0({ year, month })

  setFilters(date)

  loading.value = false
})

const setSupplyData = async (plantId, date) => {
  loading.value = true
  await supplyStore.getSupplyPlanResults(plantId, date);
  loadsOfficial.value = supplyStore.loadsOfficial
  arrivalsOfficial.value = supplyStore.arrivalsOfficial
  downloadsOfficial.value = supplyStore.downloadsOfficial
  ductsOfficial.value = supplyStore.ductsOfficial
  outgoingOfficial.value = supplyStore.outgoingOfficial
  hasData.value = supplyStore.hasData
  loading.value = false
}

const setFilters = async (date) => {
  filters.date = date || filters.date
  filters.plant = selectedPlant.value
  if (filters.date && filters.plant) {
    await setSupplyData(filters.plant, filters.date)
  }
}
</script>