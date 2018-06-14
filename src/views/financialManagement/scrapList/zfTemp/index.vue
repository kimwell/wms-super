<template>
  <div>
    <Form :mode="pageApi" :label-width="100" inline>
      <FormItem label="作废单编号：">
        <Input type="text" v-model="pageApi.cancelTicketId" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="公司名称：">
        <Input type="text" v-model="pageApi.companyName" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="进账时间：">
        <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem>
        <Button type="warning" @click.native="resetFilter">清除</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    props: {
      types: Number
    },
    data() {
      return {
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          timeBeigin: '',
          timeEnd: '',
          companyName: '',
          cancelTicketId: ''
        },
        list: [],
        totalCount: 0,
        dataValue: ['', '']
      }
    },
    computed: {
      handleFilter() {
        return {
          currentPage: this.pageApi.currentPage,
          pageSize: this.pageApi.pageSize,
          companyName: this.pageApi.companyName,
          cancelTicketId: this.pageApi.cancelTicketId,
          timeBeigin: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          timeEnd: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
        }
      }
    },
    watch: {
      'handleFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage)
            this.pageApi.currentPage = 1;
          this.getList(this.handleFilter);
        }, 200),
        deep: true
      },
    },
    methods: {
      resetFilter() {
        this.pageApi = {
          currentPage: 1,
          pageSize: 10,
          timeBeigin: '',
          timeEnd: '',
          companyName: '',
          cancelTicketId: ''
        },
        this.dataValue = ['', '']
        this.getList(this.handleFilter)
      },
      getList(params) {
        let apiUrl = this.types === 1 ? this.api.cancelReceiptPage : this.api.cancelPaymentPage;
        this.$http.post(apiUrl, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      }
    },
    created() {
      this.getList(this.handleFilter)
    }
  }
</script>

<style lang='less' scoped>
  
</style>