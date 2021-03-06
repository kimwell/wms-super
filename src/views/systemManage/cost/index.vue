<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">费用管理</p>
      <Button slot="extra" type="primary" @click="openPanel(false)">新增费用</Button>
      <Form :mode="dataApi" :label-width="100" inline>
        <FormItem label="费用名称：">
          <Input type="text" v-model="dataApi.costName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="所属公司名称：">
          <Input type="text" v-model="dataApi.companyName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">费用名称</Col>
            <Col class-name="col" span="4">单价/元</Col>
            <Col class-name="col" span="3">计算税率/%</Col>
            <Col class-name="col" span="5">所属公司名称</Col>
            <Col class-name="col" span="3">排序</Col>
            <Col class-name="col" span="3">备注</Col>
            <Col class-name="col" span="2">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="item.id">
            <Col class-name="col" span="4">{{item.costName}}</Col>
            <Col class-name="col" span="4">{{item.number}}</Col>
            <Col class-name="col" span="3">{{item.tax}}</Col>
            <Col class-name="col" span="5">{{item.companyName}}</Col>
            <Col class-name="col" span="3">{{item.sortIndex}}</Col>
            <Col class-name="col" span="3">{{item.remark}}</Col>
            <Col class-name="col" span="2">
            <Button size="small" type="warning" @click="openPanel(true,item)">编辑</Button>
            <Button size="small" type="warning" @click="deleteItem(item)">删除</Button>
            </Col>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <Page class="page-count" size="small" :total="totalCount" :page-size="dataApi.pageSize" @on-change="changePage"></Page>
      </div>
    </Card>
    <Modal v-model="panelShow" :title="isEdit?`编辑费用`:`添加费用`" :closable="false" :mask-closable="false">
      <Form :label-width="80" :ref="ref" :model="itemApi" :rules="rules">
        <FormItem label="费用名称" prop="costName">
          <Input type="text" v-model="itemApi.costName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="单价" prop="number">
          <Input type="text" v-model.number="itemApi.number" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="计算税率" prop="tax">
          <Input type="text" v-model.number="itemApi.tax" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="所属公司" prop="companyName">
          <Select v-if="!isEdit" v-model="itemApi.companyName" filterable remote :remote-method="remoteMethod" :loading="queryLoading">
            <Option v-for="(option, index) in companyList" :value="`${option.companyName}-${option.id}`" :key="index">{{option.companyName}}</Option>
          </Select>
          <span v-else>{{itemApi.companyName}}</span>
        </FormItem>
        <FormItem label="排序" prop="sortIndex">
          <Input type="text" v-model.number="itemApi.sortIndex" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="备注">
          <Input type="text" v-model="itemApi.remark" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="close">取消</Button>
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
        dataApi: {
          pageSize: 10,
          currentPage: 1,
          costName: "",
          companyName: "",
          buserId: ""
        },
        list: [],
        totalCount: 0,
        panelShow: false,
        isEdit: false,
        loading: false,
        queryLoading: false,
        itemApi: {
          id: "",
          buserId: "",
          costName: "",
          number: "",
          sortIndex: "",
          tax: "",
          remark: "",
          companyName: ''
        },
        rules: {
          companyName: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          costName: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          number: [{
            required: true,
            message: '请输入正确的单价',
            trigger: 'blur',
            type: 'number'
          }, {
            validator: (rule, value, callback) => {
              var reg = /^[1-9]\d*(?:\.\d{1,2}|\d*)$/;
              if (!reg.test(value)) {
                return callback(new Error('请输入正确的单价'));
              } else {
                callback();
              }
            }
          }],
          tax: [{
            required: true,
            message: '请输入正确的税率',
            trigger: 'blur',
            type: 'number',
          }, {
            validator: (rule, value, callback) => {
              var reg = /^[1-9]\d*(?:\.\d{1,2}|\d*)$/;
              if (!reg.test(value)) {
                return callback(new Error('请输入正确的税率'));
              } else {
                callback();
              }
            }
          }],
          sortIndex: [{
            required: true,
            message: '不能为空',
            trigger: 'blur',
            type: 'number'
          }]
        },
        companyList: [],
        companyData: {
          companyName: '',
          contact: '',
          contactNum: '',
          fax: '',
          qq: '',
          currentPage: 1,
          pageSize: 20
        },
        editItem: []
      };
    },
    computed: {
      handleFilter() {
        return {
          costName: this.dataApi.costName,
          companyName: this.dataApi.companyName,
          buserId: '',
          pageSize: this.dataApi.pageSize,
          currentPage: this.dataApi.currentPage
        }
      }
    },
    watch: {
      'handleFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage)
            this.dataApi.currentPage = 1;
          this.getList();
        }, 200),
        deep: true
      }
    },
    methods: {
      //  清除筛选
      resetFilter() {
        this.dataApi = {
          pageSize: 10,
          currentPage: 1,
          costName: "",
          companyName: "",
          buserId: ""
        }
        this.getList();
      },
      getList() {
        this.$http.post(this.api.findSaleCostList, this.dataApi).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        });
      },
      changePage(page) {
        this.dataApi.currentPage = page;
        this.getList();
      },
      openPanel(isEdit, item) {
        this.isEdit = isEdit;
        this.panelShow = true;
        if (isEdit) {
          this.editItem = item || {};
          this.itemApi = {
            id: item.id,
            buserId: item.buserId,
            costName: item.costName,
            number: item.number,
            sortIndex: item.sortIndex,
            tax: item.tax,
            remark: item.remark,
            companyName: item.companyName
          };
        } else {
          this.itemApi = {
            id: "",
            buserId: "",
            costName: "",
            number: "",
            sortIndex: "",
            tax: "",
            remark: "",
            companyName: ''
          };
          this.companyData.companyName = '';
        }
      },
      close(){
        this.panelShow = false;
        this.$refs[this.ref].resetFields();
      },
      //  查找商户
      remoteMethod(query) {
        if (query != '') {
          this.queryLoading = true;
          this.$http.post(this.api.findBusinessList, {
            companyName: query,
            contact: '',
            contactNum: '',
            currentPage: 1,
            pageSize: 20,
            fax: '',
            qq: ''
          }).then(res => {
            if (res.code === 1000) {
              this.queryLoading = false;
              this.companyList = res.data.list
            }
          })
        } else {
          this.companyList = [];
        }
      },
      handleSubmit() {
        this.$refs[this.ref].validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = JSON.parse(JSON.stringify(this.itemApi))
            let splits = params.companyName.split('-')
            params.buserId = splits[1];
            delete params.companyName;
            if (this.isEdit) {
              params.buserId = this.editItem.buserId
            }
            let urls = this.isEdit ? this.api.updateSaleCost : this.api.saveSaleCost
            this.$http.post(urls, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '编辑成功' : '添加成功')
                this.getList();
                this.panelShow = false;
              } else {
                this.$Message.error(res.message)
              }
            })
            this.loading = false;
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      // 删除
      deleteItem(data) {
        this.$Modal.confirm({
          title: ' 删除提示！',
          content: '删除后无法撤销，是否继续？',
          onOk: () => {
            let params = {
              id: data.id
            }
            this.$http.post(this.api.delSaleCost, params).then(res => {
              if (res.code === 1000) {
                this.getList();
                this.$Message.success('删除成功！');
              } else {
                this.$Message.error('删除失败！');
              }
            })
          }
        })
      }
    },
    created() {
      this.getList();
    }
  };
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
        border-right: 1px solid #d0d0d0;
        border-bottom: 1px solid #d0d0d0;
      }
    }
    .page-count {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
</style>