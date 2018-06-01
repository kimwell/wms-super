<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">入库单管理</p>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="入库单编号：">
          <Input type="text" v-model="pageApi.storageInId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="仓库名称：">
          <Input type="text" v-model="pageApi.storeHouseName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="供应商名称：">
          <Input type="text" v-model="pageApi.sellId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="开单日期：">
          <!-- <Input type="text" v-model="pageApi.startTime" placeholder="请输入..."></Input> -->
          <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="状态：">
          <Select v-model="pageApi.status" style="width: 100px;">
                    <Option v-for="item in [{name:'待确认',value: '1'},{name:'已入库',value: '2'},{name:'已完成',value: '3'},{name:'已取消',value: '4'}]" :value="item.value" :key="item.name">{{ item.name }}</Option>
                  </Select>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="6">入库单号</Col>
            <Col class-name="col" span="3">仓库名称</Col>
            <Col class-name="col" span="3">供应商名称</Col>
            <Col class-name="col" span="3">开单日期</Col>
            <Col class-name="col" span="3">状态</Col>
            <Col class-name="col" span="6">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="item.id">
            <Col class-name="col" span="6">{{item.id}}</Col>
            <Col class-name="col" span="3">{{item.storeHouseName}}</Col>
            <Col class-name="col" span="3">{{item.sellCompany}}</Col>
            <Col class-name="col" span="3">{{item.storageInDate | dateformat}}</Col>
            <Col class-name="col" span="3">{{item.status | toStatus}}</Col>
            <Col class-name="col" span="6">
            <Button size="small" type="warning" @click="itemHandle(item,1)">打印</Button>
            <Button v-if="item.status == 1" size="small" type="warning" @click="itemHandle(item,2)">确认入库</Button>
            <Button size="small" type="warning" @click="itemHandle(item,3)">详情</Button>
            </Col>
          </Row>
          <Row v-if="list.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
    </Card>
    <Modal v-model="show" width="950" title="入库单详情">
      <Row class="row-list">
        <Col span="6">公司名称：{{detailItem.company}}</Col>
        <Col span="6">开单人：{{detailItem.createUser}}</Col>
        <Col span="6">审核人：{{detailItem.checkName}}</Col>
        <Col span="6">负责人：{{detailItem.responseName}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="6">供应商：{{detailItem.sellCompany}}</Col>
        <Col span="6">开单日期：{{detailItem.createTime | dateformat}}</Col>
        <Col span="6">车牌号：{{detailItem.carId}}</Col>
        <Col span="6">物流状态：{{detailItem.status}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="6">费用：{{detailItem.money}}</Col>
        <Col span="6">仓库：{{detailItem.storeHouseName}}</Col>
        <Col span="6">备注：{{detailItem.remark}}</Col>
      </Row>
      <Table width="100%" border :columns="goodsDetailColumns" :data="detailItem.storageInGoods"></Table>
    </Modal>
        <Modal title="当前合并货品" width="800" v-model="goodsDetailShow" :mask-closable="false">
        <div v-if="detailData">
          <Row class="row-list">
            <Col span="6">产品编号：{{detailData.productNumber}}</Col>
            <Col span="6">货物名称：{{detailData.cargoName}}</Col>
            <Col span="6">表面：{{detailData.surface}}</Col>
            <Col span="6">物流状态：{{detailData.status | toMegerStatus}}</Col>
          </Row>
          <Row class="row-list">
            <Col span="6" v-if="detailData.wareHouseCargoSet">仓库：{{detailData.wareHouseCargoSet[0].wareHouseName}}</Col>
            <Col span="6">型号：{{detailData.model}}</Col>
            <Col span="6">公差：{{detailData.tolerance}}</Col>
            <Col span="6">库存数量：{{detailData.warehouseNumber}}</Col>
          </Row>
          <Row class="row-list">
            <Col span="6">日期：{{detailData.createTime | dateformat}}</Col>
            <Col span="6">品类：{{detailData.category}}</Col>
            <Col span="6">规格：{{detailData.specifications != "" ? detailData.specifications :`${detailData.height}*${detailData.width}*${detailData.length}`}}</Col>
            <Col span="6">库存重量：{{detailData.warehouseWeights}}</Col>
          </Row>
          <Row class="row-list">
            <Col span="6">产地：{{detailData.proPlacesName}}</Col>
            <Col span="6">材质：{{detailData.material}}</Col>
            <Col span="6">卷号：{{detailData.coiledSheetNum}}</Col>
            <Col span="6">预入库重量：{{detailData.weights}}</Col>
          </Row>
          <Row class="row-list">
            <Col span="6">成本价：{{detailData.costPrice}}</Col>
            <Col span="6">备注：{{detailData.remark}}</Col>
          </Row>
        </div>
      <div slot="footer">
        <Button @click="goodsDetailShow = false" >关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi: {
          pageSize: 10,
          currentPage: 1,
          storageInId: '',
          storeHouseName: '',
          sellId: '',
          startTime: '',
          endTime: '',
          status: ''
        },
        list: [],
        totalCount: 0,
        dataValue: ['', ''],
        intoData: {
          storageInId: '',
          remark: ''
        },
        show: false,
        detailItem: {},
        goodsDetailColumns: [{
            title: "序号",
            key: "cargoName",
            width: 100,
            render: (h, params) => {
              let str = params.row._index;
              return h("div", str);
            }
          },
          {
            title: "货物名称",
            key: "cargoName",
            width: 100
          },
          {
            title: "型号",
            key: "model",
            width: 100
          },
          {
            title: "产地",
            key: "proPlacesName",
            width: 100
          },
          {
            title: "规格",
            key: "specifications",
            width: 180,
            render: (h, params) => {
              let str =
                params.row.specifications != "" ?
                params.row.specifications :
                `${params.row.height}*${params.row.width}*${
                        params.row.length
                      }`;
              return h("div", str);
            }
          },
          {
            title: "公差",
            key: "tolerance",
            width: 100
          },
          {
            title: "单件重量",
            key: "singleWeight",
            width: 100
          },
          {
            title: "产品单位",
            key: "numberUnit",
            width: 100,
            render: (h, params) => {
              let str = `${params.row.numberUnit}/${params.row.weightUnit}`;
              return h("div", str);
            }
          },
          {
            title: "卷号",
            key: "coiledSheetNum",
            width: 180,
          },
          {
            title: "数量",
            key: "number",
            width: 120,
          },
          {
            title: "理计重量",
            key: "meterWeight",
            width: 120,
          },
          {
            title: "过磅重量",
            key: "poundWeight",
            width: 120,
          },
          {
            title: "过磅单重",
            key: "poundSingleWeight",
            width: 120,
          },
          {
            title: "卷重",
            key: "coiledWeight",
            width: 120,
          },
          {
            title: "原卷重",
            key: "oldCoiledWeight",
            width: 120,
          },
          {
            title: "成本价",
            key: "costPrice",
            width: 120,
          },
          {
            title: "成本金额",
            key: "costNumber",
            width: 120,
          },
          {
            title: "销售底价",
            key: "floorPrice",
            width: 120,
          },
          {
            title: "备注",
            key: "remark",
            width: 120,
          },
          {
            title: "入库后是否自动合并",
            key: "merge",
            width: 120,
            fixed: 'right',
            render: (h, params) => {
              let _this = this;
              let status = params.row.merge;
              if (status) {
                return h("div", [
                  h(
                    "Button", {
                      props: {
                        type: "warning",
                        size: "small"
                      },
                      on: {
                        click: () => {
                          _this.activeGoods = params;
                          _this.getcargoInfoDetail(params)
                        }
                      }
                    },
                    "显示产品编号"
                  )
                ]);
              } else {
                return h("div", '不合并');
              }
            }
          }
        ],
        goodsDetailShow: false,
        detailData: {}
      }
    },
    filters: {
      toStatus(val) {
        switch (val * 1) {
          case 1:
            return '待确认'
            break;
          case 2:
            return '已入库'
            break;
          case 3:
            return '已完成'
            break;
          case 4:
            return '已取消'
            break
          default:
            break
        }
      },
      toMegerStatus(val){
        switch (val * 1) {
          case 0:
            return "暂无";
            break;
          case 1:
            return "在途";
            break;
          case 2:
            return "在库";
            break;
          default:
            break;
        }
      }
    },
    computed: {
      handleFilter() {
        return {
          pageSize: this.pageApi.pageSize,
          currentPage: this.pageApi.currentPage,
          storageInId: this.pageApi.storageInId,
          storeHouseName: this.pageApi.storeHouseName,
          sellId: this.pageApi.sellId,
          startTime: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          endTime: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
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
        this.$http.post(this.api.findStorageInList, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount != '' ? res.data.totalCount : 0
          }
        })
      },
      //  重置筛选
      resetFilter() {
        this.pageApi = {
          pageSize: 10,
          currentPage: 1,
          storageInId: '',
          storeHouseName: '',
          sellId: '',
          startTime: '',
          endTime: '',
          status: ''
        }
        this.dataValue = ['', '']
        this.getList(this.handleFilter);
      },
      //  分页
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter);
      },
      //  操作
      itemHandle(item, flag) {
        if (flag === 1) {
          //  打印
  
        } else if (flag === 2) {
          //  确认入库
          this.intoData.storageInId = item.id;
          this.intoData.remark = '要入库了哈';
          this.$http.post(this.api.storageIn, this.intoData).then(res => {
            if (res.code === 1000) {
              this.$Message.success('入库成功')
              this.getList(this.handleFilter)
            } else {
              this.$Message.error(res.message)
            }
          })
        } else if (flag === 3) {
          //  详情
          this.getDetail(item)
          this.show = true;
        }
      },
      getDetail(item) {
        this.$http.post(this.api.findStorageIn, {
          storageInId: item.id
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = res.data;
          }
        })
      },
      //  合并货品详情
      getcargoInfoDetail(data) {
        this.goodsDetailShow = true;
        this.$http.post(this.api.cargoInfoDetail,{id: data.row.cargoId}).then(res =>{
          if(res.code === 1000){
            this.detailData = res.data;
          }
        })
      },
    },
    created() {
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
  
  .row-list {
    margin-bottom: 16px;
  }
</style>