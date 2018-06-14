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
        <FormItem v-if="dataApi.isBuser == 'true'" label="供应商名称：" prop="customerName">
          <Select v-model="dataApi.customerName" filterable remote @on-change="selectOnChange" :remote-method="remoteMethod" style="width: 300px;" :loading="queryLoading">
            <Option v-for="(option, index) in companyList.list" :value="`${option.companyName}-${option.id}`" :key="index">{{option.companyName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="客户账户：" prop="customerBankCardNo">
          <AutoComplete v-model="dataApi.customerBankCardNo" @on-change="customerChange" style="width: 300px;" placeholder="请输入...">
            <Option v-for="item in bankList" :value="item.cardNo" :key="item.cardNo">{{ item.cardNo }}</Option>
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
        <FormItem label="入账金额：" prop="amount" v-if="dataApi.isBuser =='false'">
          <Input type="text" v-model="dataApi.amount" style="width: 300px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="入账金额：" v-if="dataApi.isBuser =='true'">
          <Button @click="selectDistribution">选择结算客户</Button><span class="totalaccount" v-if="detail !=''">待结算金额：{{detail.account}}元</span>
          <div class="chooseSettleCustomer">
            <div class="chooseList" v-for="(item,index) in selectAllList" :key="index">
              <span>{{item.customerName}}</span>
              <span>待结算总额：{{item.waitSettleAmount}}元</span>
              <span>本次结算金额：
                  <InputNumber  style="width: 160px;" :max="item.waitSettleAmount" :min="0" v-model="item.amount" placeholder="请输入...">
                  </InputNumber>元</span>
            </div>
          </div>
        </FormItem>
        <FormItem label="入账时间：" prop="inTime">
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
          amount: '',
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
          bankCardNo: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          amount: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          inTime: [{
            required: true,
            type: 'date',
            message: '请选择日期',
            trigger: 'change'
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
        selectAllList: [],
        detail: {
          account: 0
        }
      }
    },
    computed: {
      inTime() {
        return this.dataApi.inTime != '' ? this.dataApi.inTime.getTime() : ''
      },
      totalMoney(){
        let strs = 0;
        this.selectAllList.forEach(el => {
          strs += Number(el.amount)
        })
        return strs.toFixed(2)
      }
    },
    watch: {
      'dataApi.isBuser' () {
        this.companyList = [];
        this.bankList = [];
        this.bankCardList = [];
        this.dataApi.customerName = '';
        this.detail = {};
        this.dataApi.bankCardNo = '';
        this.dataApi.customerBankCardNo = '';
        this.dataApi.bankTradeNo = '';
        this.dataApi.amount = '';
        this.dataApi.customerBankName = '';
        this.dataApi.paymentOrderAmountItem = [];
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
            this.bankCardList = res.data.cardInfo != '' ? JSON.parse(res.data.cardInfo) : [];
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
        let datas;
        if (this.dataApi.isBuser == 'true') {
          datas = data.split('-')
        }
        if (data != '') {
          let params = {
            name: this.dataApi.isBuser == 'true' ? datas[0] : data,
            cardNo: ''
          }
          this.$http.post(this.api.findbankCards, params).then(res => {
            if (res.code === 1000) {
              this.bankList = res.data
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
          if (el.cardNo == data) {
            this.dataApi.customerBankName = el.bankName
          }
        })
      },
      bankCardNoChange(data) {
  
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
        this.selectList = data;
      },
      //  确定选择结算客户
      selectAction() {
        if (this.selectList.length > 0) {
          this.selectList.forEach(el => {
            el.amount = 0;
          })
          this.selectAllList = this.selectList;
          this.settlementShow = false;
        } else {
          this.$Message.error('请选择结算客户')
        }
      },
      modalHandle(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = this.$clearData(this.dataApi)
            if (this.dataApi.isBuser == 'true') {
              let strs = params.customerName.split('-')
              params.customerName = strs[0];
              params.buserId = strs[1]
            }
            params.inTime = this.inTime;
            params.paymentOrderAmountItem = JSON.stringify(this.selectAllList)
            console.log(params)
            this.$http.post(this.api.paymentOrderOut, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('保存成功')
                this.$router.push('paymentOrder');
              }else{
                this.$Message.error(res.message);
              }
            })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      goBack() {
        this.$router.push('paymentOrder')
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
    span {
      display: inline-block;
      margin-right: 10px;
    }
  }
</style>