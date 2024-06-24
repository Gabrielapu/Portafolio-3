import validateUrl from '../utils/validateUrl.js'

export const useCarriersStore = defineStore('carriersStore', {
  state: () => {
    return {
      carriersList: [],
      carriers: {},
      carriersSimpleList: [],
    }
  },
  actions: {
    async getCarriersList(pageNum) {
      const url = pageNum ? `carriers/?page=${pageNum}` : 'carriers/all/'
      const error = 'Error al obtener los productos de input'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.carriersList = data      
      return status 
    },    
    async getCarriersSimpleList() {
      const url = 'carriers/all_simple/'
      const error = 'Error al obtener la lista simple de transportistas'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.carriersSimpleList = data      
      return status
    },
    async getCarrier(id) {
      const url = `carriers/${id}/`
      const error = 'Error al obtener producto de input'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.carriers = data      
      return status 
    },
    async addCarrier(payload) {
      const url = 'carriers/'
      const error = 'Error al agregar producto de input'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editCarrier(payload) {
      const url = `carriers/${payload.id}/`
      const error = 'Error al editar producto de input'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteCarrier({id}) {
      const url = `carriers/${id}/`
      const error = 'Error al eliminar producto de input'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    }
  },
})
