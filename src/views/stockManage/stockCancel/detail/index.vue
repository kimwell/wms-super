<template>
  <div class="details">
    <Card :bordered="false" class="card">
      <p slot="title">原单基本信息<span class="title-bar-status">状态：{{item.cancelTicket.status | toStatus}}</span></p>
      <div slot="extra">
        <Button v-show="item.cancelTicket.status == '1'" type="warning" @click="add">确认退货入库</Button>
        <Button type="warning" @click="goBack">返回</Button>
      </div>
      <Row class="row-list">
        <Col span="6">客户单位：{{item.oldSaleTicket.buyCompanyName}}</Col>
        <Col span="6">仓库：{{item.oldSaleTicket.storeHouseName}}</Col>
        <Col span="6">下单日期：{{item.oldSaleTicket.ticketTime | dateformat('yyyy-MM-dd')}}</Col>
        <Col span="6">跟单员：{{item.oldSaleTicket.merchandiser}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="6">审核人：{{item.oldSaleTicket.checkMan}}</Col>
        <Col span="6">提货车主：{{item.oldSaleTicket.carMan}}</Col>
        <Col span="6">提货车号：{{item.oldSaleTicket.carId}}</Col>
        <Col span="6">备注：{{item.oldSaleTicket.remark}}</Col>
      </Row>
    </Card>
    <Card :bordered="false" class="card" title="原单明细">
      <Row class="row-list">
        <!-- <Col span="4">销售总额：￥{{item.oldSaleTicket.saleMoney}}</Col>
          <Col span="4">不含税总金额：￥{{item.oldSaleTicket.moneyWithoutTax}}</Col>
          <Col span="4">税：￥{{item.oldSaleTicket.tax}}</Col> -->
        <Col span="4">总重量：{{item.oldSaleTicket.weight}}KG</Col>
        <Col span="4">总件数：{{item.oldSaleTicket.number}}</Col>
      </Row>
      <Table width="100%" :columns="tableHeader" :data="item.oldSaleTicket.saleTicketInfos"></Table>
    </Card>
    <Card :bordered="false" class="card" title="退货单">
      <Table width="100%" :columns="tableHeader" :data="item.cancelTicket.cancelTicketInfos"></Table>
      <!-- <h4 style="padding: 15px 0;">其他信息</h4>
        <Table width="100%" :columns="costHeader" :data="item.oldSaleTicket.saleTicketCosts"></Table> -->
    </Card>
    <Card :bordered="false" class="card" title="退货信息">
      <Form :mode="dataApi" :label-width="100" inline>
        <FormItem label="确认备注：">
          <Input type="text" :disabled="item.cancelTicket.status == '1' ? false : true" v-model="dataApi.inRemark" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="附件1：" v-if="item.cancelTicket.status == '1'">
          <uploadPic v-model="attachMent[0]"></uploadPic>
        </FormItem>
        <FormItem label="附件2：" v-if="item.cancelTicket.status == '1'">
          <uploadPic v-model="attachMent[1]"></uploadPic>
        </FormItem>
        <FormItem label="附件3：" v-if="item.cancelTicket.status == '1'">
          <uploadPic v-model="attachMent[2]"></uploadPic>
        </FormItem>
        <div v-if="item.cancelTicket.status != '1'" style="display:inline-block;">
          <FormItem :label="`附件${index+1}：`" v-for="(item,index) in attachMent" :key="index">
            <img :src="item" style="width: 200px;">
          </FormItem>
        </div>
      </Form>
    </Card>
  </div>
</template>

<script>
import uploadPic from "@/components/basics/uploadPic.vue";
export default {
  components: {
    uploadPic
  },
  data() {
    return {
      item: {
        oldSaleTicket: {},
        cancelTicket: {},
        newSaleTicket: {},
        cancelTicketLog: []
      },
      dataApi: {
        zfId: "",
        inRemark: "",
        inAttachMent: ""
      },
      isRefresh: false,
      attachMent: [],
      costHeader: [
        {
          title: "序号",
          key: "index",
          minWidth: 60,
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "费用名称",
          key: "costName",
          minWidth: 150
        },
        {
          title: "数量",
          key: "number",
          minWidth: 150
        },
        {
          title: "单价",
          key: "price",
          minWidth: 150
        },
        {
          title: "税/%",
          key: "tax",
          minWidth: 150
        },
        {
          title: "金额",
          key: "money",
          minWidth: 150
        }
      ],
      tableHeader: [
        {
          title: "序号",
          key: "index",
          minWidth: 60,
          render: (h, params) => {
            return h("span", params.index + 1);
          }
        },
        {
          title: "货物名称",
          key: "cargoName",
          minWidth: 150
        },
        {
          title: "产地",
          key: "proPlaceName",
          minWidth: 150
        },
        {
          title: "规格",
          key: "specifications",
          minWidth: 150,
          render: (h, params) => {
            let str =
              params.row.specifications != ""
                ? params.row.specifications
                : `${params.row.height}*${params.row.width}*${
                    params.row.length
                  }`;
            return h("div", str);
          }
        },
        {
          title: "公差",
          key: "tolerance",
          minWidth: 150
        },
        {
          title: "单件重量(KG)",
          key: "singleWeight",
          minWidth: 150
        },
        {
          title: "产品单位",
          key: "numberUnit",
          minWidth: 150,
          render: (h, params) => {
            let str = `${params.row.weightUnit}/${params.row.numberUnit}`;
            return h("span", str);
          }
        },
        {
          title: "卷号",
          key: "coiledSheetNum",
          minWidth: 100
        },
        {
          title: "数量",
          key: "number",
          minWidth: 100
        },
        {
          title: "理计重量(KG)",
          key: "meterWeight",
          minWidth: 120,
          render: (h, params) => {
            let str = (params.row.singleWeight * params.row.number).toFixed(3);
            return h("span", str);
          }
        },
        {
          title: "过磅重量(KG)",
          key: "poundWeight",
          minWidth: 120
        },
        {
          title: "过磅单重(KG)",
          key: "poundSingleWeight",
          minWidth: 120
        },
        {
          title: "备注",
          key: "remark",
          minWidth: 100
        }
      ]
    };
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    inRemark() {
      return this.item.cancelTicket.inRemark;
    },
    inAttach() {
      return this.item.cancelTicket.inAttachMent;
    }
  },
  filters: {
    toStatus(val) {
      switch (val * 1) {
        case 1:
          return "待退货入库";
          break;
        case 2:
          return "退货已入库";
          break;
        case 3:
          return "待财务处理";
          break;
        case 4:
          return "财务已处理";
          break;
        case 5:
          return "已完成";
          break;
        case 6:
          return "已取消";
          break;
      }
    }
  },
  watch: {
    inRemark(newValue, oldValue) {
      this.dataApi.inRemark = newValue;
    },
    inAttach(newValue, oldValue) {
      this.attachMent = newValue != "" ? JSON.parse(newValue) : [];
    }
  },
  methods: {
    getData() {
      this.$http
        .post(this.api.findCancelTicket, {
          zfId: this.id
        })
        .then(res => {
          if (res.code === 1000) {
            this.item = res.data || {};
          }
        });
    },
    // 返回
    goBack() {
      this.$router.go(-1);
      this.isRefresh = false;
    },
    add() {
      this.$Modal.confirm({
        title: "退货确认提示！",
        content: "确认后无法撤销，是否继续？",
        onOk: () => {
          let params = this.$clearData(this.dataApi);
          params.zfId = this.id;
          let arrayFilter = this.attachMent.filter(function(item) {
            return item;
          });
          params.inAttachMent = JSON.stringify(arrayFilter);
          this.$http.post(this.api.cancelTicketIn, params).then(res => {
            if (res.code === 1000) {
              this.$Message.success("操作成功");
              // this.$router.push({
              //   name: "stockCancel"
              // });
              this.isRefresh = true;
              this.$router.go(-1);
            } else {
              this.$Message.error(res.message);
            }
          });
        }
      });
    }
  },
  created() {
    this.getData();
  },
  beforeRouteLeave(to, from, next) {
    next();
    //  返回是否刷新列表
    if(this.isRefresh){
      to.meta.keepAlive = false
    }else{
      to.meta.keepAlive = true
    }
  }
};
</script>

<style lang='less' scoped>
.title-bar-status {
  display: inline-block;
  margin-left: 80px;
  font-weight: normal;
}

.details {
  .card {
    margin-bottom: 15px;
  }
  .row-list {
    margin-bottom: 10px;
    &:last-child {
      margin: 0;
    }
  }
}
</style>