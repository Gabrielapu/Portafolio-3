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
          :headers="totalInventoriesData.headers"
          :loading="loading"
          :data="totalInventoriesData.data"
          horizontal-scroll
          hide-duplicate-button
        >
          <template v-for="column in specialHeaders" #[`${column.value}`]="{ item }">
            <div class="full-center text-xs py-2">
              <Popper arrow>
                <BaseIcon class="cursor-pointer" size="17" name="uil:exclamation-circle" />
                <template #content>
                  <div class="w-full">
                    Días de autonomía: {{ item[column.value].autonomy_days }}
                  </div>
                </template>
              </Popper>
              <div class="mx-1.5">
                {{ `${item[column.value].toneladas}&nbsp;Ton` }}
              </div>
              <div 
                class="px-1 py-0.5 rounded-xl text-white" 
                :class="getBackground(item[column.value].used_capacity_percentage)"
              >
                {{ `${item[column.value].used_capacity_percentage}%` }}
              </div>
            </div>
          </template>
        </BaseTable>
      </template>  
    </Section>
  </div>
</template>

<script setup>

let totalInventoriesData = reactive([]);
let specialHeaders = reactive([])
const loading = ref(false);
const route = useRoute();
const scenarioId = route.params.scenario_id;
const store = useScenarioStore();
const excludedHeaders = ['Planta', 'Capacidad']

const requestItems = async () => {
  loading.value = true;
  totalInventoriesData = [];
  await store.getTotalInventoriesResults(scenarioId);
  totalInventoriesData = store.totalInventoriesResults.results;
  specialHeaders = totalInventoriesData.headers
    .filter(header => !excludedHeaders.includes(header.text) )
  loading.value = false;
};

onMounted(() => {
  requestItems();
});

const getBackground = (percent) => {
  if(percent >= 60 && percent <= 65) return 'bg-red-400'
  if(percent >= 66 && percent <= 70) return 'bg-orange-400'
  if(percent >= 71 && percent <= 80) return 'bg-yellow-400'
  if(percent >= 81 && percent <= 100) return 'bg-green-400'
  return 'bg-red-400'
}

</script>
