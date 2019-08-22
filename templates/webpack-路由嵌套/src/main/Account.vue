<template>
    <div>
        <h1>这是account组件</h1>

        <router-link to="/account/login">登录</router-link>
        <router-link to="/account/register">注册</router-link>

        <router-view></router-view>

    </div>
</template>


<script>
export default {
    
}
</script>

<style lang="css" scoped>

/* 样式的scoped是通过css的属性选这起实现的 */

</style>
