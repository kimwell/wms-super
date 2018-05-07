<template>
  <div>
    <commonTemplate :tableHead="columns" ref="comm" :tableBody="filterList" @date-pick="filterData">
    热门地区分析
     <a class="warning" style="position: absolute;top:10px;right:320px;" target="_blank" :href="this.api.exportExcel+'?loginId='+this.ajaxHead.loginId+'&s=locationData&authorization='+this.ajaxHead.authorization">导出EXCEl</a>
     <a @click="reset" style="position: absolute;top:0;right:10px;">清除筛选</a>
  </commonTemplate>
  <Page style="margin-top:10px;float:right" :total="totalCount" @on-change="pageChange" show-total :current="dataApi.currentPage" :page-size="dataApi.pageSize"></Page>
  </div>
</template>

<script>
  import commonTemplate from '../commonTemplate/index.vue'
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
            render: (h,params) =>{
              return h(expandRow,{
                props: {
                  row: params.row
                }
              })
            },
        },{
          title: '地区',
          key: 'locationName',
          ellipsis: true
        }, {
          title: '求购量',
          key: 'totalNum',
          className: 'red',
          sortable: true
        }, {
          title: '成交次数',
          key: 'getNum'
        }, {
          title: '成交率',
          key: 'getRate'
        }, {
          title: '有货调度次数',
          key: 'maimaimai',
          ellipsis: true
        }, {
          title: '无货调度次数',
          key: 'ptlb',
          ellipsis: true
        }, {
          title: '有货调度率',
          key: 'maiRate',
          ellipsis: true
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
        dataApi:{
          startTime: '',
          endTime: '',
          currentPage: 1,
          pageSize: 10
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
          el.getRate = el.getRate + '%';
          el.maiRate = el.maiRate + '%';
          this.columns.forEach(el2 => {
            if(_.isArray(el[el2.key])){
              item[el2.key] =  el[el2.key].join()
            }else{
              item[el2.key] =  el[el2.key]
            }
            
          });
          arr.push(item)
        });
        return arr
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
        this.$http.get(this.api.jd_locationData, {
          params: this.dataApi
        }).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount
          }
        })
      },
      filterData(data) {
        this.dataApi.startTime = data.startTime
        this.dataApi.endTime = data.endTime
        this.getData(data);
      },
      pageChange(page){
        this.dataApi.currentPage = page;
        this.getData();
      },
      reset(){
        this.$refs.comm.$children[0].clearData();
        this.dataApi = {
          startTime: '',
          endTime: '',
          currentPage: 1,
          pageSize: 10
        }
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

