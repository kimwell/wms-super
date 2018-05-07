<template>
  <div>
    <commonTemplate ref="comm" :tableHead="filterColums" :tableBody="filterList" @date-pick="filterData">
      <RadioGroup v-model="apiData.type" type="button" @on-change="getData" style="position: relative;top:-5px;">
        <Radio v-for="btn in btns" :key="btn.value" :label="btn.value">{{ btn.name }}</Radio>
      </RadioGroup>
      <a class="warning" style="position: absolute;top:10px;right:320px;" target="_blank" :href="this.api.exportExcel+'?loginId='+this.ajaxHead.loginId+'&s=typeData&authorization='+this.ajaxHead.authorization+'&type='+this.apiData.type+'&startTime='+this.apiData.startTime+'&endTime='+this.apiData.endTime">导出EXCEl</a>
      <a @click="reset" style="position: absolute;top:0;right:10px;">清除筛选</a>
    </commonTemplate>
    <Page style="margin-top:10px;float:right" :total="totalCount" @on-change="pageChange" show-total :current="apiData.currentPage" :page-size="apiData.pageSize"></Page>
  </div>
</template>

<script>
  import commonTemplate from '../commonTemplate/index.vue'
   import {
    mapGetters
  } from 'vuex'
  export default {
    components: {
      commonTemplate
    },
    data() {
      return {
        btns: [{
          name: '品类',
          value: 1
        }, {
          name: '材质',
          value: 2
        }, {
          name: '表面',
          value: 3
        }, {
          name: '产地',
          value: 4
        }],
        apiData: {
          type: 1, //1 品类 2材料 3表面 4产地
          startTime: '',
          endTime: '',
          currentPage: 1,
          pageSize: 10,
          sort: 0
        },
        totalCount: 0,
        list: [],
        columns: [{
          title: '品类',
          key: 'type',
          ellipsis: true
        }, {
          title: '平均有效报价',
          key: 'avgValidSell',
          className: 'red',
          sortable: true
        }, {
          title: '总求购',
          key: 'totalNum'
        }, {
          title: '成交数',
          key: 'getNum'
        }, {
          title: '错过报价',
          key: 'missSell',
          ellipsis: true
        }, {
          title: '有货调度次数',
          key: 'maimaimai'
        }, {
          title: '平均错过报价',
          key: 'avgMissSell',
          ellipsis: true
        }, {
          title: '有效报价',
          key: 'validSell',
          ellipsis: true
        },{
          title: '无货调度次数',
          key: 'ptlb',
          ellipsis: true
        },{
          title: '有货调度率',
          key: 'maiRate',
          ellipsis: true
        }],
        totalApi:{
          startTime: '',
          endTime: ''
        }
      }
    },
    computed: {
      // 给TABLE组件用的data数据整形
      filterList() {
        let arr = [];
        this.list.forEach(el => {
          let item = {};
          this.columns.forEach(el2 => {
            if (_.isArray(el[el2.key])) {
              item[el2.key] = el[el2.key].join();
            } else {
              let isRate = el2.key.indexOf('maiRate') >= 0;
              item[el2.key] = isRate ? el[el2.key] + '%' : el[el2.key];
            }
          });
          arr.push(item)
        });
        return arr
      },
      filterColums() {
        let columns = this.$clearData(this.columns);
        columns[0].title = this.btns[this.apiData.type - 1].name;
        return columns
      },
      ajaxHead(){
        return {
          loginId: this.$store.state.loginId,
          authorization: this.$store.state.authorization
        }
      }
    },
    methods: {
      getData() {
        this.$http.get(this.api.jd_typeData, {
          params: this.apiData
        }).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      filterData(data) {
        this.apiData.startTime = data.startTime;
        this.apiData.endTime = data.endTime;
        this.getData();
      },
      pageChange(page){
        this.apiData.currentPage = page;
        this.getData();
      },
      reset(){
        this.$refs.comm.$children[0].clearData();
        this.apiData = {
          type: 1,
          startTime: '',
          endTime: '',
          currentPage: 1,
          pageSize: 10,
          sort: 0
        },
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

