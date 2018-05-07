<template>
  <Card :bordered="false" class="card">
    <p slot="title">商家子账号管理</p>
    <Button slot="extra" size="small" type="success" @click="openModel(false)">新增商户子账号</Button>
    <div class="account-wrap">
      <Form :mode="filterData" :label-width="80" inline>
        <FormItem label="真实姓名">
          <Input type="text" v-model="filterData.realName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="用户账号">
          <Input type="text" v-model="filterData.mobile" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="商家名称">
          <Input type="text" v-model="filterData.companyName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">商户名称</Col>
            <Col class-name="col" span="3">用户账号</Col>
            <Col class-name="col" span="2">真实姓名</Col>
            <Col class-name="col" span="3">角色</Col>
            <Col class-name="col" span="2">备注</Col>
            <Col class-name="col" span="3">创建人</Col>
            <Col class-name="col" span="3">账号创建时间</Col>
            <Col class-name="col" span="4">操作</Col>
          </Row>
          <Row v-for="item in list" :key="item.id">
            <Col class-name="col" span="4">{{item.companyName}}</Col>
            <Col class-name="col" span="3">{{item.mobile}}</Col>
            <Col class-name="col" span="2">{{item.real_name}}</Col>
            <Col class-name="col" span="3"><roleTag :role="item.usrType"></roleTag></Col>
            <Col class-name="col" span="2">{{item.remark != '' ? item.remark: '暂无备注'}}</Col>
            <Col class-name="col" span="3">{{item.createUser}}</Col>
            <Col class-name="col" span="3">{{item.createTime | dateformat}}</Col>
            <Col class-name="col" span="4">
            <Button type="warning" size="small" v-if="item.usrType != 1" @click="openModel(true,item)">编辑</Button>
            <Button type="warning" size="small" @click="editPassword(item)">重置密码</Button>
            <Button type="warning" size="small" v-if="item.usrType != 1" @click="delAccount(item)">删除</Button>
            </Col>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
          <Page class="page-count" size="small" :total="totalCount" :page-size="filterData.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
      <Modal v-model="resetPassword" title="修改密码" :closable="false" :mask-closable="false">
        <Form :label-width="110" :model="passwordData">
          <FormItem label="密码">
            <Input type="password" v-model="passwordData.password" placeholder="验证6-16位任意数字或字母"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancelPassword">取消</Button>
          <Button type="primary" @click="handlePassword" :loading="loading">修改</Button>
        </div>
      </Modal>
      <Modal v-model="show" :title="isEdit ? '修改商户子账号':'新增商户子账号'" :closable="false" :mask-closable="false">
        <Form :label-width="110" :ref="ref" :model="dataApi" :rules="rules">
          <FormItem label="企业名称" prop="companyName" v-if="!isEdit">
            <Select v-model="dataApi.companyName" filterable remote :remote-method="remoteMethod" :loading="serLoading">
              <Option v-for="(option, index) in companyData" :value="`${option.companyName}-${option.companyId}`" :key="index">{{option.companyName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="企业名称" prop="companyName" v-else>
            {{dataApi.companyName}}
          </FormItem>
          <FormItem label="姓名" prop="name">
            <Input v-model="dataApi.name" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="手机号" prop="mobile">
            <Input v-model="dataApi.mobile" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="密码">
            <Input type="password" v-model="dataApi.password" placeholder="验证6-16位任意数字或字母"></Input>
          </FormItem>
          <FormItem label="角色" prop="usrType">
            <CheckboxGroup v-model="dataApi.usrType">
              <Checkbox label="2"><span>报价员</span></Checkbox>
              <Checkbox label="3" disabled><span>业务员</span></Checkbox>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="qq">
            <Input v-model="dataApi.qq" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="备注">
            <Input v-model="dataApi.remark" placeholder="请输入"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="show = false">取消</Button>
          <Button type="primary" @click="handleAccount" :loading="loading">{{isEdit ? '修改': '保存'}}</Button>
        </div>
      </Modal>
    </div>
  </Card>
</template>

<script>
  import roleTag from "@/components/basics/roleTag";
  export default {
    components: {
      roleTag
    },
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        list: [],
        filterData: {
          realName: '',
          mobile: '',
          companyName: '',
          pageSize: 10,
          currentPage: 1
        },
        totalCount: 0,
        resetPassword: false,
        passwordData: {
          userId: '',
          password: ''
        },
        rules: {
          companyName: [{
            required: true,
            message: '请输入姓名',
            trigger: 'change'
          }],
          name: [{
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          }],
          mobile: [{
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
          usrType: [{
            required: true,
            type: 'array',
            min: 1,
            message: '请选择角色',
            trigger: 'change'
          }, {
            type: 'array',
            max: 2,
            message: '请选择角色',
            trigger: 'change'
          }]
        },
        loading: false,
        editItem: {},
        show: false,
        isEdit: false,
        dataApi: {
          name: '',
          mobile: '',
          password: '',
          usrType: ['3'],
          remark: '',
          qq: '',
          companyId: '',
          companyName: ''
        },
        companyData: [],
        serLoading: false
      }
    },
    filters: {
      usrType(val) {
        let strs = ['未分配账户类型', '商户管理员', '报价员', '业务员'];
        let str = val.toString();
        let len = val.toString().length;
        let valString = [];
        for (var i = 0; i < len; i++) {
          valString.push(strs[str.charAt(i)]);
        }
        return valString.join('');
      }
    },
    computed: {
      handleFilter() {
        return {
          realName: this.filterData.realName,
          mobile: this.filterData.mobile,
          companyName: this.filterData.companyName,
          pageSize: this.filterData.pageSize,
          currentPage: this.filterData.currentPage
        }
      }
    },
    watch: {
      'handleFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage)
            this.filterData.currentPage = 1;
          this.getList();
        }, 200),
        deep: true
      }
    },
    methods: {
      changePage(page) {
        this.filterData.currentPage = page;
        this.getList();
      },
      resetFilter() {
        this.filterData = {
          realName: '',
          mobile: '',
          companyName: '',
          pageSize: 10,
          currentPage: 1
        }
        this.getList(this.handleFilter)
      },
      getList() {
        this.$http.post(this.api.findSubaccountManagementPage, this.filterData).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount
          }
        })
      },
      // 编辑
      openModel(isEdit, data) {
        this.isEdit = isEdit
        this.show = true
        if (isEdit) {
          this.editItem = data || {}
          this.dataApi = {
            name: data.name,
            mobile: data.mobile,
            password: '',
            usrType: data.usrType.split(','),
            remark: data.remark,
            qq: data.qq,
            companyId: data.companyId,
            companyName: data.companyName
          }
        } else {
          this.dataApi = {
            name: '',
            mobile: '',
            password: '',
            usrType: ['3'],
            remark: '',
            qq: '',
            companyId: '',
            companyName: ''
          }
        }
      },
      //  删除
      delAccount(data) {
        let params = {
          userId: data.id
        }
        this.$Modal.confirm({
          title: '删除提示',
          content: '确认删除？删除后将无法撤销！',
          onOk: () => {
            this.$http.post(this.api.deleteSubaccountManagement, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功')
                this.getList()
              } else {
                this.$Message.error(res.message)
              }
            })
          }
        })
      },
      // 重置密码
      editPassword(data) {
        this.resetPassword = true;
        this.passwordData.userId = data.id
      },
      //  取消修改
      cancelPassword() {
        this.resetPassword = false;
        this.passwordData.userId = '';
        this.passwordData.password = ''
      },
      //  提交修密码
      handlePassword() {
        if(this.passwordData.password != ''){
            let params = JSON.parse(JSON.stringify(this.passwordData));
            this.loading = true;
            this.$http.post(this.api.resetPassword, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('修改成功')
                this.cancelPassword();
              } else {
                this.$Message.error(res.message)
              }
              this.loading = false
            })
          } else {
            this.$Message.error('密码不能为空')
          }
      },
      //  编辑、新增
      handleAccount() {
        this.$refs[this.ref].validate((valid) => {
          if (valid) {
            this.loading = true
            let params = JSON.parse(JSON.stringify(this.dataApi));
            let splits = this.dataApi.companyName.split('-')
            params.companyName = splits[0];
            params.companyId = splits[1];
            params.usrType = params.usrType.toString()
            let urlApi = this.isEdit ? this.api.updateSubaccountType : this.api.saveSubaccountManagement
            if (this.isEdit) {
              params.userId = this.editItem.id
              params.companyId = this.editItem.companyId
              delete params.companyName;
              // delete params.companyId
            }
            this.$http.post(urlApi, params).then(res => {
              if (res.code === 1000) {
                this.show = false
                this.$Message.success(this.isEdit ? '修改成功' : '新增成功');
                this.getList();
              } else {
                this.$Message.error(res.message)
              }
              this.loading = false
            })
          } else {
            this.$Message.error('请完善表单信息')
          }
        })
      },
      //  模糊搜索商户名称
      remoteMethod(query) {
        if (query != '') {
          this.serLoading = true;
          this.$http.post(this.api.findCompanyInfo, {companyName: query}).then(res => {
            if (res.code === 1000) {
              this.serLoading = false;
              this.companyData = res.data
            }
          })
        } else {
          this.companyData = []
        }
      }
    },
    created() {
      this.getList();
    }
  }
</script>

<style lang='less' scoped>
  .account-wrap {
    background-color: #fff;
    padding: 20px 0;
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
      bottom: 10px;
    }
  }
</style>