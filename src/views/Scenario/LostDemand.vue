<template>
  <ViewHeader 
    :title="`Resultados escenarios ID: ${scenarioId}`" 
    subtitle="Resultados del escenario" 
    hide-new-item-button
    hide-upload-template-button
    download-label="Descargar resumen"
    @openModal="store.downloadResume(scenarioId)"
  />
  <div>
    <Section>   
      <template #content>
        <BaseTable
        :headers="unfulfilledDemandData.headers"
        :loading="loading"
        :data="unfulfilledDemandData.data"
        hide-duplicate-button
        horizontal-scroll
        />      
      </template>   
    </Section>
  </div>
</template>

<script setup>
const route = useRoute()
const scenarioId = route.params.scenario_id
const store = useScenarioStore()
let unfulfilledDemandData = ref([])
const  loading = ref(false)

onMounted(() => {
  requestItems()
})
const requestItems = async () => {
  loading.value = true
  unfulfilledDemandData = []
  await store.getUnfulfilledDemandResults(scenarioId)
  unfulfilledDemandData = store.unfulfilledDemandResults.results
  loading.value = false
}
</script>