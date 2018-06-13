<template>
  <div>
    <Card :bordered="false" class="card">
      <div class="filter-wrapper">
        <div class="filter-item">
          <Select v-model="filterApi.buser" filterable remote :remote-method="remoteMethod" placeholder="选择供应商" style="width: 200px;" :loading="queryLoading">
            <Option v-for="(option, index) in companyList" :value="`${option.companyName}`" :key="index">{{option.companyName}}</Option>
          </Select>
        </div>
        <div class="filter-item">
          <Select v-model="filterApi.type" style="width:200px;" placeholder="选择仓库">
            <Option v-for="(item,index) in typeData" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </div>
        <div class="filter-item">
          排行数前:
          <InputNumber :min="1" v-model="filterApi.pageSize"></InputNumber>名
        </div>
        <div class="filter-item">
          <Select v-model="filterApi.storeHouse" style="width:200px;" placeholder="选择仓库">
            <Option v-for="item in storeHouse" :value="item" :key="item">{{ item }}</Option>
          </Select>
        </div>
        <div class="filter-item">
          <DatePicker type="daterange" :options="dateOption" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </div>
        <div class="filter-item">
            <Button type="text" @click="resetData">清除筛选</Button>
        </div>
      </div>
      <p slot="title">热门销售统计</p>
      <Table :columns="filterColums" :data="list"></Table>
    </Card>
  </div>
</template>

<script>
  import expandRow from './expandRow'
  export default {
    data() {
      return {
        filterApi: {
          buser: '',
          pageSize: 10,
          startTime: '',
          endTime: '',
          type: 1,
          param: '',
          storeHouse: ''
        },
        companyList: [],
        queryLoading: false,
        typeData: [{
          id: 0,
          name: '供应商',
          key: 'sellCompanyName'
        }, {
          id: 1,
          name: '客户',
          key: 'buyCompanyName'
        }, {
          id: 2,
          name: '型号',
          key: 'model'
        }, {
          id: 3,
          name: '品类',
          key: 'ironType'
        }, {
          id: 4,
          name: '材质',
          key: 'material'
        }, {
          id: 5,
          name: '表面',
          key: 'surface'
        }, {
          id: 6,
          name: '产地',
          key: 'proPlace'
        }, {
          id: 7,
          name: '公差',
          key: 'tolerance'
        }, {
          id: 8,
          name: '规格',
          key: 'gg'
        }],
        tableHeader: [{
          type: 'expand',
          width: 50,
          render: (h, params) => {
            return h(expandRow, {
              props: {
                row: params.row
              }
            })
          }
        }, {
          title: '排名',
          render: (h, params) => {
            let str = params.row._index + 1;
            return h("span", {
              attrs: {
                class: `row-index${str}`
              }
            }, str);
          }
        }, {
          title: '客户',
          key: 'buyCompanyName',
          minWidth: 180
        }, {
          title: '下单数',
          key: 'xd'
        }, {
          title: '有效订单数',
          key: 'yx'
        }, {
          title: '作废订单数',
          key: 'zf'
        }, {
          title: '销售额',
          key: 'xse'
        }, {
          title: '有效销售额',
          key: 'yxxse'
        }, {
          title: '作废销售额',
          key: 'zfdje'
        }, {
          title: '成交率',
          key: 'cjRate',
          render: (h, params) => {
            let str = `${params.row.cjRate}%`;
            return h("span", str);
          }
        }, {
          title: '作废率',
          key: 'zfRate',
          render: (h, params) => {
            let str = `${params.row.zfRate}%`;
            return h("span", str);
          }
        }],
        storeHouse: [],
        dataValue: ['', ''],
        list: [],
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
      handleFilter() {
        return {
          buser: this.filterApi.buser,
          pageSize: this.filterApi.pageSize,
          startTime: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          endTime: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
          type: this.filterApi.type,
          param: this.filterApi.param,
          storeHouse: this.filterApi.storeHouse
        }
      },
      filterColums() {
        let columns = this.tableHeader;
        columns[2].title = this.typeData[this.filterApi.type].name;
        columns[2].key = this.typeData[this.filterApi.type].key;
        return columns
      }
    },
    watch: {
      'handleFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          this.getList(this.handleFilter);
        }, 200),
        deep: true
      }
    },
    methods: {
      //  获取仓库
      getHouse() {
        this.$http.get(this.api.findAWareHouse).then(res => {
          if (res.code === 1000) {
            this.storeHouse = res.data;
          }
        })
      },
      getList(params) {
        this.$http.post(this.api.hotStatics, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data
          }
        })
      },

      //  清除筛选
      resetData(){
          this.filterApi = {
              pageSize: 10,
              startTime: '',
              endTime: '',
              type: 1,
              param: '',
              storeHouse: ''
          };
          this.dataValue = ['',''];
          this.getList(this.handleFilter)
      },
      //  供应商
      remoteMethod(query) {
        if (query != '') {
          this.queryLoading = true;
          let params = {
            pageSize: 99,
            currentPage: 1,
            qq: '',
            fax: '',
            contactNum: '',
            contact: '',
            companyName: query
          }
          this.$http.post(this.api.findBusinessList, params).then(res => {
            if (res.code === 1000) {
              this.queryLoading = false;
              this.companyList = res.data.list;
            }
          })
        } else {
          this.companyList = [];
          this.filterApi.buser = '';
        }
      }
    },
    created() {
      this.getHouse();
      this.getList(this.handleFilter)
    }
  }
</script>

<style lang='less'>
  .filter-wrapper {
    position: absolute;
    right: 16px;
    top: 10px;
    .filter-item {
      display: inline-block;
      margin-left: 10px;
    }
  }
  
  .row-index1,
  .row-index2,
  .row-index3 {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    text-align: center;
    border-radius: 50%;
    color: #fff;
  }
  .row-index1 {
    background-color: #FF4C53
  }
  .row-index2 {
    background-color: #FFCD17
  }
  .row-index3 {
    background-color: #11C26D
  }
</style>