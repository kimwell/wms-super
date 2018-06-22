<template>
  <div :id="ids" class="myChart">
  </div>
</template>

<script>
  // 引入 ECharts 主模块
  let echarts = require('echarts/lib/echarts');
  // 引入柱状图
  require('echarts/lib/chart/line');
  // 引入提示框和标题组件
  require('echarts/lib/component/tooltip');
  require('echarts/lib/component/title');
  export default {
    props: {
      listData: Array,
      types: Number,
      ids: String
    },
    data() {
      return {
        myChart: ''
      }
    },
    computed: {
      chartData() {
        let data = {
          x: [],
          y: []
        }
        this.listData.forEach(el => {
          if (this.types === 1) {
            // 库存总重量
            data.x.push(el.date);
            data.y.push(el.allWeight * 1)
          } else if (this.types === 2) {
            //  销售额
            data.x.push(el.d);
            data.y.push(el.xszl * 1)
          } else if (this.types === 3) {
            //  销售重量
            data.x.push(el.d);
            data.y.push(el.xszl * 1)
          }
        })
        return data
      }
    },
    watch: {
      'chartData': {
        handler: _.debounce(function(val, oldVal) {
          this.chartInit();
        }, 200),
        deep: true
      }
    },
    methods: {
      chartInit() {
        let option = {
          backgroundColor: '#fff',
          textStyle: {
            color: '#526069'
          },
          tooltip: {
            backgroundColor: 'rgba(55,71,80,.8)',
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                color: 'rgba(255,255,255,.2)'
              }
            },
            padding: 14,
            textStyle: {
              color: '#fff'
            },
            axisPointer: {
              animation: false
            }
          },
          grid: {
            show: true,
            borderColor: 'RGBA(223, 226, 229, .45)'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            splitLine: {
              lineStyle: {
                color: 'RGBA(223, 226, 229, .45)'
              }
            },
            axisLine: {
              lineStyle: {
                color: 'RGBA(223, 226, 229, .45)'
              }
            }
          },
          yAxis: {
            boundaryGap: [0, '50%'],
            type: 'value',
            axisLine: {
              lineStyle: {
                color: 'RGBA(223, 226, 229, 0)'
              }
            },
            splitLine: {
              lineStyle: {
                color: 'RGBA(223, 226, 229, 1)'
              }
            },
            scale: true
          },
          series: [{
            type: 'line',
            smooth: true,
            sampling: 'average',
            itemStyle: {
              normal: {
                color: '#10C170'
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(16,193,112,.1)'
                }, {
                  offset: 1,
                  color: 'rgba(16,193,112,0)'
                }])
              }
            }
          }]
        };
        // 基于准备好的dom，初始化echarts实例
        this.myChart = echarts.init(document.getElementById(this.ids));
        this.myChart.setOption(option,true);
        this.draw();
      },
      draw() {
        let data = this.$clearData(this.chartData)
        let _this = this;
        this.myChart.setOption({
          xAxis: {
            data: data.x
          },
          tooltip: {
            formatter: function(params) {
              params = params[0];
              let showStr = '';
              if(_this.types === 1){
                  showStr = [
                   _this.listData[params.dataIndex].date + '<br/>',
                  '库存总重量：' + _this.listData[params.dataIndex].allWeight + 'KG<br/>',
                  '在库重量：' + _this.listData[params.dataIndex].wareWeight + 'KG<br/>',
                  '在途重量：' + _this.listData[params.dataIndex].preWeight + 'KG<br/>',
                ].join('');
              }else if(_this.types === 2 || _this.types === 3){
                showStr = [
                  _this.listData[params.dataIndex].d + '<br/>',
                  '销售单数：' + _this.listData[params.dataIndex].xs + '<br/>',
                  '作废单数：' + _this.listData[params.dataIndex].zf + '<br/>',
                  '销售金额：' + _this.listData[params.dataIndex].xsje + '<br/>',
                  '作废金额：' + _this.listData[params.dataIndex].zfje + '<br/>',
                  '销售重量：' + _this.listData[params.dataIndex].xszl + '<br/>',
                ].join('')
              }
              return showStr
            }
          },
          series: [{
            data: data.y
          }]
        })
      }
    },
    mounted() {
      this.chartInit();
    }
  }
</script>

<style lang='less' scoped>
  .myChart {
    width: 100%;
    height: 420px;
  }
</style>