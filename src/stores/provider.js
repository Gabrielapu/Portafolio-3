import validateUrl from '../utils/validateUrl.js'

export const useProvidersStore = defineStore('providersStore', {
  state: () => {
    return {
      providersList: [],
      providers: {},
      providersSimpleList: [],
      newProvider: {},  
      providersRoutesList: [],
      providersPipelinesList: [],
      loaderProvidersList: [],
      providersNationalSimpleList: [],
    }
  },
  actions: {
    async getProvidersList(pageNum) {
      const url = pageNum ? `providers/?page=${pageNum}` : 'providers/all/'
      const error = 'Error al obtener los proveedores'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) {
        pageNum 
          ? this.providersList = data
          : this.providersSimpleList = data
      }     
      return status 
    },
    async getLoaderProviderList() {
      const url = 'providers/all_loader_provider/'
      const error = 'Error al obtener lista de proveedores de carga'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.loaderProvidersList = data.providers
      return status
    },
    async getProvidersSimpleList() {
      const url = 'providers/all_simple/'
      const error = 'Error al obtener los proveedores'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.providersSimpleList = data   
      return status 
    },
    async getNationalProvidersList() {
      const url = 'providers/all_simple_national/'
      const error = 'Error al obtener los proveedores'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.providersNationalSimpleList = data   
      return status
    },
    async getProvidersRoutesList() {
      const url = 'providers/all_purchase_route/'
      const error = 'Error al obtener los proveedores'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.providersRoutesList = data   
      return status 
    },
    async getProvidersPipelinesList() {
      const url = 'providers/all_pipeline/'
      const error = 'Error al obtener los proveedores'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.providersPipelinesList = data   
      return status 
    },
    async getProvider(id) {
      const url = `providers/${id}/`
      const error = 'Error al obtener proveedor'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.providers = data      
      return status 
    },
    async addProvider(payload) {
      const url = 'providers/'
      const error = 'Error al agregar proveedor'
      const method = 'post'
      const { data, status } = await validateUrl(url, error, method, payload)  
      if (status === 201) this.newProvider = data
      return status 
    },
    async editProvider(payload) {
      const url = `providers/${payload.id}/`
      const error = 'Error al editar proveedor'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async addPipeline(payload) {
      const url = 'pipelines/'
      const error = 'Error al agregar ducto'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deletePipeline(id) {
      const url = `pipelines/${id}/`
      const error = 'Error al eliminar ducto'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async deleteProvider(payload) {
      const url = `providers/${payload.id}/`
      const error = 'Error al eliminar proveedor'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    }
  },
})
