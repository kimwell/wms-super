<style lang="less" scoped>
  .user-container {
    width: 100%;
    .action-div {
      position: relative;
      width: 100%;
      padding: 10px;
      background-color: #fff;
      .add-user {
        position: absolute;
        right: 10px;
        top: 10px;
      }
    }
    .list-table {
      position: relative;
      width: 100%;
      padding: 20px;
      background-color: #fff;
      margin-top: 10px;
      min-height: 480px;
      table {
        width: 100%;
        border-top: 1px solid #d0d0d0;
        border-left: 1px solid #d0d0d0;
        margin-bottom: 10px;
        thead {
          background-color: #ddd;
        }
        td,
        th {
          line-height: 40px;
          text-align: center;
          border-right: 1px solid #d0d0d0;
          border-bottom: 1px solid #d0d0d0;
          padding: 0 10px;
        }
      }
      .page-count{
        position: absolute;
        right: 10px;
        bottom: 0;
      }
      .tal{
        text-align: left;
      }
    }
  }
</style>

<template>
  <div class="user-container">
    <div class="action-div">
      <Form ref="filterFrom" :model="filterData" :label-width="80" inline style="margin-top:24px">
        <FormItem prop="name" label="昵称：">
          <Input type="text" v-model="filterData.name" @on-blur="onFilter" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem prop="mobile" label="用户账号：">
          <Input type="text" v-model="filterData.mobile" @on-blur="onFilter" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem prop="role" label="角色：">
          <Select v-model="filterData.roleId" @on-change="onFilter" placeholder="请选择" style="width:150px">
             <Option v-for="role in [{roleName:'不限',roleId:''},...roleList]" :key="role.roleId" :value="role.roleId">{{ role.roleName }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <Button class="add-user" type="success" @click.native="openUserPanel(false)">添加用户</Button>
    </div>
    <div class="list-table">
      <table>
        <colgroup>
          <col width="260">
          <col width="160">
          <col width="100">
          <col width="900">
        </colgroup>
        <thead>
          <tr>
            <th>昵称</th>
            <th>用户账号</th>
            <th>状态</th>
            <th class="tal">角色</th>
            <!-- <th>最后登录时间</th>
              <th>最后登录IP</th> -->
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item,index) in listData" :key="item.id">
            <td>{{ item.name }}</td>
            <td>{{ item.mobile }}</td>
            <td>{{ item.status == 1 ? '启用' : '禁用' }}</td>
            <td class="tal">
               <Tag  v-for="(el,i) in item.roleName.split(',')" :key="i" color="blue" v-if="el!= ''">{{ el }}</Tag>
            </td>
            <td>
              <!-- <Button type="info">详情</Button> -->
              <Button type="warning" @click.native="openUserPanel(true,item.id)" size="small">编辑</Button>
              <!-- <Button type="error">删除</Button> -->
            </td>
          </tr>
        </tbody>
      </table>
      <Page class="page-count" size="small" :current="filterData.currentPage" show-total :page-size="filterData.pageSize" :total="totalCount" @on-change="setPage"></Page>
    </div>
  
    <!-- 添加、修改用户 -->
    <Modal v-model="userInfoShow" :title="userEdit ? '编辑用户' : '添加用户'" @on-cancel="resetData"  :mask-closable="false">
      <Form ref="userInfo" :model="userData" :rules="addRule" :label-width="90">
        <FormItem label="昵称" prop="name">
          <Input v-model="userData.name" placeholder="用户昵称"></Input>
        </FormItem>
        <FormItem label="真实姓名" prop="realName">
          <Input v-model="userData.realName" placeholder="用户真实姓名"></Input>
        </FormItem>
        <FormItem label="账号" prop="mobile" v-if="!userEdit">
          <Input v-model="userData.mobile" ref="mobile" placeholder="账号"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="userData.password" type="password" :placeholder="userEdit ? '如需修改密码，请在此输入新密码' : '用户密码'"></Input>
        </FormItem>
        <FormItem label="设置角色" prop="roleList">
          <Select v-model="userData.roleList" multiple placeholder="请选择">
             <Option v-for="role in roleList" :key="role.roleId" :value="role.roleId">{{ role.roleName }}</Option>
          </Select>
        </FormItem>
      </Form>
      <Form :label-width="90">
            <FormItem label="创建人" prop="createUser" v-if="userEdit">
          {{userOtherData.createUser | isEmpty(params = '暂无')}}
        </FormItem>
        <FormItem label="创建时时间" prop="createTime" v-if="userEdit">
          {{userOtherData.createTime | dateformat}}
        </FormItem>
        <FormItem label="修改人" prop="updataUser" v-if="userEdit">
          {{userOtherData.updataUser | isEmpty(params = '暂无')}}
        </FormItem>
        <FormItem label="修改时间" prop="updataTime" v-if="userEdit">
          {{userOtherData.updataTime | dateformat}}
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" @click="addNewUser">{{ userEdit ? '编辑' : '添加' }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userInfoShow: false,
        userEdit: false, //是否为编辑模式
        filterData: {
          name: '',
          mobile: '',
          roleId: '',
          pageSize: 10,
          currentPage: 1
        },
        totalCount: 0, //用户数据总条数
        userData: {
          name: '',
          realName: '',
          password: '',
          mobile: '',
          roleList: [],
        },
        userOtherData: {
          createUser: '',
          createTime: '',
          updataUser: '',
          updataTime: ''
        },
        roleList: [],
        addRule: {
          name: [{
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
          roleList: [{
            required: true,
            type: 'array',
            min: 1,
            message: '至少选择一个角色',
            trigger: 'change'
          }]
        },
        listData: []
      }
    },
    computed: {
      // 处理roleid列表
      apiRoleIds() {
        this.roleList.forEach((el) => {
          el.flag = false;
          this.userData.roleList.find(i => {
            if (i === el.roleId) el.flag = true;
          })
        });
        return this.roleList
      }
    },
    methods: {
      // 输入筛选框时候调用
      onFilter() {
        this.filterData.currentPage = 1;
        this.getAllList()
      },
      // 获取用户列表
      getAllList() {
        this.$http.post(this.api.userList, this.filterData).then(res => {
          if(res.code === 1000){
            this.listData = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      // 分页
      setPage(page) {
        this.filterData.currentPage = page;
        this.getAllList();
      },
      // 打开用户信息面板
      openUserPanel(is, id) {
        this.userEdit = is;
        this.resetData();
        this.userInfoShow = true;
        if (this.userEdit) {
          this.getUserInfo(id);
          this.userData.id = id;
        }
      },
      // 查询用户信息
      getUserInfo(id) {
        this.$http.post(this.api.getUserInfo, {
          id: id
        }).then(res => {
          if (res.code === 1000) {
            // this.userData.roleList
            let data = res.data;
            this.userData.name = data.name;
            this.userData.mobile = data.mobile;
            this.userData.realName = data.realName;
            this.userData.password = data.password;
            this.userOtherData.createUser = data.createUserName;
            this.userOtherData.createTime = data.createTime;
            this.userOtherData.updataUser = data.updateUserName;
            this.userOtherData.updataTime = data.updateTime;
            res.data.roleList.forEach(el => {
              if (el.flag) {
                this.userData.roleList.push(el.roleId);
              }
            })
          }
        })
      },
      // 获取角色列表
      getAllRoles(id) {
        this.$http.post(this.api.getUserInfo, {
          id: id || ''
        }).then(res => {
          if (res.code === 1000) {
            this.roleList = res.data.roleList;
          }
        })
      },
      // 新建用户
      addNewUser() {
        this.$refs.userInfo.validate((valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.userData));
            params.roleList = JSON.parse(JSON.stringify(this.apiRoleIds));
            params = JSON.stringify(params);
            this.$http.post(this.api.createUser, {
              jsonObject: params
            }).then(res => {
              if (res.code === 1000) {
                if (this.userEdit) {
                  //修改列表信息
                  this.userData.id = '';
                  this.$Message.success('修改成功!');
                } else {
                  this.$Message.success('添加成功!');
                }
                this.getAllList();
                this.userInfoShow = false;
              } else if (res.code === 1001) {
                this.$Message.error('账号已存在，请修改账号！');
              }
            })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      // 重置用户信息api表单
      resetData() {
        this.userData = {
          name: '',
          realName: '',
          password: '',
          mobile: '',
          roleList: []
        }
        this.$refs.userInfo.resetFields();
      },
      // 清除筛选
      resetFilter() {
        this.filterData.name = '';
        this.filterData.mobile = '';
        this.filterData.roleId = '';
        this.getAllList();
      }
    },
    created() {
      this.getAllList()
      this.getAllRoles();
    }
  }
</script>
