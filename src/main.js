import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import VueAxios from "vue-axios";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import echarts from 'echarts'

Vue.config.productionTip = false;
Vue.prototype.$echarts = echarts;
axios.defaults.baseURL = "http://192.168.1.188:12/api";
Vue.use(VueAxios, axios);
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')
axios.interceptors.request.use(
  function (config) {
    // 拦截每次请求,携带token
    config.headers.Authorization = sessionStorage.getItem('token')

    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  }
)
