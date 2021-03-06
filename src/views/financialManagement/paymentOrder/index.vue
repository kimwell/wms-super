<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">付款管理列表</p>
      <Button slot="extra" type="primary" @click="openModel">新增</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="客户名称：">
          <Input type="text" v-model="pageApi.customerName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="付款时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card">
        <div class="card-contnet">
          <Table border :columns="tableHeader" :data="list"></Table>
          <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="cancelShow" width="500" :mask-closable="false" :closable="false" title="作废">
      <Form :label-width="110" ref="cancelForm" :model="cancelData" :rules="cancelRules">
        <FormItem label="备注：" prop="deleteRemark">
          <Input type="text" v-model="cancelData.deleteRemark" style="width: 300px;" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelHide">取消</Button>
        <Button type="primary" @click="cancelAction">确定</Button>
      </div>
    </Modal>
    <Modal v-model="detailShow" width="800" :mask-closable="false" title="付款详情">
      <Row class="row-list">
        <Col span="8">客户名称：{{activeItem.customerName}}</Col>
        <Col span="8">出账金额：{{activeItem.amount}}</Col>
        <Col span="8">客户账号：{{activeItem.customerBankCardNo}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">平台账号：{{activeItem.bankCardNo}}</Col>
        <Col span="8">出账时间：{{activeItem.inTime | dateformat}}</Col>
        <Col span="8">银行账号流水号：{{activeItem.bankTradeNo}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">附件：
        <span v-if="activeItem.fileAddress !=''">
              <Button type="primary" size="small" @click="previewImg(activeItem.fileAddress)">查看附件</Button>
            </span>
        <span v-else>暂无</span>
        </Col>
        <Col span="8">操作人：{{activeItem.updateUser}}</Col>
        <Col span="8">操作时间：{{activeItem.updateTime | dateformat}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">费用科目：{{activeItem.feeType}}</Col>
        <Col span="8">备注：{{activeItem.remark}}</Col>
      </Row>
      <h2 style="margin-bottom: 16px;">结算客户</h2>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="8">客户名称</Col>
            <Col class-name="col" span="8">结算金额</Col>
            <Col class-name="col" span="8">待结算金额</Col>
          </Row>
          <Row v-for="(item,index) in activeItem.paymentOrderAmountItems" :key="item.id">
            <Col class-name="col" span="8">{{item.customerName}}</Col>
            <Col class-name="col" span="8">{{item.amount}}</Col>
            <Col class-name="col" span="8">{{item.waitSettleAmount}}</Col>
          </Row>
        </div>
      </div>
      <div slot="footer">
        <Button @click="detailShow = false">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="prevShow" width="800" :mask-closable="false" title="预览附件">
      <div class="showImg">
        <img :src="prevImgSrc">
      </div>
      <div slot="footer">
        <Button @click="prevShow = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters.js'
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
        list: [],
        totalCount: 0,
        dataValue: ['', ''],
        cancelShow: false,
        cancelData: {
          id: '',
          deleteRemark: ''
        },
        cancelRules: {
          deleteRemark: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        detailShow: false,
        activeItem: {},
        prevShow: false,
        prevImgSrc: '',
        tableHeader: [{
          title: "客户名称",
          key: "customerName",
          minWidth: 200
        }, {
          title: "付款金额",
          key: "amount",
          minWidth: 150
        }, {
          title: "客户账号",
          key: "customerBankCardNo",
          minWidth: 200
        }, {
          title: "平台账号",
          key: "bankCardNo",
          minWidth: 200
        }, {
          title: '费用科目',
          key: 'feeType',
          minWidth: 150
        }, {
          title: "付款时间",
          key: "inTime",
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.inTime != '' ? dateformat(params.row.inTime) : '暂无')
          }
        }, {
          title: "银行账号流水号",
          key: "bankTradeNo",
          minWidth: 200
        }, {
          title: "附件",
          key: "fileAddress",
          minWidth: 100,
          render: (h, params) => {
            let str = params.row.fileAddress;
            if (str != '') {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.prevImgSrc = str
                      this.prevShow = true
                    }
                  }
                }, '查看附件')
              ]);
            } else {
              return h('span', '暂无')
            }
          }
        }, {
          title: "操作人",
          key: "updateUser",
          minWidth: 150
        }, {
          title: "操作时间",
          key: "updateTime",
          minWidth: 150,
          render: (h, params) => {
            return h('span', params.row.updateTime != '' ? dateformat(params.row.updateTime) : '暂无')
          }
        }, {
          title: "备注",
          key: "remark",
          minWidth: 200
        }, {
          title: "操作",
          key: "actinos",
          width: 150,
          fixed: 'right',
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
                    this.deleteItem(params.row)
                  }
                }
              }, '作废'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.detailShow = true;
                    this.activeItem = params.row;
                  }
                }
              }, '详情')
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
          customerName: this.pageApi.customerName,
          inTimeBegin: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          inTimeEnd: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
        }
      },
      inTime() {
        return this.dataApi.inTime != '' ? this.dataApi.inTime.getTime() : ''
      },
      allPlus() {
        let arr = 0;
        if (this.selectAllList.length != 0) {
          this.selectAllList.forEach(el => {
            console.log(el)
            return arr += Number(el.account)
          })
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
      getList(params) {
        this.$http.post(this.api.paymentOrderPage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter)
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
        this.$router.push('addPaymentOrder');
      },
      deleteItem(data) {
        this.cancelShow = true;
        this.cancelData.id = data.id;
      },
      cancelHide(){
        this.cancelShow = false;
        this.cancelData.deleteRemark = '';
      },
      // 确定作废
      cancelAction() {
        this.$refs.cancelForm.validate((valid) => {
          if (valid) {
            let params = this.$clearData(this.cancelData);
            this.$http.post(this.api.paymentOrderCancel, params).then(res => {
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
      },
      //  查看附件
      previewImg(data) {
        this.prevShow = true
        this.prevImgSrc = data;
      },
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
  
  .row-list {
    margin-bottom: 16px;
    &:last-child {
      margin: 0;
    }
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
</style>