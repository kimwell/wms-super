<template>
  <div class="page-wrapper">
    <Form :mode="pageApi" :label-width="100" inline>
      <FormItem label="作废单号：">
        <Input type="text" v-model="pageApi.zfId" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="原销售单号：">
        <Input type="text" v-model="pageApi.saleTicketId" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="退货时间：">
        <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="原单下单时间：">
        <DatePicker type="daterange" placement="bottom-end" v-model="dataValue2" placeholder="选择日期" style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem label="供应商名称：">
        <Input type="text" v-model="pageApi.sellCompany" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="客户名称：">
        <Input type="text" v-model="pageApi.customer" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="状态：">
        <Select v-model="pageApi.status" style="width: 100px;">
          <Option v-for="item in statusData" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="warning" @click.native="resetFilter">清除</Button>
      </FormItem>
    </Form>
    <Table width="100%" :columns="tableHeader" :data="list"></Table>
    <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
    <Modal v-model="show" width="1000" :mask-closable="false" title="原销售单详情">
      <div class="row-wrapper">
        <Row class="row-list">
          <Col span="6">平台已代收金额：￥{{saleDetail.platFormMoney}}</Col>
          <Col span="6">平台已结算金额：￥{{saleDetail.settleMoney}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="6">客户单位：{{saleDetail.buyCompanyName}}</Col>
          <Col span="6">仓库：{{saleDetail.storeHouseName}}</Col>
          <Col span="6">下单日期：{{saleDetail.ticketTime | dateformat}}</Col>
          <Col span="6">跟单员：{{saleDetail.merchandiser}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="6">审核人：{{saleDetail.checkMan}}</Col>
          <Col span="6">提货车主：{{saleDetail.carMan}}</Col>
          <Col span="6">提货车号：{{saleDetail.carId}}</Col>
          <Col span="6">备注：{{saleDetail.remark}}</Col>
        </Row>
      </div>
      <div class="row-wrapper">
        <Row class="row-list">
          <Col span="4">销售总额：<span class="numbers">￥{{saleDetail.saleMoney}}</span></Col>
          <Col span="4">不含税总金额：<span class="numbers">￥{{saleDetail.moneyWithoutTax}}</span></Col>
          <Col span="4">税：<span class="numbers">￥{{saleDetail.tax }}</span></Col>
          <Col span="4">总重量：<span class="numbers">{{saleDetail.weight}}KG</span></Col>
          <Col span="4">总数量：<span class="numbers">{{saleDetail.number}}</span></Col>
        </Row>
      </div>
      <Table border :columns="columns" :data="saleDetail.saleTicketInfos"></Table>
      <div slot="footer">
      </div>
    </Modal>
    <Modal v-model="panelShow" width="600" :mask-closable="false" :closable="false" :title="isFK ? '新增付款单':'新增收款单'">
      <zfPayModal :isFK="isFK" :show="panelShow"  ref="sfModal" @on-close="onClose" :itemData="currentItem"></zfPayModal>
      <div slot="footer">
        <Button @click="closePanel">取消</Button>
        <Button type="primary" @click="handleAction">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  dateformat
} from '@/utils/filters.js'
  import zfPayModal from './zfPayModal'
  export default {
    components: {
      zfPayModal
    },
    data() {
      return {
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          zfId: '',
          saleTicketId: '',
          customer: '',
          status: '',
          startTime: '',
          endTime: '',
          sellCompany: '',
          startTicketTime: '',
          endTicketTime: ''
        },
        dataValue: ['', ''],
        dataValue2: ['', ''],
        saleDetail: {},
        currentItem: {},
        show: false,
        panelShow: false,
        statusData: [{
          value: 1,
          label: '待退货入库'
        }, {
          value: 2,
          label: '退货已入库'
        }, {
          value: 3,
          label: '待财务处理'
        }, {
          value: 4,
          label: '财务已处理'
        }, {
          value: 5,
          label: '已完成'
        }, {
          value: 6,
          label: '已取消'
        }],
        list: [],
        totalCount: 0,
        isFK: false,
        columns: [{
            title: "序号",
            key: "cargoName",
            width: 60,
            render: (h, params) => {
              let str = params.index + 1;
              return h("div", str);
            }
          },
          {
            title: "货物名称",
            key: "cargoName",
            width: 100
          },
          {
            title: "产地",
            key: "proPlaceName",
            width: 100
          },
          {
            title: "规格",
            key: "specifications",
            width: 180,
            render: (h, params) => {
              let str =
                params.row.specifications != "" ?
                params.row.specifications :
                params.row.height != "" ? `${params.row.height}*${params.row.width}*${
                                        params.row.length
                                      }` : '';
              return h("div", str);
            }
          },
          {
            title: "公差",
            key: "tolerance",
            width: 100
          },
          {
            title: "单件重量",
            key: "singleWeight",
            width: 100
          },
          {
            title: "产品单位",
            key: "numberUnit",
            width: 100,
            render: (h, params) => {
              let str = params.row.numberUnit !="" ?  `${params.row.weightUnit}/${params.row.numberUnit}` : '';
              return h("div", str);
            }
          },
          {
            title: "卷号",
            key: "coiledSheetNum",
            width: 150,
          },
          {
            title: "数量",
            key: "number",
            width: 100,
          },
          {
            title: "理计重量(KG)",
            key: "ljWeight",
            width: 120,
            render: (h,params) =>{
              let str = params.row.singleWeight != '' ?  (params.row.singleWeight*params.row.number).toFixed(3) : ''
              return h("div", str);
            }
          },
          {
            title: "过磅重量(KG)",
            key: "poundWeight",
            width: 120,
          },
          {
            title: "过磅单重(KG)",
            key: "gbWeight",
            width: 120
          },
          {
            title: "卷重",
            key: "coiledWeight",
            width: 100,
          },
          {
            title: "单价(元/KG)",
            key: "price",
            width: 120,
          },
          {
            title: "税(%)",
            key: "tax",
            width: 100,
          },
          {
            title: "金额",
            key: "money",
            width: 100,
            render: (h, params) => {
              let str = `￥${params.row.money}`;
              return h("span", str);
            }
          },
          {
            title: "库存量",
            key: "storeWeight",
            width: 100,
          },
          {
            title: "备注",
            key: "remark",
            width: 200,
          }
        ],
        tableHeader: [{
          title: '作废单号',
          key: 'id',
          minWidth: 200
        }, {
          title: '原销售单号',
          key: 'ticketId',
          minWidth: 200,
          render: (h, params) => {
            let str = params.row.ticketId;
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
        }, {
          title: '客户名称',
          key: 'buyCompany',
          minWidth: 200
        }, {
          title: '供应商名称',
          key: 'sellCompany',
          minWidth: 200
        }, {
          title: '原单金额',
          key: 'saleMoney',
          minWidth: 150
        }, {
          title: '实单金额',
          key: 'sdSaleMoney',
          minWidth: 150
        }, {
          title: '退款单金额',
          key: 'refundMoney',
          minWidth: 150
        }, {
          title: '待客户支付金额',
          key: 'customerPay',
          minWidth: 150
        }, {
          title: '待供应商支付金额',
          key: 'sellPay',
          minWidth: 150
        }, {
          title: '应退回客户金额',
          key: 'customerGet',
          minWidth: 150
        }, {
          title: '应退回供应商金额',
          key: 'sellGet',
          minWidth: 150
        }, {
          title: '客户已支付金额',
          key: 'customerHasPay',
          minWidth: 150
        }, {
          title: '供应商已支付金额',
          key: 'sellHasPay',
          minWidth: 150
        }, {
          title: '已退回客户金额',
          key: 'customerHasGet',
          minWidth: 150
        }, {
          title: '已退回供应商金额',
          key: 'sellHasGet',
          minWidth: 150
        }, {
          title: '退货备注',
          key: 'remark',
          minWidth: 150
        }, {
          title: '状态',
          key: 'status',
          minWidth: 150,
          render: (h, params) => {
            let strs = this.statusData.find(item => item.value == params.row.status).label;
            return h('span', {
              class: `status status${params.row.status}`,
            }, strs)
          }
        }, {
          title: '退货时间',
          key: 'createTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.createTime != '' ? dateformat(params.row.createTime):'暂无')
          }
        }, {
          title: '退货开单人',
          key: 'createUser',
          minWidth: 150
        }, {
          title: '最近更新时间',
          key: 'updateTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.updateTime != '' ? dateformat(params.row.updateTime):'暂无')
          }
        }, {
          title: '最近更新人',
          key: 'updateUser',
          minWidth: 150
        }, {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 200,
          render: (h, params) => {
            let status = params.row.status;
            //  当待退回供应商金额和待退回客户金额为0时 付款单
            let aPay = params.row.customerGet === 0 && params.row.sellGet === 0;
            //  当待客户支付金额和待供应商支付金额为0时 收款单
            let aRepit = params.row.customerPay === 0 && params.row.sellPay === 0;
            let arr = [
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
                    this.goDetail(params.row)
                  }
                }
              }, '详情')
            ];
            //  付款单
            if (!aPay) {
              if (status == '3') {
                let payArr = [
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
                        this.actionItem(true, params.row)
                      }
                    }
                  }, '付款单')
                ];
                arr.push(payArr);
              }
            }
            //  收款单
            if (!aRepit) {
              if (status == '1' || status == '2' || status == '3') {
                let payArr = [
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.actionItem(false, params.row)
                      }
                    }
                  }, '收款单')
                ];
                arr.push(payArr);
              }
            }
            return h('div', arr);
          }
        }]
      }
    },
    computed: {
      handleFilter() {
        return {
          currentPage: this.pageApi.currentPage,
          pageSize: this.pageApi.pageSize,
          zfId: this.pageApi.zfId,
          saleTicketId: this.pageApi.saleTicketId,
          customer: this.pageApi.customer,
          status: this.pageApi.status,
          sellCompany: this.pageApi.sellCompany,
          startTime: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          endTime: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
          startTicketTime: this.dataValue2[0] != '' ? this.dataValue2[0].getTime() : '',
          endTicketTime: this.dataValue2[1] != '' ? this.dataValue2[1].getTime() : ''
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
      }
    },
    methods: {
      resetFilter() {
        this.pageApi = {
            currentPage: 1,
            pageSize: 10,
            zfId: '',
            saleTicketId: '',
            customer: '',
            status: '',
            startTime: '',
            endTime: '',
            sellCompany: '',
            startTicketTime: '',
            endTicketTime: ''
          },
          this.dataValue = ['', ''];
        this.dataValue2 = ['', ''];
        this.getList(this.handleFilter)
      },
      getList(params) {
        this.$http.post(this.api.findCancelTicketList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter)
      },
      goDetail(data) {
        this.$router.push('./scrapDetail/' + data.id)
      },
      salesDetail(data) {
        this.$http.post(this.api.findSaleTicket, {
          saleTicketId: data.ticketId
        }).then(res => {
          if (res.code === 1000) {
            this.saleDetail = res.data;
          }
        })
        this.show = true
      },
      actionItem(isFK, data) {
        //  false收款单 true付款单
        this.isFK = isFK;
        this.currentItem = data || {};
        this.panelShow = true;
      },
      //  保存收付款单
      handleAction() {
        this.$refs.sfModal.save();
      },
      onClose(data) {
        this.panelShow = data;
        this.getList(this.handleFilter);
      },
      closePanel(){
        this.panelShow = false;
        this.$refs.sfModal.clearData();
      }
    },
    created() {
      this.getList(this.handleFilter)
    }
  }
</script>

<style lang='less'>
  .status {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    padding: 0 10px;
    color: #fff;
    border-radius: 10px;
    &.status1 {
      background-color: #0BB2D4
    }
    &.status2 {
      background-color: #EB6609
    }
    &.status3 {
      background-color: #FCB900
    }
    &.status4 {
      background-color: #F13A30
    }
    &.status5 {
      background-color: #008947
    }
    &.status6 {
      background-color: #008989
    }
  }
  
  .page-count {
    text-align: right;
    margin-top: 20px;
  }
  
  .row-wrapper {
    margin-bottom: 20px;
    .numbers {
      color: #008947;
      font-weight: bold;
    }
    .row-list{
      margin-bottom: 12px;
    }
  }
</style>