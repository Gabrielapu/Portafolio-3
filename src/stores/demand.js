import validateUrl from '../utils/validateUrl.js'

export const useGeneralDemandStore = defineStore('generalDemandsStore', {
  state: () => {
    return {
      generalDemandsList: [],
      generalDemands: {},
    }
  },
  actions: {
    async getGeneralDemandsList(pageNum, filters) {
      let url = pageNum ? `general_demands/?page=${pageNum}` : 'general_demands/all/'
      if(filters) url += `&date=${filters.year}-${filters.month}`
      const error = 'Error al obtener demanda general'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.generalDemandsList = data
      return status 
    },
    async getGeneralDemand(id) {
      const url = `general_demands/${id}/`
      const error = 'Error al obtener demanda general'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.generalDemands = data      
      return status 
    },
    async addGeneralDemand(payload) {
      const url = 'general_demands/'
      const error = 'Error al agregar demanda general'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editGeneralDemand(id, payload) {
      const url = `general_demands/${id}/`
      const error = 'Error al editar demanda general'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteGeneralDemand(id) {
      const url = `general_demands/${id}/`
      const error = 'Error al eliminar demanda general'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async downloadTemplate(date) {
      const url = `general_demands/download_general_demand_template/?date=${date}`
      const error = 'Error: Plantilla sin datos'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'demanda.xlsx')
      return status
    },
    async uploadTemplate(date, file) {
      const url = 'general_demands/upload_general_demand_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('date', date)
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async updateDemands(payload) {
      const url = 'general_demands/bulk_update/'
      const error = 'Error al actualizar demandas'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)
      return status
    }
  },
})
