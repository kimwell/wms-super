<template>
  <div class="comm-container">
    <h2 class="panel-title">专员管理查询</h2>
    <div class="action-div">
      <Form :mode="filterData" :label-width="80" inline style="margin-top:24px;">
        <FormItem label="平台专员">
          <Select v-model="filterData.saleManId" placeholder="请选择" style="width:150px">
              <Option v-for="item in saleManList" :key="item.userId" :value="item.userId">{{ item.userName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="查询日期">
          <DatePicker type="daterange" :clearable="false" :options="dateOption" v-model="dataValue" placement="bottom-end" placeholder="选择日期" style="width:200px;"></DatePicker>
        </FormItem>
        <FormItem label="是否登录过">
          <Select v-model="filterData.login" placeholder="请选择" style="width:150px">
              <Option v-for="item in [{id:1,name: '是'},{id: 0,name: '否'}]" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="是否求购过">
          <Select v-model="filterData.ironBuy" placeholder="请选择" style="width:150px">
              <Option v-for="item in [{id:1,name: '是'},{id: 0,name: '否'}]" :key="item.id" :value="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="商家公司">
          <Input type="text" v-model="filterData.companyName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
          <a class="warning" target="_blank" :href="this.api.exportExcel+'?loginId='+this.ajaxHead.loginId+'&s=buserData&authorization='+this.ajaxHead.authorization+'&saleManId='+this.filterApi.saleManId+'&startTime='+this.filterApi.startTime+'&endTime='+this.filterApi.endTime+'&login='+this.filterApi.login+'&ironBuy'+this.filterApi.ironBuy+'&companyName'+this.filterApi.companyName">导出EXCEL</a>
        </FormItem>
      </Form>
        <div class="panel">
            <Card :bordered="false" class="card">
                <div class="card-contnet">
                    <div class="table-contnet">
                        <Row class-name="head">
                            <Col class-name="col" span="3">商家公司</Col>
                            <Col class-name="col" span="3">入驻时间</Col>
                            <Col class-name="col" span="2">联系人</Col>
                            <Col class-name="col" span="2">联系方式</Col>
                            <Col class-name="col" span="2">负责专员</Col>
                            <Col class-name="col" span="2">专员账号</Col>
                            <Col class-name="col" span="2">是否登陆过</Col>
                            <Col class-name="col" span="2">是否求购过</Col>
                            <Col class-name="col" span="1">求购天数</Col>
                            <Col class-name="col" span="1">登录天数</Col>
                            <Col class-name="col" span="2">求购使用率</Col>
                            <Col class-name="col" span="2">有效登录率</Col>
                        </Row>
                        <Row v-for="(item,index) in list" :key="item.id">
                            <Col class-name="col" span="3">{{item.companyName}}</Col>
                            <Col class-name="col" span="3">{{item.beBuserTime | dateformat}}</Col>
                            <Col class-name="col" span="2">{{item.contactName}}</Col>
                            <Col class-name="col" span="2">{{item.contactNum}}</Col>
                            <Col class-name="col" span="2">{{item.saleName}}</Col>
                            <Col class-name="col" span="2">{{item.saleMobile}}</Col>
                            <Col class-name="col" span="2">{{item.isLogin ? '是':'否'}}</Col>
                            <Col class-name="col" span="2">{{item.isIronBuy ? '是':'否'}}</Col>
                            <Col class-name="col" span="1">{{item.ironNum}}</Col>
                            <Col class-name="col" span="1">{{item.signNum}}</Col>
                            <Col class-name="col" span="2">{{item.ironRate}}%</Col>
                            <Col class-name="col" span="2">{{item.signRate}}%</Col>
                        </Row>
                        <Row v-if="list.length == 0">
                            <Col class-name="col" span="24">暂无数据</Col>
                        </Row>
                    </div>
                    <Page class="page-count" size="small" :total="totalCount" show-total :page-size="filterData.pageSize" @on-change="changePage"></Page>
                </div>
            </Card>
          </div> 
        </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        filterData: {
          saleManId:'',
          login: '',
          ironBuy: '',
          companyName: '',
          startTime: '',
          endTime: '',
          currentPage: 1,
          pageSize: 10
        },
        totalCount: 0,
        list: [],
        saleManList: [],
        dataValue: ['', ''],
        dateOption: {
          shortcuts: [{
              text: '最近一周',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
              }
            },
            {
              text: '最近一个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: '最近三个月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                return [start, end];
              }
            }
          ]
        }
      }
    },
    computed: {
      todayStartTime() {
        let now = new Date();
        now.setHours(0, 0, 0, 0);
        return now.getTime()
      },
      todayEndTime() {
        return this.todayStartTime + 86400000;
      },
      todayStart() {
        return new Date(this.todayStartTime)
      },
      todayEnd() {
        return new Date(this.todayEndTime)
      },
      ajaxHead() {
        return {
          loginId: this.$store.state.loginId,
          authorization: this.$store.state.authorization
        }
      },
      filterApi(){
        return {
          saleManId: this.filterData.saleManId,
          login: this.filterData.login,
          ironBuy: this.filterData.ironBuy,
          companyName: this.filterData.companyName,
          startTime: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          endTime: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
          currentPage: this.filterData.currentPage,
          pageSize: this.filterData.pageSize
        }
      }
    },
    watch: {
      'filterApi': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if(val.currentPage == oldVal.currentPage)
              this.filterData.currentPage = 1;
            this.getList();
        }, 200),
        deep: true
      }
    },
    methods: {
      changePage(page){
        this.filterData.currentPage = page;
        this.getList();
      },
      resetFilter(){
        this.filterData = {
          saleManId:'',
          login: '',
          ironBuy: '',
          companyName: '',
          startTime: '',
          endTime: '',
          currentPage: 1,
          pageSize: 10
        }
        this.dataValue = ['','']
      },
      //  获取专员
      getSalemanInfos() {
        this.$http.post(this.api.findSalemanInfos).then(res => {
          if (res.code === 1000) {
            this.saleManList = res.data;
          }
        })
      },
      // 查询列表
      getList(){
        this.$http.post(this.api.buserData,this.filterApi).then(res => {
          if(res.code === 1000){
            this.list = res.data.list;
            this.totalCount = res.data.totalCount
          }
        })
      }
    },
    mounted () {
      this.getSalemanInfos();
      this.getList();
    }
  }
</script>

<style lang="less" scoped>
  .panel-title {
    font-size: 16px;
  }
  
  .warning {
    display: inline-block;
    background: #f90;
    color: #fff;
    border-radius: 4px;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
  }
  
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
      border-left: 1px solid #d0d0d0;
      .head {
        background-color: #ddd;
      }
      .col {
        height: 40px;
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