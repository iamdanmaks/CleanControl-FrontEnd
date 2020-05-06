import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VeeValidate from 'vee-validate'
import Axios from 'axios'

Vue.config.productionTip = false

Vue.use(VeeValidate);

Vue.prototype.$http = Axios;
const token = localStorage.getItem('token');
const locale = localStorage.getItem('locale');

if (token) {
  Vue.prototype.$http.defaults.headers.common['Authorization'] = token
}

if (locale) {
  Vue.prototype.$http.defaults.headers.common['Accept-Language'] = locale
}
else {
  Vue.prototype.$http.defaults.headers.common['Accept-Language'] = 'en_UK'
}

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
