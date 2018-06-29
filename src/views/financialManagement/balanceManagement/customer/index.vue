<template>
  <div class="page-wrapper">
    <Form :mode="pageApi" :label-width="100" inline>
      <FormItem label="客户公司名称：">
        <Input type="text" v-model="pageApi.customerName" @on-blur="serachList" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem>
        <Button type="warning" @click.native="resetFilter">清除</Button>
      </FormItem>
    </Form>
    <div class="card">
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="6">客户公司名称</Col>
            <Col class-name="col" span="6">账户余额(元)</Col>
            <Col class-name="col" span="6">未完成分配订单数</Col>
            <Col class-name="col" span="6">操作</Col>
          </Row>
          <Row v-for="(item,index) in list " :key="index">
            <Col class-name="col" span="6">{{item.customerName}}</Col>
            <Col class-name="col" span="6">{{item.account}}</Col>
            <Col class-name="col" span="6">{{item.waitDistributeOrderNum}}</Col>
            <Col class-name="col" span="6">
            <Button size="small" type="warning" @click="openModel(item)">详情</Button>
            </Col>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
    </div>
    <Modal v-model="show" width="1000" :mask-closable="false" title="账户余额详情">
      <Form :mode="detailApi" :label-width="80" inline>
        <FormItem label="金额：">
          <Select v-model="detailApi.toZero" style="width: 100px;">
                <Option v-for="item in [{value: 1,label: '正'},{value: 0,label: '负'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
        </FormItem>
        <FormItem label="费用科目：">
          <Select v-model="detailApi.feeType" style="width: 100px;">
                  <Option v-for="(item,index) in feeTypeList" :value="item" :key="index">{{ item }}</Option>
                </Select>
        </FormItem>
        <FormItem label="交易时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetDetail">清除</Button>
        </FormItem>
      </Form>
      <div class="card">
        <div class="card-contnet">
          <div class="table-contnet">
            <Row class-name="head">
              <Col class-name="col" span="3">金额</Col>
              <Col class-name="col" span="4">费用科目</Col>
              <Col class-name="col" span="4">收支款账号</Col>
              <Col class-name="col" span="4">银行流水号</Col>
              <Col class-name="col" span="2">附件</Col>
              <Col class-name="col" span="4">交易时间</Col>
              <Col class-name="col" span="3">备注</Col>
            </Row>
            <Row v-for="(item,index) in detailList " :key="index">
              <Col class-name="col" span="3">{{item.amount}}</Col>
              <Col class-name="col" span="4">{{item.feeType}}</Col>
              <Col class-name="col" span="4">{{item.bankCardNo}}</Col>
              <Col class-name="col" span="4">{{item.bankTradeNo}}</Col>
              <Col class-name="col" span="2">
              <div v-if="item.fileAddress !=''">
                <Button size="small" type="warning" @click="fileDetail(true,item)">查看附件</Button>
              </div>
              <div v-else>暂无</div>
              </Col>
              <Col class-name="col" span="4">{{item.tradeTime | dateformat('yyyy-MM-dd hh:mm:ss')}}</Col>
              <Col class-name="col" span="3">
              <Tooltip placement="top" v-if="item.remark != ''">
                <Button type="text" style="width: 100px;overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;">{{item.remark}}</Button>
                <div slot="content">
                  <p class="remark-p">{{item.remark}}</p>
                </div>
              </Tooltip>
              <span v-else>暂无</span>
              </Col>
            </Row>
            <Row v-if="detailList.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
            </Row>
          </div>
          <Page class="page-count" size="small" :total="detailTotalCount" show-total :current="detailApi.currentPage" :page-size="detailApi.pageSize" @on-change="detailChangePage"></Page>
        </div>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  
    <Modal v-model="fileShow" width="900" :mask-closable="false" title="查看附件">
      <div class="showImg">
        <img :src="imgSrc">
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
          customerName: ''
        },
        feeTypeList: [],
        list: [],
        totalCount: 0,
        show: false,
        detailApi: {
          customerName: '',
          currentPage: 1,
          pageSize: 10,
          feeType: '',
          createTimeBegin: '',
          createTimeEnd: '',
          toZero: ''
        },
        dataValue: ['', ''],
        detailList: [],
        detailTotalCount: 0,
        fileShow: false,
        imgSrc: '',
      }
    },
    computed: {
      handleFilter() {
        return {
          customerName: this.detailApi.customerName,
          currentPage: this.detailApi.currentPage,
          pageSize: this.detailApi.pageSize,
          feeType: this.detailApi.feeType,
          toZero: this.detailApi.toZero,
          createTimeBegin: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          createTimeEnd: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
        }
      }
    },
    watch: {
      'handleFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage)
            this.pageApi.currentPage = 1;
          this.getDetail(this.handleFilter);
        }, 200),
        deep: true
      }
    },
    methods: {
      getList() {
        this.$http.post(this.api.customerAccountPage, this.pageApi).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      getFeeType(){
        this.$http.get(this.api.findFeeType).then(res =>{
          if(res.code === 1000){
            this.feeTypeList = res.data;
          }
        })
      },
      getDetail(params) {
        this.$http.post(this.api.customerAccountHistory, params).then(res => {
          if (res.code === 1000) {
            this.detailList = res.data.data;
            this.detailTotalCount = res.data.totalCount;
          }
        })
      },
      resetFilter() {
        this.pageApi.customerName = '';
        this.getList()
      },
      resetDetail() {
        this.detailApi = {
          currentPage: 1,
          pageSize: 10,
          customerName: this.detailApi.customerName,
          feeType: '',
          toZero: '',
          createTimeBegin: '',
          createTimeEnd: ''
        }
        this.dataValue = ['', '']
        this.getDetail(this.handleFilter)
      },
      openModel(item) {
        this.show = true;
        this.detailApi.customerName = item.customerName;
        this.getDetail(this.handleFilter);
      },
      fileDetail(show, item) {
        this.fileShow = show;
        this.imgSrc = item.fileAddress;
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList();
      },
      detailChangePage(page) {
        this.detailApi.currentPage = page;
        this.getDetail(this.handleFilter);
      },
      serachList() {
        this.getList();
      }
    },
    created() {
      this.getList();
      this.getFeeType();
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
        &:last-child{
          overflow:inherit;
        }
      }
    }
    .page-count {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .remark-p{
    white-space: normal;
  }
  .showImg {
    text-align: center;
    img {
      max-width: 100%;
    }
  }
</style>