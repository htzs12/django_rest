<template>
    <div>
        <h1>这是APP组件</h1>

        <mt-button type='danger' size='large'>default</mt-button>

        <mt-button type='danger' size='more' @click="show">点击弹窗</mt-button>

        <router-link to="/account">Account</router-link>
        <router-link to="/goodslist">Goodlist</router-link>
        
        <router-view></router-view>
        
    </div>
</template>

<script>

import { Toast } from 'mint-ui'

export default {
    data() {
        return {
            instance: null
        };
    },

    created() {
        this.getList();
    },

    methods: {
        getList(){ // 模拟获取列表的方法
            setTimeout(() => {
                this.instance.close();
            }, 3000)
        },

        show() {
            this.instance = Toast({
                message: '这是消息',
                duration: -1,
                position: 'top',
                iconClass: 'glyphicon glyphicon-ok',
                className: 'mycss'
            });
        }
    }
}
</script>