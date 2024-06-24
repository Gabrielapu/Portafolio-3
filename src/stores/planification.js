import $axios from '../utils/fetchData.js'

export const usePlanificationStore = defineStore('planificationStore', {
  state: () => {
    return {
      planificationList: [],
      planification: {},
    }
  },
  actions: {
    async getPlanificationList(pageNum) {
      const route = `planification/?page=${pageNum}`
      try {
        const { data, status} = await $axios.get(route)
        this.planificationList = data
        return status
      } catch (error) {
        return error.response.status
      }
    },
    async getAllPlanification() {
      const route = `planification/all_planifications`
      try {
        const { data, status} = await $axios.get(route)
        this.planificationList = data
        return status
      } catch (error) {
        return error.response.status
      }
    },
    async getPlanification(id) {
      const route = `planification/${id}/`
      try {
        const { data, status } = await $axios.get(route)
        this.planification = data
        return status
      } catch (error) {
        return error.response.status
      }
    },
    async addPlanification(payload) {
      const route = `planification/`
      try {
        const { status } = await $axios.post(route, payload)
        return status
      } catch (error ) {
        return error.response.status
      }
    },
    async editPlanification(id, payload) {
      const route = `planification/${id}/`
      try {
        const { status } = await $axios.put(route, payload)
        return status
      } catch (error ) {
        return error.response.status
      }
    },
    async deletePlanification(id) {
      const route = `planification/${id}/`
      try {
        const { status } = await $axios.delete(route)
        return status
      } catch (error ) {
        return error.response.status
      }
    },
  },
})
