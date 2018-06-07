<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">{{types === 1 ? '分配供应商金额管理':'结算供应商金额管理'}}</p>
      <Button slot="extra" v-if="types === 1" type="warning" @click="add">分配</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="客户公司：">
          <Input type="text" v-model="pageApi.customerName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="供应商公司：">
          <Input type="text" v-model="pageApi.buserName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="操作人：">
          <Input type="text" v-model="pageApi.updateUser" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="操作时间：">
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
              <Col class-name="col" span="4">客户名称</Col>
              <Col class-name="col" span="4">供应商公司</Col>
              <Col class-name="col" span="4">{{types === 1? '可分配金额':'可结算金额'}}</Col>
              <Col class-name="col" span="4">{{types === 1? '总待支付金额':'总待结算金额'}}</Col>
              <Col class-name="col" span="3">操作人</Col>
              <Col class-name="col" span="3">操作时间</Col>
              <Col class-name="col" span="2">操作</Col>
            </Row>
            <Row v-for="(item,index) in list " :key="index">
              <Col class-name="col" span="4">{{item.customerName}}</Col>
              <Col class-name="col" span="4">{{item.buserName}}</Col>
              <Col class-name="col" span="4">
              <span v-if="types === 1">{{item.distributeAccount}}</span>
              <span v-else>{{item.settleAccount}}</span>
              </Col>
              <Col class-name="col" span="4">
              <span v-if="types === 1">{{item.waitDistributeAmount}}</span>
              <span v-else>{{item.waitSettleAmount}}</span>
              </Col>
              <Col class-name="col" span="3">{{item.updateUser}}</Col>
              <Col class-name="col" span="3">{{item.updateTime | dateformat}}</Col>
              <Col class-name="col" span="2">
                <Button size="small" type="warning" @click="goDetail(item)">详情</Button>
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
    <Modal v-model="show" width="1000" :mask-closable="false" :title="types === 1 ? '客户可分配金额列表':'供应商金额结算记录'">
      <Form :mode="dataApi" :label-width="85" inline>
        <FormItem label="销售单号：">
          <Input type="text" v-model="dataApi.saleTicketId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem :label="types === 1 ? '分配人：':'结算人：'">
          <Input type="text" v-model="dataApi.createUser" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="操作时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dataValue1" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="客户公司：">
          {{dataApi.customerName}}
        </FormItem>
        <FormItem label="供应商公司：">
          {{dataApi.buserName}}
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetDetail">清除</Button>
        </FormItem>
      </Form>
      <div class="card">
        <div class="card-contnet">
          <div class="table-contnet">
            <Row class-name="head">
              <Col class-name="col" span="5">{{types === 1 ? '分配金额':'结算金额'}}</Col>
              <Col class-name="col" span="5">销售单号</Col>
              <Col class-name="col" span="4">{{types === 1 ? '分配人':'结算人'}}</Col>
              <Col class-name="col" span="4">{{types === 1 ? '分配时间':'结算时间'}}</Col>
              <Col class-name="col" span="6">备注</Col>
            </Row>
            <Row class-name="head" v-for="(item,index) in detailList" :key="index">
              <Col class-name="col" span="5">{{item.amount}}</Col>
              <Col class-name="col" span="5">{{item.saleTicketId}}</Col>
              <Col class-name="col" span="4">{{item.createUser}}</Col>
              <Col class-name="col" span="4">{{item.createTime | dateformat}}</Col>
              <Col class-name="col" span="6">{{item.remark}}</Col>
            </Row>
            <Row v-if="detailList.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
            </Row>
          </div>
          <Page class="page-count" size="small" :total="totalCountDetail" show-total :current="dataApi.currentPage" :page-size="dataApi.pageSize" @on-change="changeDetailPage"></Page>
        </div>
      </div>
      <div slot="footer">
        <Button @click="show = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    props: {
      types: Number
    },
    data() {
      return {
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          customerName: '',
          buserName: '',
          timeBegin: '',
          timeEnd: '',
          aType: '',
          updateUser: ''
        },
        dataValue: ['', ''],
        dataValue1: ['', ''],
        list: [],
        totalCount: 0,
        totalCountDetail: 0,
        show: false,
        dataApi:{
          currentPage: 1,
          pageSize: 10,
          customerName: '',
          buserName:'',
          buserId:'',
          saleTicketId: '',
          type: this.types,
          createUser: '',
          timeBegin: '',
          timeEnd: ''
        },
        detailList: []
      }
    },
    computed: {
      handleFilter() {
        return {
          currentPage: this.pageApi.currentPage,
          pageSize: this.pageApi.pageSize,
          customerName: this.pageApi.customerName,
          buserName: this.pageApi.buserName,
          timeBegin: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          timeEnd: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
          aType: this.types,
          updateUser: this.pageApi.updateUser
        }
      },
      detailFilter(){
        return {
          currentPage: this.dataApi.currentPage,
          pageSize: this.dataApi.pageSize,
          customerName: this.dataApi.customerName,
          buserName: this.dataApi.buserName,
          buserId: this.dataApi.buserId,
          timeBegin: this.dataValue1[0] != '' ? this.dataValue1[0].getTime() : '',
          timeEnd: this.dataValue1[1] != '' ? this.dataValue1[1].getTime() : '',
          type: this.types,
          saleTicketId: this.dataApi.saleTicketId,
          createUser: this.dataApi.createUser
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
      'detailFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage)
            this.dataApi.currentPage = 1;
          this.getLogList(this.detailFilter)
        }, 200),
        deep: true
      }
    },
    methods: {
      resetFilter() {
        this.pageApi = {
          currentPage: 1,
          pageSize: 10,
          customerName: '',
          buserName: '',
          timeBegin: '',
          timeEnd: '',
          aType: this.types,
          updateUser: ''
        }
        this.getList(this.handleFilter)
      },
      resetDetail(){
        this.dataApi ={
          currentPage: 1,
          pageSize: 10,
          customerName: this.dataApi.customerName,
          buserName: this.dataApi.buserName,
          buserId: this.dataApi.buserId,
          timeBegin: '',
          timeEnd: '',
          type: this.types,
          saleTicketId: '',
          createUser: ''
        }
        this.dataValue1 = ['','']
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter)
      },
      changeDetailPage(page){
        this.dataApi.currentPage = page;
      },
      getList(params) {
        this.$http.post(this.api.distributeSettlementPage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      add(){
        this.$router.push('supplierAmountAdd')
      },
      goDetail(item){
        this.show = true;
        this.dataApi.customerName = item.customerName;
        this.dataApi.buserName = item.buserName;
        this.dataApi.buserId = item.buserId;
        this.getLogList(this.detailFilter)
      },
      getLogList(params){
        this.$http.post(this.api.distributeSettleLog,params).then(res =>{
          if(res.code === 1000){
            this.detailList = res.data.data;
            this.totalCountDetail = res.data.totalCount;
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
</style>