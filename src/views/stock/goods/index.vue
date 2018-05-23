<template>
    <div class="router-wrap">
        <navBar :navData="routerTabs"></navBar>
        <div class="router-page">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import navBar from '@/components/basics/nav/index'
    export default {
        components: {
            navBar
        },
        data() {
            return {
                routerTabs: [{
                    name: '货品管理',
                    pathName: 'goodsManage',
                },
                // {
                //     name: 'sku管理',
                //     pathName: 'skuManage',
                // }
                ]
            }
        },
        methods: {}
    }
</script>

<style lang='less' scoped>
    
</style>