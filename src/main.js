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
// 每个请求都带上的参数，比如token
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
// 对返回的状态进行判断，比如token是否过期
axios.interceptors.response.use((res) => {
  // 返回的状态为1，重定向到登录页面
  console.log(res)
  if (res.date.code === 1) {
    sessionStorage.clear()
    router.replace({
      path: '/',
      query: {redirect: router.currentRoute.fullPath} 
    })
  }
  return res
}, function(error) {
  // 对响应错误做点什么 token 已过期 页面如果有catch处理不会进来
  console.log(error)
  return Promise.reject(error) 
})
