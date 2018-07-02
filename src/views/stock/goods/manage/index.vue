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
        <FormItem label="内部编号：">
          <Input type="text" v-model="pageApi.internalNumber" placeholder="请输入..."></Input>
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
        <FormItem label="规格：" v-if="!isBJ">
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
          <Table width="100%" border :columns="columns" :data="list"></Table>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
    </Card>
    <Modal v-model="show" :closable="false" width="1000" :mask-closable="false" title="货品详情">
      <Form :label-width="120" label-position="right" inline class="cargo-info">
        <FormItem label="货品名称:"><span>{{ detail.cargoName }}</span></FormItem>
        <FormItem label="型号:"><span>{{ detail.model }}</span></FormItem>
        <FormItem label="卷号:"><span>{{ detail.coiledSheetNum }}</span></FormItem>
        <FormItem label="品类:"><span>{{ detail.category }}</span></FormItem>
        <FormItem label="材质:"><span>{{ detail.material }}</span></FormItem>
        <FormItem label="表面:"><span>{{ detail.surface }}</span></FormItem>
        <FormItem label="公差:"><span>{{ detail.tolerance }}</span></FormItem>
        <FormItem label="产地:"><span>{{ detail.proPlacesName }}</span></FormItem>
        <FormItem label="规格:"><span>{{ detail.specifications != "" ? detail.specifications : `${detail.height}*${detail.width}*${detail.length}` }}</span></FormItem>
        <FormItem label="销售底价:"><span>{{ detail.salePrice}}</span></FormItem>
        <FormItem label="成本价:"><span>{{ detail.costPrice }}</span></FormItem>
        <FormItem label="计价方式:"><span v-if="detail.pricingWay !=''">{{ detail.pricingWay == '1' ? '按重量':'按数量' }}</span><span v-else>暂无</span></FormItem>
        <FormItem label="内部编号:"><span>{{ detail.internalNumber }}</span></FormItem>
        <FormItem label="属性:"><span>{{ detail.qualitativeTypeDes }}</span></FormItem>
        <FormItem label="类型:"><span>{{ detail.productTypeDes }}</span></FormItem>
        <FormItem label=""><span></span></FormItem>
        <FormItem label="物流状态:"><span><a class="cargo-status" :class="'status'+detail.cargoStatus">{{ detail.cargoStatus | cargoStatusStr }}</a></span></FormItem>
        <FormItem label="理算方法:"><span>{{ detail.formula }}</span></FormItem>
        <FormItem label="销项税:"><span>{{ detail.outputTaxVal }}</span></FormItem>
        <FormItem label="进项税:"><span>{{ detail.inputTaxVal }}</span></FormItem>
        <FormItem label="数量单位:"><span>{{ detail.numberUnit }}</span></FormItem>
        <FormItem label="重量单位:"><span>{{ detail.weightUnit }}</span></FormItem>
        <FormItem label="在库数量:"><span>{{ detail.numbers }}</span></FormItem>
        <FormItem label="在途数量:"><span>暂无</span></FormItem>
        <FormItem label="理计单重:"><span>{{ detail.singleWeight }}</span></FormItem>
        <FormItem label="过磅单重:"><span>{{ detail.numbers == 0 ? 0 : (detail.ponderanceCoiledSheetWeights/detail.numbers).toFixed(3) }}</span></FormItem>
        <FormItem label="剩余重量:"><span>{{ detail.warehouseWeights }}</span></FormItem>
        <FormItem label="在库重量:"><span>{{ detail.warehouseWeights }}</span></FormItem>
        <FormItem label="理计重量:"><span>{{ (detail.singleWeight * detail.numbers).toFixed(3) }}</span></FormItem>
        <FormItem label="过磅重量:"><span>{{ detail.ponderanceCoiledSheetWeights }}</span></FormItem>
        <FormItem label="原(毛)卷重:"><span>{{ detail.totalCoiledSheetWeights }}</span></FormItem>
        <FormItem label="预入库重量:"><span>{{ detail.preInWareHouseWeight }}</span></FormItem>
        <FormItem label="备注:">
          <p style="width:800px">{{ detail.remark | isEmpty('暂无')}}</p>
        </FormItem>
        <FormItem label="产品图片:">
          <p style="width:400px" v-if="detail.productImg !=''" class="productImg">
            <img :src="detail.productImg" >
          </p>
          <p v-else>暂无</p>
        </FormItem>
      </Form>
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
          ownerId: '',
          internalNumber: ''
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
          minWidth: 150,
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
          width: 150,
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
          title: '单件重量(KG)',
          key: 'singleWeight',
          width: 120,
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
          title: '在库重量(KG)',
          key: 'warehouseWeights',
          width: 120,
        }, {
          title: '在途重量(KG)',
          key: 'preInWareHouseWeight',
          width: 120,
        }, {
          title: '内部编号',
          key: 'internalNumber',
          width: 150,
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
        detail: {},
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
          ownerId: this.pageApi.ownerId,
          internalNumber: this.pageApi.internalNumber
        }
      },
      productImg() {
        return this.editItem.productImg != undefined ? this.editItem.productImg.split(',') : []
      },
      isBJ() {
        return this.pageApi.category == '不锈钢卷' || this.pageApi.category == '不锈钢板'
      }
    },
    filters: {
      tranStatus(val) {
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
      cargoStatusStr(value) {
        return ['无', '在途', '在库'][value]
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
          ownerId: '',
          internalNumber: ''
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
        this.detail = item || {}
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
      getWareHouse() {
        this.$http.post(this.api.findAWareHouse).then(res => {
          if (res.code === 1000) {
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
  
  .ivu-form-item {
    margin: 0 0 10px 0;
  }
  
  span {
    display: block;
    width: 109px;
  }
  
  .cargo-status {
    display: inline-block;
    width: 40px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #fff;
    font-size: 12px;
    border-radius: 4px;
    &.status0 {
      background-color: #526069;
    }
    &.status1 {
      background-color: #11C26D;
    }
    &.status2 {
      background-color: #0BB2D4;
    }
  }
  .productImg{
    img{
      max-width: 100%;
    }
  }
</style>