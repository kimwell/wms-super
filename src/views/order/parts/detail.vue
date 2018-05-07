<template>
  <div>
    <div class="order-detail">
      <h3>采购信息</h3>
      <Row>
        <Col span="6">
          <p>求购时间：{{detailData.ironBuyTime | dateformat}}</p>
          <p>求购品类：{{detailData.ironType}}</p>
          <p>求购规格：{{detailData.specification != '' ? detailData.specification : `${detailData.height}*${detailData.width}*${detailData.length}`}}</p>
          <p>求购备注：{{detailData.buyRemark}}</p>
        </Col>
        <Col span="6">
          <p>采购方：{{detailData.buyCompanyName}}</p>
          <p>求购材质：{{detailData.material}}</p>
          <p>求购公差：{{detailData.tolerance}}</p>
        </Col>
        <Col span="6">
          <p>联系人：{{detailData.buyContactName}}</p>
          <p>求购表面：{{detailData.surface}}</p>
          <p>求购计量：{{detailData.number}}{{detailData.numberUnit}}/{{detailData.weight}}{{detailData.weightUnit}}</p>
        </Col>
        <Col span="6">
          <p>联系方式：{{detailData.buyContactNum}}</p>
          <p>求购产地：{{detailData.proPlace}}</p>
          <p>求购等级：{{detailData.purchaseLevel !=''?detailData.purchaseLevel: '-'}}</p>
        </Col>
      </Row>
    </div>
    <div class="order-detail">
      <h3>供货信息</h3>
      <Row>
        <Col span="6">
          <p>中标时间：{{detailData.createTime | dateformat}}</p>
          <p>供货资质：{{detailData.marginLevel}}</p>
          <p>供货单价：{{detailData.price}}元/{{detailData.sellBaseUnit}}</p>
          <p>报价备注：{{detailData.sellRemark}}</p>
        </Col>
        <Col span="6">
          <p>供货方：{{detailData.sellCompanyName}}</p>
          <p>负责业务员：{{detailData.saleName}}</p>
          <p>供货公差：{{detailData.sellTolerance}}</p>
        </Col>
        <Col span="6">
          <p>联系人：{{detailData.sellContactName}}</p>
          <p>业务员手机：{{detailData.saleMobile}}</p>
          <p>供货产地：{{detailData.sellProPlace}}</p>
        </Col>
        <Col span="6">
          <p>联系方式：{{detailData.sellContactNum}}</p>
          <p>最新绑定时间：<span v-if="detailData.saleTime!=''">{{detailData.saleTime | dateformat}}</span><span v-else>-</span></p>
          <p>交货时间：<span v-if="detailData.deliveryTime!=''">{{detailData.deliveryTime | dateformatZ}}</span><span v-else>-</span></p>
        </Col>
      </Row>
    </div>
    <div class="order-detail">
      <h3>订单信息</h3>
      <Row>
        <Col span="8">
          <p>订单编号：{{detailData.storeOrderId}}</p>
          <p>订单放弃时间：<span v-if="detailData.fqTime!=''">{{detailData.fqTime | dateformat}}</span><span v-else>-</span></p>
          <p>订单完成时间：<span v-if="detailData.wcTime!=''">{{detailData.wcTime | dateformat}}</span><span v-else>-</span></p>
          <p>订单作废时间：<span v-if="detailData.zfTime!=''">{{detailData.zfTime | dateformat}}</span><span v-else>-</span></p>
          <p>订单确认期限：<span v-if="detailData.valityTime!=''">{{detailData.valityTime | dateformat}}</span><span v-else>-</span></p>
        </Col>
        <Col span="8">
          <p>订单状态：{{detailData.status | status}}</p>
          <p>订单放弃人：{{detailData.fqUser}}</p>
          <p>订单确认人：{{detailData.wcUser}}</p>
          <p>订单作废人：{{detailData.zfUser}}</p>
          <p>订单删除人：{{detailData.scUser}}</p>
        </Col>
        <Col span="8">
          <p>求购编号：{{detailData.ironBuyId}}</p>
          <p>订单放弃理由：{{detailData.fqRemark}}</p>
          <p>订单最后修改人：{{detailData.modifyUser}}</p>
          <p>订单作废理由：{{detailData.zfRemark}}</p>
          <p>订单删除时间：<span v-if="detailData.scTime!=''">{{detailData.scTime | dateformat}}</span><span v-else>-</span></p>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      detailData: [Object]
    },
    data() {
      return {
        detail:{}
      }
    },
    filters: {
      status(val) {
        switch (val * 1) {
          case 1:
            return '已完成'
            break
          case 2:
            return '待确认'
            break
          case 3:
            return '卖家取消'
            break
          case 4:
            return '过期失效'
            break
          case 5:
            return '买家取消'
            break
          case 6:
            return '超管取消'
            break
          case 7:
            return '超管作废'
            break
          case 9:
            return '超管删除'
            break
        }
      }
    },
    methods: {
    }
  }
</script>

<style lang='less' scoped>
 .order-detail{
   margin-bottom: 20px;
   h3{
     margin-bottom: 15px;
     font-size: 14px;
     font-weight: normal
   }
   p{
     margin-bottom: 8px;
   }
 } 
</style>