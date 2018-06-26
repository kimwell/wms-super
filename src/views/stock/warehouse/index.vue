<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">仓库管理</p>
      <Button slot="extra" size="small" type="primary" @click="openModel(false)">新增仓库</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="仓库名称：">
          <Input type="text" v-model="pageApi.name" @on-blur="onBlur" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">仓库名称</Col>
            <Col class-name="col" span="2">库存上限</Col>
            <Col class-name="col" span="2">实际库存</Col>
            <!-- <Col class-name="col" span="3">库位</Col> -->
            <Col class-name="col" span="4">库管员</Col>
            <Col class-name="col" span="5">地址</Col>
            <Col class-name="col" span="2">序号</Col>
            <Col class-name="col" span="2">状态</Col>
            <Col class-name="col" span="3">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="item.id">
            <Col class-name="col" span="4">{{item.name}}</Col>
            <Col class-name="col" span="2">{{item.inventory}}</Col>
            <Col class-name="col" span="2">{{item.realWeight}}吨</Col>
            <!-- <Col class-name="col" span="3"></Col> -->
            <Col class-name="col" span="4">
              <Tag color="blue" v-for="(sub,sindex) in item.kgName" :key="sindex">
                {{sub}}
              </Tag>
            </Col>
            <Col class-name="col" span="5">{{item.provinceName}}{{item.cityName}}{{item.areaName}}{{item.address}}</Col>
            <Col class-name="col" span="2">{{item.orderNum}}</Col>
            <Col class-name="col" span="2">{{item.status == '1' ? '有效':'存档'}}</Col>
            <Col class-name="col" span="3">
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
    <Modal v-model="show" :closable="false" :mask-closable="false" :title="isEdit ? '编辑仓库':'添加仓库'">
      <Form ref="userInfo" :model="dataApi" :rules="rules" :label-width="90">
        <FormItem label="仓库名称:" prop="name">
          <Input v-model="dataApi.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="仓库地址:"  style="display:inline-block;" prop="areaName">
          <adressPick ref="adressPick" @on-pick="changeAdress" :value="placePlaceholder" style="width:180px;display:inline-block;"></adressPick>
        </FormItem>
        <FormItem style="display:inline-block;" prop="address">
          <Input v-model="dataApi.address" style="width:214px;margin-left: -90px;" placeholder="详细地址"></Input>
        </FormItem>
        <FormItem label="库管员:" prop="warehouseManager">
        <CheckboxGroup v-model="dataApi.warehouseManager">
          <Checkbox v-for="(item,index) in kgList" :key="index" :label="item.id">
              <span>{{item.name}}-{{item.mobile}}</span>
          </Checkbox>
        </CheckboxGroup>
        </FormItem>
        <FormItem label="状态:">
          <RadioGroup v-model="dataApi.status">
            <Radio label="1">
              <span>有效</span>
            </Radio>
            <Radio label="0">
              <span>存档</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="库存上限:">
          <Input v-model="dataApi.inventory" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="序号:">
          <Input v-model="dataApi.orderNum" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="备注:">
          <Input v-model="dataApi.remark" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="拥有者:">
          无锡淘不锈电子商务有限公司
        </FormItem>
        <FormItem label="实际库存:" v-if="isEdit">
          {{realWeight}}吨
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
  import adressPick from '@/components/basics/adress/citySelect'
  export default {
    components: {
      adressPick
    },
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          name: ''
        },
        isEdit: false,
        show: false,
        loading: false,
        list: [],
        totalCount: 0,
        kgList: [],
        realWeight: '',
        dataApi: {
          name: '',
          provinceName: '',
          cityName: '',
          areaName: '',
          address: '',
          status: '1',
          treasuryName: '',
          treasuryId: '',
          inventory: '',
          warehouseManager: [],
          warehouseManagerId: '',
          orderNum: '',
          remark: ''
        },
        rules: {
          name: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          address: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }],
          areaName:[{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          warehouseManager: [{
            required: true, 
            type: 'array', 
            min: 1, 
            message: '至少选择一个库管员', 
            trigger: 'change' 
          }]
        }
      }
    },
    computed :{
      placePlaceholder(){
        return this.dataApi.provinceName != '' ? `${this.dataApi.provinceName}/${this.dataApi.cityName}/${this.dataApi.areaName}`:'请选择地区'
      }
    },
    methods: {
      changePage(page){
        this.pageApi.currentPage = page;
        this.getList();
      },
      getList() {
        this.$http.post(this.api.findWareHouse, this.pageApi).then(res => {
          if (res.code === 1000) {
            res.data.data.forEach(el =>{
              el.kgName = [];
              if(el.warehouseManager !=''){
                el.warehouseManager = el.warehouseManager.split(',');
                this.kgList.forEach(kg =>{
                  el.warehouseManager.map(sub =>{
                    if(kg.id === sub){
                      el.kgName.push(kg.name);
                    }
                  })
                })
              }else{
                el.warehouseManager = []
              }
            })
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      changeAdress(data) {
        this.dataApi.provinceName = data.provinceName;
        this.dataApi.cityName = data.cityName;
        this.dataApi.areaName = data.districtName;
      },
      resetFilter() {
        this.pageApi = {
          currentPage: 1,
          pageSize: 10,
          name: ''
        }
        this.getList();
      },
      openModel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.dataApi = {
            id: item.id,
            name: item.name,
            address: item.address,
            areaName: item.areaName,
            cityName: item.cityName,
            inventory: item.inventory,
            orderNum: item.orderNum,
            provinceName: item.provinceName,
            remark: item.remark,
            status: item.status,
            treasuryId: item.treasuryId,
            treasuryName: item.treasuryName,
            warehouseManager: item.warehouseManager,
            warehouseManagerId: item.warehouseManagerId
          }
          this.realWeight = item.realWeight
        } else {
          this.dataApi = {
            id: '',
            name: '',
            provinceName: '',
            cityName: '',
            areaName: '',
            address: '',
            status: '1',
            treasuryName: '',
            treasuryId: '',
            inventory: '',
            warehouseManager: [],
            warehouseManagerId: '',
            orderNum: '',
            remark: ''
          }
        }
        this.show = true
      },
      close(){
        this.show = false;
        this.$refs.adressPick.init();
        this.$refs.userInfo.resetFields();
      },
      //  添加、编辑保存
      modalHandle() {
        this.$refs.userInfo.validate((valid) => {
          if (valid) {
            let params = this.$clearData(this.dataApi);
            params.warehouseManager = params.warehouseManager.toString();
            this.$http.post(this.api.saveWareHouse, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success(this.isEdit ? '编辑成功':'添加成功')
                this.show = false;
                this.getList();
                this.$refs.adressPick.init();
              } else {
                this.$Message.error(res.message)
              }
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
            this.$http.post(this.api.deleteWareHouse, params).then(res => {
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
      onBlur(data) {
        if (this.pageApi.name != '') {
          this.getList();
        }
      },
      // 查询库管
      getAllKg(){
        this.$http.post(this.api.findSysKG).then(res =>{
          if(res.code === 1000){
            this.kgList = res.data;
          }
        })
      }
    },
    created() {
      this.getList();
      this.getAllKg();
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