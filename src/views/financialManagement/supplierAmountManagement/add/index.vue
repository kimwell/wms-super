<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">分配供应商金额</p>
      <Form :label-width="110" ref="receiptOrder" :model="dataApi" :rules="rules">
        <FormItem label="客户名称：" prop="customerName">
          <Select v-model="dataApi.customerName" filterable remote @on-change="selectOnChange" :remote-method="remoteMethod" style="width: 300px;" :loading="queryLoading">
            <Option v-for="(option, index) in companyList" :value="`${option}`" :key="index">{{option}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataApi: {
          customerName: ''
        },
        queryLoading: false,
        rules: {},
        companyList: [],
        detail: {}
      }
    },
    methods: {
      selectOnChange(data) {
        this.$http.post(this.api.buserAccountDetail, {
          buserName: data
        }).then(res => {
          if (res.code === 1000) {
            this.detail = res.data;
          }
        })
      },
      //  查找商户
      remoteMethod(query) {
        if (query != '') {
          this.queryLoading = true;
          this.$http.post(this.api.findCustomerList, {
            name: query
          }).then(res => {
            if (res.code === 1000) {
              this.queryLoading = false;
              this.companyList = res.data
            }
          })
        } else {
          this.companyList = [];
          this.dataApi.customerName = '';
        }
      },
    }
  }
</script>

<style lang='less' scoped>
  
</style>