import validateUrl from '../utils/validateUrl.js'
import { saveAs } from 'file-saver';

export const useInitialInventoriesStore = defineStore('initialInventoriesStore', {
  state: () => {
    return {
      initialInventoriesList: [],
      initialInventories: {},
      allowedDates: {},
    }
  },
  actions: {
    async getInitialInventoriesList(pageNum, date, pageSize) {
      let url = pageNum 
        ? `initial_inventories/?page=${pageNum}&page_size=${pageSize}` 
        : 'initial_inventories/all/'
      if(date) url += `&date=${date}`
      const error = 'Error al obtener inventarios iniciales'
      const { data, status } = await validateUrl(url, error)
      if (status === 200) {
        this.initialInventoriesList = []
        this.initialInventoriesList = data      
      }
      return status 
    },
    async getInitialInventory(id) {
      const url = `initial_inventories/${id}/`
      const error = 'Error al obtener inventario inicial'
      const { data, status } = await validateUrl(url, error)  
      if (status === 200) this.initialInventories = data      
      return status 
    },
    async addInitialInventory(payload) {
      const url = 'initial_inventories/'
      const error = 'Error al agregar inventario inicial'
      const method = 'post'
      const { status } = await validateUrl(url, error, method, payload)  
      return status 
    },
    async editInitialInventory(id, payload) {
      const url = `initial_inventories/${id}/`
      const error = 'Error al editar inventario inicial'
      const method = 'put'
      const { status } = await validateUrl(url, error, method, payload)  
      return status
    },
    async deleteInitialInventory(id) {
      const url = `initial_inventories/${id}/`
      const error = 'Error al eliminar inventario inicial'
      const method = 'delete'
      const { status } = await validateUrl(url, error, method)  
      return status
    },
    async downloadTemplate(date) {
      const url = `initial_inventories/download_initial_inventory_template/?date=${date}`
      const error = 'Error: Plantilla sin datos'
      const responseType = 'blob'
      const { status, data } = await validateUrl(url, error, 'get', {}, responseType) 
      if(status !== 404) saveAs(new Blob([data]), 'inventarios_iniciales.xlsx')
      return status
    },
    async uploadTemplate(date, file) {
      const url = 'initial_inventories/upload_initial_inventory_template/'
      const error = 'Error al subir archivo'
      const method = 'post'
      const bodyFormData = new FormData()
      bodyFormData.append('date', date)
      bodyFormData.append('file', file)
      const { status } = await validateUrl(url, error, method, bodyFormData)  
      return status
    },
    async getAllowedDates() {
      const url = 'initial_inventories/empty_days_initial_inventory/'
      const error = 'Error al obtener fechas permitidas'
      const { data, status } = await validateUrl(url, error)  
      if(status === 200) this.allowedDates = data
      return status
    }
  },
})
