import validateUrl from '../utils/validateUrl.js'

export const usePlantTanksStore = defineStore('plantTanksStore', {
  state: () => {
    return {
      plantTanksList: [],
      plantTank: {},
      tankMaintenanceList: [],
      plantTanksAllList: [],
    }
  },
  actions: {
    async getPlantTanksList(pageNum, plantId) {
      const url = pageNum 
        ? `tanks/?page=${pageNum}&plant_id=${plantId}` 
        : 'tanks/all/'
      const error = 'Error al obtener los tanques de planta'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.plantTanksList = data      
      return status 
    },
    async getPlantTank(id) {
      const url = `tanks/${id}/`
      const error = 'Error al obtener tanque de planta'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.plantTank = data      
      return status 
    },
    async addPlantTank(payload) {
      const url = 'tanks/'
      const error = 'Error al agregar tanque de planta'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editPlantTank(payload) {
      const url = `tanks/${payload.id}/`
      const error = 'Error al editar tanque de planta'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deletePlantTank({id}) {
      const url = `tanks/${id}/`
      const error = 'Error al eliminar tanque de planta'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async getTankMaintenanceList(date, plant_id, pageNum, pageSize) {
      const url = `tank_maintenances/?date=${date}&plant_id=${plant_id}&page=${pageNum}&page_size=${pageSize}` 
      const error = 'Error al obtener las mantenciones de tanques'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.tankMaintenanceList = data      
      return status 
    },
    async addTankMaintenance(payload) {
      const url = `tank_maintenances/`
      const error = 'Error al agregar tanque de planta'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editTankMaintenance(payload) {
      const url = `tank_maintenances/${payload.id}/`
      const error = 'Error al editar tanque de planta'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },

    async deleteTankMaintenance(payload) {
      const url = `tank_maintenances/${payload.id}/`
      const error = 'Error al eliminar tanque de planta'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async downloadTemplate() {
      const url = `tank_maintenances/download_all_tank_maintenance_template/`
      const error = 'Error: Plantilla sin datos'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'mantenciones.xlsx')
      return status
    },
    async uploadTemplate(file) {
      const url = 'tank_maintenances/upload_tank_maintenance_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async getAllPlantTanksList(plantId) {
      const url = `tanks/all_by_plant/?plant_id=${plantId}` 
      const error = 'Error al obtener los tanques de planta'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.plantTanksAllList = data      
      return status 
    },
  },
})
