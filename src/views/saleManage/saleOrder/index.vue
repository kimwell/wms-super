<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">加工单管理</p>
      <Form :mode="pageApi" :label-width="80" inline>
        <FormItem label="销售单号：">
          <Input type="text" v-model="pageApi.saleTicketId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="下单时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="客户名称：">
          <Input type="text" v-model="pageApi.buyCompanyName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="跟单员：">
          <Input type="text" v-model="pageApi.merchandiser" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 100px;">
                      <Option v-for="item in statusData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
        </FormItem>
        <FormItem label="供应商名称：">
          <Input type="text" v-model="pageApi.sellCompanyName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="3">销售单号</Col>
            <Col class-name="col" span="3">下单日期</Col>
            <Col class-name="col" span="3">供应商名称</Col>
            <Col class-name="col" span="3">客户名称</Col>
            <Col class-name="col" span="2">跟单员</Col>
            <Col class-name="col" span="2">重量</Col>
            <Col class-name="col" span="2">销售总额</Col>
            <Col class-name="col" span="2">状态</Col>
            <Col class-name="col" span="1">打印次数</Col>
            <Col class-name="col" span="3">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="item.id">
            <Col class-name="col" span="3">{{item.id}}</Col>
            <Col class-name="col" span="3">{{item.ticketTime | dateformat}}</Col>
            <Col class-name="col" span="3">{{item.sellCompanyName}}</Col>
            <Col class-name="col" span="3">{{item.buyCompanyName}}</Col>
            <Col class-name="col" span="2">{{item.merchandiser}}</Col>
            <Col class-name="col" span="2">{{item.weight}}</Col>
            <Col class-name="col" span="2">{{item.saleMoney}}</Col>
            <Col class-name="col" span="2">{{item.status | toStatus}}</Col>
            <Col class-name="col" span="1">{{item.printNum}}</Col>
            <Col class-name="col" span="3">
            <Button size="small" type="warning" @click="goDetail(item)">详情</Button>
            <Button size="small" type="warning">打印</Button>
            </Col>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
    </Card>
    <Modal title="当前合并货品" width="960" v-model="show" :mask-closable="false">
      <div class="row-wrapper">
        <h3>基本信息 <span>{{detailItem.status | toStatus}}</span></h3>
        <Row class="row-list">
          <Col span="8">客户单位：{{detailItem.buyCompanyName}}</Col>
          <Col span="8">仓库：{{detailItem.storeHouseName}}</Col>
          <Col span="8">下单日期：{{detailItem.ticketTime | dateformat}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="8">跟单员：{{detailItem.merchandiser}}</Col>
          <Col span="8">审核人：{{detailItem.checkMan}}</Col>
          <Col span="8">提货车主：{{detailItem.carMan}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="8">提货车号：{{detailItem.carId}}</Col>
          <Col span="8">备注：{{detailItem.remark}}</Col>
        </Row>
      </div>
      <div class="row-wrapper">
        <h3>订单详细信息</h3>
        <Row class="row-list">
          <Col span="8">销售总额：{{detailItem.saleMoney}}</Col>
          <Col span="8">不含税总金额：{{detailItem.moneyWithoutTax}}</Col>
          <Col span="8">税：{{detailItem.tax}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="8">总重量：{{detailItem.weight}}</Col>
          <Col span="8">总件数：{{detailItem.number}}</Col>
        </Row>
        <Table border :columns="columns" :data="detailItem.saleTicketInfos"></Table>
      </div>
      <div class="row-wrapper">
        <h3>其他费用</h3>
        <div class="card-contnet">
          <div class="table-contnet">
            <Row class-name="head">
              <Col class-name="col" span="3">序号</Col>
              <Col class-name="col" span="6">费用名称</Col>
              <Col class-name="col" span="6">数量</Col>
              <Col class-name="col" span="6">单价</Col>
              <Col class-name="col" span="3">金额</Col>
            </Row>
            <Row v-for="(item,index) in detailItem.saleTicketCosts" :key="index">
              <Col class-name="col" span="3">{{index}}</Col>
              <Col class-name="col" span="6">{{item.costName}}</Col>
              <Col class-name="col" span="6">{{item.number}}</Col>
              <Col class-name="col" span="6">{{item.price}}</Col>
              <Col class-name="col" span="3">{{item.money}}</Col>
            </Row>
          </div>
        </div>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi: {
          pageSize: 10,
          currentPage: 1,
          saleTicketId: '',
          startTime: '',
          endTime: '',
          buyCompanyName: '',
          merchandiser: '',
          status: '',
          sellCompanyName: ''
        },
        dataValue: ['', ''],
        statusData: [{
          label: '待支付',
          value: '1'
        }, {
          label: '可备货',
          value: '2'
        }, {
          label: '可发货',
          value: '3'
        }, {
          label: '已出库',
          value: '4'
        }, {
          label: '已完成',
          value: '5'
        }, {
          label: '作废中',
          value: '6'
        }, {
          label: '已作废',
          value: '9'
        }],
        list: [],
        totalCount: 0,
        show: false,
        detailItem: {
          saleTicketCosts: [],
          saleTicketInfos: []
        },
        columns: [{
            title: "序号",
            key: "cargoName",
            width: 100,
            render: (h, params) => {
              let str = params.row._index;
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
                `${params.row.height}*${params.row.width}*${
                          params.row.length
                        }`;
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
              let str = `${params.row.numberUnit}/${params.row.weightUnit}`;
              return h("div", str);
            }
          },
          {
            title: "卷号",
            key: "coiledSheetNum",
            width: 180,
          },
          {
            title: "数量",
            key: "number",
            width: 100,
          },
          {
            title: "理计重量",
            key: "ljWeight",
            width: 100
          },
          {
            title: "过磅重量",
            key: "poundWeight",
            width: 100,
          },
          {
            title: "过磅单重",
            key: "gbWeight",
            width: 100
          },
          {
            title: "卷重",
            key: "coiledWeight",
            width: 100,
          },
          {
            title: "单价",
            key: "price",
            width: 100,
          },
          {
            title: "税",
            key: "tax",
            width: 100,
          },
          {
            title: "金额",
            key: "money",
            width: 100,
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
      }
    },
    computed: {
      handleFilter() {
        return {
          pageSize: this.pageApi.pageSize,
          currentPage: this.pageApi.currentPage,
          saleTicketId: this.pageApi.saleTicketId,
          buyCompanyName: this.pageApi.buyCompanyName,
          sellCompanyName: this.pageApi.sellCompanyName,
          startTime: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          endTime: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
          status: this.pageApi.status,
          merchandiser: this.pageApi.merchandiser
        }
      }
    },
    filters: {
      toStatus(val) {
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
          pageSize: 10,
          currentPage: 1,
          saleTicketId: '',
          startTime: '',
          endTime: '',
          buyCompanyName: '',
          merchandiser: '',
          status: '',
          sellCompanyName: ''
        }
        this.dataValue = ['', '']
        this.getList(this.handleFilter)
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter)
      },
      getList(params) {
        this.$http.post(this.api.findSaleTicketList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount
          }
        })
      },
      goDetail(data) {
        this.show = true;
        this.$http.post(this.api.findSaleTicket, {
          saleTicketId: data.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = res.data;
          }
        })
      }
    },
    created() {
      this.getList(this.handleFilter);
    }
  }
</script>

<style lang='less' scoped>
  .card {
    position: relative;
    margin-bottom: 20px;
    }
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

  
  .row-wrapper {
    margin-bottom: 15px;
    .row-list {
      margin-bottom: 10px;
    }
    h3 {
      height: 36px;
      line-height: 36px;
      text-indent: 2em;
      background-color: #e6e6e6;
      margin-bottom: 15px;
      span {
        display: inline-block;
        padding-left: 30px;
      }
    }
  }
</style>