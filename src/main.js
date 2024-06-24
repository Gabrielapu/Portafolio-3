import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import dayjs from './plugins/dayjs.js'
import toastObj from './plugins/toastify.js'
import VueMultiselect from './plugins/vue-select'
import VueDatePicker from './plugins/datepicker'
import Popper from "vue3-popper";
import Paginate from 'vuejs-paginate'
import VueApexCharts from "vue3-apexcharts";

import './index.css'
import './plugins/vee-validate-rules.js'

const { Vue3Toastify, ToastContainerOptions, toast } = toastObj

const app = createApp(App)

app.use(Vue3Toastify, ToastContainerOptions)
app.use(createPinia())
app.use(router)
app.use(VueApexCharts);

app.component('VueMultiselect', VueMultiselect)
app.component('VueDatePicker', VueDatePicker);
app.component("Popper", Popper);
app.component('Paginate', Paginate)

app.provide('dayjs', dayjs)
app.provide('toast', toast) 

app.mount('#app')
