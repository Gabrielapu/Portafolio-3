import validateUrl from '../utils/validateUrl.js'

export const useRatesStore = defineStore('ratesStore', {
  state: () => {
    return {
      ratesList: [],
      rates: {},
    }
  },
  actions: {
    async getRatesList(pageNum, carrierId) {
      const url = pageNum ? `fees/?page=${pageNum}&carrier_id=${carrierId}` : 'fees/all/'
      const error = 'Error al obtener las tarifas'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.ratesList = data      
      return status 
    },
    async getRate(payload) {
      const url = `fees/${payload.id}/?freight_type=${payload.freight_type}`
      const error = 'Error al obtener tarifa'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.rates = data      
      return status 
    },
    async addRate(payload) {
      const url = 'fees/'
      const error = 'Error al agregar tarifa'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editRate(payload) {
      const url = `fees/${payload.id}/`
      const error = 'Error al editar tarifa'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteRate(payload) {
      const url = `fees/${payload.id}/?freight_type=${payload.freight_type}`
      const error = 'Error al eliminar tarifa'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async uploadTemplate(file) {
      const url = 'fees/upload_fees_template/'
      const error = 'Error al subir el archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async downloadTemplate(carrierId) {
      const url = `fees/download_fees_template/?carrier_id=${carrierId}`
      const error = 'Error: Plantilla sin datos'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status === 200) saveAs(new Blob([data]), 'tarifas.xlsx')
      return status
    },

  }, 
})
