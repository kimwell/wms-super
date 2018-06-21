<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">货品管理</p>
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
        <FormItem label="仓库：">
          <Select v-model="pageApi.wareHouseName" style="width: 130px;">
              <Option v-for="(item,index) in wareHouseList" :value="item" :key="item.index">{{ item }}</Option>
            </Select>
        </FormItem>
        <FormItem label="厚度：" v-if="isBJ">
          <Input type="text" v-model="pageApi.heightBegin" style="width:60px;" placeholder="请输入..."></Input><span class="splits">-</span>
          <Input type="text" v-model="pageApi.heightEnd" style="width:60px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="宽度：" v-if="isBJ">
          <Input type="text" v-model="pageApi.widthBegin" style="width:60px;" placeholder="请输入..."></Input><span class="splits">-</span>
          <Input type="text" v-model="pageApi.widthEnd" style="width:60px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="长度：" v-if="isBJ">
          <Input type="text" v-model="pageApi.lengthBegin" style="width:60px;" placeholder="请输入..."></Input><span class="splits">-</span>
          <Input type="text" v-model="pageApi.lengthEnd" style="width:60px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="规格："  v-if="!isBJ">
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
    <Modal v-model="show" :closable="false" width="900" :mask-closable="false" title="货品详情">
      <Row class="row-list">
        <Col span="8">供应商名称：{{editItem.ownerName}}</Col>
        <Col span="8">货品名称：{{editItem.cargoName}}</Col>
        <Col span="8">型号：{{editItem.model}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">品类：{{editItem.category}}</Col>
        <Col span="8">表面：{{editItem.surface}}</Col>
        <Col span="8">材质：{{editItem.material}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">规格：{{editItem.specifications !='' ? editItem.specifications : `${editItem.height}*${editItem.width}*${editItem.length}`}}</Col>
        <Col span="8">公差：{{editItem.tolerance}}</Col>
        <Col span="8">产地：{{editItem.proPlacesName}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">密度：{{editItem.density}}</Col>
        <Col span="8">理算方法：{{editItem.formula}}</Col>
        <Col span="8">单价重量：{{editItem.singleWeight}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">卷号：{{editItem.coiledSheetNum}}</Col>
        <Col span="8">状态：{{editItem.cargoStatus | tranStatus}}</Col>
        <Col span="8">在库重量：{{editItem.warehouseWeights}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">在途重量：{{editItem.preInWareHouseWeight}}</Col>
        <Col span="8">当前卷重：{{editItem.currentCoiledSheetWeights}}</Col>
        <Col span="8">原卷重：{{editItem.totalCoiledSheetWeights}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">仓库重量控制值：{{editItem.weightSwitchVal}}</Col>
        <Col span="8">成本价格：{{editItem.costPrice}}</Col>
        <Col span="8">销售价格：{{editItem.salePrice}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">货品库存数量：{{editItem.warehouseNumber}}</Col>
        <Col span="8">内部编号：{{editItem.internalNumber}}</Col>
        <Col span="8">备注：{{editItem.remark | isEmpty('暂无')}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="8">产品编号：{{editItem.productNumber}}</Col>
        <Col span="8">产品图片：
        <div class="pic-lists" v-for="item in productImg" :key="item">
          <img :src="item">
        </div>
        </Col>
      </Row>
      <div slot="footer">
        <Button @click="show = false">关闭</Button>
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
            let str = params.row.specifications != '' ? params.row.specifications : `${params.row.height}*${params.row.width}*${params.row.length}`
            return h('div', str);
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
          key: 'cargoStatus',
          width: 100,
          render: (h, params) => {
            let str = this.toStatus(params.row.cargoStatus)
            return h('div', [
              h('span', str)
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
                    this.openModel(params.row)
                  }
                }
              }, '详情')
            ]);
          }
        }],
        list: [],
        totalCount: 0,
        show: false,
        editItem: {},
        ironTypeList: [],
        surfaceList: [],
        materialList: [],
        proPlaceList: [],
        wareHouseList: []
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
      productImg() {
        return this.editItem.productImg != undefined ? this.editItem.productImg.split(',') : []
      },
      isBJ(){
        return this.pageApi.category == '不锈钢卷' || this.pageApi.category == '不锈钢板'
      }
    },
    filters:{
      tranStatus(val){
        switch (val * 1) {
          case 0:
            return '暂无'
            break;
          case 1:
            return '在途'
            break;
          case 2:
            return '在库'
            break;
          default:
            break;
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
      // 状态
      toStatus(val) {
        switch (val * 1) {
          case 0:
            return '暂无'
            break;
          case 1:
            return '在途'
            break;
          case 2:
            return '在库'
            break;
          default:
            break;
        }
      },
      getList(params) {
        this.$http.post(this.api.findCargoInfoList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data,
              this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter)
      },
      //  详情
      openModel(item) {
        this.editItem = item || {}
        this.show = true
      },
      closeModel() {
        this.show = false;
      },
      //   品类
      getTypeList() {
        this.$http.post(this.api.findAllIronType).then(res => {
          if (res.code === 1000) {
            this.ironTypeList = res.data;
          }
        })
      },
      //   表面
      getSurfaceList() {
        this.$http.post(this.api.findAllSurface).then(res => {
          if (res.code === 1000) {
            this.surfaceList = res.data;
          }
        })
      },
      //   材质
      getMaterialList() {
        this.$http.post(this.api.findAllMaterial).then(res => {
          if (res.code === 1000) {
            this.materialList = res.data;
          }
        })
      },
      //   产地
      getProPlaceList() {
        this.$http.post(this.api.findAllProPlace).then(res => {
          if (res.code === 1000) {
            this.proPlaceList = res.data;
          }
        })
      },
      // 仓库
      getWareHouse(){
        this.$http.post(this.api.findAWareHouse).then(res =>{
          if(res.code === 1000){
            this.wareHouseList = res.data;
          }
        })
      }
    },
    created() {
      this.getTypeList();
      this.getSurfaceList();
      this.getMaterialList();
      this.getProPlaceList();
      this.getWareHouse();
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
  
  .splits {
    color: #999;
    display: inline-block;
    padding: 0 5px;
  }
  
  .row-list {
    margin-bottom: 15px;
    .pic-lists {
      width: 200px;
      img {
        max-width: 100%;
      }
    }
  }
</style>