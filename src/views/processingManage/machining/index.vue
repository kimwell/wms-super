<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">加工单管理</p>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="加工单号：">
          <Input type="text" v-model="pageApi.processId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="仓库名称：">
          <Select v-model="pageApi.storeHouseName" style="width: 160px;">
              <Option v-for="(item,index) in wareHouseList" :value="item" :key="index">{{ item }}</Option>
            </Select>
        </FormItem>
        <FormItem label="加工公司名称：">
          <Input type="text" v-model="pageApi.companyName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="操作时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 100px;">
              <Option v-for="item in [{name:'待加工',value: '1'},{name:'加工中',value: '2'},{name:'待入库',value: '3'},{name:'已入库',value: '4'},{name:'已取消',value: '5'},{name:'入库重申',value: '6'}]" :value="item.value" :key="item.name">{{ item.name }}</Option>
            </Select>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="3">加工单号</Col>
            <Col class-name="col" span="3">仓库名称</Col>
            <Col class-name="col" span="3">加工公司名称</Col>
            <Col class-name="col" span="2">加工联系人</Col>
            <Col class-name="col" span="2">加工联系方式</Col>
            <Col class-name="col" span="2">下单人</Col>
            <Col class-name="col" span="2">状态</Col>
            <Col class-name="col" span="2">操作时间</Col>
            <Col class-name="col" span="5">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="item.id">
            <Col class-name="col" span="3">{{item.id}}</Col>
            <Col class-name="col" span="3">{{item.storeHouseName}}</Col>
            <Col class-name="col" span="3">{{item.processName}}</Col>
            <Col class-name="col" span="2">{{item.contactName}}</Col>
            <Col class-name="col" span="2">{{item.contactNum}}</Col>
            <Col class-name="col" span="2">{{item.ticketMan}}</Col>
            <Col class-name="col" span="2">{{item.status | toStatus}}</Col>
            <Col class-name="col" span="2">{{item.updateTime | dateformat}}</Col>
            <Col class-name="col" span="5">
            <Button size="small" type="warning" @click="goDetail(item)">详情</Button>
            <Button size="small" type="warning" @click="goJoinDetail(item)" v-if="item.status == '2'">加工入库开单</Button>
            <Button size="small" type="warning" @click="goJoinDetail(item)" v-if="item.status == '6'">编辑加工入库开单</Button>
            <Button size="small" type="warning" @click="goJoinDetail(item)" v-if="item.status == '3' || item.status == '4' || item.status == '5'">加工入库开单详情</Button>
            <Button size="small" type="warning" @click="print(item)" v-if="item.status != '5'">打印</Button>
            </Col>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
    </Card>
    <Modal title="打印加工单" width="400" v-model="printShow" :mask-closable="false">
      <Spin size="large" fix v-if="spinShow">
        <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
        <div>正在生成打印加工单...</div>
      </Spin>
      <div class="card-contnet" style="padding-bottom: 10px;">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="12">加工单</Col>
            <Col class-name="col" span="12">操作</Col>
          </Row>
          <Row v-for="(item,index) in printData" :key="item.id">
            <Col class-name="col" span="12">{{`加工单_${item.orderNum}`}}</Col>
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
  export default {
    data() {
      return {
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          processId: '',
          storeHouseName: '',
          companyName: '',
          startTime: '',
          endTime: '',
          status: ''
        },
        printShow: false,
        spinShow: true,
        printData: [],
        list: [],
        totalCount: 0,
        dataValue: ['', ''],
        wareHouseList: []
      }
    },
    computed: {
      handleFilter() {
        return {
          pageSize: this.pageApi.pageSize,
          currentPage: this.pageApi.currentPage,
          processId: this.pageApi.processId,
          storeHouseName: this.pageApi.storeHouseName,
          companyName: this.pageApi.companyName,
          startTime: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          endTime: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
          status: this.pageApi.status
        }
      }
    },
    filters: {
      toStatus(val) {
        switch (val * 1) {
          case 1:
            return '待加工'
            break;
          case 2:
            return '加工中'
            break;
          case 3:
            return '待入库'
            break;
          case 4:
            return '已入库'
            break;
          case 5:
            return '已取消'
            break;
          case 6:
            return '入库重审'
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
      getList(params) {
        this.$http.post(this.api.findProcessTicketList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount;
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
          processId: '',
          storeHouseName: '',
          companyName: '',
          startTime: '',
          endTime: '',
          status: ''
        }
        this.dataValue = ['', '']
        this.getList(this.handleFilter)
      },
      getWareHouse() {
        this.$http.post(this.api.findAWareHouse, {
          name: ''
        }).then(res => {
          if (res.code === 1000) {
            this.wareHouseList = res.data;
          }
        })
      },
      //  查看详情
      goDetail(item) {
        this.$router.push('./machiningDetail/' + item.id)
      },
      // 加工入库开单、加入入库开单详情
      goJoinDetail(item) {
        this.$router.push('./joinDetail/' + item.id)
      },
      //  打印
      print(item) {
        this.printShow = true;
        this.$http.post(this.api.processPrint, {
          processId: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.spinShow = false;
            this.printData = res.data;
          } else {
            this.$Message.error(res.message);
          }
        })
      },
    },
    created() {
      this.getList(this.handleFilter);
      this.getWareHouse();
    }
  }
</script>

<style lang='less' scoped>
  .card {
    position: relative;
    margin-bottom: 20px;
    .page-count {
      position: absolute;
      right: 0;
      bottom: 0;
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