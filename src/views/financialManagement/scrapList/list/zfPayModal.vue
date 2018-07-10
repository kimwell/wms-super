<template>
  <div>
    <Row class="row-list">
      <Col span="8">作废单号：<span class="numbers">{{itemData.id}}</span></Col>
      <Col v-if="!isFK" span="8">待供应商支付金额：<span class="numbers">{{itemData.sellPay }}</span></Col>
      <Col v-if="!isFK" span="8">待客户支付金额：<span class="numbers">{{itemData.customerPay}}</span></Col>
      <Col v-if="isFK" span="8">应退回供应商金额：<span class="numbers">{{itemData.sellGet }}</span></Col>
      <Col v-if="isFK" span="8">应退回客户金额：<span class="numbers">{{itemData.customerGet}}</span></Col>
    </Row>
    <Form ref="formInline" :model="dataApi" :label-width="140" :rules="ruleInline">
      <FormItem label="用户类型：">
        <RadioGroup v-model="dataApi.cType">
          <Radio label="1" :disabled="sellPay">
            <span>供应商</span>
          </Radio>
          <Radio label="2" :disabled="customerPay">
            <span>客户</span>
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="费用科目：" prop="feeType">
        <AutoComplete v-model="dataApi.feeType" style="width: 300px;" placeholder="请输入...">
          <Option v-for="item in feeList" :value="item" :key="item">{{ item }}</Option>
        </AutoComplete>
      </FormItem>
      <FormItem v-if="dataApi.cType == '1'" label="供应商名称：" prop="buserName">
        <Input type="text" disabled v-model="dataApi.buserName" style="width: 300px;" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem v-if="dataApi.cType == '1'" label="供应商银行账户：" prop="buserBankCardNo">
        <AutoComplete v-model="dataApi.buserBankCardNo" @on-change="customerChange" style="width: 300px;" placeholder="请输入...">
          <Option v-for="item in bankList" :value="item.card" :key="item.card">{{ item.card }}</Option>
        </AutoComplete>
      </FormItem>
      <FormItem v-if="dataApi.cType == '1'" label="供应商账户银行名称：" prop="buserBankName">
        <Input type="text" v-model="dataApi.buserBankName" style="width: 300px;" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem v-if="dataApi.cType == '2'" label="客户名称：" prop="customerName">
        <Input type="text" disabled v-model="dataApi.customerName" style="width: 300px;" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem v-if="dataApi.cType == '2'" label="客户银行账户：" prop="customerBankCardNo">
        <AutoComplete v-model="dataApi.customerBankCardNo" @on-change="customerChange" style="width: 300px;" placeholder="请输入...">
          <Option v-for="item in bankList" :value="item.cardNo" :key="item.cardNo">{{ item.cardNo }}</Option>
        </AutoComplete>
      </FormItem>
      <FormItem v-if="dataApi.cType == '2'" label="客户账户银行名称：" prop="customerBankName">
        <Input type="text" v-model="dataApi.customerBankName" style="width: 300px;" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="平台对公银行账户：" prop="bankCardNo">
        <AutoComplete v-model="dataApi.bankCardNo" style="width: 300px;" placeholder="请输入...">
          <Option v-for="item in platList" :value="item.card" :key="item.card">{{ item.card }}</Option>
        </AutoComplete>
      </FormItem>
      <FormItem v-if="!isFK" label="入账金额：" prop="amount">
        <InputNumber style="width: 300px;" :max="dataApi.cType == '1' ? itemData.sellPay : itemData.customerPay" :min="0" v-model="dataApi.amount" placeholder="请输入..."></InputNumber>
      </FormItem>
      <div v-if="!isFK">
        <FormItem v-if="dataApi.cType === '2'" label="客户余额抵扣：">
          <InputNumber style="width: 300px;" :max="customerMoney" :min="0" v-model="dataApi.accountDeduction" placeholder="请输入..."></InputNumber>
          <!-- <Input type="text" v-model="dataApi.accountDeduction" style="width: 300px;" placeholder="请输入..."></Input> -->
        </FormItem>
        <FormItem v-if="dataApi.cType === '2'" label="客户余额：">
          {{customerMoney}}
        </FormItem>
        <FormItem v-if="dataApi.cType === '2'" label="实际入账金额：">
          {{deductible}}
        </FormItem>
      </div>
      <FormItem v-if="isFK" label="出账金额：" prop="amount">
        <InputNumber style="width: 300px;" :max="dataApi.cType == '1' ? itemData.sellGet : itemData.customerGet" :min="0" v-model="dataApi.amount" placeholder="请输入..."></InputNumber>
      </FormItem>
      <FormItem :label="isFK ? '出账时间':'入账时间：'" prop="inTime">
        <DatePicker type="datetime" v-model="dataApi.inTime" placeholder="请选择日期" style="width: 300px"></DatePicker>
      </FormItem>
      <FormItem label="银行流水号：">
        <Input type="text" v-model="dataApi.bankTradeNo" style="width: 300px;" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="银行回执单：">
        <uploadBtn v-model="dataApi.fileAddress"></uploadBtn>
        <div v-if="dataApi.fileAddress !=''">
          <img :src="dataApi.fileAddress" style="max-width:100%;margin:15px 0">
        </div>
      </FormItem>
      <FormItem label="备注：">
        <Input type="text" v-model="dataApi.remark" style="width: 300px;" placeholder="请输入..."></Input>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  import uploadBtn from '@/components/basics/uploadBtn'
  export default {
    components: {
      uploadBtn
    },
    props: {
      isFK: {
        type: Boolean
      },
      show: {
        type: Boolean
      },
      itemData: {
        type: Object
      }
    },
    data() {
      return {
        dataApi: {
          cType: this.itemData.sellPay === 0 ? '2' : '1',
          buserId: '',
          buserName: '',
          buserBankCardNo: '',
          buserBankName: '',
          customerName: '',
          customerBankCardNo: '',
          customerBankName: '',
          bankCardNo: '',
          bankName: '',
          amount: 0,
          inTime: '',
          bankTradeNo: '',
          remark: '',
          feeType: '',
          fileAddress: '',
          cancelTicketId: '',
          accountDeduction: 0
        },
        ruleInline: {
          feeType: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          customerName: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          customerBankCardNo: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          customerBankName: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          buserName: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          buserBankCardNo: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          buserBankName: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          bankCardNo: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          amount: [{
            required: true,
            message: '不能为空',
            trigger: 'blur',
            type: 'number'
          }, {
            validator: (rule, value, callback) => {
              var reg = /^((?!0)\d+(\.\d{1,2})?)$/g;
              if (!reg.test(value)) {
                return callback(new Error('请输入正确的入账金额'));
              } else {
                callback();
              }
            }
          }],
          inTime: [{
            required: true,
            type: 'date',
            message: '请选择日期',
            trigger: 'change'
          }]
        },
        feeList: [],
        companyList: [],
        queryLoading: false,
        bankList: [],
        platList: [],
        customerMoney: 0
      }
    },
    computed: {
      inTime() {
        return this.dataApi.inTime != '' ? this.dataApi.inTime.getTime() : ''
      },
      customerPay() {
        return this.isFK ? this.itemData.customerGet === 0 : this.itemData.customerPay === 0;
      },
      sellPay() {
        return this.isFK ? this.itemData.sellGet === 0 : this.itemData.sellPay === 0;
      },
      customerNum() {
        return this.itemData.customerPay - this.dataApi.amount === 0
      },
      sellNum() {
        return this.itemData.sellPay - this.dataApi.amount === 0
      },
      isZero() {
        return this.itemData.customerPay - this.dataApi.amount === 0 && this.itemData.sellPay - this.dataApi.amount === 0 && this.itemData.customerGet === 0 && this.itemData.sellGet === 0;
      },
      deductible(){
        return (Number(this.dataApi.amount) + Number(this.dataApi.accountDeduction)).toFixed(2)
      }
    },
    watch: {
      'dataApi.cType' (newVal, oldVal) {
        this.companyList = [];
        this.bankList = [];
        this.reset();
        if (newVal === '1') {
          this.dataApi.buserName = this.itemData.sellCompany;
        } else {
          this.dataApi.customerName = this.itemData.buyCompany;
        }
      },
      show(n, o) {
        if (this.show) {
          this.$refs.formInline.resetFields();
          if (this.isFK) {
            if (this.itemData.sellGet === 0) {
              this.dataApi.cType = '2';
              this.dataApi.customerName = this.itemData.buyCompany;
            } else {
              this.dataApi.cType = '1';
              this.dataApi.buserName = this.itemData.sellCompany;
            }
          } else {
            if (this.itemData.sellPay === 0) {
              this.dataApi.cType = '2';
              this.dataApi.customerName = this.itemData.buyCompany;
            } else {
              this.dataApi.cType = '1';
              this.dataApi.buserName = this.itemData.sellCompany;
            }
            if(this.dataApi.cType === '2'){
              this.findCustomerAccount();
            }
          }
        }
      },
      'dataApi.buserName' (newVal, oldVal) {
        this.selectOnChange(newVal)
      },
      'dataApi.customerName' (newVal, oldVal) {
        this.selectOnChange(newVal)
      }
    },
    methods: {
      reset() {
        this.dataApi = {
          cType: this.dataApi.cType,
          buserId: '',
          buserName: '',
          buserBankCardNo: '',
          buserBankName: '',
          customerName: '',
          customerBankCardNo: '',
          customerBankName: '',
          bankCardNo: '',
          bankName: '',
          amount: 0,
          inTime: this.dataApi.inTime,
          bankTradeNo: this.dataApi.bankTradeNo,
          remark: this.dataApi.remark,
          feeType: this.dataApi.feeType,
          fileAddress: this.dataApi.fileAddress,
          cancelTicketId: this.dataApi.cancelTicketId,
          accountDeduction: 0
        }
      },
      clearData() {
        this.$refs.formInline.resetFields();
        this.dataApi = {
          cType: this.dataApi.cType,
          buserId: '',
          buserName: '',
          buserBankCardNo: '',
          buserBankName: '',
          customerName: '',
          customerBankCardNo: '',
          customerBankName: '',
          bankCardNo: '',
          bankName: '',
          amount: 0,
          inTime: '',
          bankTradeNo: '',
          remark: '',
          feeType: '',
          fileAddress: '',
          cancelTicketId: '',
          accountDeduction: 0
        }
      },
      getFeeList() {
        this.$http.get(this.api.findFeeType).then(res => {
          if (res.code === 1000) {
            this.feeList = res.data;
          }
        })
      },
      getPlat() {
        this.$http.post(this.api.findPlatBankCard).then(res => {
          if (res.code === 1000) {
            this.platList = res.data != '' ? JSON.parse(res.data.cardInfo) : []
          }
        })
      },
      findCustomerAccount(){
        this.$http.post(this.api.findCustomerAccount,{customerName: this.dataApi.customerName}).then(res =>{
          if(res.code === 1000){
            this.customerMoney = res.data.account;
          }
        })
      },
      // 选择供应商
      selectOnChange(data) {
        if (data != '') {
          let params = {}
          if (this.dataApi.cType == '1') {
            params = {};
            params.companyName = data;
          } else {
            params = {}
            params.name = data;
            params.cardNo = ''
          }
          let urls = this.dataApi.cType == '1' ? this.api.getCompanyCard : this.api.findbankCards
          this.$http.post(urls, params).then(res => {
            if (res.code === 1000) {
              if (this.dataApi.cType == '1') {
                this.bankList = res.data != '' ? JSON.parse(res.data.cardInfo) : []
              } else {
                this.bankList = res.data
              }
            }
          })
        }
      },
      //  选择银行卡自动填充银行名称
      customerChange(data) {
        this.bankList.forEach(el => {
          if (this.dataApi.cType == '1') {
            if (el.card == data) {
              this.dataApi.buserBankName = el.bank
            }
          } else {
            if (el.cardNo == data) {
              this.dataApi.customerBankName = el.bankName
            }
          }
        })
      },
      save() {
        if (this.isZero) {
          this.$Modal.confirm({
            title: "再次确认",
            content: "提交后，客户和供应商金额结算已完成，状态将变为已完成，确认是否提交？",
            onOk: () => {
              this.saveData();
            }
          })
        } else {
          this.saveData();
        }
      },
      saveData() {
        let params = this.$clearData(this.dataApi);
        params.inTime = this.inTime;
        params.cancelTicketId = this.itemData.id;
        let saveApi = this.isFK ? this.api.cancelTicketBgPayment : this.api.cancelTicketBgReceipt;
        this.$http.post(saveApi, params).then(res => {
          if (res.code === 1000) {
            this.$emit('on-close', false)
            this.$Message.success('保存成功');
            this.clearData();
          } else {
            this.$Message.error(res.message);
          }
        })
      }
    },
    created() {
      this.getFeeList();
      this.getPlat();
    }
  }
</script>

<style lang='less' scoped>
  
</style>