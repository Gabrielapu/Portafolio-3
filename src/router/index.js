import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Scenarios from '../views/Scenarios.vue';
import Plants from '../views/Parameters/Stable/Plants.vue';
import Providers from '../views/Parameters/Stable/Providers.vue';
import Carriers from '../views/Parameters/Stable/Carriers.vue';
import InputProducts from '../views/Parameters/Stable/InputProducts.vue';
import ProcessedProducts from '../views/Parameters/Stable/ProcessedProducts.vue';
import CarrierRates from '../views/Parameters/Stable/CarrierRates.vue';
import LoadStableParameters from '../views/Parameters/Stable/LoadStableParameters.vue';
import StableBorderCrossings from '../views/Parameters/Stable/StableBorderCrossings.vue';

import CPT from '../views/Parameters/ByDate/CPT.vue'
import Demand from '../views/Parameters/ByDate/Demand.vue'
import InitialInventories from '../views/Parameters/ByDate/InitialInventories.vue'
import BorderCrossings from '../views/Parameters/ByDate/BorderCrossings.vue'
import OperationCalendar from '../views/Parameters/ByDate/OperationCalendar.vue' 
import TankMaintenance from '../views/Parameters/ByDate/TankMaintenance.vue'
import TrucksWaiting from '../views/Parameters/ByDate/TrucksWaiting.vue'
import Commitments from '../views/Commitments.vue'
import RegisterMovements from '../views/RegisterMovements.vue'
import ScenarioDetail from '../views/Scenario/ScenarioDetail.vue'
import Resume from '../views/Scenario/Resume.vue'
import Costs from '../views/Scenario/Costs.vue'
import TotalInventories from '../views/Scenario/TotalInventories.vue'
import LostDemand from '../views/Scenario/LostDemand.vue'
import CarrierCapacity from '../views/Scenario/CarrierCapacity.vue'
import ScenarioPlan from '../views/Scenario/ScenarioPlan.vue'
import DispatchRecord from '../views/Movements/DispatchRecord.vue'
import PipelinesCalendar from '../views/PipelinesCalendar.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: Home },
    { path: '/login', name: 'login', component: Login },
    { path: '/scenarios', name: 'scenarios', component: Scenarios },

    {
      path: '/parameters/stable/load',
      name: 'loadstableparameters',
      component: LoadStableParameters,
    },
    { path: '/parameters/stable/plants', name: 'plants', component: Plants },
    {
      path: '/parameters/stable/providers',
      name: 'providers',
      component: Providers,
    },
    {
      path: '/parameters/stable/carriers',
      name: 'carriers',
      component: Carriers,
    },
    {
      path: '/parameters/stable/inputproducts',
      name: 'inputproducts',
      component: InputProducts,
    },
    {
      path: '/parameters/stable/processedproducts',
      name: 'processedproducts',
      component: ProcessedProducts,
    },
    {
      path: '/parameters/stable/carrierrates',
      name: 'carrierrates',
      component: CarrierRates,
    },
    { path: '/parameters/stable/bordercrossings', name: 'bordercrossings_stable', component: StableBorderCrossings },
    { path: '/parameters/bydate/cpt', name: 'cpt', component: CPT },
    { path: '/parameters/bydate/demand', name: 'demand', component: Demand },
    {
      path: '/parameters/bydate/initialinventories',
      name: 'initialinventories',
      component: InitialInventories,
    },
    {
      path: '/parameters/bydate/bordercrossings',
      name: 'bordercrossings',
      component: BorderCrossings,
    },
    {
      path: '/parameters/bydate/operationcalendar',
      name: 'operationcalendar',
      component: OperationCalendar,
    },

    { path: '/commitments', name: 'commitments', component: Commitments },
    { path: '/pipelinescalendar', name: 'pipelinescalendar', component: PipelinesCalendar },

    {
      path: '/registermovements',
      name: 'registermovements',
      component: RegisterMovements,
    },

    {
      path: '/scenarios/:scenario_id',
      name: 'scenario_detail',
      component: ScenarioDetail,
    },
    {
      path: '/scenarios/:scenario_id/results/resume',
      name: 'scenario_results_resume',
      component: Resume,
    },
    {
      path: '/scenarios/:scenario_id/results/costs',
      name: 'scenario_results_costs',
      component: Costs,
    },
    {
      path: '/parameters/stable/load',
      name: 'loadstableparameters',
      component: LoadStableParameters,
    },
    {
      path: '/parameters/stable/plants',
      name: 'plants',
      component: Plants,
    },
    {
      path: '/parameters/stable/providers',
      name: 'providers',
      component: Providers,
    },
    {
      path: '/parameters/stable/carriers',
      name: 'carriers',
      component: Carriers,
    },
    {
      path: '/parameters/stable/inputproducts',
      name: 'inputproducts',
      component: InputProducts,
    },
    {
      path: '/parameters/stable/processedproducts',
      name: 'processedproducts',
      component: ProcessedProducts,
    },
    {
      path: '/parameters/stable/carrierrates',
      name: 'carrierrates',
      component: CarrierRates,
    },
    {
      path: '/parameters/stable/bordercrossings',
      name: 'bordercrossings_stable',
      component: StableBorderCrossings,
    },

    { path: '/parameters/bydate/cpt', name: 'cpt', component: CPT },
    { path: '/parameters/bydate/demand', name: 'demand', component: Demand },
    { path: '/parameters/bydate/initialinventories', name: 'initialinventories', component: InitialInventories },
    { path: '/parameters/bydate/bordercrossings', name: 'bordercrossings', component: BorderCrossings },
    { path: '/parameters/bydate/operationcalendar', name: 'operationcalendar', component: OperationCalendar },
    { path: '/parameters/bydate/tankmaintenance', name: 'tankmaintenance', component: TankMaintenance },
    { path: '/parameters/bydate/truckswaiting', name: 'truckswaiting', component: TrucksWaiting },

    { path: '/commitments', name: 'commitments', component: Commitments },

    {
      path: '/registermovements',
      name: 'registermovements',
      component: RegisterMovements,
    },

    {
      path: '/scenarios/:scenario_id',
      name: 'scenario_detail',
      component: ScenarioDetail,
    },
    {
      path: '/scenarios/:scenario_id/results/resume',
      name: 'scenario_results_resume',
      component: Resume,
    },
    {
      path: '/scenarios/:scenario_id/results/costs',
      name: 'scenario_results_costs',
      component: Costs,
    },
    {
      path: '/scenarios/:scenario_id/results/total_inventories',
      name: 'scenario_results_totalinventories',
      component: TotalInventories,
    },
    {
      path: '/scenarios/:scenario_id/results/lost_demand',
      name: 'scenario_results_lostdemand',
      component: LostDemand,
    },
    {
      path: '/scenarios/:scenario_id/results/carrier_capacity',
      name: 'scenario_results_carriercapacity',
      component: CarrierCapacity,
    },

    {
      path: '/scenarios/:scenario_id/scenario_plan',
      name: 'scenario_plan',
      component: ScenarioPlan,
    },
    {
      path: '/scenarios/:scenario_id/scenario_plan',
      name: 'scenario_plan',
      component: ScenarioPlan,
    },
    {
      path: '/dispatchrecord',
      name: 'dispatchrecord',
      component: DispatchRecord,
    },
  ],
});

router.beforeEach((to) => {
  if (to.name === 'login') {
    const token = localStorage.getItem('access_token');
    if (token) {
      return { name: 'home' };
    }
  }
  if (to.name !== 'login') {
    const token = localStorage.getItem('access_token');
    if (token) {
      return true;
    } else {
      return { name: 'login' };
    }
  }
  return true;
});

export default router;
