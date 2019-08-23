<template>
    <div>
        <h1>这是APP组件</h1>

        <router-link to="/account">Account</router-link>
        <router-link to="/goodslist">Goodlist</router-link>
        
        <router-view></router-view>
    </div>
</template>