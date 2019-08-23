import Vue from 'vue'

import app from './App.vue'

import VueRouter from 'vue-router'

import router from './router.js'

import MintUI from 'mint-ui'

import 'mint-ui/lib/style.css'

import 'bootstrap/dist/css/bootstrap.css'

import './css/index.css'

import './lib/mui/css/mui.css'


Vue.use(MintUI)


Vue.use(VueRouter)

var vm = new Vue({
    el: '#app',
    render: c => c(app),
    router // 挂载路由到vm实例上
})
