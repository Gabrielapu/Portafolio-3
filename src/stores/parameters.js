import validateUrl from '../utils/validateUrl.js'

export const useParametersStore = defineStore('parametersStore', {
  state: () => {
    return {
      lastUpdatedFile: null
    }
  },
  actions: {
    async uploadTemplate(file) {
      const url = 'stable_parameters/upload'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async getLastUpdatedTemplate(template) {
      const url = `upload_templates/last?template_name=${template}`
      const error = 'Error al obtener el último archivo'
      const { data, status } = await validateUrl(url, error, 'get')  
      if (status == 200) this.lastUpdatedFile = data
      return status
    },
    async downloadTemplate() {
      const url = 'stable_parameters/download'
      const error = 'Error al obtener el último archivo'
      const responseType = 'blob'
      const {status, data} = await validateUrl(url, error, 'get', {},responseType) 
      saveAs(new Blob([data]), 'plantilla.xlsx')
      return status
    }
  },
})
