<template>
  <div>
    <Row class="row-list">
      <Col span="6">供应商数：{{row.sellId}}</Col>
      <Col span="6">客户数：{{row.buyId}}</Col>
      <Col span="6">型号：{{row.model}}</Col>
      <Col span="6">品类：{{row.ironType}}</Col>
    </Row>
    <Row class="row-list">
      <Col span="6">材质：{{row.material}}</Col>
      <Col span="6">表面：{{row.surface}}</Col>
      <Col span="6">产地：{{row.proPlace}}</Col>
      <Col span="6">规格：{{row.gg}}</Col>
    </Row>
    <Row class="row-list">
      <Col span="6">公差：{{row.tolerance}}</Col>
    </Row>
  </div>
</template>

<script>
  export default {
    props: {
      row: Object
    },
    data() {
      return {}
    },
    methods: {}
  }
</script>

<style lang='less' scoped>
  .row-list{
    margin-bottom: 10px;
    &:last-child{
      margin: 0;
    }
  }
</style>