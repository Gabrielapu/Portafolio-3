<template>
  <ViewHeader 
    :title="`Resultados escenarios ID: ${scenarioId}`" 
    subtitle="Resultados del escenario" 
    hide-new-item-button
    hide-upload-template-button
    download-label="Descargar resumen"
    @openModal="downloadResume()"
  />
  <Section>
    <template #content>
      <div class="flex items-center justify-between">
        <div class="full-center">
          <Button 
            label="Camiones iniciales" 
            color="primary"
            :text-only="activeTable !== 'initialTrucks'"
            :shadow="false"
            size="sm" 
            class="mr-1"
            @click.native="activeTable = 'initialTrucks'"
          />
          <Button 
            label="CPT" 
            color="primary" 
            :text-only="activeTable !== 'cpt'"
            :shadow="false"
            size="sm" 
            class="mr-1"
            @click.native="activeTable = 'cpt'"
          />
          <Button 
            label="Nacionales" 
            color="primary" 
            :text-only="activeTable !== 'national'"
            :shadow="false"
            size="sm" 
            class="mr-1"
            @click.native="activeTable = 'national'"
          />
          <Button 
            label="Importaciones" 
            color="primary" 
            :text-only="activeTable !== 'international'"
            :shadow="false"
            size="sm" 
            class="mr-1"
            @click.native="activeTable = 'international'"
          />
          <Button 
            label="Transferencias" 
            color="primary" 
            :text-only="activeTable !== 'transfers'"
            :shadow="false"
            size="sm" 
            class="mr-1"
            @click.native="activeTable = 'transfers'"
          />
          <Button 
            label="Ductos" 
            color="primary" 
            :text-only="activeTable !== 'pipelines'"
            :shadow="false"
            size="sm" 
            @click.native="activeTable = 'pipelines'"
          />
        </div>
      </div>
      <div class="mt-4">
        <SummaryTable :type="activeTable" />        
      </div>
    </template>
  </Section>
</template>

<script setup>
const route = useRoute()
const activeTable = ref('initialTrucks')
const scenarioId = route.params.scenario_id
const store = useScenarioStore()

const downloadResume = () => {
  store.downloadResume(scenarioId)
}

</script>