<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">加工单详情<span class="status-header">状态：{{item.status | toStatus}}</span></p>
      <div slot="extra">
        <Button size="small" v-if="item.status == '1'" @click="onPrecess" type="warning">确认加工</Button>
        <Button size="small" type="warning" @click="goBack">返回</Button>
      </div>
      <div class="detail-wrapper">
        <Row class="row-list">
          <Col span="6">公司名称：{{item.customerName}}</Col>
          <Col span="6">加工公司名称：{{item.processName}}</Col>
          <Col span="6">加工公司联系人：{{item.contactName}}</Col>
          <Col span="6">加工公司联系方式：{{item.contactNum}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="6">制单人：{{item.ticketMan}}</Col>
          <Col span="6">审核人：{{item.checkMan}}</Col>
          <Col span="6">提货人：{{item.carMan}}</Col>
          <Col span="6">提货车号：{{item.carId}}</Col>
        </Row>
      </div>
    </Card>
    <Card :bordered="false" class="card">
      <p slot="title">加工货物</p>
      <div class="detail-wrapper">
        <Row class="row-list">
          <Col span="6">货物名称：{{item.cargoName}}</Col>
          <Col span="6">剩余重量：{{item.remainWeight}}</Col>
          <Col span="6">原重量：{{item.processWeight}}</Col>
          <Col span="6">卷号：{{item.coiledSheetNum}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="6">规格：{{item.specification !=''? item.specification: `${item.height}*${item.width}*${item.length}`}}</Col>
          <Col span="6">公差：{{item.tolerance}}</Col>
          <Col span="6">产地：{{item.proPlaceName}}</Col>
          <Col span="6">表面：{{item.surfaceName}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="6">仓库：{{item.storeHouseName}}</Col>
          <Col span="6">加工费用：{{item.cost}}</Col>
          <Col span="6">交货日期：{{item.delivery | dateformat('yyyy-MM-dd')}}</Col>
          <Col span="6">备注：{{item.remark}}</Col>
        </Row>
      </div>
    </Card>
    <Card :bordered="false" class="card">
      <p slot="title">加工明细</p>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">序号</Col>
            <Col class-name="col" span="5">规格</Col>
            <Col class-name="col" span="5">公差</Col>
            <Col class-name="col" span="5">数量</Col>
            <Col class-name="col" span="5">重量</Col>
          </Row>
          <Row v-for="(sub,index) in item.processTicketInfos" :key="index">
            <Col class-name="col" span="4">{{index}}</Col>
            <Col class-name="col" span="5">{{`${sub.height}*${sub.width}*${sub.length}`}}</Col>
            <Col class-name="col" span="5">{{sub.tolerance}}</Col>
            <Col class-name="col" span="5">{{sub.number}}</Col>
            <Col class-name="col" span="5">{{sub.weight}}</Col>
          </Row>
          <div v-if="item.processTicketInfos">
            <Row v-if="item.processTicketInfos.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
            </Row>
          </div>
        </div>
      </div>
      <div class="totalNum"><span>数量合计：{{item.number}}</span><span>加工重量合计： {{item.processWeight}}</span></div>
    </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        item: {}
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      }
    },
    filters: {
      toStatus(val) {
        switch (val * 1) {
          case 1:
            return '待加工'
            break;
          case 2:
            return '加工中'
            break;
          case 3:
            return '待入库'
            break;
          case 4:
            return '已入库'
            break;
          case 5:
            return '已取消'
            break;
        }
      }
    },
    methods: {
      getData() {
        this.$http.post(this.api.findProcess, {
          processId: this.id
        }).then(res => {
          if (res.code === 1000) {
            this.item = res.data;
          }
        })
      },
      // 返回
      goBack() {
        this.$router.go(-1)
      },
      //  确认加工
      onPrecess() {
        this.$Modal.confirm({
          title: "确认加工提示！",
          content: "确认加入加工单？",
          onOk: () => {
            let params = {
              processId: this.id
            }
            this.$http.post(this.api.saveProcess, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('加入成功');
                this.$router.go(-1)
              } else {
                this.$Message.error(res.message)
              }
            })
          }
        })
      }
    },
    created() {
      this.getData();
    }
  }
</script>

<style lang='less' scoped>
  .card {
    margin-bottom: 20px;
    .status-header {
      display: inline-block;
      padding-left: 40px;
      font-weight: normal;
    }
    .detail-wrapper {
      .row-list {
        margin-bottom: 15px;
      }
    }
    .totalNum {
      span {
        display: inline-block;
        margin-right: 30px;
      }
    }
  }
  
  .card {
    position: relative;
    margin-bottom: 20px;
    .card-contnet {
      position: relative;
      padding-bottom: 40px;
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
    .page-count {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
</style>