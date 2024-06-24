<template>
  <div v-if="loading">
    <Spinner />
  </div>
  <div v-else >
    <ViewHeader 
      :title="`Escenario ID: ${scenarioId}`"
      :subtitle="scenarioStore.scenario.status" 
      new-item-label="Ejecutar Escenario"
      new-item-icon="uil:play"
      hide-download-template-button
      hide-upload-template-button
      :loading-new-item="loadingNewItem || !!timer"
      :disable-new-item-button="scenarioStore.scenario.status !== 'Pendiente de ejecución' || !!timer"
      @newItem="executeScenario()"
    />
    <div class="my-8">
    <Card>
      <div class="text-md w-full">
        <p class="py-1"> Descripción de escenario </p>
          <InputValidateField 
            class="text-slate-400" 
            v-model="scenarioStore.scenario.description"
            placeholder-text="Descripción del escenario"  
          />
        <div class="font-medium pt-2">
        <span class="text-default-600 font-semibold text-xs mr-5">
          Fecha inicial:
          <span class="text-default-400 font-normal">
          {{ dayjs(scenarioStore.scenario.initial_date).format('DD-MM-YYYY')}}
          </span>
        </span>
        <span class="text-default-800 text-xs mr-5">
          Duración:
          <span class="text-default-400 font-normal">
          {{ scenarioStore.scenario.duration}}
          </span>
        </span>
        <span class="text-default-600 text-xs">
          Tasa de cambio:
          <span class="text-default-400 font-normal">
          {{ scenarioStore.scenario.usd_rate }}
          </span>
        </span>
        </div>
        <Divider class="mt-4" />
        <div class="flex items-center justify-end mt-4">
        <div class="flex items-center"> 
          <Badge
            :icon="scenarioStatus[scenarioStore.scenario.status].icon"
            :icon-classes="scenarioStatus[scenarioStore.scenario.status].classes"
            iconSize="md"
            size="sm"
            :color="scenarioStatus[scenarioStore.scenario.status].color"
            :text="scenarioStatus[scenarioStore.scenario.status].text"
          />
          <Button v-if="scenarioStore.scenario.status === 'Infactible'"
            class="ml-4 mr-3" 
            size="sm"
            color="primary"                
            label="DESCARGAR RESTRICCIONES"
            icon="uil:download-alt"
            @click.native="downloadRestrictions()"
          />        
        </div>
        <Button
          class="ml-auto mr-3" 
          size="md"
          color="primary"                
          label="GUARDAR CAMBIOS"
          icon="uil:save"
          @click.native="saveScenarioChanges()"
        />
        <Button
          color="danger"
          size="md"
          label="ELIMINAR ESCENARIO"
          outlined                
          icon="uil:trash"
          @click.native="deleteScenarioModal = true"
        />
        </div>
      </div>
    </Card>
    <CommitmentsSummary />    
    <DemandSummary />
    <InitialInventoriesSummary />
    <DeleteModal
      v-model="deleteScenarioModal"
      :current-item="scenarioStore.scenario"
      label="escenario"
      :store-name="scenarioStore"
      delete-method="deleteScenario"
      @reload="$router.push('/scenarios')"
    />
    </div>
    <AlertCard
      v-if="false"
      size="sm"
      :color="'error'"
      :title="'Errores'"
      icon="bx:error-alt"
      :infolist="['Error 1', 'Error 2', 'Error 3: ']"
    />
    <AlertCard
      v-if="false"
      size="sm"
      :color="'alert'"
      :title="'Alertas'"
      icon="bx:error-alt"
      :infolist="['Alerta 1', 'Alerta 2', 'Alerta 3: ']"
    />
  </div>    
</template>  
<script setup>
const dayjs = inject('dayjs')
const route = useRoute()
let scenario = reactive({})
const loading = ref(true)
const loadingNewItem = ref(false)
const deleteScenarioModal = ref(false)
const scenarioId = route.params.scenario_id
const scenarioStore = useScenarioStore()
const timer = ref(null)
const scenarioStatus = useScenarioStatus()

onMounted(() => {
  requestScenario()
  if(!timer.value && scenarioStore.scenario.status === 'Ejecutando') {
    callStatus()
  }
})

watch(() => scenarioStore.scenario.status, () => {
  if((/Completado|Error|Infactible|Sin solución/).test(scenarioStore.scenario.status)) {
    clearTimer()
  }
}, { deep: true })

const requestScenario = async () => {
  loading.value = true
  await scenarioStore.getScenario(scenarioId)
  loading.value = false
}

const saveScenarioChanges = async () => {
  loading.value = true
  await scenarioStore.editScenario({
    id: scenarioId,
    description: scenarioStore.scenario.description,
    initial_date: scenarioStore.scenario.initial_date
  })
  loading.value = false
}

const downloadRestrictions = async () => {
  await scenarioStore.downloadRestrictions(scenarioId)
}

const executeScenario = async () => {
  loadingNewItem.value = true
  scenarioStore.execute(scenarioId)
  if(!timer.value) scenarioStore.getScenario(scenarioId)
  callStatus()
  loadingNewItem.value = false
}

const callStatus = () => {
  timer.value = setInterval(() => {
    scenarioStore.getScenario(scenarioId)
  }, 30000)
}

const clearTimer = () => {
  clearInterval(timer.value)
  timer.value = null
}

onUnmounted(() => {
  clearTimer()
})
</script>
  