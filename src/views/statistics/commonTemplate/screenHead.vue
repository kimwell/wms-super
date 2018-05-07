<template>
    <div class="head">
        <slot></slot>
        <DatePicker @on-change="ouput" class="date-pick" v-model="dateValue" format="yyyy/MM/dd" type="daterange" placement="bottom-end" placeholder="选择日期范围" style="width: 200px"></DatePicker>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                dateValue: ['', '']
            }
        },
        methods: {
            ouput(val){
                let data = {
                    startTime: val[0] != '' ? new Date(val[0]).getTime() : '',
                    endTime: val[1] != '' && val[1] != undefined ? new Date(val[1]).getTime() : '',
                }
                this.$emit('date-change',data);
            },
            clearData(){
                this.dateValue = ['','']
            }
        }
    }
</script>


<style lang="less" scoped>
    .head {
        position: relative;
        width: 100%;
        height: 48px;
        line-height: 48px;
        font-size: 14px;
        padding: 0 20px;
        background-color: #fff;
        border-bottom: 1px solid #ddd;
        .date-pick {
            position: absolute;
            right: 80px;
            top: 10px;
        }
    }
</style>
