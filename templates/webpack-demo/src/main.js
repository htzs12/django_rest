
// 这是项目js的入口项目

// 导入jquery
import $ from 'jquery'

import './css/index.css'

import demo, { title } from './test.js'

console.log(demo);
console.log(title);

// import Vue from '../node_modules/vue/dist/vue.js'
import Vue from 'vue'

import login from './login.vue'


// var vm = new Vue({
//    el: '#app',
//     data: {
//        msg: '123'
//     },
//     render: c => c(login)
// });

$(function () {
    $('li:odd').css('backgroundColor', 'blue');
});


class Person {
    // static 定义静态属性 (Person.info)
    static info = {name: 'hao', 'age': 30}
}

// 实例属性
var p1 = new Person();


// es6语法 webpack报错, 通过babel,可以帮我们将高级语法转换为低级语法.

// 1. cnpm i babel-preset-env babel-preset-stage-0 -D
// 2. cnpm i babel-core babel-loader babel-plugin-transform-runtime -D
// 3. 排除 node_modules目录  {test:/\.js$/, use: 'babel-loader', exclude: /node_modules/}
