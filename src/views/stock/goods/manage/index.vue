<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">货品管理</p>
      <Button slot="extra" type="primary" @click="openModel(false)">新增货品</Button>
      <Form :mode="pageApi" :label-width="85" inline>
        <FormItem label="供应商名称：">
          <Input type="text" v-model="pageApi.ownerName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="货品名称：">
          <Input type="text" v-model="pageApi.cargoName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="型号：">
          <Input type="text" v-model="pageApi.model" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.cargoStatus" style="width: 130px;">
            <Option v-for="item in [{name:'在途',value: '1'},{name:'在库',value: '2'}]" :value="item.value" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="品类：">
          <Select v-model="pageApi.category" style="width: 130px;">
            <Option v-for="(item,index) in ironTypeList" :value="item" :key="item.index">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="表面：">
          <Select v-model="pageApi.surface" style="width: 130px;">
            <Option v-for="(item,index) in surfaceList" :value="item" :key="item.index">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="材质：">
          <Select v-model="pageApi.material" style="width: 130px;">
            <Option v-for="(item,index) in materialList" :value="item" :key="item.index">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="产地：">
          <Select v-model="pageApi.proPlacesName" style="width: 130px;">
            <Option v-for="(item,index) in proPlaceList" :value="item" :key="item.index">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="厚度：">
          <Input type="text" v-model="pageApi.heightBegin" style="width:60px;" placeholder="请输入..."></Input><span class="splits">-</span><Input type="text" v-model="pageApi.heightEnd" style="width:60px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="宽度：">
          <Input type="text" v-model="pageApi.widthBegin" style="width:60px;" placeholder="请输入..."></Input><span class="splits">-</span><Input type="text" v-model="pageApi.widthEnd" style="width:60px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="长度：">
          <Input type="text" v-model="pageApi.lengthBegin" style="width:60px;" placeholder="请输入..."></Input><span class="splits">-</span><Input type="text" v-model="pageApi.lengthEnd" style="width:60px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="规格：">
          <Input type="text" v-model="pageApi.specifications" style="width:80px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="公差：">
          <Input type="text" v-model="pageApi.tolerance" style="width:80px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Table width="100%" :columns="columns" :data="list"></Table>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
    </Card>
    <Modal v-model="show" :closable="false" width="700" :mask-closable="false" :title="isEdit ? '编辑货品':'添加货品'">
      <Form :ref="ref" :model="editItem" :rules="rules" :label-width="100">
        <div class="goods-wrap">
          <h3>货品基本信息</h3>
          <Row>
            <Col span="12">
            <FormItem label="供应商名称：" prop="ownerName" style="margin-bottom:15px;">
              <Select v-if="!isEdit" v-model="editItem.ownerName" filterable remote :remote-method="remoteMethod" :loading="queryLoading">
                    <Option v-for="(option, index) in companyList" :value="`${option.companyName}-${option.id}`" :key="index">{{option.companyName}}</Option>
                  </Select>
              <span v-else>{{ownerName}}</span>
            </FormItem>
            <FormItem label="货品名称：" style="margin-bottom:15px;">
              <Input v-model="editItem.cargoName" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="货品名称：" style="margin-bottom:15px;">
              <RadioGroup v-model="editItem.status">
                <Radio :label="1">
                  <span>有效</span>
                </Radio>
                <Radio :label="2">
                  <span>存档</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="类型：" style="margin-bottom:15px;">
              <RadioGroup v-model="editItem.productType">
                <Radio :label="1">
                  <span>库存商品</span>
                </Radio>
                <Radio :label="2">
                  <span>消耗品</span>
                </Radio>
                <Radio :label="3">
                  <span>服务</span>
                </Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="属性：" style="margin-bottom:15px;">
  
            </FormItem>
            </Col>
            <Col span="12" style="padding-left: 30px;">
            <uploadPic title="货品图片"></uploadPic>
            </Col>
          </Row>
        </div>
        <div class="goods-wrap">
          <h3>产品sku</h3>
          <div v-if="!isSku">
            <div class="addSku" @click="showAdd">快速添加产品SKU</div>
          </div>
          <div v-if="isSku">添加添加添加添加添加</div>
        </div>
      </Form>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
        <Button type="primary" :loading="loading" @click="handleAction">{{isEdit ? '编辑':'添加'}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import skuModel from './addSku'
  import uploadPic from '@/components/basics/uploadPic'
  export default {
    components: {
      skuModel,
      uploadPic
    },
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        rules: {
          ownerName: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
        },
        companyList: [],
        queryLoading: false,
        ownerName: '',
        isSku: false,
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          specifications: '',
          category: '',
          surface: '',
          proPlacesName: '',
          tolerance: '',
          heightBegin: '',
          heightEnd: '',
          widthBegin: '',
          widthEnd: '',
          lengthBegin: '',
          lengthEnd: '',
          material: '',
          hasStore: '',
          cargoName: '',
          status: '',
          cargoStatus: '',
          model: '',
          costPrice: '',
          wareHouseName: '',
          productNumber: '',
          ownerName: '',
          ownerId: ''
        },
        columns: [{
          title: '供应商名称',
          key: 'ownerName',
          width: 200,
          fixed: 'left'
        }, {
          title: '货品名称',
          key: 'cargoName',
          width: 150,
        }, {
          title: '型号',
          key: 'model',
          width: 100,
        }, {
          title: '品类',
          key: 'category',
          width: 100,
        }, {
          title: '材质',
          key: 'material',
          width: 100,
        }, {
          title: '表面',
          key: 'surface',
          width: 100,
        }, {
          title: '规格',
          key: 'specifications',
          width: 220,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.specifications != '' ? params.row.specifications : `${params.row.height}*${params.row.width}*${params.row.length}`)
            ]);
          }
        }, {
          title: '公差',
          key: 'tolerance',
          width: 100,
        }, {
          title: '产地',
          key: 'proPlacesName',
          width: 100,
        }, {
          title: '密度',
          key: 'density',
          width: 100,
        }, {
          title: '理算方法',
          key: 'formula',
          width: 100,
        }, {
          title: '单件重量',
          key: 'singleWeight',
          width: 100,
        }, {
          title: '卷号',
          key: 'coiledSheetNum',
          width: 100,
        }, {
          title: '状态',
          key: 'status',
          width: 100,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.status == '1' ? '在库' : '在途')
            ]);
          }
        }, {
          title: '在库重量',
          key: 'warehouseWeights',
          width: 100,
        }, {
          title: '在途重量',
          key: 'preInWareHouseWeight',
          width: 100,
        }, {
          title: '备注',
          key: 'remark',
          width: 100,
        }, {
          title: '操作',
          key: 'action',
          width: 100,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.activeIndex = params.index;
                    this.openModel(true, params.row)
                  }
                }
              }, '编辑')
            ]);
          }
        }],
        list: [],
        totalCount: 0,
        show: false,
        isEdit: false,
        activeIndex: 0,
        loading: false,
        editItem: {
          cargoName: '',
          productName: '',
          productNumber: '',
          specifications: '',
          category: '',
          surface: '',
          proPlacesName: '',
          tolerance: '',
          weights: '',
          density: '',
          weightUnit: '',
          numbers: '',
          numberUnit: '',
          productType: 1,
          outputTaxVal: '',
          outputTaxId: '',
          inputTaxVal: '',
          inputTaxId: '',
          productImg: '',
          internalNumber: '',
          qualitativeType: [],
          status: 1,
          warehouseNumber: '',
          warehouseWeights: '',
          numberSwitchStatus: '',
          numberSwitchVal: '',
          weightSwitchStatus: '',
          weightSwitchVal: '',
          skuId: '',
          material: '',
          height: '',
          width: '',
          length: '',
          formula: '',
          formulaId: '',
          pricingWay: '',
          model: '',
          ownerId: '',
          ownerName: ''
        },
        ironTypeList:[],
        surfaceList: [],
        materialList: [],
        proPlaceList: [],
      }
    },
    computed: {
      handleFilter() {
        return {
          currentPage: this.pageApi.currentPage,
          pageSize: this.pageApi.pageSize,
          specifications: this.pageApi.specifications,
          category: this.pageApi.category,
          surface: this.pageApi.surface,
          proPlacesName: this.pageApi.proPlacesName,
          tolerance: this.pageApi.tolerance,
          heightBegin: this.pageApi.heightBegin,
          heightEnd: this.pageApi.heightEnd,
          widthBegin: this.pageApi.widthBegin,
          widthEnd: this.pageApi.widthEnd,
          lengthBegin: this.pageApi.lengthBegin,
          lengthEnd: this.pageApi.lengthEnd,
          material: this.pageApi.material,
          hasStore: this.pageApi.hasStore,
          cargoName: this.pageApi.cargoName,
          status: this.pageApi.status,
          cargoStatus: this.pageApi.cargoStatus,
          model: this.pageApi.model,
          costPrice: this.pageApi.costPrice,
          wareHouseName: this.pageApi.wareHouseName,
          productNumber: this.pageApi.productNumber,
          ownerName: this.pageApi.ownerName,
          ownerId: this.pageApi.ownerId
        }
      },
      activeItem() {
        return this.list.length != 0 ? this.list[this.activeIndex] : {}
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
      resetFilter() {
        this.pageApi = {
          currentPage: 1,
          pageSize: 10,
          specifications: '',
          category: '',
          surface: '',
          proPlacesName: '',
          tolerance: '',
          heightBegin: '',
          heightEnd: '',
          widthBegin: '',
          widthEnd: '',
          lengthBegin: '',
          lengthEnd: '',
          material: '',
          hasStore: '',
          cargoName: '',
          status: '',
          cargoStatus: '',
          model: '',
          costPrice: '',
          wareHouseName: '',
          productNumber: '',
          ownerName: '',
          ownerId: ''
        }
        this.getList(this.handleFilter)
      },
      getList(params) {
        this.$http.post(this.api.findCargoInfoList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data,
              this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page){
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter)
      },
      //  新增、编辑货品Model
      openModel(isEdit, item) {
        this.isEdit = isEdit
        if (isEdit) {
          Object.keys(this.editItem).forEach(key => this.editItem[key] = this.activeItem[key] ? this.activeItem[key] : '')
        } else {
          this.editItem = {
            cargoName: '',
            productName: '',
            productNumber: '',
            specifications: '',
            category: '',
            surface: '',
            proPlacesName: '',
            tolerance: '',
            weights: '',
            density: '',
            weightUnit: '',
            numbers: '',
            numberUnit: '',
            productType: 1,
            outputTaxVal: '',
            outputTaxId: '',
            inputTaxVal: '',
            inputTaxId: '',
            productImg: '',
            internalNumber: '',
            qualitativeType: [],
            status: 1,
            warehouseNumber: '',
            warehouseWeights: '',
            numberSwitchStatus: '',
            numberSwitchVal: '',
            weightSwitchStatus: '',
            weightSwitchVal: '',
            skuId: '',
            material: '',
            height: '',
            width: '',
            length: '',
            formula: '',
            formulaId: '',
            pricingWay: '',
            model: '',
            ownerId: '',
            ownerName: ''
          }
        }
        this.show = true
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
          this.itemData.ownerName = '';
          this.itemData.ownerId = '';
        }
      },
      //  新增、编辑提交
      handleAction() {
        // this.$refs.goodsRef.save();
      },
      closeModel() {
        this.show = false;
      },
      showAdd() {
  
      },
    //   品类
    getTypeList(){
      this.$http.post(this.api.findAllIronType).then(res => {
        if(res.code === 1000){
          this.ironTypeList = res.data;
        }
      })
    },
    //   表面
    getSurfaceList(){
      this.$http.post(this.api.findAllSurface).then(res => {
        if(res.code === 1000){
          this.surfaceList = res.data;
        }
      })
    },
    //   材质
    getMaterialList(){
      this.$http.post(this.api.findAllMaterial).then(res => {
        if(res.code === 1000){
          this.materialList = res.data;
        }
      })
    },
    //   产地
    getProPlaceList(){
      this.$http.post(this.api.findAllProPlace).then(res => {
        if(res.code === 1000){
          this.proPlaceList = res.data;
        }
      })
    }
    },
    created() {
      this.getTypeList();
      this.getSurfaceList();
      this.getMaterialList();
      this.getProPlaceList();
      this.getList(this.handleFilter);
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
    .page-count {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  .goods-wrap {
    h3 {
      font-size: 14px;
      color: #333;
      margin-bottom: 20px;
    }
  }
  
  .addSku {
    padding: 20px 0;
    text-align: center;
    font-size: 16px;
    cursor: pointer;
    background: #e6e6e6;
    color: #333;
  }
  .splits{
    color: #999;
    display: inline-block;
    padding: 0 5px;
  }
</style>