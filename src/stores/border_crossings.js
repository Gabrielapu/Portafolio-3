import validateUrl from '../utils/validateUrl.js'

export const useBorderCrossingsStore = defineStore('borderCrossings', {
  state: () => {
    return {
      borderCrossingsCalendarList: [],
      borderCrossingsList: [],
      returnTimes: [],
      returnPlants: []
    }
  },
  actions: {
    async getBorderCrossings(date, pageNum, pageSize) {
      let url = `border_crossings/list_operation/?page=${pageNum}&page_size=${pageSize}` 
      if (date) url += `&date=${date.year}-${date.month}`
      const error = 'Error al obtener los pasos fronterizos'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.borderCrossingsCalendarList = data      
      return status 
    },
    async getBorderCrossingsList(pageNum, pageSize) {
      let url = `border_crossings/?page=${pageNum}&page_size=${pageSize}`
      const error = 'Error al obtener los pasos fronterizos'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.borderCrossingsList = data
      return status
    },
    async getReturnTimes(plantId, pageNum, pageSize) {
      let url = `borders_return_times/?page=${pageNum}&page_size=${pageSize}`
      if (plantId) url += `&plant_id=${plantId}`
      const error = 'Error al obtener los tiempos de regreso'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) this.returnTimes = data
      return status
    },
    async downloadTemplate(date) {
      const url = `border_crossings/download_border_crossing_template/?date=${date}`
      const error = 'Error: Plantilla sin datos'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'pasos_fronterizos.xlsx')
      return status
    },
    async uploadTemplate(date, file) {
      const url = 'border_crossings/upload_border_crossing_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('date', date)
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async downloadStableBorderCrossingTemplate() {
      const url = 'border_crossings/download_stable_border_crossing_template/'
      const error = 'Error: Plantilla sin datos'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'pasos_fronterizos.xlsx')
      return status
    },
    async uploadStableBorderCrossingTemplate(file) {
      const url = 'border_crossings/upload_stable_border_crossing_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async getPlants() {
      const url = 'borders_return_times/plants/'
      const error = 'Error al obtener las plantas'
      const { data, status } = await validateUrl(url, error)    
      if (status === 200) this.returnPlants = data      
      return status
    },
  },
})
