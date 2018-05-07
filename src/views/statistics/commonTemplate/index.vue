<template>
    <div class="data-list-container">
        <screenHead @date-change="filterData"><slot></slot></screenHead>
        <Table border :columns="tableHead" :data="tableBody"></Table>
    </div>
</template>

<script>
    import screenHead from '../commonTemplate/screenHead.vue'
    export default {
        components: {
            screenHead
        },
        props: {
            title: String,
            tableHead: Array,
            tableBody: Array
        },
        data() {
            return {
    
            }
        },
        methods: {
            filterData(data) {
                this.$emit('date-pick', data)
            }
        }
    }
</script>


<style lang="less">
    .data-list-container {
        width: 100%;
    }

    .ivu-table td.red{
        color: red;
        font-weight: 500;
    }
</style>
