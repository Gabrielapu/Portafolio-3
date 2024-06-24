import validateUrl from '../utils/validateUrl.js'

export const usePipelineSuppliesStore = defineStore('usePipelineSupplies', {
  state: () => {
    return {
      pipelineSuppliesList: [],
    }
  },
  actions: {
    async getPipelineSuppliesList(pageNum, filters) {
      let url = pageNum 
        ? `pipeline_supplies/?page=${pageNum}` 
        : 'pipeline_supplies/all/'
      if(filters) url += `&date=${filters.year}-${filters.month}`
      const error = 'Error al obtener ductos'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.pipelineSuppliesList = data
      return status 
    },
    async updatePipelineSupplies(payload) {
      const url = 'pipeline_supplies/bulk_update/'
      const error = 'Error al actualizar ductos'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)
      return status
    },
    async uploadTemplate(date, file) {
      const url = 'pipeline_supplies/upload_pipeline_supply_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      bodyFormData.append('date', date)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async downloadTemplate(date) {
      const url = `pipeline_supplies/download_pipeline_supply_template/?date=${date}`
      const error = 'Error al subir archivo'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'ductos y programacion.xlsx')
      return status
    }
  },
})
