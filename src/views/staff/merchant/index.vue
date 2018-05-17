<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">商户管理</p>
      <Button slot="extra" type="primary" @click="openModel(false)">新增商户</Button>
      <Form :mode="listApi" :label-width="80" inline>
        <FormItem label="商户公司">
          <Input type="text" v-model="listApi.companyName" @on-change="onFilter" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="8">商户名称</Col>
            <Col class-name="col" span="3">联系人</Col>
            <Col class-name="col" span="3">联系电话</Col>
            <Col class-name="col" span="3">qq</Col>
            <Col class-name="col" span="3">传真</Col>
            <Col class-name="col" span="4">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="item.id">
            <Col class-name="col" span="8">{{ item.companyName }}</Col>
            <Col class-name="col" span="3">{{ item.contact }}</Col>
            <Col class-name="col" span="3">{{ item.contactNum}}</Col>
            <Col class-name="col" span="3">{{ item.qq}}</Col>
            <Col class-name="col" span="3">{{ item.fax}}</Col>
            <Col class-name="col" span="4">
            <Button size="small" type="warning" @click="openModel(true,item)">编辑</Button>
            <Button size="small" type="warning" @click="bindItem(item)">绑定</Button>
            <Button size="small" type="error" @click="deleteItem(item)">删除</Button>
            </Col>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="listApi.currentPage" :page-size="listApi.pageSize" @on-change="changePage"></Page>
      </div>
    </Card>
    <Modal v-model="panelShow" :closable="false" :mask-closable="false" :title="isEdit ? '编辑商户':'新增商户'">
      <Form :label-width="110" :ref="ref" :model="itemApi" :rules="rules">
        <FormItem label="公司名称：" prop="companyName">
          <Poptip trigger="focus" content="content" placement="bottom">
            <Input v-model="itemApi.companyName" placeholder="请输入" />
            <div class="api" slot="content">
              <div class="apiList" v-for="item in companyList" @click="selectItem(item)">{{item.companyName}}</div>
              <div class="apiList" v-if="companyList.length == 0">暂无匹配</div>
            </div>
          </Poptip>
        </FormItem>
        <FormItem label="联系人：" prop="contact">
          <Input v-model="itemApi.contact" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="联系电话：" prop="contactNum">
          <Input v-model="itemApi.contactNum" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="QQ：">
          <Input v-model="itemApi.qq" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="传真：">
          <Input v-model="itemApi.fax" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="close">取消</Button>
        <Button type="primary" :loading="loading" @click="modalHandle">{{ isEdit ? '编辑' : '添加' }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        isEdit: false,
        panelShow: false,
        itemApi: {
          companyName: '',
          qq: '',
          contact: '',
          contactNum: '',
          fax: '',
          id: '',
          companyId: ''
        },
        listApi: {
          companyName: '',
          contact: '',
          contactNum: '',
          fax: '',
          qq: '',
          currentPage: 1,
          pageSize: 10
        },
        rules: {
          companyName: [{
            required: true,
            message: '公司名称不能为空',
            trigger: 'blur'
          }],
          contact: [{
            required: true,
            message: '联系人不能为空',
            trigger: 'blur'
          }],
          contactNum: [{
            required: true,
            message: '联系电话不能为空',
            trigger: 'blur'
          }],
        },
        loading: false,
        companyList: [],
        list: [],
        totalCount: 0
      };
    },
    watch: {
      'itemApi.companyName': function(val, oldval) {
        if (val != '') {
          this.remoteMethod();
        } else if (val == '') {
          this.resetData();
        }　　　　　
      },
    },
    methods: {
      resetFilter() {
        this.listApi = {
          companyName: '',
          contact: '',
          contactNum: '',
          fax: '',
          qq: '',
          currentPage: 1,
          pageSize: 10
        }
        this.getList();
      },
      onFilter() {
        if (this.listApi.companyName != '') {
          this.getList();
        }
      },
      //  翻页
      changePage(page) {
        this.listApi.currentPage = page;
        this.getList();
      },
      getList() {
        this.$http.post(this.api.findBusinessList, this.listApi).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      openModel(isEdit, data) {
        this.isEdit = isEdit;
        this.panelShow = true;
        if (isEdit) {
          this.itemApi = {
            companyName: data.companyName,
            qq: data.qq,
            contact: data.contact,
            contactNum: data.contactNum,
            fax: data.fax,
            id: data.id,
            companyId: data.companyId
          }
        } else {
          this.resetData();
        }
      },
      remoteMethod(query) {
        if (this.itemApi.companyName != '') {
          this.$http.post(this.api.getRemoteBusinessInfo, {
            companyName: this.itemApi.companyName
          }).then(res => {
            if (res.code === 1000) {
              this.companyList = res.data
            }
          })
        } else {
          this.companyList = []
        }
      },
      resetData() {
        this.itemApi = {
          companyName: '',
          qq: '',
          contact: '',
          contactNum: '',
          fax: '',
          id: ''
        }
        this.companyList = []
      },
      selectItem(data) {
        this.itemApi = {
          companyName: data.companyName,
          qq: data.qq,
          contact: data.contact,
          contactNum: data.contactNum,
          fax: data.fax,
          id: '',
          companyId: data.id
        }
      },
      close() {
        this.panelShow = false;
        this.resetData();
      },
      //  保存、编辑商户
      modalHandle() {
        this.$refs[this.ref].validate((valid) => {
          if (valid) {
            let params = this.itemApi;
            this.$http.post(this.api.saveBusinessInfo, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('成功');
                this.panelShow = false;
                this.getList();
              } else {
                this.$Message.error(res.message)
              }
            })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      // 删除商户
      deleteItem(data) {
        let params = {
          id: data.id
        }
        this.$Modal.confirm({
          title: "删除提示！",
          content: "删除后无法撤销，是否继续？",
          onOk: () => {
            this.$http.post(this.api.delBusiness, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功');
                this.getList();
              } else {
                this.$Message.error(res.message)
              }
            })
          }
        })
      },
      bindItem() {
  
      }
    },
    created() {
      this.getList();
    }
  };
</script>

<style lang='less' scoped>
  .ivu-modal-content /deep/ .ivu-poptip {
    display: block;
  }
  
  .ivu-modal-content /deep/ .ivu-poptip-rel {
    display: block;
  }
  
  .apiList {
    line-height: 36px;
    cursor: pointer;
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