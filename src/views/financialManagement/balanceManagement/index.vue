<template>
  <div class="page-main">
    <Tabs type="card" :animated="false" v-model="page" @on-click="tabsChange">
      <TabPane label="客户">
        <customerTemp v-if="page === 0"></customerTemp>
      </TabPane>
      <TabPane label="供应商">
        <supplierTemp v-if="page === 1"></supplierTemp>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import customerTemp from './customer/index.vue';
  import supplierTemp from './supplier/index.vue';
  export default {
    components: {
      customerTemp,
      supplierTemp
    },
    data() {
      return {
        page: 0
      }
    },
    methods: {
      tabsChange(data) {
        this.page = data;
      }
    }
  }
</script>

<style lang='less'>
  .page-main {
    .page-wrapper {
      background-color: #fff;
      margin-top: -16px;
      padding: 16px;
      min-height: 500px;
    }
  }
  
  .page-main>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar {
    border: transparent;
  }
  
  .page-main>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-nav-next,
  .page-main>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-nav-prev {
    display: none;
  }
  
  .page-main>.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab {
    border-color: transparent;
  }
</style>