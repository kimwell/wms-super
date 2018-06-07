<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">交易数据汇总</p>
      <Form :mode="dataApi" :label-width="80" inline>
        <FormItem label="供应商：">
          <Select v-model="dataApi.buser" filterable remote :remote-method="remoteMethod" style="width: 200px;" :loading="queryLoading">
            <Option v-for="(option, index) in companyList" :value="`${option.companyName}`" :key="index">{{option.companyName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="日期：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <Row >
        <div class="item-wrapper">
          <div class="item-list">
            <div>总下单数</div>
            <div class="item-nums">{{item.allTicket}}</div>
          </div>
          <div class="item-list">
            <div>有效总订单数</div>
            <div class="item-nums">{{item.validTicket}}</div>
          </div>
          <div class="item-list">
            <div>作废总订单数</div>
            <div class="item-nums">{{item.zf}}</div>
          </div>
          <div class="item-list">
            <div>总下单金额</div>
            <div class="item-nums">{{item.allMoney != '' ? item.allMoney :0}}</div>
          </div>
          <div class="item-list">
            <div>有效下单总金额</div>
            <div class="item-nums">{{item.validMoney !='' ? item.validMoney:0}}</div>
          </div>
          <div class="item-list">
            <div>作废单总金额</div>
            <div class="item-nums">{{item.zfje}}</div>
          </div>
          <div class="item-list">
            <div>成交率</div>
            <div class="item-nums">{{item.cjRate}}%</div>
          </div>
          <div class="item-list">
            <div>作废率</div>
            <div class="item-nums">{{item.zfRate}}%</div>
          </div>
          <div class="item-list">
            <div>客户数</div>
            <div class="item-nums">{{item.customer}}</div>
          </div>
          <div class="item-list">
            <div>供应商数</div>
            <div class="item-nums">{{item.sell}}</div>
          </div>
        </div>
      </Row>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        dataApi: {
          buser: '',
          startTime: '',
          endTime: ''
        },
        dataValue: ['', ''],
        item: {},
        companyList: [],
        queryLoading: false
      }
    },
    computed: {
      filterData() {
        return {
          buser: this.dataApi.buser,
          startTime: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          endTime: this.dataValue[1] != '' ? this.dataValue[1].getTime() : ''
        }
      }
    },
    watch:{
      'filterData': {
        handler: _.debounce(function(val, oldVal) {
          this.getData(this.filterData);
        }, 200),
        deep: true
      },
    },
    methods: {
      getData(params) {
        this.$http.post(this.api.saleStatics, params).then(res => {
          if (res.code === 1000) {
            this.item = res.data;
          }
        })
      },
      resetFilter(){
        this.dataApi = {
          buser: '',
          startTime: '',
          endTime: ''
        }
        this.companyList = [];
        this.dataValue = ['',''];
      },
      //  查找供应商
      remoteMethod(query){
        if (query != '') {
          this.queryLoading = true;
          this.$http.post(this.api.findBusinessList, {
            companyName: query,
            contact: '',
            contactNum: '',
            fax: '',
            qq:'',
            currentPage: 1,
            pageSize: 30
          }).then(res => {
            if (res.code === 1000) {
              this.queryLoading = false;
              this.companyList = res.data.list
            }
          })
        } else {
          this.companyList = [];
          this.dataApi.buser = '';
        }
      }
    },
    created() {
      this.getData(this.filterData)
    }
  }
</script>

<style lang='less' scoped>
  .item-wrapper{
    .item-list{
      display: inline-block;
      width: 20%;
      float: left;
      margin-bottom: 20px;
      .item-nums{
        font-size: 20px;
        margin-top: 10px;
        font-weight: bold;
      }
    }
  }
</style>