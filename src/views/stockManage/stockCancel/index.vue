<template>
  <Card :bordered="false" class="card">
    <p slot="title">作废管理</p>
    <Form :mode="pageApi" :label-width="100" inline>
      <FormItem label="作废单号：">
        <Input type="text" v-model="pageApi.zfId" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="原销售单号：">
        <Input type="text" v-model="pageApi.saleTicketId" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="退货时间：">
        <DatePicker type="datetimerange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 330px"></DatePicker>
      </FormItem>
      <FormItem label="原单下单日期：">
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
  </Card>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters.js'
  export default {
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
        tableHeader: [{
          title: '作废单号',
          key: 'id',
          minWidth: 200
        }, {
          title: '原销售单号',
          key: 'ticketId',
          minWidth: 200
        }, {
          title: '原单下单日期',
          key: 'ticketTime',
          minWidth:150,
          render: (h, params) => {
            return h('span', params.row.ticketTime != '' ? dateformat(params.row.ticketTime,'yyyy-MM-dd') : '暂无')
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
          title: '退货备注',
          key: 'remark',
          minWidth: 200
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
            return h('span', params.row.createTime != '' ? dateformat(params.row.createTime) : '暂无')
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
            return h('span', params.row.updateTime != '' ? dateformat(params.row.updateTime) : '暂无')
          }
        }, {
          title: '最近更新人',
          key: 'updateUser',
          minWidth: 150
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
                    // this.deleteItem(params.row)
                  }
                }
              }, '打印')
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
        this.$router.push('./stockCancelDetail/' + data.id)
      }
    },
    created() {
      this.getList(this.handleFilter)
    },
    beforeRouteEnter(to, from, next) {
      next();
      let name  = from.name;
      if(name == 'stockOut' || name == 'stockInto' || name == 'goods'){
        to.meta.keepAlive = false;
      }
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
</style>