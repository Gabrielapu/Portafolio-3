<template>
  <BaseHeader title="Compromisos" class="mt-5" />
  <div>
    <Section>
      <template #content>
        <div class="flex items-center justify-between">
          <div class="full-center">
            <Button 
              label="Nacional" 
              color="primary"
              :text-only="activeTable !== 'nationals'"
              :shadow="false"
              size="sm" 
              class="mr-1"
              @click.native="activeTable = 'nationals'"
            />
            <Button 
              label="Importaciones" 
              color="primary"
              :text-only="activeTable !== 'imports'"
              :shadow="false"
              size="sm" 
              class="mr-1"
              @click.native="activeTable = 'imports'"
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
              :text-only="activeTable !== 'pipeline'"
              :shadow="false"
              size="sm" 
              @click.native="activeTable = 'pipeline'"
            />
          </div>
        </div>
        <div  class="mt-4">
          <BaseTable
            :headers="data.headers"
            :data="data.data"
            :loading="loading"
            paginated
            :items-per-page="8"
            :items-amount="totalCount"
            :current-page="currentPage"
            @change-page="changePage"
          />
        </div>
      </template>
    </Section>
  </div>
</template>

<script setup>
const activeTable = ref('nationals')
let data = ref([])
let totalCount = ref(0)
const currentPage = ref(1)
const loading = ref(false)
const route = useRoute()
const store = useScenarioStore()

const methodNames = {
  nationals: 'getComittedProviderTrips',
  imports: 'getComittedProviderTrips',
  transfers: 'getCommittedTransferTrips',
  pipeline: 'getComittedPipelineSupplies',
}
const dataNames = {
  nationals: 'nationalCommittedProviderTrips',
  imports: 'importCommittedProviderTrips',
  transfers: 'committedTransferTrips',
  pipeline: 'committedPipelineSupplies',
}

onMounted(() => {
  requestItems()
})

watch(() => activeTable.value, async () => {
  requestItems()
});

const changePage = (page) => {
  currentPage.value = page
  requestItems(page)
}

const requestItems = async () => {
  loading.value = true
  data = []
  const isImport = activeTable.value === 'imports'
  await store[methodNames[activeTable.value]](
    currentPage.value, 
    route.params.scenario_id, 
    isImport
  )
  if (Object.keys(store[dataNames[activeTable.value]]).length) {
    data = store[dataNames[activeTable.value]].results
    totalCount = store[dataNames[activeTable.value]].count
  }
  loading.value = false
}
</script>