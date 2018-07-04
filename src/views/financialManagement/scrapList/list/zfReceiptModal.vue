<template>
  <div>
    <Row class="row-list">
      <Col span="8">作废单号：<span class="numbers">{{itemData.id}}</span></Col>
      <Col span="8">应退回客户金额：<span class="numbers">{{itemData.customerGet}}</span></Col>
      <Col span="8">应退回供应商金额：<span class="numbers">{{itemData.sellGet }}</span></Col>
    </Row>
    <Form ref="formInline" :model="dataApi" :label-width="140" :rules="ruleInline">
      <FormItem label="用户类型：">
        <RadioGroup v-model="dataApi.cType">
          <Radio label="1" :disabled="sellGet">
            <span>供应商</span>
          </Radio>
          <Radio label="2" :disabled="customerGet">
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
        <Select v-model="dataApi.buserName" filterable remote @on-change="selectOnChange" :remote-method="remoteMethod" style="width: 300px;" :loading="queryLoading">
          <Option v-for="(option, index) in companyList.list" :value="`${option.companyName}-${option.id}`" :key="index">{{option.companyName}}</Option>
        </Select>
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
        <Select v-model="dataApi.customerName" filterable remote @on-change="selectOnChange" :remote-method="remoteMethod" style="width: 300px;" :loading="queryLoading">
          <Option v-for="(option, index) in companyList" :value="`${option}`" :key="index">{{option}}</Option>
        </Select>
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
        <Input type="text" v-model="dataApi.bankCardNo" style="width: 300px;" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="入账金额：" prop="amount">
        <InputNumber style="width: 300px;" :max="dataApi.cType == '1' ? itemData.sellGet : itemData.customerGet" :min="0" v-model="dataApi.amount" placeholder="请输入..."></InputNumber>
      </FormItem>
      <FormItem label="入账时间：" prop="inTime">
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
      itemData: {
        type: Object
      }
    },
    data() {
      return {
        dataApi: {
          cType: this.itemData.customerGet === 0 ? '1': '2',
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
          cancelTicketId: ''
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
            trigger: 'blur'
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
        bankList: []
      }
    },
    computed: {
      inTime() {
        return this.dataApi.inTime != '' ? this.dataApi.inTime.getTime() : ''
      },
      customerGet() {
        return this.itemData.customerGet === 0;
      },
      sellGet() {
        return this.itemData.sellGet === 0;
      },
      customerNum() {
        return this.itemData.customerGet - this.dataApi.amount === 0
      },
      sellNum() {
        return this.itemData.sellGet - this.dataApi.amount === 0
      },
      isZero() {
        return this.itemData.customerPay - this.dataApi.amount === 0 && this.itemData.sellPay - this.dataApi.amount === 0 && this.itemData.customerGet === 0 && this.itemData.sellGet === 0;
      }
    },
    watch: {
      'dataApi.cType' (newVal, oldVal) {
        this.companyList = [];
        this.bankList = [];
        this.reset();
      },
      'itemData.sellGet' (newVal, oldVal) {
        if (newVal === 0) {
          this.dataApi.cType = '2';
        } else {
          this.dataApi.cType = '1';
        }
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
          amount: this.dataApi.amount,
          inTime: this.dataApi.inTime,
          bankTradeNo: this.dataApi.bankTradeNo,
          remark: this.dataApi.remark,
          feeType: this.dataApi.feeType,
          fileAddress: this.dataApi.fileAddress,
          cancelTicketId: this.dataApi.cancelTicketId
        }
      },
      clearData() {
        this.$refs.formInline.resetFields();
        this.dataApi = {
          cType: '',
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
          cancelTicketId: ''
        }
      },
      getFeeList() {
        this.$http.get(this.api.findFeeType).then(res => {
          if (res.code === 1000) {
            this.feeList = res.data;
          }
        })
      },
      // 选择供应商
      selectOnChange(data) {
        let datas;
        if (this.dataApi.cType == '1') {
          datas = data.split('-')
        }
        if (data != '') {
          let params = {}
          if (this.dataApi.cType == '1') {
            params = {};
            params.companyName = datas[0]
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
                this.bankList = res.data !='' ? res.data : []
              }
            }
          })
        }
      },
      //  查找商户
      remoteMethod(query) {
        if (query != '') {
          this.queryLoading = true;
          let urls = this.dataApi.cType == '1' ? this.api.findBusinessList : this.api.findCustomerList
          let params = this.dataApi.cType == '1' ? {
            pageSize: 99,
            currentPage: 1,
            qq: '',
            fax: '',
            contactNum: '',
            contact: '',
            companyName: query
          } : {
            name: query
          }
          this.$http.post(urls, params).then(res => {
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
        if (params.cType == '1' && params.buserName != '') {
          let sp = params.buserName.split('-')
          params.buserName = sp[0];
          params.buserId = sp[1];
        }
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
    }
  }
</script>

<style lang='less' scoped>
  
</style>