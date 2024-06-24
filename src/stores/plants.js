import validateUrl from '../utils/validateUrl.js'

export const usePlantsStore = defineStore('plantsStore', {
  state: () => {
    return {
      plantsList: [],
      plants: {},
      simplePlants: [],
      loaderPlants: [],
    }
  },
  actions: {
    async getPlantsList(pageNum) {
      const url = pageNum ? `plants/?page=${pageNum}` : 'plants/all/'
      const error = 'Error al obtener las plantas'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.plantsList = data      
      return status 
    },
    async getPlantsSimpleList() {
      const url = 'plants/all_simple/'
      const error = 'Error al obtener las plantas'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.simplePlants = data      
      return status
    },
    async getLoaderPlantsList() {
      const url = 'plants/all_loader_plant/'
      const error = 'Error al obtener las plantas cargadoras'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.loaderPlants = data      
      return status
    },
    async getPlant(id) {
      const url = `plants/${id}/`
      const error = 'Error al obtener la planta'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.plants = data      
      return status 
    },
    async addPlant(payload) {
      const url = 'plants/'
      const error = 'Error al agregar planta'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editPlant(payload) {
      const url = `plants/${payload.id}/`
      const error = 'Error al editar planta'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deletePlant({id}) {
      const url = `plants/${id}/`
      const error = 'Error al eliminar planta'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    }
  },
})
