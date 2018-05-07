<template>
  <div>
    <commonTemplate :tableHead="filterColums" :tableBody="filterList" @date-pick="filterData">
      <RadioGroup v-model="apiData.storeType" type="button" @on-change="getData" style="position: relative;top:-5px;">
        <Radio v-for="btn in btns" :key="btn.value" :label="btn.value">{{ btn.name }}</Radio>
      </RadioGroup>
      <RadioGroup v-model="apiData.dimension" type="button" @on-change="getData" style="position: relative;top:-5px;">
        <Radio v-for="btn in dimension" :key="btn.value" :label="btn.value">{{ btn.name }}</Radio>
      </RadioGroup>
    </commonTemplate>
  </div>
</template>

<script>
import commonTemplate from '../../commonTemplate/index'
export default {
  components: {
    commonTemplate
  },
  data () {
    return {
      apiData: {
        timeBegin: '',
        timeEnd: '',
        storeType: '1',
        dimension: '1',
        orderNumSort: ''
      },
      btns: [{
        name: '现货资源',
        value: 1
      },{
        name: '定开计划',
        value: 2
      },{
        name: '特价资源',
        value: 3
      }],
      dimension: [{
        name: '品类',
        value: 1
      },{
        name: '材质',
        value: 2
      },{
        name: '表面',
        value: 3
      },{
        name: '产地',
        value: 4
      }],
      columns: [{
        title: '参数名称',
        key: 'parameterName'
      },{
        title: '订单数量',
        key: 'orderNum',
        sortable: true
      },{
        title: '订单成交量',
        key: 'orderBingo',
      },{
        title: '订单成交率',
        key: 'orderBingoRates',
      }],
      list: [],
    }
  },
  computed: {
      // 给TABLE组件用的data数据整形
      filterList() {
        let arr = [];
        this.list.forEach(el => {
          let item = {};
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
      filterColums() {
        let columns = this.$clearData(this.columns);
        columns[0].title = this.dimension[this.apiData.dimension - 1].name;
        return columns
      }
    },
  methods: {
    getData() {
      this.$http.post(this.api.fourDAnalysis,this.apiData).then(res => {
        if (res.code === 1000) {
            this.list = res.data
          }
      })
    },
    filterData(data) {
      this.apiData.timeBegin = data.startTime;
      this.apiData.timeEnd = data.endTime;
      this.getData();
    }
  },
  created () {
    this.getData();
  }
}
</script>

<style>

</style>
