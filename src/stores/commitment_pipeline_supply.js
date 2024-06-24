import validateUrl from '../utils/validateUrl.js'
import { saveAs } from 'file-saver';

export const useCommitedPipelineSuppliesStore = defineStore('commitedPipelineSuppliesStore', {
  state: () => {
    return {
      commitedPipelineSuppliesList: [],
      commitedPipelineSupplies: {},
    }
  },
  actions: {
    async getCommitedPipelineSupplysList(pageNum, filters) {
      let url = pageNum 
        ? `committed_pipeline_supplies/?page=${pageNum}` 
        : 'committed_pipeline_supplies/all/'
      if(filters) url += `&month=${filters.month}&year=${filters.year}`
      const error = 'Error al obtener abastecimientos mensuales por ducto'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.commitedPipelineSuppliesList = data
      return status 
    },
    async getCommitedPipelineSupply(id) {
      const url = `committed_pipeline_supplies/${id}/`
      const error = 'Error al obtener abastecimiento mensual por ducto'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.commitedPipelineSupplies = data      
      return status 
    },
    async addCommitedPipelineSupply(payload) {
      const url = 'committed_pipeline_supplies/'
      const error = 'Error al agregar abastecimiento mensual por ducto'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editCommitedPipelineSupply(payload) {
      const url = `committed_pipeline_supplies/${payload.id}/`
      const error = 'Error al editar abastecimiento mensual por ducto'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteCommitedPipelineSupply({id}) {
      const url = `committed_pipeline_supplies/${id}/`
      const error = 'Error al eliminar abastecimiento mensual por ducto'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async downloadTemplate(startDate, endDate) {
      const url = 
        `committed_pipeline_supplies/download_cpt_template/?start_date=${startDate}&end_date=${endDate}`
      const error = 'Error: Plantilla sin datos'
      const method = 'get'
      const { status, data } = await validateUrl(url, error, method )  
      saveAs(new Blob([data]), 'plantilla.xlsx')
      return status
    },
    async uploadTemplate(file) {
      const url = 'committed_pipeline_supplies/upload_cpt_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    }
  },
})
