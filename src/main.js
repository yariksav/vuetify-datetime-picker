import 'vuetify/dist/vuetify.css'
import './stylus/main.styl'
import Vue from 'vue'
import Vuetify from 'vuetify'
import App from './app'
import DatetimePicker from '~components/index'

Vue.use(Vuetify)
const vuetify = new Vuetify()
Vue.use(DatetimePicker)

/* eslint no-unused-vars: "off" */
const app = new Vue({
  el: '#app',
  vuetify,
  ...App
})
