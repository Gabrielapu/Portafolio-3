import validateUrl from '../utils/validateUrl.js'

export const useInputProductStore = defineStore('inputProductsStore', {
  state: () => {
    return {
      inputProductsList: [],
      inputProductsSimpleList: [],
      inputProducts: {},
    }
  },
  actions: {
    async getInputProductsList(pageNum) {
      const url = pageNum ? `input_products/?page=${pageNum}` : 'input_products/all/'
      const error = 'Error al obtener los productos de input'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.inputProductsList = data      
      return status 
    },
    async getInputProductsSimpleList() {
      const url = 'input_products/all_simple/'
      const error = 'Error al obtener el listado de productos'
      const {data, status} = await validateUrl(url, error)
      if (status === 200) this.inputProductsSimpleList = data
      return status
    },
    async getInputProduct(id) {
      const url = `input_products/${id}/`
      const error = 'Error al obtener producto de input'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.inputProducts = data      
      return status 
    },
    async addInputProduct(payload) {
      const url = 'input_products/'
      const error = 'Error al agregar producto de input'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editInputProduct(payload) {
      const url = `input_products/${payload.id}/`
      const error = 'Error al editar producto de input'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteInputProduct({id}) {
      const url = `input_products/${id}/`
      const error = 'Error al eliminar producto de input'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    }
  },
})
