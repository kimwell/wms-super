<template>
  <div>
    <div class="buserInfo">
      <p class="">卖家公司：{{unionData.companyName}}</p>
      <p class="">主账号名：{{unionData.buserMobile}}</p>
      <p class="">联系人：{{unionData.contact}}</p>
      <p class="">联系方式：{{unionData.contactNum}}</p>
    </div>
    <div class="union-main">
      <div class="head-main"><span class="company">{{unionData.companyName}}</span>的客户管理表</div>
      <div class="filter">
        <Form :model="filterData" inline :label-width="80">
          <FormItem label="客户公司：" class="magin0">
            <Input type="text" v-model="filterData.companyName" placeholder="输入商家名称"></Input>
          </FormItem>
          <FormItem label="业务员：" class="magin0">
            <Select v-model="filterData.saleId" style="width:200px">
                  <Option v-for="item in saleMan" :value="item.saleId" :key="item.saleId">{{ item.saleName }}{{item.saleMobile}}</Option>
            </Select>
          </FormItem>
          <FormItem label="分配状态：" class="magin0">
            <Select v-model="filterData.hasSale" style="width:150px">
              <Option v-for="item in [{id:1,label:'已分配'},{id:0,label:'未分配'}]" :value="item.id" :key="item.id">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <Button type="warning" @click="reset">清空筛选</Button>
        </Form>
      </div>
      <div class="union-body table-contnet">
        <Row class-name="head">
          <Col class-name="col" span="2">
          <Checkbox :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
          </Col>
          <Col class-name="col" span="5">公司名称</Col>
          <Col class-name="col" span="2">联系人</Col>
          <Col class-name="col" span="3">联系方式</Col>
          <Col class-name="col" span="2">负责业务员</Col>
          <Col class-name="col" span="3">业务员账号</Col>
          <Col class-name="col" span="3">最近操作人</Col>
          <Col class-name="col" span="4">最近更新时间</Col>
        </Row>
        <CheckboxGroup v-model="allotApi.id" @on-change="checkAllGroupChange">
          <Row v-for="(item,i) in company" :key="i">
            <Col class-name="col" span="2">
            <Checkbox :label="item.id"><span></span></Checkbox>
            </Col>
            <Col class-name="col" span="5">{{item.companyName}}</Col>
            <Col class-name="col" span="2">{{item.contact}}</Col>
            <Col class-name="col" span="3">{{item.contactNum}}</Col>
            <Col class-name="col" span="2">{{item.saleName}}</Col>
            <Col class-name="col" span="3">{{item.saleMobile}}</Col>
            <Col class-name="col" span="3">{{item.updateUser}}</Col>
            <Col class-name="col" span="4">{{item.updateTime | dateformat}}</Col>
          </Row>
        </CheckboxGroup>
      </div>
      <Row style="text-align:center;padding:10px 0;" v-if="company == 0">暂无数据</Row>
      <div class="union-foot">
        <div class="">您已勾选{{selectLen}}家有业务往来的买家，分配给业务员
            <Select v-model="saleManInfo" style="width:200px">
              <Option v-for="item in saleMan" :value="`${item.saleId}-${item.saleName}-${item.saleMobile}`" :key="item.saleId">{{ item.saleName }}{{item.saleMobile}}</Option>
            </Select>
          <Button style="margin-left: 20px;" type="warning" @click="allotAction">确认分配</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      unionData: Object
    },
    data() {
      return {
        filterData: {
          currentPage: 1,
          pageSize: 10,
          companyName: '',
          hasSale: '',
          saleId: '',
          companypId: this.getId
        },
        selectLen: 0,
        saleMan: [],
        company: [],
        totalCount: 0,
        checkMan: [],
        checkAll: false,
        indeterminate: false,
        allotApi:{
          id: [],
          saleId: '',
          saleName: '',
          saleMobile: ''
        },
        saleManInfo: ''
      }
    },
    computed: {
      getId() {
        return this.unionData.id
      },
      filterApi() {
        return {
          currentPage: this.filterData.currentPage,
          pageSize: this.filterData.pageSize,
          companyName: this.filterData.companyName,
          hasSale: this.filterData.hasSale,
          saleId: this.filterData.saleId,
          companypId: this.filterData.companypId
        }
      },
      allCheckIds(){
        let arr = [];
        this.company.forEach(el=>{
          arr.push(el.id);
        })
        return arr
      }
    },
    watch: {
      getId(newVal, old) {
        this.getSalesman();
        this.filterData.companypId = this.getId;
      },
      'filterApi': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage)
            this.filterData.currentPage = 1;
          this.getCompany();
          this.resetCheck();
        }, 200),
        deep: true
      }
    },
    methods: {
      resetCheck(){
        this.checkAll = false;
        this.allotApi.id = [],
        this.saleManInfo =''
      },
      checkAllGroupChange(data) {
        this.selectLen = this.allotApi.id.length;
        if (data.length === this.filterData.pageSize || data.length === this.company.length) {
          this.checkAll = true;
        } else if (data.length > 0) {
          this.checkAll = false;
        } else {
          this.checkAll = false;
        }
      },
      handleCheckAll(val) {
        if (this.indeterminate) {
          this.checkAll = false;
        } else {
          this.checkAll = !this.checkAll;
        }
        this.indeterminate = false;
        if (this.checkAll) {
          this.allotApi.id = this.allCheckIds;
          this.selectLen = this.allotApi.id.length;
        } else {
          this.allotApi.id = [];
          this.selectLen = 0;
        }
      },
      //  清除筛选
      reset() {
        this.filterData = {
          currentPage: 1,
          pageSize: 10,
          companyName: '',
          hasSale: '',
          saleId: '',
          companypId: this.getId
        }
        this.allotApi.id = [];
        this.checkAll = false;
      },
      // 查询公司
      getCompany() {
        this.$http.post(this.api.findClientManagementPage, this.filterApi).then(res => {
          if (res.code === 1000) {
            this.totalCount = res.data.totalCount;
            this.company = res.data.list;
          }
        })
      },
      //  查询业务员
      getSalesman() {
        let params = {
          companyId: this.unionData.id
        }
        this.$http.post(this.api.findSalesmanByCompanyId, params).then(res => {
          if (res.code === 1000) {
            this.saleMan = res.data
          }
        })
      },
      //  分配业务员
      allotAction(){
        if(this.allotApi.id.length == 0){
          this.$Message.error('请选择商家客户')
        }else{
          if(this.saleManInfo != ''){
            let sales = this.saleManInfo.split('-')
            let params = this.$clearData(this.allotApi)
            params.id = JSON.stringify(params.id);
            params.saleId = sales[0];
            params.saleName = sales[1]
            params.saleMobile = sales[2]
            this.$http.post(this.api.updateClientManagement,params).then(res => {
              if(res.code === 1000){
                this.getCompany();
                this.$Message.success('操作成功')
                this.resetCheck();
                this.$parent.$parent.closeUnion()
              }else{
                this.$Message.error(res.message)
              }
            })
          }else{
            this.$Message.error('请选择业务员')
          }
        }
      }
    },
    created() {}
  }
</script>

<style lang='less' scoped>
  .union-main {
    .head-main {
      margin: 15px 0;
    }
    .company {
      color: #f90;
    }
  }
  
  .table-contnet {
    line-height: 40px;
    text-align: center;
    border-top: 1px solid #d0d0d0;
    border-left: 1px solid #d0d0d0;
    .head {
      background-color: #ddd;
    }
    .col {
      height: 40px;
      padding: 0 5px;
      border-right: 1px solid #d0d0d0;
      border-bottom: 1px solid #d0d0d0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .union-foot{
    padding: 20px 0;
  }
</style>