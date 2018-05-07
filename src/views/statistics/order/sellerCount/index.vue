<template>
  <div>
    <commonTemplate :tableHead="filterColums" :tableBody="filterList" @date-pick="filterData">
      <RadioGroup v-model="apiData.storeType" type="button" @on-change="getData" style="position: relative;top:-5px;">
        <Radio v-for="btn in btns" :key="btn.value" :label="btn.value">{{ btn.name }}</Radio>
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
        storeType: '1'
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
      columns: [{
        title: '商户名称',
        key: 'sellerCompanyName',
      },{
        title: '总下单数量',
        key: 'orderNum',
      },{
        title: '总成交数据',
        key: 'orderBingo',
      },{
        title: '总成交率',
        key: 'orderBingoRates',
      },{
        title: '品类',
        key: 'ironTypeRange',
      },{
        title: '材质',
        key: 'materialRange',
      },{
        title: '表面',
        key: 'surfaceRange',
      },{
        title: '产地',
        key: 'proPlaceRange',
      },{
        title: '省份',
        key: 'procinceName',
      },{
        title: '城市',
        key: 'cityName',
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
        return columns
      }
    },
  methods: {
    getData() {
      this.$http.post(this.api.orderSellerTopTen,this.apiData).then(res => {
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
