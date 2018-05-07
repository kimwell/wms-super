<template>
  <div>
    <Row class="expand-row" >
       <Col span="6">
            <span class="expand-key">名称:</span>
            <span class="expand-value">{{row.companyName}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">地区: </span>
            <span class="expand-value">{{row.address}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">求购数量: </span>
            <span class="expand-value">{{row.totalNum}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">有货调度率: </span>
            <span class="expand-value">{{row.maiRate}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">有效报价: </span>
            <span class="expand-value">{{row.validNum}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">成交率: </span>
            <span class="expand-value">{{row.getRate}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">成交量: </span>
            <span class="expand-value">{{row.getNum}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">平均有效报价: </span>
            <span class="expand-value">{{row.avgValidNum}}</span>
       </Col> 
       <Col span="6">
            <span class="expand-key">品类: </span>
            <span class="expand-value">{{row.ironType}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">材质: </span>
            <span class="expand-value">{{row.material}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">表面: </span>
            <span class="expand-value">{{row.surface}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">产地: </span>
            <span class="expand-value">{{row.proPlace}}</span>
       </Col>
    </Row>  
  </div>
</template>
<script>
export default {
  props: {
      row: Object,
  }
}
</script>
<style lang="less" scoped>
.expand-key{
    font-weight: bolder;
}
.expand-row {
    .expand-value{
       word-break:break-all; 
    }
    .ivu-col{
        margin: 5px 0;
    }
}
</style>


