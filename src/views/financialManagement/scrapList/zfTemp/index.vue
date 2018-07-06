<template>
  <div>
    <Form :mode="pageApi" :label-width="100" inline>
      <FormItem label="作废单编号：">
        <Input type="text" v-model="pageApi.cancelTicketId" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="公司名称：">
        <Input type="text" v-model="pageApi.companyName" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem :label="types === 1 ? '进账时间：':'出账时间：'">
        <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem>
        <Button type="warning" @click.native="resetFilter">清除</Button>
      </FormItem>
    </Form>
    <Table width="100%" :columns="tableHeader" :data="list"></Table>
    <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
    <Modal v-model="show" width="800" :mask-closable="false" title="查看附件">
      <div class="showImg">
        <img :src="showImg">
      </div>
      <div slot="footer">
        <Button @click="show = false">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="cancelShow" width="600" :mask-closable="false" :closable="false" :title="types === 1 ? '作废收款单':'作废付款单'">
      <Form  :model="dataApi" ref="formRef" :label-width="100" :rules="ruleInline" onkeydown="if(event.keyCode==13)return false;">
      <FormItem label="作废备注：" prop="deleteRemark">
        <Input type="text" v-model="dataApi.deleteRemark" style="width: 300px;" placeholder="请输入..."></Input>
      </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelHide">取消</Button>
        <Button type="primary" @click="handleAction">确定</Button>
      </div>
    </Modal>
    <Modal v-model="detailShow" width="600" :mask-closable="false" :title="this.types === 1 ? '收款单详情':'付款单详情'">
      <detailModal :activeData="activeItem"></detailModal>
      <div slot="footer">
        <Button @click="detailShow = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  dateformat
} from '@/utils/filters.js'
import detailModal from './detailModal'
  export default {
    components:{
      detailModal
    },
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
        dataApi: {
          id: '',
          deleteRemark: ''
        },
        ruleInline: {
          deleteRemark: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
        },
        show:false,
        showImg:  '',
        cancelShow: false,
        detailShow: false,
        activeItem: {},
        list: [],
        totalCount: 0,
        dataValue: ['', ''],
        tableHeader:[{
          title: '作废单编号',
          key: 'cancelTicketId',
          minWidth: 200,
          render: (h, params) => {
            let str = params.row.cancelTicketId;
            return h('div', [
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.salesDetail(params.row)
                  }
                }
              }, str),
            ]);
          }
        },{
          title: '公司名称',
          key: 'customerName',
          minWidth: 200,
          render: (h,params) =>{
            let t = params.row.customerName !='' ? params.row.customerName : '无'
            return h('span',t)
          }
        },{
          title: '客户银行账号',
          key: 'customerBankCardNo',
          minWidth: 200,
          render: (h,params) =>{
            let t = params.row.customerBankCardNo !='' ? params.row.customerBankCardNo : '无'
            return h('span',t)
          }
        },{
          title: '供应商名称',
          key: 'buserNamebu',
          minWidth: 200,
          render: (h,params) =>{
            let t = params.row.buserName !='' ? params.row.buserName : '无'
            return h('span',t)
          }
        },{
          title: '供应商银行账号',
          key: 'buserBankCardNo',
          minWidth: 200,
          render: (h,params) =>{
            let t = params.row.buserBankCardNo !='' ? params.row.buserBankCardNo : '无'
            return h('span',t)
          }
        },{
          title: this.types === 1 ? '进账金额':'出账金额',
          key: 'amount',
          minWidth: 100
        },{
          title: this.types === 1 ? '进账时间':'出账时间',
          key: 'inTime',
          minWidth: 150,
          render: (h,params) =>{
            return h('span',params.row.inTime != '' ? dateformat(params.row.inTime):'暂无')
          }
        },{
          title: '平台账号',
          key: 'bankCardNo',
          minWidth: 200
        },{
          title: '银行账号流水号',
          key: 'bankTradeNo',
          minWidth: 200
        },{
          title: '附件',
          key: 'fileAddress',
          minWidth: 100,
          render: (h, params) => {
            let fileAddress = params.row.fileAddress;
            if(fileAddress != ''){
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.previewImg( params.row.fileAddress)
                  }
                }
              }, '查看'),
            ]);
            }else{
              return h('span','暂无')
            }
          }
        },{
          title: '操作人',
          key: 'createUser',
          minWidth: 150
        },{
          title: '操作时间',
          key: 'updateTime',
          minWidth: 150,
          render: (h,params) =>{
            return h('span',params.row.updateTime != '' ? dateformat(params.row.updateTime):'暂无')
          }
        },{
          title: '备注',
          key: 'remark',
          minWidth: 200
        }, {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.goDetail( params.row)
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteItem(params.row)
                  }
                }
              }, '作废')
            ]);
          }
        }]
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
      },
      cancelHide(){
        this.cancelShow = false;
        this.dataApi.deleteRemark = '';
        this.$refs.formRef.resetFields();
      },
      changePage(data){
        this.dataApi.currentPage = page;
        this.getList(this.handleFilter)
      },
      previewImg(data){
        this.show = true;
        this.showImg = data;
      },
      salesDetail(data){
        this.$router.push('./scrapDetail/' + data.cancelTicketId)
      },
      goDetail(data){
        this.activeItem = data || {};
        this.detailShow = true;
      },
      deleteItem(data){
        this.cancelShow = true;
        this.dataApi.id = data.id;
      },
      handleAction(){
        this.$refs.formRef.validate((valid) => {
          if(valid){
            let saveApi = this.types === 1 ? this.api.receiptCancel : this.api.paymentCancel;
            let params = this.$clearData(this.dataApi)
            this.$http.post(saveApi,params).then(res =>{
              if(res.code === 1000){
                this.$Message.success('作废成功');
                this.cancelShow = false;
                this.getList(this.handleFilter);
              }else{
                this.$Message.error(res.message);
              }
            })
          }else{
            this.$Message.error('备注不能为空')
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
  .showImg{
    img{
      display: block;
      margin: 0 auto;
      max-width: 100%;
    }
  }
</style>