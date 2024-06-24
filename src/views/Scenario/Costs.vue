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
          :headers="headers"
          :data="store.costsResults"
          :loading="loading"
          hide-duplicate-button
        >
        </BaseTable>
      </template>   
    </Section>
  </div>
</template>

<script setup>
const route = useRoute()
const loading = ref(true)
const scenarioId = route.params.scenario_id
const store = useScenarioStore()

const headers = [
  { text: 'Costo', value: 'cost' },
  { text: 'Valor', value: 'value' },
]
const requestItems = async () => {
  loading.value = true
  await store.getCostsResults(scenarioId)
  loading.value = false
}
onMounted(() => {
  requestItems()
})
</script>