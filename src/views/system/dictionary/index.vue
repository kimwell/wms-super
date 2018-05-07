<template>
  <div class="panel">
    <Card :bordered="false" class="card">
      <p slot="title">数据字典管理</p>
      <Button slot="extra" size="small" type="success" @click="openModel(false)">新增数据字典</Button>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">数据字典名称</Col>
            <Col class-name="col" span="4">标识码</Col>
            <Col class-name="col" span="4">内容</Col>
            <Col class-name="col" span="4">备注</Col>
            <Col class-name="col" span="3">最近操作人</Col>
            <Col class-name="col" span="3">最近操作时间</Col>
            <Col class-name="col" span="2">操作</Col>
          </Row>
          <Row v-for="item in list" :key="item.id">
            <Col class-name="col" span="4">{{item.name}}</Col>
            <Col class-name="col" span="4">{{item.codes}}</Col>
            <Col class-name="col" span="4">{{item.vals}}</Col>
            <Col class-name="col" span="4">{{item.remark != '' ? item.remark : '暂无备注'}}</Col>
            <Col class-name="col" span="3">{{item.updateTime | dateformat}}</Col>
            <Col class-name="col" span="3">{{item.updateUser}}</Col>
            <Col class-name="col" span="2">
            <Button size="small" type="warning" @click="openModel(true,item)">编辑</Button>
            <Button size="small" type="error" @click="deleteItem(item)">删除</Button>
            </Col>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
          <Page class="page-count" size="small" :total="totalCount" :page-size="pageData.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="show" :title="isEdit?`编辑字典数据`:`添加字典数据`" :closable="false" :mask-closable="false">
      <Form :label-width="110" :ref="ref" :model="apiData" :rules="rules">
        <FormItem label="字典名称：" prop="name">
          <Input v-model="apiData.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="唯一标识：" prop="codes">
          <Input v-model="apiData.codes" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="字典内容：" prop="vals">
          <Input v-model="apiData.vals" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="apiData.remark" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
        <Button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '编辑' : '添加' }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        pageData: {
          currentPage: 1,
          pageSize: 10
        },
        list: [],
        totalCount: 0,
        apiData: {
          id: '',
          name: '',
          codes: '',
          vals: '',
          remark: ''
        },
        show: false,
        isEdit: false,
        loading: false,
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }],
          codes: [{
            required: true,
            message: '请输入唯一标识',
            trigger: 'blur'
          }],
          vals: [{
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          }]
        },
        editItem: {},
      }
    },
    methods: {
      getList() {
        this.$http.post(this.api.findDataDictionaryPage, this.pageData).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      //  分页
      changePage(page) {
        this.pageData.currentPage = page;
        this.getList();
      },
      //  新增、编辑弹窗
      openModel(isEdit, item) {
        this.isEdit = isEdit;
        this.show = true;
        if (isEdit) {
          this.editItem = item || {}
          this.apiData = {
            id: item.id,
            name: item.name,
            codes: item.codes,
            vals: item.vals,
            remark: item.remark
          }
        } else {
          this.apiData = {
            id: '',
            name: '',
            codes: '',
            vals: '',
            remark: ''
          }
        }
      },
      //  删除 
      deleteItem(data) {
        this.$Modal.confirm({
          title: '删除提示',
          content: '确认删除？',
          onOk: () => {
            let base = {
              id: data.id
            };
            let params = JSON.parse(JSON.stringify(base))
            this.$http.post(this.api.deleteDataDictionary, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功');
                //  删除当前页最后一条数据时，返回上一分页
                if(this.list.length == 1){
                  if(this.pageData.currentPage != 1)
                    this.pageData.currentPage = this.pageData.currentPage - 1
                  this.getList();
                }else{
                  this.getList();
                }
              } else {
                this.$Message.error('删除失败')
              }
            })
          }
        })
      },
      // 提交编辑、保存
      handleSubmit() {
        this.$refs[this.ref].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = JSON.parse(JSON.stringify(this.apiData));
            if (this.isEdit) {
              params.id = this.editItem.id;
              params.name = this.apiData.name;
              params.vals = this.apiData.vals;
              params.codes = this.apiData.codes;
              params.remark = this.apiData.remark;
            }
            this.$http.post(this.api.saveUpdateDataDictionary, params).then(res => {
              if (res.code === 1000) {
                this.getList();
                this.$Message.success('操作成功');
                this.show = false;
              } else {
                this.$Message.error(res.message);
              }
              this.loading = false
            })
          } else {
            this.$Message.error('表单验证失败');
          }
        })
      }
    },
    created() {
      this.getList();
    }
  }
</script>

<style lang="less" scoped>
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