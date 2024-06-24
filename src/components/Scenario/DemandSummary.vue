<template>
  <BaseHeader title="Demanda"/>
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
  await store.getScenarioDemands(
    route.params.scenario_id, 
    currentPage.value
  )
  totalCount.value = store.scenarioDemands.count
  demands.value = store.scenarioDemands.results.data
  headers.value = store.scenarioDemands.results.headers
  loading.value = false
}
</script>