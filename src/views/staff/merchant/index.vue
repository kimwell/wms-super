<template>
  <div class="page-containter">
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
            <Col class-name="col" span="6">商户名称</Col>
            <Col class-name="col" span="3">联系人</Col>
            <Col class-name="col" span="3">联系电话</Col>
            <Col class-name="col" span="3">QQ</Col>
            <Col class-name="col" span="3">传真</Col>
            <Col class-name="col" span="6">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="item.id">
            <Col class-name="col" span="6">{{ item.companyName }}</Col>
            <Col class-name="col" span="3">{{ item.contact }}</Col>
            <Col class-name="col" span="3">{{ item.contactNum}}</Col>
            <Col class-name="col" span="3">{{ item.qq}}</Col>
            <Col class-name="col" span="3">{{ item.fax}}</Col>
            <Col class-name="col" span="6">
            <Button size="small" type="warning" @click="bindAccount(item,false)">绑定账号</Button>
            <Button size="small" type="warning" @click="bindItem(item)">查看绑定账号</Button>
            <Button size="small" type="warning" @click="openModel(true,item)">编辑</Button>
            <Button size="small" type="warning" @click="showBaseData(index)">分类数据</Button>
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
          <Poptip trigger="focus" content="content" placement="bottom" style="width: 100%;">
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
    <Modal v-model="bindRoleShow" width="1000" :closable="false" :mask-closable="false" title="已绑定账号">
      <div class="card">
        <div class="card-contnet">
          <div class="table-contnet">
            <Row class-name="head">
              <Col class-name="col" span="4">昵称</Col>
              <Col class-name="col" span="4">真实姓名</Col>
              <Col class-name="col" span="4">账号</Col>
              <Col class-name="col" span="8">角色</Col>
              <Col class-name="col" span="4">操作</Col>
            </Row>
            <Row v-for="(item,index) in bindRoleList" :key="item.id">
              <Col class-name="col" span="4">{{item.userName}}</Col>
              <Col class-name="col" span="4">{{item.realName}}</Col>
              <Col class-name="col" span="4">{{item.mobile}}</Col>
              <Col class-name="col" span="8">
              <Tag v-if="item.roleInfos.length != 0" color="blue" v-for="(sub,index) in item.roleInfos" :key="index">{{sub.roleName}}</Tag>
              </Col>
              <Col class-name="col" span="4">
              <Button size="small" type="warning" @click="bindAccount(item,true)">编辑</Button>
              </Col>
            </Row>
            <Row v-if="bindRoleList.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
            </Row>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="bindRoleShow = false">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="modalShow" :closable="false" :mask-closable="false" title="绑定账号">
      <Form ref="userInfo" :model="accountData" :rules="addRule" :label-width="90">
        <FormItem label="昵称" prop="userName">
          <Input v-model="accountData.userName" placeholder="用户昵称"></Input>
        </FormItem>
        <FormItem label="真实姓名" prop="realName">
          <Input v-model="accountData.realName" placeholder="用户真实姓名"></Input>
        </FormItem>
        <FormItem label="账号" prop="mobile">
          <Input v-model="accountData.mobile" ref="mobile" placeholder="账号"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="accountData.userPsd" type="password" :placeholder="roleEdit ? '如需修改密码，请在此输入新密码' : '用户密码'"></Input>
        </FormItem>
        <FormItem label="设置角色" prop="roleIds">
          <Select v-model="accountData.roleIds" multiple placeholder="请选择">
                       <Option v-for="role in roleList" :key="role.id" :value="role.id">{{ role.name }}</Option>
                    </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="closeAccount">取消</Button>
        <Button type="primary" :loading="loading" @click="accountHandle">添加</Button>
      </div>
    </Modal>
    <Modal title="分类数据配置" width="900" v-model="showData" loading :mask-closable="false" @on-ok="saveData">
        <baseData v-if="showData" :id="activeItem.id" ref="scope"></baseData>
    </Modal>
  </div>
</template>

<script>
  import baseData from './baseData'
  export default {
    components: {
      baseData
    },
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        isEdit: false,
        panelShow: false,
        bindRoleShow: false,
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
        totalCount: 0,
        accountData: {
          mobile: '',
          userName: '',
          userPsd: '',
          realName: '',
          saasCompanyId: '',
          mainCompanyId: '',
          roleIds: []
        },
        modalShow: false,
        addRule: {
          userName: [{
            required: true,
            message: '昵称不能为空',
            trigger: 'blur'
          }],
          realName: [{
            required: true,
            message: '真实姓名不能为空',
            trigger: 'blur'
          }],
          mobile: [{
            required: true,
            message: '账号不能为空',
            trigger: 'blur'
          }],
          password: [{
            required: false,
            message: '密码不能为空',
            trigger: 'blur'
          }],
          roleIds: [{
            required: true,
            type: 'array',
            min: 1,
            message: '至少选择一个角色',
            trigger: 'change'
          }]
        },
        roleList: [],
        bindRoleList: [],
        roleEdit: false, //是否为编辑模式
        activeIndex: 0,
        showData: false
      };
    },
    computed: {
      activeItem() {
        return this.list.length != 0 ? this.list[this.activeIndex] : {}
      }
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
      showBaseData(index) {
        this.activeIndex = index;
        this.showData = true;
      },
      //  保存分类数据
      saveData(){
        this.$refs.scope.saveBaseData();
        this.showData = false
      },
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
      //  查看已绑定的账号
      bindItem(data) {
        this.bindRoleShow = true;
        this.$http.post(this.api.findCompanyUserList, {
          companyId: data.id
        }).then(res => {
          if (res.code === 1000) {
            this.bindRoleList = res.data;
          }
        })
      },
      resetAccount() {
        this.accountData = {
          mobile: '',
          userName: '',
          userPsd: '',
          realName: '',
          saasCompanyId: '',
          mainCompanyId: '',
          roleIds: []
        }
      },
      bindAccount(data, roleEdit) {
        this.roleEdit = roleEdit;
        this.modalShow = true;
        if (roleEdit) {
          data.roleInfos.forEach(el => {
            this.accountData.roleIds.push(el.roleId)
          })
          this.accountData.mainCompanyId = data.mainCompanyId,
            this.accountData.saasCompanyId = data.saasCompanyId,
            this.accountData.mobile = data.mobile,
            this.accountData.userName = data.userName,
            this.accountData.realName = data.realName
        } else {
          this.accountData.mainCompanyId = data.companyId;
          this.accountData.saasCompanyId = data.id
        }
      },
      //  绑定账号
      accountHandle() {
        this.$refs.userInfo.validate((valid) => {
          if (valid) {
            let params = JSON.stringify(this.accountData);
            this.$http.post(this.api.bindAccount, {
              jsonInfo: params
            }).then(res => {
              if (res.code === 1000) {
                this.$Message.success('绑定成功')
                this.modalShow = false;
                this.getList();
                if (this.roleEdit)
                  this.bindRoleShow = false
                this.resetAccount();
  
              } else {
                this.$Message.error(res.message)
              }
            })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      closeAccount() {
        this.modalShow = false;
        this.resetAccount();
      },
      getRoleList() {
        this.$http.post(this.api.findRoleList, {
          loginType: 2
        }).then(res => {
          if (res.code === 1000) {
            this.roleList = res.data;
          }
        })
      }
    },
    created() {
      this.getList();
      this.getRoleList();
    }
  };
</script>

<style lang='less' scoped>
  .page-containter /deep/.ivu-poptip /deep/ .ivu-poptip-rel {
    width: 100%;
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