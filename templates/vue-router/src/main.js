import Vue from 'vue'

import app from './App.vue'

import VueRouter from 'vue-router'

import account from './main/Account.vue'

import goodslist from './main/GoodsList.vue'


Vue.use(VueRouter)

var router = new VueRouter({
    routers: [{
            path: '/account',
            component: account
        },
        {
            path: '/goodslist',
            component: goodslist
        },
    ]
})

var vm = new Vue({
    el: '#app',
    render: c => c(app),
    router // 挂载路由到vm实例上
})