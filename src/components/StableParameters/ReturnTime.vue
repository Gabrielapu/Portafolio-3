<template>
  <ViewHeader 
    title="Tiempo de regreso" 
    hide-download-template-button
    hide-upload-template-button
    hide-new-item-button
  >
    <template #filters>
      <CustomSelect
        v-if="!loading" 
        class="mr-1"
        v-model="selectedPlant" 
        :options="store.returnPlants"
        @update:model-value="requestItems(FIRST_PAGE)" 
      />
    </template>
  </ViewHeader>
  <div>
    <Section>
      <template #content>
        <BaseTable
          :headers="headers"
          :data="returnTimes"
          :loading="loading"
          paginated
          :items-per-page="8"
          :items-amount="totalCount"
          :current-page="currentPage"
          @change-page="changePage"
        />
      </template>
    </Section>
  </div>
</template>

<script setup>
let returnTimes = reactive([])
const selectedPlant = ref(null)
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const store = useBorderCrossingsStore()
const pStore = usePlantsStore()
const PAGE_SIZE = 8
const headers = [
  { text: 'Planta', value: 'plant_name' },
  { text: 'Paso fronterizo', value: 'border_crossing_name' },
  { text: 'Proveedor', value: 'provider_name' },
  { text: 'Tiempo de viaje (Días)', value: 'travel_time' },
]

const FIRST_PAGE = 1
onMounted(async () => {
  await store.getPlants()
  selectedPlant.value = store.returnPlants.length ? store.returnPlants[0]?.id : null
  await requestItems(FIRST_PAGE)
})

const requestItems = async (page = 1) => {
  loading.value = true
  returnTimes = []
  await store.getReturnTimes(selectedPlant.value, page, PAGE_SIZE);
  returnTimes = [...store.returnTimes.results]
  totalCount.value = store.returnTimes.count
  loading.value = false
}

const changePage = (page) => {
  currentPage.value = page
  requestItems(page)
}

defineExpose({ requestItems });
</script>