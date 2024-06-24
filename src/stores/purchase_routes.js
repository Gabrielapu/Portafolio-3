import validateUrl from '../utils/validateUrl.js'

export const usePurchaseRoutesStore = defineStore('purchaseRoutesStore', {
  state: () => {
    return {
      purchaseRoutesList: [],
      purchaseRoute: {},
    }
  },
  actions: {
    async getPurchaseRoutesList(pageNum, providerId) {
      const url = pageNum 
        ? `purchase_routes/?page=${pageNum}&provider_id=${providerId}` 
        : 'purchase_routes/all/'
      const error = 'Error al obtener las rutas de compra'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.purchaseRoutesList = data      
      return status 
    },
    async getPurchaseRoute(id) {
      const url = `purchase_routes/${id}/`
      const error = 'Error al obtener ruta de compra'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.purchaseRoute = data      
      return status 
    },
    async addPurchaseRoute(payload) {
      const url = 'purchase_routes/'
      const error = 'Error al agregar ruta de compra'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editPurchaseRoute(payload) {
      const url = `purchase_routes/${payload.id}/`
      const error = 'Error al editar ruta de compra'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deletePurchaseRoute({id}) {
      const url = `purchase_routes/${id}/`
      const error = 'Error al eliminar ruta de compra'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    }
  },
})
