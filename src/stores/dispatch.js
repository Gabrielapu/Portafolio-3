import validateUrl from '../utils/validateUrl.js'

export const useDispatchStore = defineStore('dispatchStore', {
  state: () => {
    return {
      dispatchList: [],
    }
  },
  actions: {
    async getDispatchList(pageNum, pageSize, month, year, type, international) {
      let url = pageNum && pageSize
        ? `dispatches/?page=${pageNum}&pageSize=${pageSize}` 
        : 'dispatches/all/'
      if (type) url += `&origin_type=${type}`
      if (month) url += `&month=${month}`
      if (year) url += `&year=${year}`
      if (international !== undefined) url += `&provider__international=${international}`
      const error = 'Error al obtener registro de despacho'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.dispatchList = data
      return status 
    },

    async downloadTemplate(date) {
      const url = 
        `dispatches/download_dispatch_template/?date=${date}`
      const error = 'Error al obtener el último archivo'
      const responseType = 'blob'
      const {status, data} = await validateUrl(url, error, 'get', {},responseType) 
      if (status == 200) saveAs(new Blob([data]), 'registroDespachos.xlsx')
      return status
    },
    async uploadTemplate(date, file) {
      const url = 'dispatches/upload_initial_trucks_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('date', date)
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    }
  },
})
