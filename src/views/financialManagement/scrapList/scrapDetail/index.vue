<template>
  <div class="details">
    <Card :bordered="false" class="card">
      <p slot="title">原单基本信息<span class="title-bar-status">状态：{{item.cancelTicket.status | toStatus}}</span></p>
      <div slot="extra">
        <Button type="warning" @click="goBack">返回</Button>
      </div>
        <Row class="row-list">
        <Col span="6">平台代收金额：{{item.oldSaleTicket.platFormMoney}}</Col>
        <Col span="6">平台已结算金额：{{item.oldSaleTicket.settleMoney}}</Col>
        <Col span="6">原单发货状态：{{item.oldSaleTicket.status | tofhStatus}}</Col>
        <Col span="6">原单结算状态：{{item.oldSaleTicket.moneyStatus | moneyStatus}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="6">客户单位：{{item.oldSaleTicket.buyCompanyName}}</Col>
        <Col span="6">仓库：{{item.oldSaleTicket.storeHouseName}}</Col>
        <Col span="6">下单日期：{{item.oldSaleTicket.ticketTime | dateformat('yyyy-MM-dd')}}</Col>
        <Col span="6">跟单员：{{item.oldSaleTicket.merchandiser}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="6">审核人：{{item.oldSaleTicket.checkMan}}</Col>
        <Col span="6">提货车主：{{item.oldSaleTicket.carMan}}</Col>
        <Col span="6">提货车号：{{item.oldSaleTicket.carId}}</Col>
        <Col span="6">备注：{{item.oldSaleTicket.remark | isEmpty('暂无')}}</Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card" title="原单明细">
      <Row class="row-list">
        <Col span="4">销售总额：￥{{item.oldSaleTicket.saleMoney}}</Col>
        <Col span="4">不含税总金额：￥{{item.oldSaleTicket.moneyWithoutTax}}</Col>
        <Col span="4">税：￥{{item.oldSaleTicket.tax}}</Col>
        <Col span="4">总重量：{{item.oldSaleTicket.weight}}KG</Col>
        <Col span="4">总件数：{{item.oldSaleTicket.number}}</Col>
      </Row>
      <Table width="100%" :columns="tableHeader" :data="item.oldSaleTicket.saleTicketInfos"></Table>
      <h4 style="padding: 15px 0;">其他费用</h4>
      <Table width="100%" :columns="costHeader" :data="item.oldSaleTicket.saleTicketCosts"></Table>
    </Card>
    <Card :bordered="false" class="card" >
      <p slot="title">
        退货单<span class="other-cost">(退货单的货物种类与数量加实单的货物种类与数量等于原单货物数量，且退货单货物不可为空)</span>
      </p>
      <Table width="100%" :columns="tableHeader" :data="item.cancelTicket.cancelTicketInfos"></Table>
      <h4 style="padding: 15px 0;">其他信息</h4>
      <Row class="row-list">
        <Col span="6">退货金额合计：￥{{item.cancelTicket.refundMoney}}</Col>
        <Col span="6">附件：<img v-if="item.cancelTicket.attachMent !=''" style="width: 200px;vertical-align: top;" :src="item.cancelTicket.attachMent"><span v-else>暂无</span></Col>
        <Col span="6">备注：{{item.cancelTicket.remark | isEmpty('暂无')}}</Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card" title="退货确认信息">
      <Form :mode="dataApi" :label-width="100" inline>
        <FormItem label="确认备注：">
          {{dataApi.inRemark}}
        </FormItem>
        <FormItem :label="`附件${index+1}：`" v-for="(item,index) in attachMent" :key="index">
          <img :src="item" style="width: 120px;">
        </FormItem>
      </Form>
    </Card>
    <Card :bordered="false" class="card" title="实单">
      <Row class="row-list">
        <Col span="4">销售总额：￥{{item.newSaleTicket.saleMoney}}</Col>
        <Col span="4">不含税总金额：￥{{item.newSaleTicket.moneyWithoutTax}}</Col>
        <Col span="4">税：￥{{item.newSaleTicket.tax}}</Col>
        <Col span="4">总重量：{{item.newSaleTicket.weight}}KG</Col>
        <Col span="4">总件数：{{item.newSaleTicket.number}}</Col>
      </Row>
      <Table width="100%" :columns="tableHeader" :data="item.newSaleTicket.saleTicketInfos"></Table>
      <h4 style="padding: 15px 0;">其他费用<span class="other-cost">原单中的其他费用需全部退掉，如有需要请在实单中另开</span></h4>
      <Table width="100%" :columns="costHeader" :data="item.newSaleTicket.saleTicketCosts"></Table>
    </Card>
    <Card :bordered="false" class="card" title="操作日志">
      <Table width="100%" :columns="logHeader" :data="item.cancelTicketLog"></Table>
    </Card>
  </div>
</template>

<script>
import {
  dateformat
} from '@/utils/filters.js'
  import uploadPic from '@/components/basics/uploadPic.vue'
  export default {
    components: {
      uploadPic
    },
    data() {
      return {
        item: {
          oldSaleTicket: {},
          cancelTicket: {},
          newSaleTicket: {},
          cancelTicketLog: []
        },
        dataApi: {
          zfId: '',
          inRemark: '',
          inAttachMent: ''
        },
        attachMent: [],
        logHeader: [{
          title: '操作时间',
          key: 'updateTime',
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.updateTime != '' ? dateformat(params.row.updateTime):'暂无')
          }
        }, {
          title: '操作人',
          key: 'updateUser',
          minWidth: 150
        }, {
          title: '操作内容',
          key: 'description',
          minWidth: 150
        }],
        costHeader: [{
          title: '序号',
          key: 'index',
          minWidth: 60,
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        }, {
          title: '费用名称',
          key: 'costName',
          minWidth: 150
        }, {
          title: '数量',
          key: 'number',
          minWidth: 150
        }, {
          title: '单价',
          key: 'price',
          minWidth: 150
        }, {
          title: '税/%',
          key: 'tax',
          minWidth: 150
        }, {
          title: '金额',
          key: 'money',
          minWidth: 150
        }],
        tableHeader: [{
          title: '序号',
          key: 'index',
          minWidth: 60,
          render: (h, params) => {
            return h('span', params.index + 1)
          }
        }, {
          title: '货物名称',
          key: 'cargoName',
          minWidth: 150
        }, {
          title: '产地',
          key: 'proPlaceName',
          minWidth: 150
        }, {
          title: '规格',
          key: 'specifications',
          minWidth: 150,
          render: (h, params) => {
            let str =
              params.row.specifications != "" ?
              params.row.specifications :
              `${params.row.height}*${params.row.width}*${
                            params.row.length
                          }`;
            return h("div", str);
          }
        }, {
          title: '公差',
          key: 'tolerance',
          minWidth: 150
        }, {
          title: '单件重量(KG)',
          key: 'singleWeight',
          minWidth: 150
        }, {
          title: '产品单位',
          key: 'numberUnit',
          minWidth: 150,
          render: (h,params) =>{
            let str = `${params.row.weightUnit}/${params.row.numberUnit}`;
            return h("span", str);
          }
        }, {
          title: '卷号',
          key: 'coiledSheetNum',
          minWidth: 100
        }, {
          title: '数量',
          key: 'number',
          minWidth: 100
        }, {
          title: '理计重量(KG)',
          key: 'meterWeight',
          minWidth: 120,
          render: (h,params) =>{
            let str = (params.row.singleWeight*params.row.number).toFixed(3);
            return h("span", str);
          }
        }, {
          title: '过磅重量(KG)',
          key: 'poundWeight',
          minWidth: 120
        }, {
          title: '过磅单重(KG)',
          key: 'poundSingleWeight',
          minWidth: 120
        }, {
          title: '备注',
          key: 'remark',
          minWidth: 100
        }]
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      inRemark() {
        return this.item.cancelTicket.inRemark
      },
      inAttach() {
        return this.item.cancelTicket.inAttachMent
      }
    },
    filters: {
      toStatus(val) {
        switch (val * 1) {
          case 1:
            return '待退货入库'
            break;
          case 2:
            return '退货已入库'
            break;
          case 3:
            return '待财务处理'
            break;
          case 4:
            return '财务已处理'
            break;
          case 5:
            return '已完成'
            break;
          case 6:
            return '已取消'
            break;
        }
      },
      tofhStatus(val){
        switch (val * 1) {
          case 1:
            return '待支付'
            break;
          case 2:
            return '可备货'
            break;
          case 3:
            return '可发货'
            break;
          case 4:
            return '已出库'
            break;
          case 5:
            return '已完成'
            break;
          case 6:
            return '作废中'
            break;
          case 9:
            return '已作废'
            break;
        }
      },
      moneyStatus(val){
        switch (val * 1) {
          case 1:
            return '待结算'
            break;
          case 2:
            return '部分结算'
            break;
          case 3:
            return '已结算'
            break;
        }
      }
    },
    watch: {
      inRemark(newValue, oldValue) {
        this.dataApi.inRemark = newValue
      },
      inAttach(newValue, oldValue) {
        this.attachMent = newValue != '' ? JSON.parse(newValue) : []
      }
    },
    methods: {
      getData() {
        this.$http.post(this.api.findCancelTicket, {
          zfId: this.id
        }).then(res => {
          if (res.code === 1000) {
            this.item = res.data || {}
          }
        })
      },
      add() {
        this.$Modal.confirm({
          title: "退货确认提示！",
          content: "确认后无法撤销，是否继续？",
          onOk: () => {
            let params = this.$clearData(this.dataApi)
            params.zfId = this.id;
            params.inAttachMent = JSON.stringify(this.attachMent);
            this.$http.post(this.api.cancelTicketIn, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('操作成功');
                this.$router.go(-1)
              } else {
                this.$Message.error(res.message)
              }
            })
          }
        })
      },
      // 返回
      goBack() {
        this.$router.go(-1)
      },
    },
    created() {
      this.getData();
    }
  }
</script>

<style lang='less' scoped>
  .title-bar-status {
    display: inline-block;
    margin-left: 80px;
    font-weight: normal
  }
  
  .details {
    .card {
      margin-bottom: 15px;
    }
    .row-list {
      margin-bottom: 10px;
      &:last-child {
        margin: 0;
      }
    }
  }
  .other-cost{
    display: inline-block;
    margin-left: 10px;
    color: rgb(255, 76, 83);
  }
</style>