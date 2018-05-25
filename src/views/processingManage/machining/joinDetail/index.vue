<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">加工单详情<span class="status-header">状态：{{item.status | toStatus}}</span><span class="status-header">加工单号:{{item.id}}</span></p>
      <div slot="extra">
        <Button size="small" type="warning" @click="goBack">返回</Button>
      </div>
      <div class="detail-wrapper">
        <Row class="row-list">
          <Col span="6">公司名称：{{item.customerName}}</Col>
          <Col span="6">加工公司名称：{{item.processName}}</Col>
          <Col span="6">加工公司联系人：{{item.contactName}}</Col>
          <Col span="6">加工公司联系方式：{{item.contactNum}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="6">制单人：{{item.ticketMan}}</Col>
          <Col span="6">审核人：{{item.checkMan}}</Col>
          <Col span="6">提货人：{{item.carMan}}</Col>
          <Col span="6">提货车号：{{item.carId}}</Col>
        </Row>
      </div>
    </Card>
    <Card :bordered="false" class="card">
      <p slot="title">加工货物</p>
      <div class="detail-wrapper">
        <Row class="row-list">
          <Col span="6">货物名称：{{item.cargoName}}</Col>
          <Col span="6">剩余重量：{{item.remainWeight}}</Col>
          <Col span="6">原重量：{{item.processWeight}}</Col>
          <Col span="6">卷号：{{item.coiledSheetNum}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="6">规格：{{item.specification !=''? item.specification: `${item.height}*${item.width}*${item.length}`}}</Col>
          <Col span="6">公差：{{item.tolerance}}</Col>
          <Col span="6">产地：{{item.proPlaceName}}</Col>
          <Col span="6">表面：{{item.surfaceName}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="6">仓库：{{item.storeHouseName}}</Col>
          <Col span="6">加工费用：{{item.cost}}</Col>
          <Col span="6">交货日期：{{item.delivery | dateformat('yyyy-MM-dd')}}</Col>
          <Col span="6">备注：{{item.remark}}</Col>
        </Row>
      </div>
    </Card>
    <Card :bordered="false" class="card">
      <p slot="title">加工单货物明细</p>
      <div slot="extra">
        <Button size="small" type="warning" @click="selectGoods">选择库存货物</Button>
      </div>
      <div class="detail-wrapper">
        <div class="extra-form">
          <Form :mode="dataApi" :label-width="100" inline>
            <FormItem label="收卷值：">
              <Input type="text" v-model="dataApi.coildSheetWeight" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="收卷备注：">
              <Input type="text" v-model="dataApi.remark" placeholder="请输入..."></Input>
            </FormItem>
          </Form>
        </div>
      </div>
    </Card>
    <Modal title="选择库存货物" width="1000" v-model="show" :mask-closable="false">
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
          <Input type="text" v-model="pageApi.heightBegin" style="width:60px;" placeholder="请输入..."></Input><span class="splits">-</span>
          <Input type="text" v-model="pageApi.heightEnd" style="width:60px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="宽度：">
          <Input type="text" v-model="pageApi.widthBegin" style="width:60px;" placeholder="请输入..."></Input><span class="splits">-</span>
          <Input type="text" v-model="pageApi.widthEnd" style="width:60px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="长度：">
          <Input type="text" v-model="pageApi.lengthBegin" style="width:60px;" placeholder="请输入..."></Input><span class="splits">-</span>
          <Input type="text" v-model="pageApi.lengthEnd" style="width:60px;" placeholder="请输入..."></Input>
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
          <Table width="100%" :columns="columns" :data="list" @on-selection-change="onSelected"></Table>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
      <div slot="footer">
        <Button @click="cancelModal">取消</Button>
        <Button type="primary" @click="saveData">添加</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        item: {},
        dataApi: {
          coildSheetWeight: '',
          processId: '',
          remark: '',
          goods: []
        },
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
          type: 'selection',
          width: 60,
          align: 'center'
        }, {
          title: '产品编号',
          key: 'productNumber',
          width: 200,
        }, {
          title: '仓库',
          key: 'wareHouseCargoSet',
          width: 150,
          render: (h, params) => {
            let str = params.row.wareHouseCargoSet[0].wareHouseName
            return h('div', str);
          }
        }, {
          title: '货品名称',
          key: 'cargoName',
          width: 150,
        }, {
          title: '日期',
          key: 'createTime',
          width: 135,
          render: (h, params) => {
            let str = this.toTime(params.row.createTime);
            return h('div', str);
          }
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
        }],
        list: [],
        totalCount: 0,
        show: false,
        ironTypeList: [],
        surfaceList: [],
        materialList: [],
        proPlaceList: [],
        goods: []
      }
    },
    computed: {
      id() {
        return this.$route.params.id
      },
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
          wareHouseName: this.item.storeHouseName,
          productNumber: this.pageApi.productNumber,
          ownerName: this.pageApi.ownerName,
          ownerId: this.item.customerId
        }
      },
      productImg() {
        // return this.editItem.productImg != undefined ? this.editItem.productImg.split(',') : []
      }
    },
    filters: {
      toStatus(val) {
        switch (val * 1) {
          case 1:
            return '待加工'
            break;
          case 2:
            return '加工中'
            break;
          case 3:
            return '待入库'
            break;
          case 4:
            return '已入库'
            break;
          case 5:
            return '已取消'
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
      getData() {
        this.$http.post(this.api.findProcess, {
          processId: this.id
        }).then(res => {
          if (res.code === 1000) {
            this.item = res.data;
          }
        })
      },
      // 返回
      goBack() {
        this.$router.go(-1)
      },
      //  选择货物
      selectGoods() {
        this.show = true;
      },
      saveData() {
        if (this.goods.length > 0) {
          this.goods.forEach(el => {
            el.cargoId = el.id,
              el.coiledSheetNum = '',
              el.number = '',
              el.poundWeight = '',
              el.coiledWeight = '',
              el.oldCoiledWeight = '',
              el.costPrice = '',
              el.floorPrice = '',
              el.remark = '',
              el.merge = '',
              el.mergeCargoId = ''
          })
          this.show = false;
          this.dataApi.goods = this.goods;
        } else {
          this.$Message.error('请选择货品')
        }
      },
      cancelModal() {
        this.show = false;
        this.dataApi.goods = [],
          this.goods = []
      },
      onSelected(data) {
        this.goods = data;
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
      //  格式化时间
      toTime(val) {
        let date = new Date(val);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        let minute = date.getMinutes();
        let second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute ;
      },
      getList(params) {
        this.$http.post(this.api.findCargoInfoList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data,
              this.totalCount = res.data.totalCount
          }
        })
      },
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
          productNumber: '',
          ownerName: '',
        }
        this.getList(this.handleFilter)
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter)
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
      async asyncGoods() {
        await this.getData()
        this.getTypeList();
        this.getSurfaceList();
        this.getMaterialList();
        this.getProPlaceList();
      }
    },
    created() {
      this.getData();
    }
  }
</script>

<style lang='less' scoped>
  .card {
    margin-bottom: 20px;
    .status-header {
      display: inline-block;
      padding-left: 40px;
      font-weight: normal;
    }
    .detail-wrapper {
      position: relative;
      .row-list {
        margin-bottom: 15px;
      }
      .extra-form {
        position: absolute;
        top: -58px;
        left: 150px;
        ;
      }
    }
    .totalNum {
      span {
        display: inline-block;
        margin-right: 30px;
      }
    }
  }
  
  .remrak-warpper {
    display: inline-block;
    font-weight: normal;
    padding-left: 50px;
  }
</style>