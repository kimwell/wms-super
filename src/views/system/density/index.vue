<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">商户管理</p>
      <Button slot="extra" type="primary" @click="openModel">新增商户</Button>
      <Form :mode="listApi" :label-width="80" inline>
        <FormItem label="材质：">
          <Input type="text" v-model="listApi.material" @on-change="onFilter" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="10">材质</Col>
            <Col class-name="col" span="10">密度</Col>
            <Col class-name="col" span="4">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="item.id">
            <Col class-name="col" span="10">{{ item.material }}</Col>
            <Col class-name="col" span="10">{{ item.density}}</Col>
            <Col class-name="col" span="4">
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
    <Modal v-model="panelShow" :closable="false" :mask-closable="false" title="新增材质密度">
      <!-- <Form :label-width="110" ref="menuEdit" :model="itemApi" :rules="ruleValidate"> -->
      <Form :label-width="110" :ref="ref" :model="dataApi" :rules="rules">
        <FormItem label="材质：" prop="material">
          <Input v-model="dataApi.material" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="密度：" prop="density">
          <Input v-model="dataApi.density" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="close">取消</Button>
        <Button type="primary" :loading="loading" @click="modalHandle">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        listApi: {
          material: '',
          currentPage: 1,
          pageSize: 10
        },
        list: [],
        totalCount: 0,
        dataApi: {
          material: '',
          density: ''
        },
        loading: false,
        panelShow: false,
        rules: {
          material: [{
            required: true,
            message: '材质不能为空',
            trigger: 'blur'
          }],
          density: [{
            required: true,
            message: '密度不能为空',
            trigger: 'blur'
          }]
        }
      }
    },
    methods: {
      getList() {
        this.$http.post(this.api.findDensityList, this.listApi).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list
            this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page) {
        this.listApi.currentPage = page;
        this.getList();
      },
      onFilter() {
        if (this.listApi.material != '') {
          this.getList();
        }
      },
      resetFilter() {
        this.resetListApi();
        this.getList();
      },
      resetListApi() {
        this.listApi = {
          material: '',
          currentPage: 1,
          pageSize: 10
        }
      },
      openModel() {
        this.panelShow = true;
      },
      //  新增
      modalHandle() {
        this.$refs[this.ref].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = JSON.parse(JSON.stringify(this.dataApi));
            this.$http.post(this.api.saveDensity, params).then(res => {
              if (res.code === 1000) {
                this.getList();
                this.$Message.success('操作成功！');
                this.panelShow = false;
              } else {
                this.$Message.error(res.message);
              }
              this.loading = false;
            })
  
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      //  删除
      deleteItem(item) {
        this.$Modal.confirm({
          title: ' 删除提示！',
          content: '删除后无法撤销，是否继续？',
          onOk: () => {
            let params = {
              id: item.id
            }
            this.$http.post(this.api.deleteDensity, params).then(res => {
              if (res.code === 1000) {
                this.getList();
                this.$Message.success('删除成功！');
              } else {
                this.$Message.error('删除失败！');
              }
            })
          }
        })
      },
      //  关闭modal对话框
      close() {
        this.panelShow = false
        this.dataApi = {
          material: '',
          density: ''
        }
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