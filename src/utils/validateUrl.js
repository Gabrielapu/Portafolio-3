import $axios from '../utils/fetchData.js'
import toastObj from '../plugins/toastify.js'
const { toast } = toastObj

export default async function validateUrl(
    url, 
    errorMsg = 'Error', 
    method = 'get', 
    payload = {},
    responseType = 'json'
) {
  try {
    const { data, status } = await $axios({url, data: payload, method, responseType })
    return { status, data }
  } catch (error) {
    if(error.response.status === 400 ) {
      Object.keys(error.response.data).forEach(key => {
        const errorLength = error.response.data[key].length
        if(errorLength >= 1) {
          for(let i = 0; i < errorLength; i++) {
            toast.error(error.response.data[key][i])
          }
        }
      })
    } else {
      toast.error(errorMsg)
    }
    return { status: error.response.status, error }
  }   
}