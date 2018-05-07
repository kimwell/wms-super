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
            <span class="expand-key">响应次数: </span>
            <span class="expand-value">{{row.totalNum}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">有效报价: </span>
            <span class="expand-value">{{row.validSell}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">无效报价: </span>
            <span class="expand-value">{{row.missSell}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">调度选中次数: </span>
            <span class="expand-value">{{row.chooseNum}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">中标次数: </span>
            <span class="expand-value">{{row.getSell}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">调度选中率: </span>
            <span class="expand-value">{{row.chooseRate}}</span>
       </Col>
       <Col span="6">
            <span class="expand-key">中标率: </span>
            <span class="expand-value">{{row.getRate}}</span>
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


