<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">添加付款单</p>
      <Form :label-width="110" ref="receiptOrder" :model="dataApi" :rules="rules">
        <FormItem label="是否是供应商：" prop="isBuser">
          <RadioGroup v-model="dataApi.isBuser">
            <Radio label="true">
              <span>是</span>
            </Radio>
            <Radio label="false">
              <span>否</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="费用科目：" prop="feeType">
          <AutoComplete v-model="dataApi.feeType" style="width: 300px;" placeholder="请输入...">
            <Option v-for="item in feeList" :value="item" :key="item">{{ item }}</Option>
          </AutoComplete>
        </FormItem>
        <FormItem v-if="dataApi.isBuser == 'false'" label="客户名称：" prop="customerName">
          <Select v-model="dataApi.customerName" filterable remote @on-change="selectOnChange" :remote-method="remoteMethod" style="width: 300px;" :loading="queryLoading">
            <Option v-for="(option, index) in companyList" :value="`${option}`" :key="index">{{option}}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="dataApi.isBuser == 'false'" label="客户账户：" prop="customerBankCardNo">
          <AutoComplete v-model="dataApi.customerBankCardNo" @on-change="customerChange" style="width: 300px;" placeholder="请输入...">
            <Option v-for="item in bankList" :value="item.cardNo" :key="item.cardNo">{{ item.cardNo }}</Option>
          </AutoComplete>
        </FormItem>
        <FormItem v-if="dataApi.isBuser == 'true'" label="供应商名称：" prop="customerName">
          <Select v-model="dataApi.customerName" ref="companyRef" filterable remote @on-change="selectOnChange" :remote-method="remoteMethod" style="width: 300px;" :loading="queryLoading">
            <Option v-for="(option, index) in companyList.list" :value="`${option.companyName}-${option.id}`" :key="index">{{option.companyName}}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="dataApi.isBuser == 'true'" label="供应商账户：" prop="customerBankCardNo">
          <AutoComplete v-model="dataApi.customerBankCardNo" @on-change="customerChange" style="width: 300px;" placeholder="请输入...">
            <Option v-for="item in bankList" :value="item.card" :key="item.card">{{ item.card }}</Option>
          </AutoComplete>
        </FormItem>
        <FormItem label="账户银行：" prop="customerBankName">
          <Input type="text" v-model="dataApi.customerBankName" style="width: 300px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="公司账号：" prop="bankCardNo">
          <AutoComplete v-model="dataApi.bankCardNo" style="width: 300px;" placeholder="请输入...">
            <Option v-for="item in bankCardList" :value="item.card" :key="item.card">{{ item.card }}</Option>
          </AutoComplete>
        </FormItem>
        <FormItem label="付款金额：" prop="amount" v-if="dataApi.isBuser =='false'">
          <InputNumber style="width: 300px;" :max="9999999" :min="0" v-model="dataApi.amount" placeholder="请输入..."></InputNumber>
        </FormItem>
        <FormItem label="付款金额：" v-if="dataApi.isBuser =='true'">
          <Button @click="selectDistribution">选择结算客户</Button><span class="totalaccount" v-if="detail !=''">待结算金额：{{detail.account}}元</span>
          <div class="chooseSettleCustomer" v-if="selectedShow">
            <div class="chooseList" v-for="(p,index) in selectList" :key="index">
              <span>{{p.customerName}}</span>
              <span>待结算总额：{{p.waitSettleAmount}}元</span>
              <span>本次结算金额：
              <InputNumber style="width: 160px;" :max="p.waitSettleAmount" :min="0" v-model="p.amount" placeholder="请输入...">
              </InputNumber>元</span>
            </div>
          </div>
        </FormItem>
        <FormItem label="付款时间：" prop="inTime">
          <DatePicker type="datetime" v-model="dataApi.inTime" placeholder="请选择日期" style="width: 300px"></DatePicker>
        </FormItem>
        <FormItem label="银行流水号：">
          <Input type="text" v-model="dataApi.bankTradeNo" style="width: 300px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="银行回执单：">
          <uploadBtn v-model="dataApi.fileAddress"></uploadBtn>
          <div v-if="dataApi.fileAddress !=''" style="width:300px;">
            <img :src="dataApi.fileAddress" style="max-width:100%;margin:15px 0">
          </div>
        </FormItem>
        <FormItem label="备注：">
          <Input type="text" v-model="dataApi.remark" style="width: 300px;" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <Button @click="goBack" style="margin-left:100px;">取消</Button>
      <Button type="primary" style="margin-left: 20px;" @click="modalHandle('receiptOrder')">添加</Button>
    </Card>
    <Modal v-model="settlementShow" width="800" :mask-closable="false" title="选择结算客户">
      <Table border ref="selection" :columns="tableHeader" :data="distributionList" @on-selection-change="disSelect"></Table>
      <div slot="footer">
        <Button @click="settlementShow = false">取消</Button>
        <Button type="primary" @click="selectAction">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import uploadBtn from '@/components/basics/uploadBtn'
  export default {
    components: {
      uploadBtn
    },
    data() {
      return {
        tableHeader: [{
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '客户名称',
          key: 'customerName'
        }, {
          title: '待结算金额',
          key: 'waitSettleAmount'
        }],
        settlementShow: false,
        prevImgSrc: '',
        prevShow: false,
        show: false,
        dataApi: {
          isBuser: "true",
          customerName: '',
          buserId: '',
          customerBankCardNo: '',
          customerBankName: '',
          bankCardNo: '',
          bankName: '',
          amount: 0,
          inTime: '',
          bankTradeNo: '',
          remark: '',
          fileAddress: '',
          feeType: '',
          paymentOrderAmountItem: []
        },
        rules: {
          isBuser: [{
            required: true,
            message: '请选择是否是供应商',
            trigger: 'change'
          }],
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
          }],
          bankTradeNo: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        feeList: [],
        loading: false,
        companyList: [],
        queryLoading: false,
        bankList: [],
        bankCardList: [],
        distributionList: [],
        distributionApi: {
          customerName: '',
          buserName: ''
        },
        selectList: [],
        detail: {
          account: 0
        },
        selectedShow: false
      }
    },
    computed: {
      inTime() {
        return this.dataApi.inTime != '' ? this.dataApi.inTime.getTime() : ''
      },
      totalMoney(){
        return this.selectList.reduce((sum, el) => sum + el.amount, 0)
      },
      allSellMoney() {
        return this.totalMoney > this.detail.account
      }
    },
    watch: {
      'dataApi.isBuser' (newVal,oldVal) {
        this.companyList = [];
        this.bankList = [];
        this.bankCardList = [];
        this.dataApi.customerName = '';
        this.detail = {};
        this.dataApi.bankCardNo = '';
        this.dataApi.customerBankCardNo = '';
        this.dataApi.bankTradeNo = '';
        this.dataApi.amount = 0;
        this.dataApi.customerBankName = '';
        this.dataApi.paymentOrderAmountItem = [];
        this.selectList = [];
        this.selectedShow = false;
      }
    },
    methods: {
      getFeeList() {
        this.$http.get(this.api.findFeeType).then(res => {
          if (res.code === 1000) {
            this.feeList = res.data;
          }
        })
      },
      getBankCard() {
        this.$http.post(this.api.findPlatBankCard).then(res => {
          if (res.code === 1000) {
            this.bankCardList = res.data != '' ? JSON.parse(res.data.cardInfo) : [];
            this.bankCardList.forEach(el => {
              el.card = el.card.toString();
            })
          }
        })
      },
      //  选择结算客户
      selectDistribution() {
        if (this.dataApi.customerName != '') {
          this.distributionApi.buserName = this.dataApi.customerName;
          let params = this.$clearData(this.distributionApi)
          if (this.dataApi.isBuser == 'true') {
            let strs = this.dataApi.customerName.split('-')
            params.buserName = strs[0];
          }
          this.$http.post(this.api.chooseSettleCustomer, params).then(res => {
            if (res.code === 1000) {
              this.settlementShow = true;
              this.distributionList = res.data;
            }
          })
        } else {
          this.$Message.error('请先选择客户名称')
        }
      },
      //  选择客户名称
      selectOnChange(data) {
        this.dataApi.customerBankCardNo = '';
        this.dataApi.customerBankName = '';
        this.bankList = [];
        this.selectList = [];
        this.selectedShow = false;
        let datas;
        if (this.dataApi.isBuser == 'true') {
          datas = data.split('-')
        }
        if (data != '') {
          let params = this.dataApi.isBuser == 'true' ? {companyName: datas[0]}: {
            name: data,
            cardNo: ''
          }
          //  供应商、客户银行卡查询
          let cardUrl = this.dataApi.isBuser == 'true' ? this.api.getCompanyCard : this.api.findbankCards
          this.$http.post(cardUrl, params).then(res => {
            if (res.code === 1000) {
              this.bankList = this.dataApi.isBuser == 'true' ? res.data !='' ? JSON.parse(res.data.cardInfo) : [] : res.data
            }
          })
          this.$http.post(this.api.buserAccountDetail, {
            buserName: this.dataApi.isBuser == 'true' ? datas[0] : data
          }).then(res => {
            if (res.code === 1000) {
              this.detail = res.data;
            }
          })
        }
      },
      customerChange(data) {
        this.bankList.forEach(el => {
          if(this.dataApi.isBuser == 'true'){
            if (el.card == data) {
              this.dataApi.customerBankName = el.bank
            }
          }else{
          if (el.cardNo == data) {
            this.dataApi.customerBankName = el.bankName
          }
          }
        })
      },
      //  查找商户
      remoteMethod(query) {
        if (query != '') {
          this.queryLoading = true;
          let urls = this.dataApi.isBuser == 'true' ? this.api.findBusinessList : this.api.findCustomerList
          let params = this.dataApi.isBuser == 'true' ? {
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
      //  选择结算客户
      disSelect(data) {
        data.forEach(el =>{
          el.amount = 0;
        })
        this.selectList = data;
      },
      //  确定选择结算客户
      selectAction() {
        if (this.selectList.length > 0) {
          this.selectedShow = true;
          this.settlementShow = false;
        } else {
          this.$Message.error('请选择结算客户')
        }
      },
      modalHandle(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if(this.allSellMoney){
              this.$Message.error('入账总金额不能大于供应商金额');
            }else{
            let params = this.$clearData(this.dataApi)
            if (this.dataApi.isBuser == 'true') {
              let strs = params.customerName.split('-')
              params.customerName = strs[0];
              params.buserId = strs[1]
            }
            params.inTime = this.inTime;
            params.paymentOrderAmountItem = JSON.stringify(this.selectList)
            this.$http.post(this.api.paymentOrderOut, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('保存成功')
                this.$router.push('paymentOrder');
              } else {
                this.$Message.error(res.message);
              }
            })
            }
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      goBack() {
        this.$router.go(-1)
      }
    },
    created() {
      this.getFeeList();
      this.getBankCard();
    }
  }
</script>

<style lang='less' scoped>
  .totalaccount {
    display: inline-block;
    margin-left: 20px;
  }
  
  .chooseList {
    margin-bottom: 10px;
    span {
      display: inline-block;
      margin-right: 10px;
    }
  }
</style>