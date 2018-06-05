<template>
  <div>
    付款单
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi:{
          currentPage: 1,
          pageSize: 10,
          inTimeBegin: '',
          inTimeEnd: '',
          customerName: ''
        },
        list: [],
        totalCount: 0,
        dataValue: ['','']
      }
    },
    computed:{
      handleFilter() {
        return {
          currentPage: this.pageApi.currentPage,
          pageSize: this.pageApi.pageSize,
          customerName: this.pageApi.customerName,
          inTimeBegin: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          inTimeEnd: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
        }
      },
    },
    methods: {
      getList(params){
        this.$http.post(this.api.paymentOrderPage,params).then(res =>{
          if(res.code === 1000){
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
          }
        })
      }
    },
    created(){
      this.getList(this.handleFilter)
    }
  }
</script>

<style lang='less' scoped>
  
</style>