<template>
  <div class="page-main">
    <Tabs type="card" :animated="false" v-model="page" @on-click="tabsChange">
      <TabPane label="作废列表">
        <zfList v-if="page == 0"></zfList>
      </TabPane>
      <TabPane label="作废收款列表">
        <zfReceiptList v-if="page == 1"></zfReceiptList>
      </TabPane>
      <TabPane label="作废付款列表">
        <zfPaymenttList v-if="page == 2"></zfPaymenttList>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import zfList from './list/zfList'
  import zfPaymenttList from './list/zfPaymenttList'
  import zfReceiptList from './list/zfReceiptList'
  export default {
    components: {
      zfList,
      zfPaymenttList,
      zfReceiptList
    },
    data() {
      return {
        page: 1
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
      margin-top: -17px;
      padding: 17px;
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
  .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab{
    border: 0;
  }
</style>