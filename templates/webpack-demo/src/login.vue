
<tempalte>

<div>
    <h1>这是登录组件.vue-- {{ msg }}</h1>
</div>

</tempalte>


<script>

export default {
    data() {
        return {
            msg: '123'
        }
    },
    methods: {
        show() {
            console.log('调用了show方法.');
        }
    }
}

</script>


<style>



</style>