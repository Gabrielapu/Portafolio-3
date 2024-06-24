import validateUrl from '../utils/validateUrl.js'

export const useTrucksRangeStore = defineStore('trucksStore', {
  state: () => {
    return {
      trucksRangeList: [],
    }
  },
  actions: {
    async getTrucksRangeList(pageNum, date) {
      const url =  `trucks_ranges/?page=${pageNum}&month=${date.month}&year=${date.year}`
      const error = 'Error al obtener los rango de camiones'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.trucksRangeList = data      
      return status 
    },
    async addTrucksRange(payload) {
      const url = `trucks_ranges/`
      const error = 'Error al agregar rango de camiones'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editTrucksRange(payload) {
      const url = `trucks_ranges/${payload.id}/`
      const error = 'Error al editar rango de camiones'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },

    async deleteTrucksRange(payload) {
      const url = `trucks_ranges/${payload.id}/`
      const error = 'Error al eliminar rango de camiones'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async downloadTemplate(date) {
      const url = `trucks_ranges/download_trucks_range_template/?date=${date}`
      const error = 'Error: Plantilla sin datos'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), `rangoCamiones_${date}.xlsx`)
      return status
    },
    async uploadTemplate(file, date) {
      const url = `trucks_ranges/upload_trucks_range_template/`
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
