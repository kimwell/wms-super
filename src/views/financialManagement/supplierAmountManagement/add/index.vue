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
        <FormItem label="账户可分配金额：">
          <span style="display:inline-block;margin-right:20px;">{{detail.account}}</span>
          <Button type="warning" @click="openMadel" size="small">选择供应商</Button>
        </FormItem>
        <FormItem label="明细：" v-if="selectedList.length >0">
          <div class="supplier-list">
            <div v-for="(item,index) in selectedList" :key="index">
              <span>{{item.buserName}}</span>
              <span>分配金额：
                  <InputNumber  style="width: 160px;" :max="item.customerMoney" :min="0" v-model="item.amount" placeholder="请输入...">
                  </InputNumber>
                </span>
              <span>备注：<Input type="text" style="width: 160px;" v-model="item.remark" placeholder="请输入..."></Input></span>
              <span>待支付总额：{{item.customerMoney}}</span>
            </div>
          </div>
        </FormItem>
        <FormItem v-if="selectedList.length >0">
          <Button type="warning" @click="handleAction">提交</Button>
        </FormItem>
      </Form>
    </Card>
    <Modal v-model="show" width="800" :mask-closable="false" title="选择供应商">
      <Form :mode="distributionApi" :label-width="100" inline>
        <FormItem label="供应商名称：">
          <Input type="text" v-model="distributionApi.buserName" @on-blur="searchDis" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <Table border ref="selection" :columns="tableHeader" :data="distribution" @on-selection-change="disSelect"></Table>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
        <Button type="primary" @click="selectAction">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableHeader: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '供应商名称',
          key: 'buserName'
        }, {
          title: '待支付总额(元)',
          key: 'customerMoney'
        }],
        dataApi: {
          customerName: ''
        },
        queryLoading: false,
        rules: {},
        companyList: [],
        detail: {},
        show: false,
        distribution: [],
        distributionApi: {
          customerName: '',
          buserName: ''
        },
        selectList: [],
        selectedList: [],
        handleApi: {
          customerName: '',
          buser: []
        }
      }
    },
    computed: {
      totalMoney() {
        let strs = 0;
        this.selectedList.forEach(el => {
          strs += Number(el.amount)
        })
        return strs.toFixed(2)
      }
    },
    methods: {
      selectOnChange(data) {
        this.handleApi.customerName = data;
        this.$http.post(this.api.customerAccountFind, {
          customerName: data
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
      openMadel(data) {
        if (this.dataApi.customerName != '') {
          this.show = true;
          this.distributionApi.customerName = this.dataApi.customerName;
          this.getdistributionPages();
        } else {
          this.$Message.error('请先选择客户名称')
        }
      },
      getdistributionPages() {
        this.$http.post(this.api.distributionPages, this.distributionApi).then(res => {
          if (res.code === 1000) {
            res.data.forEach(el => {
              el.amount = 0;
              el.remark = ''
            })
            this.distribution = res.data;
          }
        })
      },
      selectAction() {
        if (this.selectList.length > 0) {
          this.show = false
          this.selectedList = this.selectList;
        } else {
          this.$Message.error('请选择供应商')
        }
      },
      disSelect(data) {
        this.selectList = data;
      },
      searchDis() {
        this.getdistributionPages();
      },
      handleAction() {
        let tMoney = Number(this.totalMoney);
        let aMoney = Number(this.detail.account);
        if (tMoney > aMoney) {
          this.$Message.error('分配金额不能大于账户可分配金额')
        } else {
          let params = this.$clearData(this.handleApi);
          params.buser = JSON.stringify(this.selectedList)
          this.$http.post(this.api.doDistribute, params).then(res => {
            if (res.code === 1000) {
              this.$Message.success('分配成功')
              this.$router.push('supplierAmountManagement')
            } else {
              this.$Message.error(res.message)
            }
          })
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .supplier-list {
    span {
      display: inline-block;
      margin-right: 25px;
    }
  }
</style>