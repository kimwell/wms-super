<template>
  <div>
    <Card :bordered="false" class="card">
      <div class="filter-wrapper">
        <DatePicker type="daterange" :options="dateOption" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
      </div>
      <p slot="title">库存货品统计</p>
      <div class="card-body">
        <div class="card-body-main">
          <div class="body-main-data">
            <div class="data-flexblock">
              <div class="data-flex" v-for="(item,index) in flexData" :key="index">
                <div class="name"><i class="pointer" :class="`pointer${index}`"></i>{{item.name}}</div>
                <div class="count">{{item.count}}</div>
              </div>
            </div>
          </div>
          <div class="chart-body">
            <div class="chart-item">
              <div class="chart-item-title">库存总重量(KG)</div>
              <div class="chart-item-main">
                <chartTemp :listData="list" :types="1" ids="kcChart" ref="chartFef"></chartTemp>
              </div>
            </div>
          </div>
        </div>
        <div class="card-body-aside">
          <div class="card-body-aside-title">条件搜索</div>
          <commFilter @on-change="doFilter" ref="childFilter"></commFilter>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
  import commFilter from '../dataAnalysisFilter/index'
  import chartTemp from '../chartTemp/index'
  export default {
    components: {
      commFilter,
      chartTemp
    },
    data() {
      return {
        params: {},
        flexData: [{
          name: '库存总重量(KG)',
          count: 0,
        }, {
          name: '在库重量(KG)',
          count: 0,
        }, {
          name: '在途重量(KG)',
          count: 0,
        }],
        list: [{
          allWeight: 88,
          date: "1970-01-01",
          preWeight: 0,
          wareWeight: 0,
        }, {
          allWeight: 2000,
          date: "1970-01-01",
          preWeight: 0,
          wareWeight: 0,
        }, {
          allWeight: 8000,
          date: "1970-01-01",
          preWeight: 100,
          wareWeight: 0,
        }, {
          allWeight: 390,
          date: "1970-01-01",
          preWeight: 0,
          wareWeight: 0,
        }, {
          allWeight: 8888,
          date: "1970-01-01",
          preWeight: 0,
          wareWeight: 0,
        }, {
          allWeight: 2000,
          date: "1970-01-01",
          preWeight: 0,
          wareWeight: 0,
        }, {
          allWeight: 8000,
          date: "1970-01-01",
          preWeight: 100,
          wareWeight: 0,
        }, {
          allWeight: 390,
          date: "1970-01-01",
          preWeight: 0,
          wareWeight: 0,
        }],
        dataValue: ['', ''],
        dateOption: {
          shortcuts: [{
              text: '今日',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24);
                return [start, end];
              }
            }, {
              text: '本周',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                return [start, end];
              }
            },
            {
              text: '本月',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                return [start, end];
              }
            },
            {
              text: '本年',
              value() {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                return [start, end];
              }
            }
          ]
        }
      }
    },
    computed: {
      timeRange() {
        return {
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
        return this.todayStartTime - 86400000 * 7;
      },
      todayStart() {
        return new Date(this.todayStartTime)
      },
      todayEnd() {
        return new Date(this.todayEndTime)
      }
    },
    watch: {
      'timeRange' () {
        this.params.startTime = this.timeRange.startTime;
        this.params.endTime = this.timeRange.endTime;
        this.getData(this.params)
      }
    },
    methods: {
      resetData() {
        this.dataValue = ['', ''];
      },
      doFilter(data) {
        let params = this.$clearData(data);
        params.startTime = this.timeRange.startTime;
        params.endTime = this.timeRange.endTime;
        this.params = params;
        this.getData(params)
      },
      getData(params) {
        this.$http.post(this.api.wareStatics, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.flexData[0].count = res.data.allWeight;
            this.flexData[1].count = res.data.wareWeight
            this.flexData[2].count = res.data.preWeight
          }
        })
      }
    },
    mounted() {
      this.$refs.childFilter.searchFilter();
      window.onresize = () => {
        setTimeout(() => {
          this.$refs.chartFef.myChart.resize();
        }, 100)
      }
    },
    created() {
      this.dataValue[0] = this.todayEnd;
      this.dataValue[1] = this.todayStart;
      this.timeRange.startTime = this.dataValue[0] != '' ? this.dataValue[0].getTime() : '';
      this.timeRange.endTime = this.dataValue[1] != '' ? this.dataValue[1].getTime() : '';
    }
  }
</script>

<style lang='less' scoped>
  @import url('../../../assets/less/base.less');
  .card-body {
    position: relative;
    margin: -16px 0 -16px -16px;
    .card-body-main {
      min-height: 900px;
      margin-right: 246px;
      border-right: 1px solid #e6e6e6;
      .data-flexblock {
        .flex-block;
        border-bottom: 1px solid #e6e6e6;
      }
      .data-flex {
        .flex(1);
        padding-left: 16px;
        border-right: 1px solid #e6e6e6;
        padding-bottom: 24px;
        padding-top: 16px;
        &:last-child {
          border-right: 0;
        }
        .name {
          font-size: 12px;
          .pointer {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 5px;
            &.pointer0 {
              background-color: #11C26D
            }
            &.pointer1 {
              background-color: #EB6609
            }
            &.pointer2 {
              background-color: #0BB2D4
            }
            &.pointer3 {
              background-color: #FF4C53
            }
            &.pointer4 {
              background-color: #3E8EF7
            }
          }
        }
        .count {
          font-size: 24px;
          color: #374750;
          margin-top: 12px;
          padding-left: 15px;
        }
      }
    }
    .card-body-aside {
      position: absolute;
      right: 0;
      top: 0;
      width: 246px;
      padding-top: 16px;
      background-color: #fff;
      .card-body-aside-title {
        margin: 10px 16px;
        font-size: 14px;
        font-weight: bold;
        color: #374750
      }
    }
  }
  
  .filter-wrapper {
    position: absolute;
    right: 16px;
    top: 10px;
  }
  
  .chart-body {
    .chart-item {
      padding: 20px;
      border-bottom: 1px solid #E4EAEC;
      &:last-child {
        border-bottom: 0;
      }
      .chart-item-title {
        font-weight: bold;
        color: #374750;
        margin-bottom: 10px;
      }
    }
  }
</style>