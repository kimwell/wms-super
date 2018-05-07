<template>
  <div class="panel">
    <filterUnreated @on-change="doFilter"></filterUnreated>
    <p style="text-align:center;padding: 20px 0;" v-show="list.length<=0">暂无数据</p>
    <div class="data-list">
      <div class="list-card" v-for="(item,i) in list" :key="i">
        <div class="card-head">
          <span>商户名称：{{item.companyName}}</span><span style="margin-left:20px;">求购编号：{{item.ironBuyId}}</span>
          <div class="action"><a @click="detailAction(item)">查看报价</a><a @click="offerAction(item)">查看剩余可报价量</a></div>
        </div>
        <div class="card-body clearfix">
          <div class="item">货源地：{{item.locationName}}</div>
          <div class="item">品类：{{item.ironType}}</div>
          <div class="item">材质：{{item.material}}</div>
          <div class="item">表面：{{item.surface}}</div>
          <div class="item">规格：{{item.specification != '' ? item.specification : `${item.height}*${item.width}*${item.length}`}}</div>
          <div class="item">公差：{{item.tolerance}}</div>
          <div class="item">计量：<span v-if="item.number != ''">{{item.number}}{{item.numberUnit}}</span><span v-if="item.number != '' && item.weight !=''">/</span><span v-if="item.weight != ''">{{item.weight}}{{item.weightUnit}}</span></div>
          <div class="item">产地：{{item.proPlace}}</div>
          <div class="item">可报价总量：{{item.buserNum}}</div>
          <div class="item">有效报价：{{item.sellNum}}</div>
          <div class="item">剩余可报价量：{{item.remainNum}}</div>
          <div class="item">调度情况：{{item.bgStatus == 1 ?'有货':'无货'}}</div>
          <div class="item">买家公司：{{item.companyName}}</div>
          <div class="item">调度操作人：{{item.bgName}}</div>
          <div class="item">备注：{{item.remark !='' ? item.remark : '暂无'}}</div>
        </div>
      </div>
    </div>
    <Page class="page-count" size="small" :total="totalCount" show-total :current="screenApi.currentPage" :page-size="screenApi.pageSize" @on-change="changePage"></Page>
    <Modal v-model="detailShow" width="1100" title="报价详情">
      <div class="detail" v-if="detailData.ironBuy">
        <div>求购内容：{{detailData.ironBuy.ironTypeName}}{{detailData.ironBuy.materialName}}<span v-if="detailData.ironBuy.ironTypeName != '' && detailData.ironBuy.proPlacesName!= ''">/</span>{{detailData.ironBuy.proPlacesName}}/{{detailData.ironBuy.surfaceName}}(收货城市：{{detailData.ironBuy.locationName}})</div>
        <div>规格：{{detailData.ironBuy.specifications != '' ? detailData.ironBuy.specifications : `${detailData.ironBuy.height}*${detailData.ironBuy.width}*${detailData.ironBuy.length}`}}</div>
        <div>公差：{{detailData.ironBuy.tolerance}}</div>
        <div>计量：<span v-if="detailData.ironBuy.numbers !=''">{{detailData.ironBuy.numbers}}{{detailData.ironBuy.numberUnit}}</span><span v-if="detailData.ironBuy.numbers != '' && detailData.ironBuy.weights !=''">/</span><span v-if="detailData.ironBuy.weights !=''">{{detailData.ironBuy.weights}}{{detailData.ironBuy.weightUnit}}</span></div>
        <div>备注：{{detailData.ironBuy.remark !='' ? detailData.ironBuy.remark: '暂无'}}</div>
        <div>买家公司：{{detailData.buser.companyName}}</div>
        <div>联系人：{{detailData.buser.contactName}} 联系方式：{{detailData.buser.contactNum}}</div>
        <div>调度状态：{{detailData.ironBuy.bgStatus == 1 ?'有货':'无货'}}</div>
        <div>剩余可报价商家数：{{detailData.remainBuserNum}}</div>
        <div class="ironVal" style="padding:15px 0;">
          <p>有效报价：{{detailData.validSell.length}}</p>
          <div class="validSell table-contnet">
            <Row class-name="head">
              <Col class-name="col" span="1">&nbsp;</Col>
              <Col class-name="col" span="5">公司名称</Col>
              <Col class-name="col" span="3">报价人</Col>
              <Col class-name="col" span="3">联系方式</Col>
              <Col class-name="col" span="2">单价</Col>
              <Col class-name="col" span="2">公差</Col>
              <Col class-name="col" span="2">产地</Col>
              <Col class-name="col" span="3">交货时间</Col>
              <Col class-name="col" span="3">备注</Col>
            </Row>
            <Row v-for="(item,i) in detailData.validSell" :key="i">
              <Col class-name="col" span="1">
              <Icon v-show="item.choose" type="checkmark-circled" size="20" color="#2d8cf0"></Icon>
              </Col>
              <Col class-name="col" span="5">{{item.companyName}}</Col>
              <Col class-name="col" span="3">{{item.contactName}}</Col>
              <Col class-name="col" span="3">{{item.contactNum}}</Col>
              <Col class-name="col" span="2">{{item.sellIng.offerPerPrice}}元/{{item.sellIng.baseUnit}}</Col>
              <Col class-name="col" span="2">{{item.sellIng.tolerance}}</Col>
              <Col class-name="col" span="2">{{item.sellIng.offerPlaces}}</Col>
              <Col class-name="col" span="3">{{item.sellIng.deliveryTime | dateformatZ}}</Col>
              <Col class-name="col" span="3">{{item.sellIng.offerRemark !='' ? item.sellIng.offerRemark: '暂无'}}</Col>
            </Row>
          </div>
        </div>
        <div class="ironMiss">
          <p>错过报价：{{detailData.missSell.length}}</p>
          <p v-for="item in detailData.missSell" :key="item.id">
            {{ item.companyName }} — 联系人：{{item.contactName}} — 联系电话：{{item.contactNum}}
          </p>
        </div>
      </div>
      <div slot="footer">
      </div>
    </Modal>
    <Modal v-model="notSellshow" width="900" title="剩余可报价量">
      <div class="detail" v-if="notSellDetail.ironType">
        <div>求购内容：{{notSellDetail.ironType}}/{{notSellDetail.material}}/{{notSellDetail.proPlaces}}/{{notSellDetail.surface}}(收货城市：{{notSellDetail.locationName}})</div>
        <div>规格：{{notSellDetail.specification != '' ? notSellDetail.specification : `${notSellDetail.height}*${notSellDetail.width}*${notSellDetail.length}`}}</div>
        <div>公差：{{notSellDetail.tolerance}}</div>
        <div>计量：<span v-if="notSellDetail.number !=''">{{notSellDetail.number}}{{notSellDetail.numberUnit}}</span><span v-if="notSellDetail.number != '' && notSellDetail.weight !=''">/</span><span v-if="notSellDetail.weight != ''">{{notSellDetail.weight}}{{notSellDetail.weightUnit}}</span></div>
        <div>备注：{{notSellDetail.remark !='' ? notSellDetail.remark: '暂无'}}</div>
        <div style="color:red;padding:10px 0;">剩余可报价商家数：{{notSell.length}}</div>
      </div>
      <Row style="text-align: center;line-height:34px;">
        <Col span="8">公司名称</Col>
        <Col span="8">联系人</Col>
        <Col span="8">联系方式</Col>
      </Row>
      <Row style="text-align: center;line-height:34px;" v-for="(item,i) in notSell" :key="i">
        <Col span="8">{{item.companyName}}</Col>
        <Col span="8">{{item.contactName}}</Col>
        <Col span="8">{{item.contactNum}}</Col>
      </Row>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
  import City from '@/components/basics/adress/citySelect.vue'
  import filterUnreated from '../parts/filterUntreated.vue'
  export default {
    components: {
      City,
      filterUnreated
    },
    data() {
      return {
        detailShow: false,
        screenApi: {
          currentPage: 1,
          pageSize: 10
        },
        totalCount: 0,
        list: [],
        detailData: {},
        notSell: [],
        notSellDetail: {},
        notSellshow: false
      }
    },
    methods: {
      doFilter(data) {
        let params = _.cloneDeep(data);
        this.screenApi.currentPage = 1;
        params.currentPage = this.screenApi.currentPage;
        params.pageSize = this.screenApi.pageSize;
        this.params = params;
        this.getList(params);
      },
      changePage(page) {
        this.screenApi.currentPage = page;
        let params = _.cloneDeep(this.params);
        params.currentPage = page;
        this.getList(params);
      },
      getList(params) {
        this.$http.post(this.api.findDealIronBuy, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      //  查看报价
      detailAction(data) {
        let params = {
          ironBuyId: data.ironBuyId
        }
        this.$http.post(this.api.findDealSell, params).then(res => {
          if (res.code === 1000) {
            this.detailData = res.data;
          }
        })
        this.detailShow = true
      },
      //  查看剩余可报价量
      offerAction(data) {
        this.notSellDetail = data
        let params = {
          ironBuyId: data.ironBuyId
        }
        this.$http.post(this.api.findNotSellBuser, params).then(res => {
          if (res.code === 1000) {
            this.notSell = res.data
          }
        })
        this.notSellshow = true;
      }
    },
    created() {}
  }
</script>

<style lang='less' scoped>
  .panel {
    padding-bottom: 40px;
    position: relative;
    .page-count {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  
  .list-card {
    background: #fff;
    border: 1px solid #e6e6e6;
    margin-top: 15px;
    font-size: 14px;
    color: #333;
    .card-head {
      position: relative;
      border-bottom: 1px solid #e6e6e6;
      height: 46px;
      line-height: 46px;
      padding: 0 20px;
      .action {
        position: absolute;
        right: 20px;
        top: 0;
        a {
          margin-left: 15px;
        }
      }
    }
    .card-body {
      position: relative;
      padding: 20px;
      padding-bottom: 10px;
      .item {
        width: 20%;
        float: left;
        margin-bottom: 10px;
      }
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
</style>