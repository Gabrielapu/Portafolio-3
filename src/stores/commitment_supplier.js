import validateUrl from '../utils/validateUrl.js'
import { saveAs } from 'file-saver';

export const useCommitedProviderTripsStore = defineStore('commitedProviderTrips', {
  state: () => {
    return {
      commitedProviderTripsList: [],
      commitedProviderTrips: {},
      commitedProviderTripsSimpleList: [],
    }
  },
  actions: {
    async getCommitedProviderTripsList(pageNum, filters, international) {
      let url = pageNum 
        ? `committed_provider_trips/?page=${pageNum}` 
        : 'committed_provider_trips/all/'
      if(filters) url += `&month=${filters.month}&year=${filters.year}`
      if(international !== null) url += `&provider__international=${international}`
      const error = 'Error al obtener viajes comprometidos con proveedores'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.commitedProviderTripsList = data
      return status 
    },
    async getCommitedProviderTrip(id) {
      const url = `committed_provider_trips/${id}/`
      const error = 'Error al obtener viaje comprometido con proveedor'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.commitedProviderTrips = data      
      return status 
    },
    async addCommitedProviderTrip(payload) {
      const url = 'committed_provider_trips/'
      const error = 'Error al agregar viaje comprometido con proveedor'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editCommitedProviderTrip(payload) {
      const url = `committed_provider_trips/${payload.id}/`
      const error = 'Error al editar viaje comprometido con proveedor'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteCommitedProviderTrip({id}) {
      const url = `committed_provider_trips/${id}/`
      const error = 'Error al eliminar viaje comprometido con proveedor'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async getCommitedProviderTrips() {
      const url = '/committed_provider_trips/import_form/'
      const error = 'Error al obtener viajes comprometidos con proveedores'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.commitedProviderTripsSimpleList = data
    },
    async downloadTemplate(startDate, endDate) {
      const url = 
        `committed_provider_trips/download_cpt_template/?start_date=${startDate}&end_date=${endDate}`
      const error = 'Error: Plantilla sin datos'
      const method = 'get'
      const { status, data } = await validateUrl(url, error, method )  
      saveAs(new Blob([data]), 'plantilla.xlsx')
      return status
    },
    async uploadTemplate(file) {
      const url = 'committed_provider_trips/upload_cpt_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    }
  },
})
