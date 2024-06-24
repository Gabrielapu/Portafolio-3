import validateUrl from '../utils/validateUrl.js'

export const useOperationStore = defineStore('operationsStore', {
  state: () => ({
    operationsByProvider: [],
    operationsByPlant: [],
  }),
  actions: {
    async getProviderOperationList(date) {
      const url = `provider_operations/?date=${date.year}-${date.month}`
      const error = 'Error al obtener el calendario de operación por proveedor'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.operationsByProvider = data      
      return status 
    },
    async updateProviderOperationCalendar(payload) {
      const url = 'provider_operations/bulk_update/'
      const error = 'Error al actualizar calendario por proveedores'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)
      return status
    },
    async getPlantOperationList(date) {
      const url = `plant_operations/?date=${date.year}-${date.month}`
      const error = 'Error al obtener el calendario de operación por planta'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.operationsByPlant = data      
      return status 
    },
    async updatePlantOperationCalendar(payload) {
      const url = 'plant_operations/bulk_update/'
      const error = 'Error al actualizar calendario por plantas'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)
      return status
    },
    async downloadTemplate(date) {
      const url = `operations/download_operation_template/?date=${date}`
      const error = 'Error: Plantilla sin datos'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'operacion.xlsx')
      return status
    },
    async uploadTemplate(date, file) {
      const url = 'operations/upload_operation_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('date', date)
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    }
  },
})
