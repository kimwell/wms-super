<template>
  <div>
    <filterPage @on-change="doFilter"></filterPage>
    <p style="text-align:center;padding: 20px 0;" v-show="list.length<=0">暂无数据</p>
    <div class="data-list">
      <div class="list-card" v-for="(item,i) in list" :key="i">
        <div class="card-head">
          <span>求购编号：{{item.id}}</span><span style="margin-left:15px;" v-if="item.salesManName != ''">({{item.salesManName}}&nbsp;&nbsp;{{item.salesManTel}})</span>
          <div class="action">
            <a @click="detailAction(item)">查看详情</a>
            <a v-if="item.status == 1" @click="delAction(item)">删除求购</a>
          </div>
        </div>
        <div class="card-body clearfix">
          <div class="item">求购状态：
            <span v-if="item.status == 2">超管删除</span>
            <span v-else-if="item.status == 0">买家删除</span>
            <span v-else-if="item.status == 1 && item.buyStatus ==3">已失效</span>
            <span v-else-if="item.status == 1 && item.buyStatus ==2 && item.bgStatus == 1">已成交</span>
            <span v-else-if="item.bgStatus == 1 || item.bgStatus == 2 && item.buyStatus ==1 && item.status==1">待确认</span>
            <span v-else-if="item.bgStatus == 0  && item.buyStatus ==1 && item.status==1">待调度</span>
          </div>
          <div class="item">发起时间：{{item.createTime | dateformat}}</div>
          <div class="item">报价期限：{{item.sellTime | dateformat}}</div>
          <div class="item">选标期限：<span v-if="item.checkTime != ''">{{item.checkTime | dateformat}}</span ><span v-else>-</span></div>
          <div class="item">成交时间：<span v-if="item.updateTime != ''">{{item.updateTime | dateformat}}</span ><span v-else>-</span></div>
          <div class="item">买家公司：{{item.companyName}}</div>
          <div class="item">卖家公司：{{item.companyPName != ''? item.companyPName : '-'}}</div>
          <div class="item">调度情况：{{item.bgStatus | bgStatus}}</div>
          <div class="item" v-if="item.aTime > 0">调度时长：{{item.aTime | dateformatT}}</div>
          <div class="item" v-else>调度时长：-</div>
          <div class="item">匹配卖家总量：{{item.buserNum}}</div>
          <div class="item">品类：{{item.ironTypeName}}</div>
          <div class="item">材质|表面：{{item.materialName}}|{{item.surfaceName}}</div>
          <div class="item">规格：{{item.specifications != '' ? item.specifications : `${item.height}*${item.width}*${item.length}`}}</div>
          <div class="item">产地|公差：{{item.proPlacesName}}<span v-if="item.tolerance !=''">|{{item.tolerance}}</span></div>
        </div>
      </div>
      <div class="pages">
        <Page :total="totalCount" @on-change="pageChange" show-total :current="screenApi.currentPage" :page-size="screenApi.pageSize"></Page>
      </div>
    </div>
    <Modal v-model="show" title="查看求购详情" width="1200" :mask-closable="false">
      <div class="detail-page" v-if="detailShow">
        <Row>
          <Col span="12">
          <p>求购时间：{{detailData.createTime | dateformat}}</p>
          <p>求购内容：{{detailData.ironTypeName}}/{{detailData.materialName}}/{{detailData.surfaceName}}</p>
          <p>产地：{{detailData.proPlacesName}}</p>
          <p>货源地：{{detailData.locationName}}</p>
          <p>规格：{{detailData.specifications != '' ? detailData.specifications : `${detailData.height}*${detailData.width}*${detailData.length}`}}</p>
          <p>公差：{{detailData.tolerance}}</p>
          <p>计量：
            <span v-if="detailData.numbers !=''">{{detailData.numbers}}{{detailData.numberUnit}}</span>
            <template v-if="detailData.numbers != '' && detailData.weights != ''">/</template>
            <span v-if="detailData.weights !=''">{{detailData.weights}}{{detailData.weightUnit}}</span>
          </p>
          <p>备注：{{detailData.remark}}</p>
          <p>买家公司：{{detailData.companyName}}</p>
          <p>联系方式：{{detailData.contactNum}}</p>
          <p>买家求购等级：{{detailData.purchaseLevel!=''?detailData.purchaseLevel:'-'}}</p>
          </Col>
          <Col span="12">
          <p>求购状态：
            <span v-if="detailData.status == 2">超管删除</span>
            <span v-else-if="detailData.status == 0">买家删除</span>
            <span v-else-if="detailData.status == 1 && detailData.buyStatus ==3">已失效 <template v-if="detailData.reason != ''">({{detailData.reason}})</template></span>
            <span v-else-if="detailData.status == 1 && detailData.buyStatus ==2 && detailData.bgStatus == 1">已成交</span>
            <span v-else-if="detailData.bgStatus == 1 || detailData.bgStatus == 2 && detailData.buyStatus ==1 && detailData.status==1">待确认</span>
            <span v-else-if="detailData.bgStatus == 0  && detailData.buyStatus ==1 && detailData.status==1">待调度</span>
          </p>
          <p>可报价总量：{{detailData.buserNum}}</p>
          <p>有效报价量：{{detailData.effectiveSeller.length}}</p>
          <p>错过报价量：{{detailData.missSeller.length}}</p>
          <p>剩余未报量：{{detailData.leftNum}}</p>
          <p v-if="detailData.aTime > 0">调度完成时长：{{detailData.aTime | dateformatT}}</p>
          <p v-else>调度完成时长：暂未调度</p>
          <p>调度操作人：{{detailData.bgName != ''? detailData.bgName:'-'}}</p>
          <p>中标公司：{{detailData.storeOrder != ''? detailData.storeOrder.sellCompanyName:'-'}}</p>
          <p>中标单价：{{detailData.sell != ''? detailData.sell.sellPerPrice:'-'}}<span v-if="detailData.sell != ''">元/{{detailData.sell.sellPriceUnit}}</span></p>
          <p v-if="detailData.updateTime !=''">中标时间：{{detailData.updateTime | dateformat}}</p>
          <p v-else>中标时间：-</p>
          <p>生成订单：{{detailData.storeOrder != ''? detailData.storeOrder.id:'-'}}</p>
          </Col>
        </Row>
        <div class="offer-main">
          <div class="offer-head">有效报价：{{detailData.effectiveSeller.length}}</div>
          <div class="offer-body">
            <div class="card-contnet">
              <div class="table-contnet">
                <Row class-name="head">
                  <Col class-name="col" span="2">调度状态</Col>
                  <Col class-name="col" span="4">卖家公司名</Col>
                  <Col class-name="col" span="2">联系人</Col>
                  <Col class-name="col" span="2">联系方式</Col>
                  <Col class-name="col" span="2">报价</Col>
                  <Col class-name="col" span="1">公差</Col>
                  <Col class-name="col" span="1">产地</Col>
                  <Col class-name="col" span="2">交货时间</Col>
                  <Col class-name="col" span="3">备注</Col>
                  <Col class-name="col" span="3">报价时间</Col>
                  <Col class-name="col" span="2">竞标状态</Col>
                </Row>
                <p v-if="detailData.effectiveSeller.length == 0">暂无有效报价</p>
                <div v-for="(n,index) in detailData.effectiveSeller"  :key="index">
                  <Row class="row-body">
                    <Col class-name="col" span="2">
                    <a class="iconfont showMore" :class="n.hisShow?'icon-iconfontjiantou':'icon-jiantouarrow487'" @click="showMore(index)"></a>{{n.hasBgStatus | bgStatus}}</Col>
                    <Col class-name="col" span="4">{{n.companyName}}</Col>
                    <Col class-name="col" span="2">{{n.contact}}</Col>
                    <Col class-name="col" span="2">{{n.contactNum}}</Col>
                    <Col class-name="col" span="2">{{n.offerPerPrice}}元/{{n.baseUnit}}</Col>
                    <Col class-name="col" span="1">{{n.tolerance}}</Col>
                    <Col class-name="col" span="1">{{n.offerPlaces}}</Col>
                    <Col class-name="col" span="2">{{n.historyIronSellerInfo[0].deliveryTime}}</Col>
                    <Col class-name="col" span="3">{{n.offerRemark}}</Col>
                    <Col class-name="col" span="3">{{n.historyIronSellerInfo[0].createTime | dateformat}}</Col>
                    <Col class-name="col" span="2" ><span :class="{'active':n.historyIronSellerInfo[0].offerStatus == 2}">{{n.historyIronSellerInfo[0].offerStatus == 2 ? "已中标":"未中标"}}</span></Col>
                  </Row>
                  <div v-show="n.hisShow" id="keywords" class="history">
                    <div class="card-contnet">
                      <div class="table-contnet">
                        <Row class-name="head" style="background:#f0f0f0">
                          <Col class-name="col" span="4">报价</Col>
                          <Col class-name="col" span="4">公差</Col>
                          <Col class-name="col" span="4">产地</Col>
                          <Col class-name="col" span="4">交货时间</Col>
                          <Col class-name="col" span="4">备注</Col>
                          <Col class-name="col" span="4">报价时间</Col>
                        </Row>
                        <Row v-for="(h,j) in n.historyIronSellerInfo" :key="j">
                          <Col class-name="col" span="4">{{h.offerPerPrice}}元/{{h.baseUnit}}</Col>
                          <Col class-name="col" span="4">{{h.tolerance}}</Col>
                          <Col class-name="col" span="4">{{h.offerPlaces}}</Col>
                          <Col class-name="col" span="4">{{h.deliveryTime}}</Col>
                          <Col class-name="col" span="4">{{h.offerRemark}}</Col>
                          <Col class-name="col" span="4">{{h.createTime | dateformat}}</Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="offer-main">
          <div class="offer-head">错过报价：{{detailData.missSeller.length}}</div>
          <div class="offer-body">
            <p v-if="detailData.missSeller.length == 0">暂无错过的报价</p>
            <p v-for="item in detailData.missSeller">
              {{item.companyName}}-联系人：{{item.contact}}-联系电话：{{item.contactNum}}
            </p>
          </div>
        </div>
      </div>
      <div slot="footer"></div>
    </Modal>
  </div>
</template>

<script>
  import filterPage from './parts/filter'
  export default {
    components: {
      filterPage
    },
    data() {
      return {
        params: {},
        screenApi: {
          currentPage: 1,
          pageSize: 10
        },
        list: [],
        totalCount: 0,
        show: false,
        detailData: {},
        detailShow: false
      }
    },
    filters: {
      bgStatus(val) {
        switch (val * 1) {
          case 0:
            return '待调度'
            break;
          case 1:
            return '有货调度'
            break;
          case 2:
            return '无货调度'
            break;
        }
      },
      dStatus(val) {
        switch (val * 1) {
          case 1:
            return '进行中'
            break;
          case 2:
            return '已成交'
            break;
          case 3:
            return '已失效'
            break;
        }
      },
      buyStatus(val) {
        switch (val * 1) {
          case 1:
            return '待调度'
            break;
          case 2:
            return '待确认'
            break;
          case 3:
            return '已成交'
            break;
          case 4:
            return '已失效'
            break;
          case 5:
            return '买家已删除'
            break;
          case 6:
            return '超管删除'
            break;
        }
      }
    },
    watch: {
      'detailData' () {
        this.detailShow = true;
      },
      '$route'(){
        this.getList(this.params)
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
      pageChange(page) {
        this.screenApi.currentPage = page;
        let params = _.cloneDeep(this.params);
        params.currentPage = page;
        this.getList(params);
      },
      getList(params) {
        this.$http.post(this.api.queryIronBuy, params).then(res => {
          if (res.code === 1000) {
            res.data.result.forEach(el =>{
              el.aTime = el.bgTime - el.createTime
            })
            this.list = res.data.result;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      //  查看详情
      detailAction(data) {
        this.show = true;
        let params = {
          ironBuyId: data.id
        }
        this.$http.post(this.api.queryIronBuyInfo, params).then(res => {
          if (res.code === 1000) {
            res.data[0].aTime = res.data[0].bgTime - res.data[0].createTime;
            this.detailData = res.data[0];
            this.detailData.effectiveSeller.map(item => {
              item.hisShow = false;
              return item
            });
            this.detailData = this.detailData;
          }
        })
      },
      //  删除求购
      delAction(data) {
        let params = {
          ironBuyId: data.id
        }
        this.$Modal.confirm({
          title: '删除提示！',
          content: '确认删除该条数据？删除后将无法撤销!',
          onOk: () => {
            this.$http.post(this.api.deleteIronBuyInfo, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功!')
                this.getList(this.params);
              } else {
                this.$Message.error(res.message);
              }
            })
          }
        });
      },
      showMore(i) {
        //  查看历史报价 更新视图
          if(!this.$data.detailData.effectiveSeller[i].hisShow ){
            this.$data.detailData.effectiveSeller[i].hisShow = true;
            this.$data.detailData = Object.assign({}, this.$data.detailData);
          }else{
            this.$data.detailData.effectiveSeller[i].hisShow = false;
            this.$data.detailData = Object.assign({}, this.$data.detailData);
          }
      }
    },
    created() {}
  }
</script>

<style lang='less' scoped>
  .data-list {
    position: relative;
    padding-bottom: 50px;
    .pages {
      position: absolute;
      right: 0;
      bottom: 0
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
  
  .detail-page {
    p {
      margin-bottom: 6px;
    }
  }
  
  .offer-main {
    margin-top: 20px;
    .offer-head {
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
  
  .table-contnet {
    line-height: 40px;
    text-align: center;
    .head {
      background-color: #e6e6e6;
    }
    .row-body {
      border-bottom: 1px solid #e6e6e6;
      .active{
        color: green;
      }
    }
    .col {
      position: relative;
      height: 40px;
      padding: 0 3px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:first-child {
        overflow: inherit
      }
      .showMore {
        position: absolute;
        left: -10px;
        top: 0;
        color: #666;
      }
    }
    .history {
      background-color: #f0f0f0;
      text-align: left;
    }
  }
</style>