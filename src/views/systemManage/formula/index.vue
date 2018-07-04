<template>
  <Card :bordered="false" class="card">
    <p slot="title">公式管理</p>
    <div class="card-contnet">
      <div class="table-contnet">
        <Row class-name="head">
          <Col class-name="col" span="10">公式名称</Col>
          <Col class-name="col" span="5">公式代码</Col>
          <Col class-name="col" span="5">序号</Col>
          <Col class-name="col" span="4">操作</Col>
        </Row>
        <Row v-for="(item,index) in list" :key="item.id">
          <Col class-name="col" span="10">{{item.name}}</Col>
          <Col class-name="col" span="5">{{item.code}}</Col>
          <Col class-name="col" span="5">{{item.sortIndex}}</Col>
          <Col class-name="col" span="4">
          <Button size="small" type="warning" @click="openPanel(true,item)">编辑</Button>
          </Col>
        </Row>
      </div>
    </div>
    <Modal v-model="show" :title="isEdit?`编辑公式`:`添加公式`" :closable="false" :mask-closable="false">
      <Form :label-width="80" :ref="ref" :model="itemApi" :rules="rules">
        <FormItem label="公式名称" prop="name">
          <Input type="text" :disabled="isEdit" v-model="itemApi.name" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="公式代码" prop="code">
          <Input type="text" :disabled="isEdit" v-model="itemApi.code" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="排序" prop="sortIndex">
          <Input type="text" v-model="itemApi.sortIndex" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
        <Button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '编辑' : '添加' }}</Button>
      </div>
    </Modal>
  </Card>
</template>

<script>
  export default {
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        list: [],
        itemApi: {
          id: '',
          name: '',
          code: '',
          sortIndex: ''
        },
        isEdit: false,
        show: false,
        editItem: {},
        rules: {
          name: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          code: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          sortIndex: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
        },
        loading: false
      }
    },
    methods: {
      getList() {
        this.$http.post(this.api.findFormula).then(res => {
          if (res.code === 1000) {
            this.list = res.data
          }
        })
      },
      openPanel(isEdit, data) {
        this.isEdit = isEdit;
        this.editItem = data || {};
        if (isEdit) {
          this.itemApi = {
            id: data.id,
            name: data.name,
            code: data.code,
            sortIndex: data.sortIndex.toString()
          }
        } else {
          this.itemApi = {
            id: '',
            name: '',
            code: '',
            sortIndex: ''
          }
        }
        this.show = true;
      },
      //  编辑、保存
      handleSubmit() {
        this.$refs[this.ref].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = JSON.parse(JSON.stringify(this.itemApi))
            this.$http.post(this.api.updateFormula,params).then(res => {
              if(res.code === 1000){
                this.$Message.success('修改成功')
                this.getList();
                this.show = false;
              }else{
                this.$Message.error(res.message)
              }
              this.loading = false;
            })
        }})
      }
    },
    created() {
      this.getList();
    }
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