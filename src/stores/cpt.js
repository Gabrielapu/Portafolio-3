import validateUrl from '../utils/validateUrl.js'
import { saveAs } from 'file-saver';

export const useCptArrivalsStore = defineStore('cptArrivalsStoreStore', {
  state: () => {
    return {
      cptArrivalsList: [],
      cptArrivals: {},
    }
  },
  actions: {
    async getCptArrivalsList(pageNum, filters) {
      let url = pageNum ? `cpt_arrivals/?page=${pageNum}` : 'cpt_arrivals/all/'
      if(filters) url += `&month=${filters.month}&year=${filters.year}`
      const error = 'Error al obtener llegadas CPT'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) {
        this.cptArrivalsList = []
        this.cptArrivalsList = data      
      }
      return status 
    },
    async getCptArrival(id) {
      const url = `cpt_arrivals/${id}/`
      const error = 'Error al obtener llegada CPT'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.cptArrivals = data      
      return status 
    },
    async addCptArrival(payload) {
      const url = 'cpt_arrivals/'
      const error = 'Error al agregar llegada CPT'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editCptArrival(id, payload) {
      const url = `cpt_arrivals/${id}/`
      const error = 'Error al editar llegada CPT'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteCptArrival(id) {
      const url = `cpt_arrivals/${id}/`
      const error = 'Error al eliminar llegada CPT'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async downloadTemplate(date) {
      const url = `cpt_arrivals/download_cpt_template/?date=${date}`
      const error = 'Error: Plantilla sin datos'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'cpt.xlsx')
      return status
    },
    async uploadTemplate(date, file) {
      const url = 'cpt_arrivals/upload_cpt_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('date', date)
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
  },
})
