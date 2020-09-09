import Vue from 'vue'
import Router from 'vue-router'
import Inde from '../App.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: 'Inde',
    component: Inde
  }]
})
