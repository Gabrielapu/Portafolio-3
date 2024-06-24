import validateUrl from '../utils/validateUrl.js'

export const useInitialTrucksStore = defineStore('initialTrucksStore', {
  state: () => {
    return {
      initialTrucksList: [],
      initialTruck: {},
    }
  },
  actions: {
    async getInitialTrucksList(pageNum) {
      const url = pageNum ? `initial_trucks/?page=${pageNum}` : 'initial_trucks/all/'
      const error = 'Error al obtener los camiones iniciales'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.initialTrucksList = data      
      return status 
    },
    async getInitialTruck(id) {
      const url = `initial_trucks/${id}/`
      const error = 'Error al obtener camion inicial'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.initialTruck = data      
      return status 
    },
    async addInitialTruck(payload) {
      const url = 'initial_trucks/'
      const error = 'Error al agregar camion inicial'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editInitialTruck(id, payload) {
      const url = `initial_trucks/${id}/`
      const error = 'Error al editar camion inicial'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteInitialTruck(id) {
      const url = `initial_trucks/${id}/`
      const error = 'Error al eliminar camion inicial'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async downloadTemplate(startDate, endDate) {
      const url = 
        `initial_trucks/download_initial_trucks_template/?start_date=${startDate}&end_date=${endDate}`
      const error = 'Error: Plantilla sin datos'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'camiones_iniciales.xlsx')
      return status
    },
    async uploadTemplate(file) {
      const url = 'initial_trucks/upload_initial_trucks_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    }
  },
})
