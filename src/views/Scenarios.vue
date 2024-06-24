<template>
  <ViewHeader 
    title="Escenarios" 
    subtitle="Listado de todos los escenarios" 
    new-item-label="Nuevo escenario"
    hide-download-template-button 
    hide-upload-template-button 
    @newItem="crudModal = true" 
  />
  <div>
    <Section>
      <template #content>
        <BaseTable 
          :headers="headers" 
          :data="scenarios" 
          :loading="loading" 
          paginated 
          :items-per-page="8"
          :items-amount="totalCount" 
          :current-page="currentPage"
          :edit-button-options="{ icon: 'uil:search', text: 'detalle' }" 
          hide-duplicate-button 
          hide-delete-button
          edit-link="scenarios" 
          @change-page="page => requestScenarios(page)"
        >
          <template #initial_date="{ item }">
            {{ dayjs(item.initial_date).format('DD/MM/YYYY') }}
          </template>
          <template #fulfilled_demanda_percentage="{ item }">
            <span> {{ `${item.fulfilled_demanda_percentage} %` }} </span>
          </template>
          <template #waiting_days="{ item }">
            <span> {{ `${item.waiting_days} Días` }} </span>
          </template>
          <template #status="{ item }">
            <Badge 
              :icon="scenarioStatus[item.status].icon" 
              :icon-classes="scenarioStatus[item.status].classes"
              iconSize="md" 
              size="sm" 
              :color="scenarioStatus[item.status].color"
              :text="scenarioStatus[item.status].text"
            />
          </template>
          <template #unfulfilled_demanda_percentage="{ item }">
            <span> {{ `${item.unfulfilled_demanda_percentage} %` }} </span>
          </template>
          <template #total_cost="{ item }">
            <span> {{ `${item.total_cost} $MM` }} </span>
          </template>
        </BaseTable>
      </template>
    </Section>
  </div>
  <CRUDModal v-if="crudModal" :form="crudForm" v-model="crudModal" @reload="reload" />
</template>

<script setup>
import InputValidateField from '@/components/Input/InputValidateField.vue'
import DatePicker from '@/components/Input/DatePicker.vue'

let scenarios = reactive([])
const dayjs = inject('dayjs')
const loading = ref(false)
const totalCount = ref(0)
const currentPage = ref(1)
const crudModal = ref(false)
const store = useScenarioStore()
const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Fecha inicial', value: 'initial_date' },
  { text: 'Costos totales', value: 'total_cost' },
  { text: 'Demanda satisfecha', value: 'fulfilled_demanda_percentage' },
  { text: 'Toneladas insatisfechas', value: 'unfulfilled_demand_tons' },
  { text: 'Inventarios bajos', value: 'low_inventories' },
  { text: 'Días de espera', value: 'waiting_days' },
  { text: 'Estado', value: 'status' },
  { text: 'Duración', value: 'duration' },
  { text: 'Acciones', value: 'actions' },
]
const scenarioStatus = useScenarioStatus()
const crudForm = {
  type: 'add',
  store,
  add: {
    action: 'addScenario',
    title: 'Crear escenario',
    subtitle: 'Agrega un nuevo escenario'
  },
  fields: [
    shallowReactive({
      component: DatePicker,
      label: 'Fecha de inicio',
      value: '',
      name: 'fecha del escenario',
      rules: ['required'],
      field_name: 'initial_date'
    }),
    shallowReactive({
      component: InputValidateField,
      label: 'Duración (días)',
      placeholder: 'Duración',
      value: '',
      name: 'duración',
      rules: ['required', 'integer'],
      field_name: 'duration'
    }),
    shallowReactive({
      component: InputValidateField,
      label: 'Tasa de cambio',
      placeholder: 'Tasa de cambio',
      value: '',
      name: 'tasa de cambio',
      rules: ['required', 'integer'],
      field_name: 'usd_rate'
    })
  ]
}

onMounted(() => {
  const FIRST_PAGE = 1
  requestScenarios(FIRST_PAGE)
})

const requestScenarios = async (page) => {
  currentPage.value = page
  loading.value = true
  scenarios = []
  await store.getScenarioList(page)
  scenarios = store.scenarioList.results
  totalCount.value = store.scenarioList.count
  loading.value = false
}

const reload = async () => {
  await requestScenarios(currentPage.value)
}

</script>