import validateUrl from '../utils/validateUrl.js'

export const usePlantRoutesStore = defineStore('plantRoutesStore', {
  state: () => {
    return {
      plantRoutesList: [],
      plantRoute: {},
    }
  },
  actions: {
    async getPlantRoutesList(pageNum, plantId) {
      const url = pageNum 
        ? `transfer_routes/?page=${pageNum}&source_plant_id=${plantId}` 
        : 'transfer_routes/all/'
      const error = 'Error al obtener las rutas de planta'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.plantRoutesList = data      
      return status 
    },
    async getPlantRoute(id) {
      const url = `transfer_routes/${id}/`
      const error = 'Error al obtener ruta de planta'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.plantRoute = data      
      return status 
    },
    async addPlantRoute(payload) {
      const url = 'transfer_routes/'
      const error = 'Error al agregar ruta de planta'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editPlantRoute(payload) {
      const url = `transfer_routes/${payload.id}/`
      const error = 'Error al editar ruta de planta'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deletePlantRoute({id}) {
      const url = `transfer_routes/${id}/`
      const error = 'Error al eliminar ruta de planta'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    }
  },
})
