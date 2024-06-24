<template>
  <aside ref="navDrawer" class="nav-drawer-wrapper fixed top-0 left-0 w-[260px] 
      h-screen overflow-auto shadow-md z-30 bg-white">
    <div class="flex flex-col w-full px-4 pb-16 pt-7">
      <!-- <img src="../../assets/lipigas-logo.svg" class="mb-10" alt="logo" /> -->

      <div v-for="(item, i) in mainNavItems" :key="i">
        <NavDrawerOption :item="item" @displayChildren="e => displayItems(mainNavItems, e)"
          @displayGrandchildren="e => displaySubitems(mainNavItems, e)" />
        <Divider v-if="item.divider && item.show" class="mt-6" />
      </div>
      <div v-if="showScenarioNavItems" v-for="(item, i) in scenarioNavItems" :key="i">
        <NavDrawerOption :item="item" @displayChildren="e => displayItems(scenarioNavItems, e)"
          @displayGrandchildren="e => displaySubitems(scenarioNavItems, e)" />
      </div>
    </div>
  </aside>
</template>

<script setup>
const mainNavItems = ref([])
const scenarioNavItems = ref([])
const route = useRoute()
const showScenarioNavItems = ref(false)

onBeforeMount(() => {
  setMainNavItems()
})

const scenarioId = computed(() => {
  return route.params.scenario_id
})

watch(() => scenarioId.value, () => {
  if (scenarioId.value) {
    setScenarioItems()
    showScenarioNavItems.value = true
  } else {
    showScenarioNavItems.value = false
  }
})

const displaySubitems = (navItems, { subitem, parent }) => {
  const parentItem = navItems.find(item => item.title === parent.title)
  const childToDisplay = parentItem.children.find(item => item.title === subitem.title)
  childToDisplay.displayGrandchildren = !childToDisplay.displayGrandchildren
}

const displayItems = (navItems, item) => {
  const itemToDisplay = navItems.find(i => i.title === item.title)
  itemToDisplay.displayItems = !itemToDisplay.displayItems
}

const setScenarioItems = () => {
  scenarioNavItems.value = [
    {
      title: `Escenario ID: ${scenarioId.value} `,
      icon: 'uil:layer-group',
      link: `/scenarios/${scenarioId.value}`,
      children: [],
      active: 'scenario_detail',
      show: true,
    },
    {
      title: 'Resultados',
      icon: 'uil:graph-bar',
      displayItems: false,
      children: [
        {
          title: 'Resumen',
          link: `/scenarios/${scenarioId.value}/results/resume`,
          active: 'scenario_results_resume',
          children: []
        },
        {
          title: 'Costos',
          link: `/scenarios/${scenarioId.value}/results/costs`,
          active: 'scenario_results_costs',
          children: []
        },
        {
          title: 'Inventarios totales',
          link: `/scenarios/${scenarioId.value}/results/total_inventories`,
          active: 'scenario_results_totalinventories',
          children: []
        },
        {
          title: 'Demanda perdida',
          link: `/scenarios/${scenarioId.value}/results/lost_demand`,
          active: 'scenario_results_lostdemand',
          children: []
        },
        {
          title: 'Capacidad de transportistas',
          link: `/scenarios/${scenarioId.value}/results/carrier_capacity`,
          active: 'scenario_results_carriercapacity',
          children: []
        }
      ],
      show: false
    },
    {
      title: 'Plan de escenario',
      icon: 'lucide:calendar',
      link: `/scenarios/${scenarioId.value}/scenario_plan`,
      children: [],
      active: 'scenario_plan',
      show: false,
    },
  ]
}

const setMainNavItems = () => {
  mainNavItems.value = [
    {
      title: 'Plan de abastecimiento',
      icon: 'uil:calendar-alt',
      link: '/',
      children: [],
      active: 'home',
      show: true,
    },
    {
      title: 'Escenarios',
      icon: 'uil:layer-group',
      link: '/scenarios',
      children: [],
      active: 'scenarios',
      show: true,
    },
    {
      title: 'Parámetros',
      icon: 'uil:sliders-v',
      displayItems: false,
      children: [
        {
          title: 'Por fecha',
          displayGrandchildren: false,
          children: [
            {
              title: 'CPT',
              link: '/parameters/bydate/cpt',
              active: 'cpt'
            },
            {
              title: 'Demanda',
              link: '/parameters/bydate/demand',
              active: 'demand'
            },
            {
              title: 'Inventarios iniciales',
              link: '/parameters/bydate/initialinventories',
              active: 'initialinventories'
            },
            {
              title: 'Pasos fronterizos',
              link: '/parameters/bydate/bordercrossings',
              active: 'bordercrossings'
            },
            {
              title: 'Calendario Operación',
              link: '/parameters/bydate/operationcalendar',
              active: 'operationcalendar'
            },
            {
              title: 'Mantención tanques',
              link: '/parameters/bydate/tankmaintenance',
              active: 'tankmaintenance'
            },
            {
              title: 'Camiones en espera',
              link: '/parameters/bydate/truckswaiting',
              active: 'truckswaiting'
            }
          ]
        },
        {
          title: 'Estables',
          displayGrandchildren: false,
          children: [
            {
              title: 'Cargar parámetros',
              link: '/parameters/stable/load',
              active: 'loadstableparameters',
            },
            {
              title: 'Plantas',
              link: '/parameters/stable/plants',
              active: 'plants',
            },
            {
              title: 'Proveedores',
              link: '/parameters/stable/providers',
              active: 'providers'
            },
            {
              title: 'Transportistas',
              link: '/parameters/stable/carriers',
              active: 'carriers'
            },
            {
              title: 'Tarifas transportistas',
              link: '/parameters/stable/carrierrates',
              active: 'carrierrates'
            },
            {
              title: 'Productos de input',
              link: '/parameters/stable/inputproducts',
              active: 'inputproducts'
            },
            {
              title: 'Productos elaborados',
              link: '/parameters/stable/processedproducts',
              active: 'processedproducts'
            },
            {
              title: 'Pasos fronterizos',
              link: '/parameters/stable/bordercrossings',
              active: 'bordercrossings_stable'
            }
          ]
        }
      ],
      show: true,
    },
    {
      title: 'Compromisos',
      icon: 'uil:truck',
      link: '/commitments',
      children: [],
      active: 'commitments',
      show: true,
    },
    {
      title: 'Registro de despacho',
      icon: 'uil:clipboard-alt',
      link: '/dispatchrecord',
      children: [],
      active: 'dispatchrecord',
      show: true,
    },
    {
      title: 'Ductos y programación',
      icon: 'ri:drop-line',
      link: '/pipelinescalendar',
      children: [],
      active: 'pipelinescalendar',
      show: true,
      divider: true
    },
  ]
}
</script>