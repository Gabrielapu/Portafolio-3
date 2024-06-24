import validateUrl from '../utils/validateUrl.js'

export const useMonthlyCommitmentsStore = defineStore('useMonthlyCommitments', {
  actions: {
    async uploadTemplate(date, file) {
      const url = 'monthly_commitments/upload'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      bodyFormData.append('date', date)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async downloadTemplate(date) {
      const url = `monthly_commitments/download?date=${date}`
      const error = 'Error al subir archivo'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'compromisos mensuales.xlsx')
      return status
    }
  },
})
