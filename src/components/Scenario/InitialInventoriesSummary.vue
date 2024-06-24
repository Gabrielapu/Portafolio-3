<template>
  <BaseHeader title="Inventarios Iniciales"/>
  <BaseTable
    :headers="headers"
    :data="demands"
    :loading="loading"
    paginated
    :items-per-page="8"
    :items-amount="totalCount"
    :current-page="currentPage"
    @change-page="changePage"
  />
</template>

<script setup>
let totalCount = ref(0)
const currentPage = ref(1)
const loading = ref(false)
const route = useRoute()
const store = useScenarioStore()
const demands = ref([])
const headers = ref([])

onMounted(() => {
  requestItems()
})

const changePage = (page) => {
  currentPage.value = page
  requestItems(page)
}

const requestItems = async () => {
  loading.value = true
  await store.getScenarioInitialInventories(
    route.params.scenario_id, 
    currentPage.value
  )
  totalCount.value = store.scenarioInitialInventories.count
  demands.value = store.scenarioInitialInventories.results.data
  headers.value = store.scenarioInitialInventories.results.headers
  loading.value = false
}
</script>