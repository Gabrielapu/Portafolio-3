import validateUrl from '../utils/validateUrl.js'
import { saveAs } from 'file-saver';

export const useCommitedTransferTripsStore = defineStore('commitedTransferTripsStore', {
  state: () => {
    return {
      commitedTransferTripsList: [],
      commitedTransferTrips: {},
    }
  },
  actions: {
    async getCommitedTransferTripsList(pageNum, filters) {
      let url = pageNum 
        ? `committed_transfer_trips/?page=${pageNum}` 
        : 'committed_transfer_trips/all/'
      if(filters) url += `&month=${filters.month}&year=${filters.year}`
      const error = 'Error al obtener viajes comprometidos con proveedores'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.commitedTransferTripsList = data
      return status 
    },
    async getCommitedTransferTrip(id) {
      const url = `committed_transfer_trips/${id}/`
      const error = 'Error al obtener viaje comprometido con proveedor'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.commitedTransferTrips = data      
      return status 
    },
    async addCommitedTransferTrip(payload) {
      const url = 'committed_transfer_trips/'
      const error = 'Error al agregar viaje comprometido con proveedor'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editCommitedTransferTrip(payload) {
      const url = `committed_transfer_trips/${payload.id}/`
      const error = 'Error al editar viaje comprometido con proveedor'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteCommitedTransferTrip({id}) {
      const url = `committed_transfer_trips/${id}/`
      const error = 'Error al eliminar viaje comprometido con proveedor'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async downloadTemplate(startDate, endDate) {
      const url = 
        `committed_transfer_trips/download_cpt_template/?start_date=${startDate}&end_date=${endDate}`
      const error = 'Error: Plantilla sin datos'
      const method = 'get'
      const { status, data } = await validateUrl(url, error, method )  
      saveAs(new Blob([data]), 'plantilla.xlsx')
      return status
    },
    async uploadTemplate(file) {
      const url = 'committed_transfer_trips/upload_cpt_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    }
  },
})
