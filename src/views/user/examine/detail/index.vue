<template>
  <div style="background: #fff;">
    <Card :bordered="false" dis-hover>
      <p slot="title">商家基本信息</p>
      <Row>
        <Col class-name="col" span="2" class="col-title"><span class="star">*</span>公司名称：</Col>
        <Col class-name="col" span="22">{{item.companyName}}</Col>
      </Row>
      <Row>
        <Col class-name="col" span="2" class="col-title"><span class="star">*</span>注册资金：</Col>
        <Col class-name="col" span="22">{{item.regMoney}}万元</Col>
      </Row>
    </Card>
    <Card :bordered="false" dis-hover>
      <p slot="title">商家业务信息</p>
      <Row>
        <Col class-name="col" span="2" class="col-title"><span class="star">*</span>联系人：</Col>
        <Col class-name="col" span="22">{{item.contact}}</Col>
      </Row>
      <Row>
        <Col class-name="col" span="2" class="col-title"><span class="star">*</span>联系电话：</Col>
        <Col class-name="col" span="22">{{item.contactNum}}</Col>
      </Row>
      <Row>
        <Col class-name="col" span="2" class="col-title">QQ：</Col>
        <Col class-name="col" span="22">{{item.qq}}</Col>
      </Row>
      <Row>
        <Col class-name="col" span="2" class="col-title">传真：</Col>
        <Col class-name="col" span="22">{{item.fax}}</Col>
      </Row>
      <Row>
        <Col class-name="col" span="2" class="col-title"><span class="star">*</span>办公地址：</Col>
        <Col class-name="col" span="22">{{item.provinceName}}{{item.cityName}}{{item.districtName}}{{item.address}}</Col>
      </Row>
      <Row>
        <Col class-name="col" span="2" class="col-title">我的专员：</Col>
        <Col class-name="col" span="22">
          <Select v-model="sale" placeholder="请选择" disabled size="small" style="width:200px">
            <Option v-for="item in saleman" :value="item.saleName + '-'+item.saleId + '-'+ item.saleMobile" :key="item.saleId" >{{ item.saleName }}  {{ item.saleMobile }}</Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <Col class-name="col" span="2" class="col-title">店铺封面：</Col>
        <Col class-name="col" span="22">
          <div class="preview" style="width:200px;" v-if="item.cover !=''"> 
            <img :src="item.cover" style="max-width: 100%;" />
            <span class="pre-bottom"><i class="iconfont icon-fangda" @click="showPreview(item.cover)"></i></span>
          </div>
        </Col>
      </Row>
      <Row>
        <Col class-name="col" span="2" class="col-title"><span class="star">*</span>店铺简介：</Col>
        <Col class-name="col" span="22">{{item.sellerProfile !='' ? item.sellerProfile: '暂无'}}</Col>
      </Row>
    </Card>
    <Card :bordered="false" dis-hover>
      <p slot="title">上传证件</p>
      <Row>
        <Col class-name="col" span="2" class="col-title"><span class="star">*</span>证件类型：</Col>
        <Col class-name="col" span="22">{{item.flag == 1? "三证合一":"营业执照+组织机构代码证+税务登记证"}}</Col>
      </Row>
      <Row v-if="item.flag == 1">
        <Col class-name="col" span="2" class="col-title">营业执照：</Col>
        <Col class-name="col" span="22">
          <div class="preview" style="width:200px;">
            <img :src="item.allCer" style="max-width: 100%;" />
            <span class="pre-bottom"><i class="iconfont icon-fangda" @click="showPreview(item.allCer)"></i></span>
          </div>
        </Col>
      </Row>
      <Row v-else>
        <Col class-name="col" span="2" class="col-title">照片：</Col>
        <Col class-name="col" span="4" style="margin-right:15px;">
        <p><span class="star">*</span>营业执照</p>
        <div class="preview">
          <img :src="item.bussinessLic" style="max-width: 100%;" />
          <span class="pre-bottom"><i class="iconfont icon-fangda" @click="showPreview(item.bussinessLic)"></i></span>
        </div>
        </Col>
        <Col class-name="col" span="4" style="margin-right:15px;">
        <p><span class="star">*</span>组织机构代码证</p>
          <div class="preview">
            <img :src="item.codeLic"  style="max-width: 100%;" />
            <span class="pre-bottom"><i class="iconfont icon-fangda" @click="showPreview(item.codeLic)"></i></span>
          </div>
        </Col>
        <Col class-name="col" span="4">
        <p><span class="star">*</span>税务登记证</p>
          <div class="preview">
            <img :src="item.financeLic" style="max-width: 100%;" />
            <span class="pre-bottom"><i class="iconfont icon-fangda" @click="showPreview(item.financeLic)"></i></span>
          </div>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" dis-hover v-if="this.getStatus == 3">
      <p slot="title">审核未通过</p>
      <Row>
        <Col class-name="col" span="2" class="col-title">未通过时间：</Col>
        <Col class-name="col" span="22">{{item.overAuditTime | dateformat}}</Col>
      </Row>
      <Row>
        <Col class-name="col" span="2" class="col-title">未通过理由：</Col>
        <Col class-name="col" span="22">{{item.remark}}</Col>
      </Row>
    </Card>
    <Card :bordered="false" dis-hover v-if="this.getStatus == 2">
      <p slot="title">审核操作</p>
      <Row>
        <Button type="primary" @click="passHandle(1)">审核通过</Button>
        <Button type="ghost" @click="passHandle(2)">无法通过</Button>
      </Row>
    </Card>
    <Modal v-model="show" :closable="false">
      <h2 class="form-title">无法通过认证审核</h2>
      <Form :model="apiData" label-position="top">
        <FormItem label="">
          <Input v-model="apiData.remark" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入此次认证申请无法通过审核的原因，用户将可以查看此结果"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
        <Button type="primary" @click="unpass" :loading="loading">确认</Button>
      </div>
    </Modal>
    <Modal v-model="preShow" width="800" title="查看大图">
      <div class="preview-img">
        <img :src="showImg">
      </div>
      <div slot="footer">
        <a class="btns" @click="preShow = false">关闭</a>
      </div>
    </Modal>
  </div>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      loading: false,
      apiData: {
        companyId: "",
        pass: "",
        remark: "",
        saleId: "",
        saleMobile: "",
        saleName: ""
      },
      item: {},
      saleman: [],
      sale: "",
      preShow: false,
      showImg: ''
    };
  },
  computed: {
    getId() {
      return this.$route.params.id;
    },
    getUserId(){
      return this.$route.params.userId
    },
    getStatus() {
      return this.$route.params.status;
    }
  },
  watch: {
    sale(val){
      if(val != ''){
        let saless = val.split('-');
        this.apiData.saleId = saless[1]
        this.apiData.saleMobile = saless[2]
        this.apiData.saleName = saless[0]
      }
    }
  },
  methods: {
    getData() {
      let params = {
        companyId: this.getId
      };
      this.$http.post(this.api.getBuserInfoByUserId, params).then(res => {
        if (res.code === 1000) {
          this.item = res.data;
          if(this.item.saleName != ''){
            this.sale = `${this.item.saleName}-${this.item.saleId}-${this.item.saleMobile}`;
          }
        }
      });
    },
    getSalesMan() {
      this.$http.post(this.api.findSalemanInfo).then(res => {
        if (res.code === 1000) {
          this.saleman = res.data;
        }
      });
    },
    //  通过审核
    passHandle(data) {
      if (data == 1) {
        this.$Modal.confirm({
          title: " 审核提示！",
          content: "确认审核通过该商户？",
          onOk: () => {
            // if (this.sale != "") {
            //   let sales = this.sale.split("-");
              this.apiData = {
                companyId: this.getId,
                userId: this.getUserId,
                pass: 1,
                remark: "",
                saleId: this.apiData.saleId,
                saleMobile: this.apiData.saleMobile,
                saleName: this.apiData.saleName
              };
            // }
            // if (this.apiData.saleId != "") {
              this.handleSubmit();
            // } else {
            //   this.$Message.error("请选择专员");
            // }
          }
        });
      } else {
        this.show = true;
      }
    },
    //  不通过审核
    unpass() {
      if (this.apiData.remark != "") {
        this.apiData = {
          companyId: this.getId,
          userId: this.getUserId,
          pass: 3,
          remark: this.apiData.remark,
          saleId: this.item.saleId,
          saleMobile: this.item.saleMobile,
          saleName: this.item.saleName
        };
        this.handleSubmit();
      } else {
        this.$Message.error("请填写不通过原因");
      }
    },
    //  提交审核
    handleSubmit() {
      this.$http.post(this.api.updateBuserInfoById, this.apiData).then(res => {
        if (res.code === 1000) {
          this.$router.push({
            name: "examine"
          });
        }
      });
    },
    //  预览大图
    showPreview(data){
      this.preShow = true
      this.showImg = data;
    }
  },
  mounted() {
    this.getData();
  },
  created() {
    this.getData();
    this.getSalesMan();
  }
};
</script>

<style lang='less' scoped>
.ivu-row {
  padding: 12px 0;
}

.col-title {
  text-align: right;
  padding-right: 10px;
}
.star {
  color: red;
}
.form-title {
  display: block;
  text-align: center;
  margin-bottom: 15px;
}
.preview{
  position: relative;
  .pre-bottom{
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: right;
    padding-right: 10px;
    background: rgba(0,0,0,.7);
    color: #fff;
    .iconfont{
      cursor: pointer;
    }
  }
}
.preview-img{
  img{
    max-width: 100%;
    display: block;
    margin: 0 auto;
  }
}
</style>