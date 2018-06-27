<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">费用科目列表</p>
      <Button slot="extra" size="small" type="primary" @click="openModel(false)">新增</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="科目名称：">
          <Input type="text" v-model="pageApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 100px;">
            <Option v-for="item in [{value: 1,label: '启用'},{value: 2,label: '禁用'}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">科目名称</Col>
            <Col class-name="col" span="4">状态</Col>
            <Col class-name="col" span="4">备注</Col>
            <Col class-name="col" span="4">操作人</Col>
            <Col class-name="col" span="4">操作时间</Col>
            <Col class-name="col" span="4">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="item.id">
            <Col class-name="col" span="4">{{item.name}}</Col>
            <Col class-name="col" span="4">
              <i-switch size="large" :value="item.status" @on-change="changeSwitch(item)" true-value="1" false-value="2">
                  <span slot="open">启用</span>
                  <span slot="close">禁用</span>
              </i-switch>
            </Col>
            <Col class-name="col" span="4">{{item.remark}}</Col>
            <Col class-name="col" span="4">{{item.updateUser}}</Col>
            <Col class-name="col" span="4">{{item.updateTime | dateformat}}</Col>
            <Col class-name="col" span="4">
            <Button size="small" type="warning" @click="openModel(true,item)">编辑</Button>
            <Button size="small" type="error" @click="deleteItem(item)">删除</Button>
            </Col>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
    </Card>
    <Modal v-model="show" :closable="false" :mask-closable="false" :title="isEdit ? '编辑':'添加'">
      <Form ref="userInfo" :model="dataApi" :rules="rules" :label-width="90">
        <FormItem label="科目名称:" prop="name">
          <Input v-model="dataApi.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="备注:">
          <Input v-model="dataApi.remark" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="close">取消</Button>
        <Button type="primary" :loading="loading" @click="modalHandle">{{isEdit? '编辑':'添加'}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          name: '',
          status: ''
        },
        list: [],
        totalCount: 0,
        show: false,
        dataApi: {
          id: '',
          name: '',
          remark: ''
        },
        rules: {
          name: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        isEdit: false,
        loading: false
      }
    },
    computed:{
      handleFilter(){
        return {
          pageSize: this.pageApi.pageSize,
          currentPage: this.pageApi.currentPage,
          name: this.pageApi.name,
          status: this.pageApi.status
        }
      }
    },
    watch: {
      'handleFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage)
            this.pageApi.currentPage = 1;
          this.getList(this.handleFilter);
        }, 200),
        deep: true
      }
    },
    methods: {
      getList(params) {
        this.$http.post(this.api.findFeeTypeList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter);
      },
      resetFilter() {
        this.pageApi = {
          currentPage: 1,
          pageSize: 10,
          name: '',
          status: ''
        }
        this.getList(this.handleFilter);
      },
      close(){
        this.show = false;
        this.$refs.userInfo.resetFields();
      },
      // 更改状态
      changeSwitch(data){
        this.$http.post(this.api.modifyFeeType,{id: data.id ,status: data.status == '1'? '2':'1'}).then(res =>{
          if(res.code === 1000){
            this.$Message.success(data.status == '1' ? '已禁用':'已启用')
            this.getList(this.handleFilter);
          }else{
            this.$Message.error(res.message)
          }
        })
      },
      openModel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.dataApi = {
            name: item.name,
            remark: item.remark,
            id: item.id
          }
        } else {
          this.dataApi = {
            name: '',
            remark: '',
            id: ''
          }
        }
        this.show = true
      },
      // 保存新增、编辑
      modalHandle() {
        this.$refs.userInfo.validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.$clearData(this.dataApi);
            let urls = this.isEdit ? this.api.updateFeeType : this.api.saveFeeType
            this.$http.post(urls, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '编辑成功' : '添加成功')
                this.show = false;
                this.getList(this.handleFilter);
              } else {
                this.$Message.error(res.message)
              }
              this.loading = false
            })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      //  删除
      deleteItem(data) {
        this.$Modal.confirm({
          title: "删除提示！",
          content: "删除后无法撤销，是否继续？",
          onOk: () => {
            let params = {
              id: data.id
            }
            this.$http.post(this.api.deleteFeeType, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功');
                this.getList(this.handleFilter);
              } else {
                this.$Message.error(res.message)
              }
            })
          }
        })
      }
    },
    created() {
      this.getList(this.handleFilter);
    },
  }
</script>

<style lang='less' scoped>
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