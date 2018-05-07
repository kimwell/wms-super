<template>
  <div>
    <div class="page-components"><OfferConfig title="买家求购" type="2"></OfferConfig></div>
    <div class="page-components"><OfferConfig title="卖家报价" type="1"></OfferConfig></div>
    <!-- <div class="page-components"><OfferConfig title="订单确认时间" type="3"></OfferConfig></div> -->
    <openTimeConfig></openTimeConfig>
  </div>
</template>

<script>
import OfferConfig from './parts/OfferConfig.vue'
import openTimeConfig from './parts/openTimeConfig.vue'
  export default {
    components: {
      OfferConfig,
      openTimeConfig
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  .page-components{
    margin-bottom: 20px;
  }
</style>