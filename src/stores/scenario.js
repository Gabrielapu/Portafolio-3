import validateUrl from '../utils/validateUrl.js';

export const useScenarioStore = defineStore('scenarioStore', {
  state: () => {
    return {
      scenarioList: [],
      scenarioPlant: [],
      scenarioPlanList: [],
      scenario: {},
      status: '',
      carrierCapacityResults: [],
      costsResults: [],
      cptArrivalResults: [],
      initialTrucksResults: [],
      transfersResults: [],
      pipelinesResults: [],
      purchasesResults: [],
      totalInventoriesResults: [],
      unfulfilledDemandResults: [],
      plants: [],
      plantList: [],
      isOfficial: false,
      carriers: {},
      nationalCommittedProviderTrips: {},
      importCommittedProviderTrips: {},
      committedPipelineSupplies: {},
      committedTransferTrips: {},
      scenarioDemands: {},
      scenarioInitialInventories: {},
    };
  },
  actions: {
    async getScenarioList(pageNum) {
      const url = pageNum ? `scenario/?page=${pageNum}` : 'scenario/all/';
      const error = 'Error al obtener los escenarios';
      const { data, status } = await validateUrl(url, error);
      if (status === 200) this.scenarioList = data;
      return status;
    },
    async getScenario(id) {
      localStorage.setItem('scenario_status', JSON.stringify(''));
      const url = `scenario/${id}/`;
      const error = 'Error al obtener el escenario';
      const { data, status } = await validateUrl(url, error);
      if (status === 200) {
        this.scenario = data;
        this.status = data.status;
        this.isOfficial = data.is_official;
        localStorage.setItem('scenario_status', JSON.stringify(data.status));
      }
      return status;
    },
    async addScenario(payload) {
      const url = 'scenario/';
      const error = 'Error al agregar escenario';
      const method = 'post';
      const { status } = await validateUrl(url, error, method, payload);
      return status;
    },
    async editScenario(payload) {
      const url = `scenario/${payload.id}/`;
      const error = 'Error al editar escenario';
      const method = 'put';
      const { status } = await validateUrl(url, error, method, payload);
      return status;
    },
    async deleteScenario(id) {
      const url = `scenario/${id}/`;
      const error = 'Error al eliminar escenario';
      const method = 'delete';
      const { status } = await validateUrl(url, error, method);
      return status;
    },
    execute(scenarioId) {
      const url = 'jobs/executions/run';
      const error = 'Error al ejecutar escenario';
      const method = 'post';
      const { status } = validateUrl(url, error, method, {
        scenario_id: scenarioId,
      });
      return status;
    },
    async getCarrierCapacityResults(scenarioId, carrierId) {
      const url = `scenario/${scenarioId}/carrier_capacity_results/?carrier_id=${carrierId}`;
      const error =
        'Error al obtener los resultados de capacidad de transportistas';
      const { status, data } = await validateUrl(url, error, 'get');
      if (status === 200) this.carrierCapacityResults = data;
      return status;
    },
    async getCostsResults(scenarioId) {
      const url = `scenario/${scenarioId}/costs_results/`;
      const error = 'Error al obtener los resultados de costos';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.costsResults = data;
      return status;
    },
    async getCptArivalResults(scenarioId) {
      const url = `scenario/${scenarioId}/cpt_arrival_results/`;
      const error = 'Error al obtener los resultados de llegadas CPT';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.cptArrivalResults = data;
      return status;
    },
    async getInitialTrucksResults(scenarioId) {
      const url = `scenario/${scenarioId}/initial_truck_results/`;
      const error = 'Error al obtener los resultados de camiones iniciales';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.initialTrucksResults = data;
      return status;
    },
    async getPipelinesResults(scenarioId) {
      const url = `scenario/${scenarioId}/pipelines_results/`;
      const error = 'Error al obtener los resultados de tuberias';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.pipelinesResults = data;
      return status;
    },
    async getPurchasesNationalResults(scenarioId) {
      const url = `scenario/${scenarioId}/purchases_results/?international=false`;
      const error = 'Error al obtener los resultados de compras';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.purchasesResults = data;
      return status;
    },
    async getPurchasesInternationalResults(scenarioId) {
      const url = `scenario/${scenarioId}/purchases_results/?international=true`;
      const error = 'Error al obtener los resultados de compras';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.purchasesResults = data;
      return status;
    },
    async getTotalInventoriesResults(scenarioId) {
      const url = `scenario/${scenarioId}/total_inventories_results/`;
      const error = 'Error al obtener los resultados de inventarios';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.totalInventoriesResults = data;
      return status;
    },
    async getUnfulfilledDemandResults(scenarioId) {
      const url = `scenario/${scenarioId}/unfulfilled_demand_results/`;
      const error = 'Error al obtener los resultados de demanda perdida';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.unfulfilledDemandResults = data;
    },
    async getTransfersResults(scenarioId) {
      const url = `scenario/${scenarioId}/transfer_summary_results/`;
      const error = 'Error al obtener el resumen de transferencias';
      const method = 'get';
      const { data, status } = await validateUrl(url, error, method);
      if (status === 200) this.transfersResults = data;
      return status;
    },
    async downloadResume(scenarioId) {
      const url = `jobs/executions/files?scenario_id=${scenarioId}&type=Salidas&filename=Resumen_resultados`;
      const error = 'Error al descargar resumen de resultados';
      const { data } = await validateUrl(url, error);
      return data;
    },
    async downloadRestrictions(scenarioId) {
      const url = `jobs/executions/files?scenario_id=${scenarioId}&type=Salidas&filename=Restricciones_conflictivas_`;
      const error = 'Error al descargar restricciones conflictivas';
      const { status, data } = await validateUrl(url, error);
      window.location.href = data.url
      return status;
    },
    async getScenarioPlan(scenarioId, plantId) {
      const url = `scenario/${scenarioId}/scenario_plan/?plant_id=${plantId}`;
      const error = 'Error al descargar listado de plan de escenario.';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.scenarioPlant = data;
      return data;
    },
    async getPlants(scenarioId) {
      const url = `scenario/${scenarioId}/plants/`;
      const error =
        'Error al descargar listado de plantas asociadas al escenario.';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.plants = data;
      return data;
    },
    async downloadPlan(scenarioId) {
      const url = `/jobs/executions/files?scenario_id=${scenarioId}&type=Salidas&filename=Planificacion`;
      const error = 'Error al descargar planificación';
      const { status, data } = await validateUrl(url, error);
      window.open(data.url);
      return status;
    },
    async getScenarioPlanList(scenarioId, plantId) {
      const url = `scenario/${scenarioId}/scenario_plan/?plant_id=${plantId}`;
      const error = 'Error al descargar listado de plan de escenario.';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.scenarioPlanList = data.results;
      return status;
    },
    async getPlantList(scenarioId) {
      const url = `scenario/${scenarioId}/plants/`;
      const error = 'Error al descargar listado de plantas asociadas al escenario.';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.plantList = data.results;
      return status;
    },
    async publishAsPlan(payload) {
      const url = 'scenario/save_official_supply_plan/';
      const error = 'Error al guardar escenario como oficial';
      const method = 'post';
      const { status } = await validateUrl(url, error, method, payload);
      return status;
    },
    async getCarriers(scenarioId) {
      const url = `scenario/${scenarioId}/carriers/`;
      const error = 'Error al obtener los transportistas';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.carriers = data;
    },
    async getComittedProviderTrips(page, scenarioId, isImport) {
      let url = 'scenario_committed_provider_trips/';
        url += `?is_import=${isImport}`
        url += `&scenario_id=${scenarioId}`
        url += `&page=${page}`
      let error = 'Error al obtener resumen de compromisos';
        error += isImport ? ' de importación' : ' nacionales';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) {
        isImport
          ? this.importCommittedProviderTrips = data
          : this.nationalCommittedProviderTrips = data
      } 
      return data;
    },
    async getComittedPipelineSupplies(page, scenarioId) {
      let url = `scenario_committed_pipeline_supplies/?scenario_id=${scenarioId}`;
        url += `&page=${page}`
      const error = 'Error al obtener resumen de compromisos de ductos';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.committedPipelineSupplies = data
      return data;
    },
    async getCommittedTransferTrips(page, scenarioId) {
      let url = `scenario_committed_transfer_trips/?scenario_id=${scenarioId}`;
        url += `&page=${page}`
      const error = 'Error al obtener resumen de compromisos de transferencias';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.committedTransferTrips = data
      return data;
    },
    async getScenarioDemands(scenarioId, pageNum) {
      let url = `scenario_demands/?scenario_id=${scenarioId}`;
        url += `&page=${pageNum}`;
      const error = 'Error al obtener demandas de escenario';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.scenarioDemands = data;
      return status;
    },
    async getScenarioInitialInventories(scenarioId, pageNum) {
      let url = `scenario_initial_inventories/?scenario_id=${scenarioId}`;
        url += `&page=${pageNum}`;
      const error = 'Error al obtener inventarios iniciales de escenario';
      const { status, data } = await validateUrl(url, error);
      if (status === 200) this.scenarioInitialInventories = data;
      return status;
    }
  },
  getters: {
    getStatus: (state) =>
      state.status || JSON.parse(localStorage.getItem('scenario_status')),
  },
});
