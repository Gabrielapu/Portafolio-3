import validateUrl from '../utils/validateUrl.js';

export const useSupplyPlanStore = defineStore('supplyPlan', {
  state: () => ({
    loadsOfficial: {
      headers: [],
      data: [],
      text: 'Cargas proveedores y transferencias',
    },
    arrivalsOfficial: {
      headers: [],
      data: [],
      text: 'Llegadas',
    },
    downloadsOfficial: {
      headers: [],
      data: [],
      text: 'Descargas',
    },
    ductsOfficial: {
      headers: [],
      data: [],
      text: 'Abastecimiento por ducto',
    },
    outgoingOfficial: {
      headers: [],
      data: [],
      text: 'Cargas para transferencias',
    },
    hasData: false,
  }),
  actions: {
    async getSupplyPlanResults(plantId, date = '2023-08') {
      const url = `official_supply_plan/?plant_id=${plantId}&date=${date}`;
      const error = 'Error al descargar plan de abastecimiento';
      const { status, data } = await validateUrl(url, error);
      this.hasData = !!Object.keys(data.results).length;

      if (status === 200) {
        const {
          loads_official,
          arrivals_official,
          downloads_official,
          ducts_official,
          outgoing_official,
        } = data.results;
        this.loadsOfficial =
          loads_official?.length > 0
            ? loads_official[0]
            : {
                headers: [],
                data: [],
                text: 'Cargas proveedores y transferencias',
              };
        this.arrivalsOfficial =
          arrivals_official?.length > 0
            ? arrivals_official[0]
            : {
                headers: [],
                data: [],
                text: 'Llegadas',
              };
        this.downloadsOfficial =
          downloads_official?.length > 0
            ? downloads_official[0]
            : {
                headers: [],
                data: [],
                text: 'Descargas',
              };
        this.ductsOfficial =
          ducts_official?.length > 0
            ? ducts_official[0]
            : {
                headers: [],
                data: [],
                text: 'Abastecimiento por ducto',
              };
        this.outgoingOfficial =
          outgoing_official?.length > 0
            ? outgoing_official[0]
            : {
                headers: [],
                data: [],
                text: 'Cargas para transferencias',
              };
      }
      return status;
    },
  },
});
