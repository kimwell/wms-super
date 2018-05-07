<template>
  <div>
    <commonTemplate :tableHead="columns" ref="comm" :tableBody="filterList" @date-pick="filterData">
      买家数据分析
      <a class="warning" style="position: absolute;top:10px;right:540px;" target="_blank" :href="this.api.exportExcel+'?loginId='+this.ajaxHead.loginId+'&s=buyData&authorization='+this.ajaxHead.authorization+'&companyName='+this.dataApi.companyName+'&startTime='+this.dataApi.startTime+'&endTime='+this.dataApi.endTime">导出EXCEl</a>
      <div class="inputs" style="position: absolute;top:0;right:310px;">
        <Input v-model="dataApi.companyName" @on-blur="getData" placeholder="请输入买家公司名称" style="width: 200px;"></Input>
      </div>
      <a style="position: absolute;top:0;right:10px;" @click="reset">清除筛选</a>
    </commonTemplate>
    <Page style="margin-top:10px;float:right" :total="totalCount" @on-change="pageChange" show-total :current="dataApi.currentPage" :page-size="dataApi.pageSize"></Page>
  </div>
</template>

<script>
  import commonTemplate from '../commonTemplate/index.vue';
  import expandRow from './expandRow.vue';
  import {
    mapGetters
  } from 'vuex'
  export default {
    components: {
      commonTemplate,
      expandRow
    },
    data() {
      return {
        list: [],
        columns: [{
          type: 'expand',
          width: 40,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          },
        }, {
          title: '名称',
          key: 'companyName',
          ellipsis: true
        }, {
          title: '地区',
          key: 'address',
          ellipsis: true
        }, {
          title: '求购数量',
          key: 'totalNum',
          className: 'red',
          sortable: true
        }, {
          title: '有效报价',
          key: 'validNum'
        }, {
          title: '平均有效报价',
          key: 'avgValidNum'
        }, {
          title: '成交率',
          key: 'getRate'
        }, {
          title: '成交量',
          key: 'getNum'
        }, {
          title: '有货调度率',
          key: 'maiRate'
        }, {
          title: '品类',
          key: 'ironType',
          ellipsis: true
        }, {
          title: '材质',
          key: 'material',
          ellipsis: true
        }, {
          title: '表面',
          key: 'surface',
          ellipsis: true
        }, {
          title: '产地',
          key: 'proPlace',
          ellipsis: true
        }],
        dataApi: {
          startTime: '',
          endTime: '',
          currentPage: 1,
          pageSize: 10,
          sort: '',
          companyName: ''
        },
        totalCount: 0
      }
    },
    computed: {
      // 给TABLE组件用的data数据整形
      filterList() {
        let arr = [];
        this.list.forEach(el => {
          let item = {};
          el.avgValidNum = el.avgValidNum;
          el.maiRate = el.maiRate + '%';
          el.getRate = el.getRate + '%';
          el.maimaimai = el.maimaimai + '%';
          this.columns.forEach(el2 => {
            if (_.isArray(el[el2.key])) {
              item[el2.key] = el[el2.key].join()
            } else {
              item[el2.key] = el[el2.key]
            }
          });
          arr.push(item)
        });
        return arr;
      },
      ajaxHead(){
        return {
          loginId: this.$store.state.loginId,
          authorization: this.$store.state.authorization
        }
      }
    },
    methods: {
      getData(params = {}) {
        this.$http.get(this.api.jd_buyData, {
          params: this.dataApi
        }).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount
          }
        })
      },
      filterData(data) {
        this.dataApi.startTime = data.startTime;
        this.dataApi.endTime = data.endTime;
        this.getData(data);
      },
      pageChange(page) {
        this.dataApi.currentPage = page;
        this.getData();
      },
      reset() {
        this.dataApi = {
          startTime: '',
          endTime: '',
          currentPage: 1,
          sort: '',
          pageSize: 10,
          companyName: ''
        }
        this.$refs.comm.$children[0].clearData();
        this.getData();
      }
    },
    created() {
      this.getData();
    }
  }
</script>
<style lang="less" scoped>
  .warning{
    display: inline-block;
    background: #f90;
    color: #fff;
    border-radius: 4px;
    padding: 0 10px;
    height: 32px;
    line-height: 32px;
  }
</style>

