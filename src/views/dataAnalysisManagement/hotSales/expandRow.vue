<template>
  <div>
    <div class="row-list clearfix">
      <div class="row-item">供应商数：{{row.sellId}}</div>
      <div class="row-item" v-show="types != 1">客户数：{{row.buyId}}</div>
      <div class="row-item" v-show="types != 2">型号：{{row.model}}</div>
      <div class="row-item" v-show="types != 3">品类：{{row.ironType}}</div>
      <div class="row-item" v-show="types != 4">材质：{{row.material}}</div>
      <div class="row-item" v-show="types != 5">表面：{{row.surface}}</div>
      <div class="row-item" v-show="types != 6">产地：{{row.proPlace}}</div>
      <div class="row-item" v-show="types != 8">规格：{{row.gg}}</div>
      <div class="row-item" v-show="types != 7">公差：{{row.tolerance}}</div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      row: Object,
      types: Number
    }
  }
</script>

<style lang='less' scoped>
  .row-list{
    margin-bottom: 10px;
    .row-item{
      float: left;
      width: 25%;
      margin-bottom: 10px;
    }
  }
</style>