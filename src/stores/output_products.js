import validateUrl from '../utils/validateUrl.js'

export const useOutputProductStore = defineStore('outputProductsStore', {
  state: () => {
    return {
      outputProductsList: [],
      outputProductsSimpleList: [],
      outputProducts: {},
      newOutputProduct: {},
    }
  },
  actions: {
    async getOutputProductsList(pageNum) {
      const url = pageNum ? `output_products/?page=${pageNum}` : 'output_products/all/'
      const error = 'Error al obtener los productos de output'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.outputProductsList = data      
      return status 
    },
    async getOutputProductsSimpleList() {
      const url = 'output_products/all_simple/'
      const error = 'Error al obtener el listado de productos'
      const {data, status} = await validateUrl(url, error)
      if (status === 200) this.outputProductsSimpleList = data
      return status
    },
    async getOutputProduct(id) {
      const url = `output_products/${id}/`
      const error = 'Error al obtener producto de output'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.outputProducts = data      
      return status 
    },
    async addOutputProduct(payload) {
      const url = 'output_products/'
      const error = 'Error al agregar producto de output'
      const method = 'post'
      const { data, status } = await validateUrl(url, error, method, payload)  
      if (status === 201) this.newOutputProduct = data
      return status 
    },
    async editOutputProduct(payload) {
      const url = `output_products/${payload.id}/`
      const error = 'Error al editar producto de output'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteOutputProduct({id}) {
      const url = `output_products/${id}/`
      const error = 'Error al eliminar producto de output'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async addPossibleInput(payload) {
      const url = 'possible_inputs/'
      const error = 'Error al agregar input posible'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deletePossibleInput(id) {
      const url = `possible_inputs/${id}/`
      const error = 'Error al eliminar posible input'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status      
    }
    
  },
})
