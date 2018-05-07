<template>
  <div class="comm-container">
    <h2 class="panel-title">专员管理查询</h2>
    <div class="action-div">
      <Form :mode="filterData" :label-width="80" inline style="margin-top:24px;">
        <FormItem label="绑定专员">
          <Select v-model="filterData.saleId" placeholder="请选择" style="width:200px">
                      <Option v-for="item in saleManList" :key="item.userId" :value="item.userId">{{ item.userName }}  {{item.userMobile}}</Option>
                  </Select>
        </FormItem>
        <FormItem label="查询日期:">
          <DatePicker type="daterange" :clearable="false" :options="dateOption" v-model="dataValue" placement="bottom-end" placeholder="选择日期" style="width:200px;"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
        <FormItem>
          <a class="warning" target="_blank" :href="this.api.exportExcel+'?loginId='+this.ajaxHead.loginId+'&s=salesManData&authorization='+this.ajaxHead.authorization+'&saleId='+this.filterApi.saleId+'&startTime='+this.filterApi.startTime+'&endTime='+this.filterApi.endTime">导出EXCEL</a>
        </FormItem>
      </Form>
      <div class="panel">
        <Card :bordered="false" class="card">
          <div class="card-contnet">
            <div class="table-contnet">
              <Row class-name="head">
                <Col class-name="col" span="3">平台专员</Col>
                <Col class-name="col" span="3">专员账号</Col>
                <Col class-name="col" span="2">总绑定用户数</Col>
                <Col class-name="col" span="2">注册商户数</Col>
                <Col class-name="col" span="2">有效登录数</Col>
                <Col class-name="col" span="2">求购数</Col>
                <Col class-name="col" span="2">求购成交数</Col>
                <Col class-name="col" span="2">求购成交率</Col>
                <Col class-name="col" span="2">订单数量</Col>
                <Col class-name="col" span="2">订单完成数</Col>
                <Col class-name="col" span="2">订单完成率</Col>
              </Row>
              <Row v-for="(item,index) in listData" :key="item.id">
                <Col class-name="col" span="3">{{item.userName}}</Col>
                <Col class-name="col" span="3">{{item.userMobile}}</Col>
                <Col class-name="col" span="2">{{item.totalBindUserNum}}</Col>
                <Col class-name="col" span="2">{{item.newBindBuserNum}}</Col>
                <Col class-name="col" span="2">{{item.buserLoginCount}}</Col>
                <Col class-name="col" span="2">{{item.ironBuyNum}}</Col>
                <Col class-name="col" span="2">{{item.ironBuyFinishNum}}</Col>
                <Col class-name="col" span="2">{{item.ironBuyPercent}}%</Col>
                <Col class-name="col" span="2">{{item.storeOrderNum}}</Col>
                <Col class-name="col" span="2">{{item.storeOrderFinishNum}}</Col>
                <Col class-name="col" span="2">{{item.storeOrderPercent}}%</Col>
              </Row>
              <Row v-if="listData.length == 0">
                <Col class-name="col" span="24">暂无数据</Col>
              </Row>
            </div>
            <div style="text-align:right;padding-top:20px;"><span style="display:inline-block;margin-right:20px;">共{{totalCount}}专员</span>新注册商户总数:{{totalNum}}</div>
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  export default {
    data() {
      return {
        saleManList: [],
        listData: [],
        totalCount: 0,
        filterData: {
          saleId: '',
          startTime: '',
          endTime: '',
        },
        totalNum: 0,
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
        },
      }
    },
    computed: {
      filterApi() {
        return {
          saleId: this.filterData.saleId,
          startTime: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          endTime: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
        }
      },
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
      ajaxHead(){
        return {
          loginId: this.$store.state.loginId,
          authorization: this.$store.state.authorization
        }
      }
    },
    watch: {
      'filterApi': {
        handler: _.debounce(function(val, oldVal) {
          this.getList();
        }, 200),
        deep: true
      }
    },
    methods: {
      resetFilter() {
        this.filterData = {
          saleId: '',
          startTime: '',
          endTime: '',
        }
        this.dataValue = ['', ''];
        this.getList();
      },
      //  获取专员
      getSalemanInfos() {
        this.$http.post(this.api.findSalemanInfos).then(res => {
          if (res.code === 1000) {
            this.saleManList = res.data;
          }
        })
      },
      getList() {
        this.$http.post(this.api.salesManData, this.filterApi).then(res => {
          if (res.code === 1000) {
            this.listData = res.data.data;
            this.totalNum = res.data.totalNewBuserNum;
            this.totalCount = res.data.totalCount
            this.listData.forEach(el => {
              el.storeOrderPercent = Number(el.storeOrderPercent).toFixed(2);
              el.ironBuyPercent = Number(el.ironBuyPercent).toFixed(2)
            })
          }
        })
      },
      getToday() {
        this.filterApi.startTime = this.todayStartTime;
        this.filterApi.endTime = this.todayEndTime;
      },
    },
    created() {
      this.getList();
      this.getSalemanInfos();
      this.getToday();
      this.dataValue[0] = this.todayStart;
      this.dataValue[1] = this.todayEnd
    }
  }
</script>

<style lang="less" scoped>
  .panel-title {
    font-size: 16px;
  }
  .warning{
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