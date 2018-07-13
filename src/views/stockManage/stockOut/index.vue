<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">出库单管理</p>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="出库单号：">
          <Input type="text" v-model="pageApi.outBoundId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="销售单号：">
          <Input type="text" v-model="pageApi.saleTicketId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="出库时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="客户名称：">
          <Input type="text" v-model="pageApi.buyCompanyName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="仓库名称：">
          <Select v-model="pageApi.storeHouseName" style="width: 150px;">
                <Option v-for="(item,index) in storeHouseList" :value="item" :key="index">{{ item }}</Option>
              </Select>
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
        <Table border :columns="tableHeader" :data="list"></Table>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
    </Card>
    <Modal title="出库单详情" width="960" v-model="show" :mask-closable="false">
      <div class="row-wrapper">
        <h3>基本信息
          <span>出库单号：{{detailItem.outBound.id}}</span>
          <span>销售单号：{{detailItem.saleTicket.id}}</span>
          <span>状态：{{detailItem.saleTicket.status | toStatus}}</span>
        </h3>
        <Row class="row-list">
          <Col span="8">客户单位：{{detailItem.saleTicket.buyCompanyName}}</Col>
          <Col span="8">仓库：{{detailItem.saleTicket.storeHouseName}}</Col>
          <Col span="8">下单日期：{{detailItem.saleTicket.ticketTime | dateformat('yyyy-MM-dd')}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="8">跟单员：{{detailItem.saleTicket.merchandiser}}</Col>
          <Col span="8">提货车主：{{detailItem.saleTicket.carMan}}</Col>
          <Col span="8">提货车号：{{detailItem.saleTicket.carId}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="8">审核人：{{detailItem.saleTicket.checkMan}}</Col>
          <Col span="8">备注：{{detailItem.saleTicket.remark}}</Col>
          <Col span="8">出库备注：{{detailItem.outBound.remark}}</Col>
        </Row>
      </div>
      <div class="row-wrapper">
        <h3>订单详细信息</h3>
        <Table border :columns="columns" :data="detailItem.saleTicket.saleTicketInfos"></Table>
      </div>
      <div class="row-wrapper" v-if="detailItem.saleTicket.status == '3'">
        <h3>出库确认信息</h3>
        <Form :label-width="100" ref="form" :model="outApi" :rules="rules" inline>
          <FormItem label="提货车主：" prop="carMan">
            <Input type="text" v-model="outApi.carMan" placeholder="请输入..."></Input>
          </FormItem>
          <FormItem label="提货车号：" prop="carId">
            <Input type="text" v-model="outApi.carId" placeholder="请输入..."></Input>
          </FormItem>
          <FormItem label="出库备注：">
            <Input type="text" v-model="outApi.remark" placeholder="请输入..."></Input>
          </FormItem>
        </Form>
      </div>
      <div class="row-wrapper" v-if="detailItem.saleTicket.status == '4'">
        <h3>出库确认信息</h3>
        <Row class="row-list">
          <Col span="6">提货车主：{{detailItem.outBound.carMan}}</Col>
          <Col span="6">提货车号：{{detailItem.outBound.carId}}</Col>
          <Col span="6">备注：{{detailItem.outBound.remark}}</Col>
        </Row>
      </div>
      <div slot="footer">
        <div v-if="detailItem.saleTicket.status == '3'">
          <Button type="text" @click="show = false">取消</Button>
          <Button type="primary" @click="save">确认出库</Button>
        </div>
      </div>
    </Modal>
    <Modal title="打印出库单" width="400" v-model="printShow" :mask-closable="false">
      <Spin size="large" fix v-if="spinShow">
        <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
        <div>正在生成打印出库单...</div>
      </Spin>
      <div class="card-contnet" style="padding-bottom: 10px;">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="12">出库单</Col>
            <Col class-name="col" span="12">操作</Col>
          </Row>
          <Row v-for="(item,index) in printData" :key="item.id">
            <Col class-name="col" span="12">{{`出库单_${item.orderNum}`}}</Col>
            <Col class-name="col" span="12">
            <a class="ivu-btn ivu-btn-warning ivu-btn-small" :href="item.viewUrl" target="_blank">打印</a>
            </Col>
          </Row>
          <Row v-if="printData.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters.js'
  export default {
    data() {
      return {
        pageApi: {
          pageSize: 10,
          currentPage: 1,
          outBoundId: '',
          startTime: '',
          endTime: '',
          storeHouseName: '',
          buyCompanyName: '',
          status: '',
          sellCompanyName: '',
          saleTicketId: ''
        },
        outApi: {
          outBoundId: '',
          carMan: '',
          carId: '',
          remark: ''
        },
        printShow: false,
        spinShow: true,
        printData: [],
        storeHouseList: [],
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
          outBound: {},
          saleTicket: {
            saleTicketCosts: [],
            saleTicketInfos: []
          }
        },
        rules: {
          carMan: [{
            required: true,
            message: '请输入提货车主',
            trigger: 'blur'
          }],
          carId: [{
            required: true,
            message: '请输入车牌号',
            trigger: 'blur'
          }, {
            validator: (rule, value, callback) => {
              let xreg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF]$)|([DF][A-HJ-NP-Z0-9][0-9]{4}$))/;
              let creg = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1}$/;
              if (value.length == 7) {
                if (creg.test(value)) {
                  callback();
                } else {
                  return callback(new Error('请输入正确的车牌号'));
                }
              } else if (value.length == 8) {
                if (xreg.test(value)) {
                  callback();
                } else {
                  return callback(new Error('请输入正确的车牌号'));
                }
              } else {
                return callback(new Error('请输入正确的车牌号'));
              }
            },
            trigger: 'blur'
          }]
        },
        tableHeader: [{
          title: "出库单号",
          key: "id",
          minWidth: 200
        }, {
          title: "销售单号",
          key: "saleTicketId",
          minWidth: 200
        }, {
          title: "供应商名称",
          key: "sellCompanyName",
          minWidth: 200
        }, {
          title: "客户名称",
          key: "buyCompanyName",
          minWidth: 200
        }, {
          title: "仓库名称",
          key: "storeHouseName",
          minWidth: 150
        }, {
          title: "出库操作人",
          key: "outMan",
          minWidth: 150,
          render: (h, params) => {
            let t = params.row.outMan != '' ? params.row.outMan : '暂无'
            return h('span', t)
          }
        }, {
          title: "出库时间",
          key: "outTime",
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.outTime != '' ? dateformat(params.row.outTime) : '暂无')
          }
        }, {
          title: "状态",
          key: "status",
          minWidth: 150,
          render: (h, params) => {
            let t = params.row.status != '' ? this.status(params.row.status) : ''
            return h('span', t)
          }
        }, {
          title: "最近更新人",
          key: "updateUser",
          minWidth: 150
        }, {
          title: "最近更新时间",
          key: "updateTime",
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.updateTime != '' ? dateformat(params.row.updateTime) : '暂无')
          }
        }, {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 140,
          render: (h, params) => {
            let status = params.row.status;
            if (status === '6' || status === '9') {
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
                      this.goDetail(params.row)
                    }
                  }
                }, '详情')
              ]);
            } else {
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
                      this.goDetail(params.row)
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
                      this.print(params.row)
                    }
                  }
                }, '打印')
              ]);
            }
          }
        }],
        columns: [{
            title: "序号",
            key: "cargoName",
            width: 100,
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
            title: "单件重量(KG)",
            key: "singleWeight",
            width: 120
          },
          {
            title: "产品单位",
            key: "numberUnit",
            width: 100,
            render: (h, params) => {
              let str = `${params.row.weightUnit}/${params.row.numberUnit}`;
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
            title: "理计重量(KG)",
            key: "meterWeight",
            width: 120,
            render: (h, params) => {
              let str = params.row.singleWeight != '' ? (params.row.singleWeight * params.row.number).toFixed(3) : ''
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
            key: "poundSingleWeight",
            width: 120
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
          outBoundId: this.pageApi.outBoundId,
          buyCompanyName: this.pageApi.buyCompanyName,
          sellCompanyName: this.pageApi.sellCompanyName,
          startTime: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          endTime: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
          status: this.pageApi.status,
          storeHouseName: this.pageApi.storeHouseName,
          saleTicketId: this.pageApi.saleTicketId
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
          sellCompanyName: '',
          saleTicketId: ''
        }
        this.dataValue = ['', '']
        this.getList(this.handleFilter)
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter)
      },
      getList(params) {
        this.$http.post(this.api.findOutBoundList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount
          }
        })
      },
      status(val) {
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
      getStoreHouse() {
        this.$http.post(this.api.findAWareHouse).then(res => {
          if (res.code === 1000) {
            this.storeHouseList = res.data;
          }
        })
      },
      goDetail(data) {
        this.show = true;
        this.outApi.outBoundId = data.id;
        this.$http.post(this.api.findOunBound, {
          outBoundId: data.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = res.data;
          }
        })
      },
      //  打印
      print(item) {
        this.printShow = true;
        this.$http.post(this.api.saleTicketPrint, {
          saleTicketId: item.saleTicketId
        }).then(res => {
          if (res.code === 1000) {
            this.spinShow = false;
            this.printData = res.data;
          } else {
            this.$Message.error(res.message);
          }
        })
      },
      //  确认出库
      save() {
        this.$refs.form.validate(valid => {
          if (valid) {
            let params = this.$clearData(this.outApi)
            this.$http.post(this.api.saleTicketOut, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('出库成功');
                this.show = false;
                this.getList(this.handleFilter);
                this.outApi = {
                  outBoundId: '',
                  carMan: '',
                  carId: '',
                  remark: ''
                }
              } else {
                this.$Message.error(res.message)
              }
            })
          } else {
            this.$Message.warning('请填写必填项!')
          }
        })
      }
    },
    created() {
      this.getList(this.handleFilter);
      this.getStoreHouse();
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