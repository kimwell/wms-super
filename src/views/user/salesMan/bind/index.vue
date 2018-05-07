<template>
  <div class="comm-container">
    <h2 class="panel-title">专员绑定管理</h2>
    <Form :mode="filterData" :label-width="80" inline style="margin-top:24px;">
      <FormItem prop="name" label="商家名称">
        <Input type="text" v-model="filterData.name" @on-blur="onFilter" placeholder="请输入..."></Input>
      </FormItem>
      <!-- <FormItem prop="login" label="商家账号">
        <Input type="text" v-model="filterData.login" @on-blur="onFilter" placeholder="请输入..."></Input>
      </FormItem> -->
      <FormItem prop="bind" label="绑定状态：">
        <Select v-model="filterData.bind" @on-change="onFilter" placeholder="请选择" style="width:150px">
                <Option v-for="bind in stateData" :key="bind.val" :value="bind.val">{{ bind.name }}</Option>
              </Select>
      </FormItem>
      <FormItem  label="绑定来源：">
        <Select v-model="filterData.saleFrom" @on-change="onFilter" placeholder="请选择" style="width:150px">
                <Option v-for="item in [{id:0,label:'专员绑定'},{id:1,label:'平台绑定'}]" :key="item.id" :value="item.id">{{ item.label }}</Option>
              </Select>
      </FormItem>
      <FormItem prop="login" label="绑定专员">
        <Select v-model="filterData.salesmanUserId" @on-change="onFilter" placeholder="请选择" style="width:150px">
                  <Option v-for="item in saleManList" :key="item.userId" :value="item.userId">{{ item.userName }}</Option>
              </Select>
      </FormItem>
      <FormItem>
        <Button type="warning" @click.native="resetFilter">清除</Button>
      </FormItem>
    </Form>
    <div class="panel">
      <Card :bordered="false" class="card">
        <div class="card-contnet">
          <div class="table-contnet">
            <Row class-name="head">
              <Col class-name="col" span="1">
              <Checkbox :indeterminate="indeterminate" :value="checkAll" @click.prevent.native="handleCheckAll">全选</Checkbox>
              </Col>
              <Col class-name="col" span="5">商家公司</Col>
              <!-- <Col class-name="col" span="3">商家账号</Col> -->
              <Col class-name="col" span="4">联系人</Col>
              <Col class-name="col" span="4">联系方式</Col>
              <Col class-name="col" span="4">专员姓名</Col>
              <Col class-name="col" span="2">专员账号</Col>
              <Col class-name="col" span="2">最近操作人</Col>
              <Col class-name="col" span="2">绑定来源</Col>
            </Row>
            <CheckboxGroup ref="getGroup" v-model="bindData.busers" @on-change="checkAllGroupChange">
              <Row v-for="(item,index) in roleList" :key="item.id">
                <Col class-name="col" span="1">
                <Checkbox :label="item.id">&nbsp;</Checkbox>
                </Col>
                <Col class-name="col" span="5">{{ item.companyName }}</Col>
                <!-- <Col class-name="col" span="4">{{ item.mobile }}</Col> -->
                <Col class-name="col" span="4">{{ item.contact }}</Col>
                <Col class-name="col" span="4">{{ item.contactNum }}</Col>
                <Col class-name="col" span="4">{{ item.saleName }}</Col>
                <Col class-name="col" span="2">{{ item.saleTel }}</Col>
                <Col class-name="col" span="2">{{ item.updateUser }}</Col>
                <Col class-name="col" span="2">
                  <span v-if="item.saleFrom == '1'">平台绑定</span>
                  <span v-else-if="item.saleFrom == '0'">专员绑定</span>
                  <span v-else>-</span>
                </Col>
              </Row>
            </CheckboxGroup>
            <Row v-if="roleList.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
            </Row>
          </div>
          <Page class="page-count" size="small" show-total :total="totalCount" :current="filterData.currentPage" :page-size="filterData.pageSize" @on-change="changePage"></Page>
        </div>
      </Card>
      <div class="bind-main">
        你已勾选<span class="num">{{selectLen}}</span>家商户，批量绑定至专员
        <Select v-model="bindData.salesmanUserId" placeholder="请选择" style="width:150px">
                  <Option v-for="item in saleManList" :key="item.userId" :value="item.userId">{{ item.userName }}</Option>
              </Select>

        <RadioGroup v-model="origin">
          <Radio :label="1">
              <span>平台绑定</span>
          </Radio>
          <Radio :label="0">
              <span>专员绑定</span>
          </Radio>
        </RadioGroup>
        <Button type="primary" size="large" @click.native="savaBind">绑定</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      filterData: {
        name: "",
        login: "",
        bind: "",
        salesmanUserId: "",
        saleFrom:'',
        pageSize: 10,
        currentPage: 1
      },
      bindData: {
        busers: [],
        salesmanUserId: ""
      },
      roleList: [],
      saleManList: [],
      roleStaus: [],
      totalCount: 0,
      stateData: [
        {
          val: "2",
          name: "不限"
        },
        {
          val: "1",
          name: "已绑定"
        },
        {
          val: "0",
          name: "未绑定"
        }
      ],
      indeterminate: false,
      checkAll: false,
      selectLen: 0,
      origin: 1
    };
  },
  computed: {
    allCheckIds() {
      let arr = [];
      this.roleList.forEach(el => {
        arr.push(el.id);
      });
      return arr;
    }
  },
  methods: {
    //  获取查询绑定用户
    getAllList() {
      this.$http
        .post(this.api.findCompangWithSaleman, this.filterData)
        .then(res => {
          if (res.code === 1000) {
            this.roleList = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        });
    },
    onFilter() {
      this.filterData.currentPage = 1;
      this.getAllList();
      this.resetBindData();
    },
    changePage(page) {
      this.filterData.currentPage = page;
      this.getAllList();
      this.resetBindData();
    },
    //  获取专员
    getSalemanInfos() {
      this.$http.post(this.api.findSalemanInfos).then(res => {
        if (res.code === 1000) {
          this.saleManList = res.data;
        }
      });
    },
    //  清空筛选数据
    resetFilter() {
      this.filterData.name = "";
      this.filterData.bind = "";
      this.filterData.login = "";
      this.filterData.salesmanUserId = "";
      this.filterData.saleFrom = ''
      this.getAllList();
      this.resetBindData();
    },
    //  清空绑定信息
    resetBindData() {
      this.bindData.busers = [];
      this.bindData.salesmanUserId = "";
      this.indeterminate = false;
      this.checkAll = false;
      this.selectLen = 0;
    },
    //  全选
    handleCheckAll(val) {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;
      if (this.checkAll) {
        this.bindData.busers = this.allCheckIds;
        this.selectLen = this.bindData.busers.length;
      } else {
        this.bindData.busers = [];
        this.selectLen = 0;
      }
    },
    checkAllGroupChange(data) {
      this.selectLen = this.bindData.busers.length;
      if (data.length === this.filterData.pageSize) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    //  确认绑定
    savaBind() {
      this.$Modal.confirm({
        title: " 绑定提示！",
        content: "确认绑定？",
        onOk: () => {
          let params = this.$clearData(this.bindData);
          params.busers = JSON.stringify(params.busers);
          params.saleFrom = this.origin
          this.$http.post(this.api.updateSalemanInfo, params).then(res => {
            if (res.code === 1000) {
              this.$Message.success("操作成功！");
              this.getAllList();
              this.resetBindData();
            } else {
              this.$Message.error("操作失败！");
            }
          });
        }
      });
    }
  },
  created() {
    this.getAllList();
    this.getSalemanInfos();
  }
};
</script>

<style lang="less" scoped>
.panel-title {
  font-size: 16px;
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
    border-left: 1px solid #d0d0d0;
    .head {
      background-color: #ddd;
    }
    .col {
      height: 40px;
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

.bind-main {
  position: relative;
  padding-bottom: 30px;
  .num {
    color: red;
  }
  button {
    position: absolute;
    top: 0;
    right: 30px;
  }
}
</style>



