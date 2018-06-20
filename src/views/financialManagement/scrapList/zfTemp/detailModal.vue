<template>
  <div class="details">
    <Form :label-width="120">
      <FormItem label="用户类型：">
        {{activeData.cType == '1' ? '供应商':'客户'}}
      </FormItem>
      <FormItem label="费用科目：">
        {{activeData.feeType}}
      </FormItem>
      <FormItem v-if="activeData.cType == '1'" label="供应商名称：">
        {{activeData.buserName}}
      </FormItem>
      <FormItem v-if="activeData.cType == '1'" label="供应商银行账户：">
        {{activeData.buserBankCardNo}}
      </FormItem>
      <FormItem v-if="activeData.cType == '1'" label="供应商账户银行名称：">
        {{activeData.buserBankName}}
      </FormItem>
      <FormItem v-if="activeData.cType == '2'" label="客户名称：">
        {{activeData.customerName}}
      </FormItem>
      <FormItem v-if="activeData.cType == '2'" label="客户银行账户：">
        {{activeData.customerBankCardNo}}
      </FormItem>
      <FormItem v-if="activeData.cType == '2'" label="客户账户银行名称：">
        {{activeData.customerBankName}}
      </FormItem>
      <FormItem label="平台对公银行账户：">
        {{activeData.bankCardNo}}
      </FormItem>
      <FormItem label="入账金额：">
        {{activeData.amount}}
      </FormItem>
      <FormItem label="入账时间：" prop="inTime">
        {{activeData.inTime | dateformat}}
      </FormItem>
      <FormItem label="银行流水号：">
        {{activeData.bankTradeNo}}
      </FormItem>
      <FormItem label="银行回执单：">
        <div v-if="activeData.fileAddress !=''">
          <img :src="activeData.fileAddress" style="max-width:100%;margin:15px 0">
        </div>
        <span v-else>暂无</span>
      </FormItem>
      <FormItem label="备注：">
        {{activeData.remark | isEmpty('暂无')}}
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    props: {
      activeData: {
        type: Object
      }
    },
    data() {
      return {
  
      }
    },
    methods: {
  
    }
  }
</script>

<style lang='less'>
  .details {
    .ivu-form-item {
      margin-bottom: 5px;
    }
  }
</style>