<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">收款管理列表</p>
      <Button slot="extra" type="primary" @click="openModel">新增</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="客户名称：">
          <Input type="text" v-model="pageApi.customerName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="进账时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card">
        <div class="card-contnet">
          <div class="table-contnet">
            <Row class-name="head">
              <Col class-name="col" span="3">客户名称</Col>
              <Col class-name="col" span="2">进账金额</Col>
              <Col class-name="col" span="3">客户账号</Col>
              <Col class-name="col" span="2">平台账号</Col>
              <Col class-name="col" span="2">进账时间</Col>
              <Col class-name="col" span="2">银行账号流水号</Col>
              <Col class-name="col" span="2">附件</Col>
              <Col class-name="col" span="2">操作人</Col>
              <Col class-name="col" span="2">操作时间</Col>
              <Col class-name="col" span="2">备注</Col>
              <Col class-name="col" span="2">操作</Col>
            </Row>
            <Row v-for="(item,index) in list " :key="index">
              <Col class-name="col" span="3">{{item.customerName}}</Col>
              <Col class-name="col" span="2">{{item.amount}}</Col>
              <Col class-name="col" span="3">{{item.customerBankCardNo}}</Col>
              <Col class-name="col" span="2">{{item.bankCardNo}}</Col>
              <Col class-name="col" span="2">{{item.inTime | dateformat}}</Col>
              <Col class-name="col" span="2">{{item.bankTradeNo}}</Col>
              <Col class-name="col" span="2">
              <Button v-if="item.fileAddress != ''" size="small" type="warning" @click.native="previewImg(item.fileAddress)">查看</Button>
              <span v-else>暂无</span>
              </Col>
              <Col class-name="col" span="2">{{item.updateUser}}</Col>
              <Col class-name="col" span="2">{{item.updateTime | dateformat}}</Col>
              <Col class-name="col" span="2">{{item.remark}}</Col>
              <Col class-name="col" span="2">
              <Button size="small" type="warning" @click="deleteItem(item)">作废</Button>
              </Col>
            </Row>
            <Row v-if="list.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
            </Row>
          </div>
          <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="show" width="500" :mask-closable="false" @on-cancel="close" title="新增收款单">
      <Form :label-width="110" ref="receiptOrder" :model="dataApi" :rules="rules">
        <FormItem label="费用科目：" prop="feeType">
          <AutoComplete v-model="dataApi.feeType" style="width: 300px;" placeholder="请输入...">
            <Option v-for="item in feeList" :value="item" :key="item">{{ item }}</Option>
          </AutoComplete>
        </FormItem>
        <FormItem label="客户名称：" prop="customerName">
          <Select v-model="dataApi.customerName" filterable remote @on-change="selectOnChange" :remote-method="remoteMethod" style="width: 300px;" :loading="queryLoading">
            <Option v-for="(option, index) in companyList" :value="`${option}`" :key="index">{{option}}</Option>
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
          <AutoComplete v-model="dataApi.bankCardNo" @on-change="bankCardNoChange" style="width: 300px;" placeholder="请输入...">
            <Option v-for="item in bankCardList" :value="item.card" :key="item.card">{{ item.card }}</Option>
          </AutoComplete>
        </FormItem>
        <FormItem label="入账金额：" prop="amount">
          <Input type="text" v-model="dataApi.amount" style="width: 300px;" placeholder="请输入..."></Input>
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
      <div slot="footer">
        <Button @click="close">取消</Button>
        <Button type="primary" :loading="loading" @click="modalHandle('receiptOrder')">添加</Button>
      </div>
    </Modal>
    <Modal v-model="prevShow" width="800" :mask-closable="false" title="预览附件">
      <div class="showImg">
        <img :src="prevImgSrc">
      </div>
    </Modal>
    <Modal v-model="cancelShow" width="500" :mask-closable="false" title="作废">
      <Form :label-width="110" ref="cancelForm" :model="cancelData" :rules="cancelRules">
        <FormItem label="备注：" prop="deleteRemark">
          <Input type="text" v-model="cancelData.deleteRemark" style="width: 300px;" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelShow = false">取消</Button>
        <Button type="primary" @click="cancelAction">确定</Button>
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
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          inTimeBegin: '',
          inTimeEnd: '',
          customerName: ''
        },
        show: false,
        dataValue: ['', ''],
        list: [],
        totalCount: 0,
        dataApi: {
          customerName: '',
          customerBankCardNo: '',
          customerBankName: '',
          bankCardNo: '',
          bankName: '',
          amount: '',
          inTime: '',
          bankTradeNo: '',
          remark: '',
          fileAddress: '',
          feeType: ''
        },
        cancelRules: {
          deleteRemark: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        rules: {
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
        prevShow: false,
        prevImgSrc: '',
        cancelShow: false,
        cancelData: {
          id: '',
          deleteRemark: ''
        },
        bankCardList: []
      }
    },
    computed: {
      handleFilter() {
        return {
          currentPage: this.pageApi.currentPage,
          pageSize: this.pageApi.pageSize,
          customerName: this.pageApi.customerName,
          inTimeBegin: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          inTimeEnd: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
        }
      },
      inTime() {
        return this.dataApi.inTime != '' ? this.dataApi.inTime.getTime() : ''
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
      }
    },
    methods: {
      //  选择客户名称
      selectOnChange(data) {
        if (data != '') {
          let params = {
            name: data,
            cardNo: ''
          }
          this.$http.post(this.api.findbankCards, params).then(res => {
            if (res.code === 1000) {
              this.bankList = res.data
            }
          })
        }
      },
      bankCardNoChange(data){
        // this.dataApi.bankCardNo = data;
      },
      customerChange(data){
        this.bankList.forEach(el =>{
          if(el.cardNo == data){
            console.log(el)
            this.dataApi.customerBankName = el.bankName
          }
        })
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter)
      },
      getList(params) {
        this.$http.post(this.api.receiptOrderPage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
          }
        })
      },
      getFeeList() {
        this.$http.get(this.api.findFeeType).then(res => {
          if (res.code === 1000) {
            this.feeList = res.data;
          }
        })
      },
      getBankCard(){
        this.$http.post(this.api.findPlatBankCard).then(res =>{
          if(res.code === 1000){
            this.bankCardList = res.data.cardInfo != ''? JSON.parse(res.data.cardInfo) : [];
          }
        })
      },
      resetFilter() {
        this.pageApi = {
          currentPage: 1,
          pageSize: 10,
          inTimeBegin: '',
          inTimeEnd: '',
          customerName: ''
        }
        this.dataValue = ['', '']
        this.getList(this.handleFilter);
      },
      openModel() {
        this.show = true;
      },
      resetData() {
        this.dataApi = {
          customerName: '',
          customerBankCardNo: '',
          customerBankName: '',
          bankCardNo: '',
          bankName: '',
          amount: '',
          inTime: '',
          bankTradeNo: '',
          remark: '',
          fileAddress: '',
          feeType: ''
        }
      },
      close() {
        this.show = false;
        this.resetData();
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
      modalHandle(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = this.$clearData(this.dataApi)
            params.inTime = this.inTime;
            this.$http.post(this.api.receiptOrderIn, params).then(res => {
              if (res.code === 1000) {
                this.show = false;
                this.$Message.success('保存成功')
                this.getList(this.handleFilter)
                this.resetData();
              }
            })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      //  查看附件
      previewImg(data) {
        this.prevShow = true
        this.prevImgSrc = data;
      },
      //  作废
      deleteItem(data) {
        this.cancelShow = true;
        this.cancelData.id = data.id;
      },
      // 确定作废
      cancelAction() {
        this.$refs.cancelForm.validate((valid) => {
          if (valid) {
            let params = this.$clearData(this.cancelData);
            this.$http.post(this.api.receiptOrderCancel, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('作废成功');
                this.cancelShow = false;
                this.getList(this.handleFilter)
              } else {
                this.$Message.error(res.message)
              }
            })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      }
    },
    created() {
      this.getList(this.handleFilter)
      this.getFeeList();
      this.getBankCard();
    }
  }
</script>

<style lang='less' scoped>
  .card {
    position: relative;
    margin-bottom: 20px;
    .card-contnet {
      position: relative;
      padding-bottom: 40px;
    }
    .table-contnet {
      line-height: 40px;
      text-align: center;
      border-top: 1px solid #d0d0d0;
      border-left: 1px solid #d0d0d0;
      .head {
        background-color: #ddd;
      }
      .col {
        height: 40px;
        padding: 0 5px;
        border-right: 1px solid #d0d0d0;
        border-bottom: 1px solid #d0d0d0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .page-count {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  
  .showImg {
    text-align: center;
    img {
      max-width: 100%;
    }
  }
</style>