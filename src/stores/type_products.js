import validateUrl from '../utils/validateUrl.js'

export const useTypeProducts = defineStore('typeProductsStore', {
  state: () => {
    return {
      typeProductsList: []
    }
  },
  actions: {
    async getTypeProductsList() {
      const url = 'type_products/all/'
      const error = 'Error al obtener los tipos de productos'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.typeProductsList = data      
      return status 
    },
  }, 
})
