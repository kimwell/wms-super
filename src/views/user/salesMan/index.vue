<template>
    <div>
        <div>
            <subNav :navData="routerTabs"></subNav>
        </div>
        <div>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import subNav from '@/components/basics/nav/index'
    export default {
        components: {
            subNav
        },
        data() {
            return {
                routerTabs: [{
                    name: '专员管理查询',
                    pathName: 'salesManManagement',
                }, {
                    name: '专员绑定管理',
                    pathName: 'salesManBind',
                }, {
                    name: '专员负责商户',
                    pathName: 'salesManBusiness',
                }, {
                    name: '商户使用分析',
                    pathName: 'businessUse',
                }]
            }
        }
    }
</script>

<style lang="less" scoped>
    .comm-container {
        width: 100%;
        background-color: #fff;
        position: relative;
        padding: 10px;
    }
</style>





