<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">入库单管理</p>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="入库单编号：">
          <Input type="text" v-model="pageApi.storageInId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="仓库名称：">
          <Select v-model="pageApi.storeHouseName" style="width: 150px;">
              <Option v-for="(item,index) in storeHouseList" :value="item" :key="index">{{ item }}</Option>
            </Select>
        </FormItem>
        <FormItem label="供应商名称：">
          <Input type="text" v-model="pageApi.sellId" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="开单日期：">
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
            <Col class-name="col" span="3">入库单号</Col>
            <Col class-name="col" span="3">仓库名称</Col>
            <Col class-name="col" span="3">供应商名称</Col>
            <Col class-name="col" span="3">开单日期</Col>
            <Col class-name="col" span="3">状态</Col>
            <Col class-name="col" span="3">最近更新人</Col>
            <Col class-name="col" span="3">最近更新时间</Col>
            <Col class-name="col" span="3">操作</Col>
          </Row>
          <Row v-for="(item,index) in list" :key="item.id">
            <Col class-name="col" span="3">{{item.id}}</Col>
            <Col class-name="col" span="3">{{item.storeHouseName}}</Col>
            <Col class-name="col" span="3">{{item.sellCompany}}</Col>
            <Col class-name="col" span="3">{{item.storageInDate | dateformat('yyyy-MM-dd')}}</Col>
            <Col class-name="col" span="3">{{item.status | toStatus}}</Col>
            <Col class-name="col" span="3">{{item.updateUser}}</Col>
            <Col class-name="col" span="3">{{item.updateTime | dateformat}}</Col>
            <Col class-name="col" span="3">
            <Button v-if="item.status == '1'" size="small" type="warning" @click="itemHandle(item,2)">确认入库</Button>
            <Button size="small" type="warning" @click="itemHandle(item,3)">详情</Button>
            <Button size="small" type="warning"  v-if="item.status != '4'" @click="itemHandle(item,1)">打印</Button>
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
        <Col span="6">开单日期：{{detailItem.storageInDate | dateformat('yyyy-MM-dd')}}</Col>
        <Col span="6">提货车主：{{detailItem.carMan}}</Col>
        <Col span="6">车牌号：{{detailItem.carId}}</Col>
      </Row>
      <Row class="row-list">
        <Col span="6">货物状态：{{detailItem.goodStatus}}</Col>
        <Col span="6">费用：{{detailItem.cost}}</Col>
        <Col span="6">仓库：{{detailItem.storeHouseName}}</Col>
        <Col span="6">备注：{{detailItem.remark}}</Col>
      </Row>
      <Table width="100%" border :columns="goodsDetailColumns" :data="detailItem.storageInGoods"></Table>
    </Modal>
    <Modal title="当前合并货品" width="800" v-model="goodsDetailShow" :mask-closable="false">
        <Form :label-width="120" label-position="right" inline class="cargo-info" v-if="detailData">
        <FormItem label="货品名称:"><span>{{ detailData.cargoName }}</span></FormItem>
        <FormItem label="型号:"><span>{{ detailData.model }}</span></FormItem>
        <FormItem label="卷号:"><span>{{ detailData.coiledSheetNum }}</span></FormItem>
        <FormItem label="品类:"><span>{{ detailData.category }}</span></FormItem>
        <FormItem label="材质:"><span>{{ detailData.material }}</span></FormItem>
        <FormItem label="表面:"><span>{{ detailData.surface }}</span></FormItem>
        <FormItem label="公差:"><span>{{ detailData.tolerance }}</span></FormItem>
        <FormItem label="产地:"><span>{{ detailData.proPlacesName }}</span></FormItem>
        <FormItem label="规格:"><span>{{ detailData.specifications != "" ? detailData.specifications : `${detailData.height}*${detailData.width}*${detailData.length}` }}</span></FormItem>
        <FormItem label="销售底价:"><span>{{ detailData.salePrice}}</span></FormItem>
        <FormItem label="成本价:"><span>{{ detailData.costPrice }}</span></FormItem>
        <FormItem label="计价方式:"><span v-if="detailData.pricingWay !=''">{{ detailData.pricingWay == '1' ? '按重量':'按数量' }}</span><span v-else>暂无</span></FormItem>
        <FormItem label="内部编号:"><span>{{ detailData.internalNumber }}</span></FormItem>
        <FormItem label="属性:"><span>{{ detailData.qualitativeTypeDes }}</span></FormItem>
        <FormItem label="类型:"><span>{{ detailData.productTypeDes }}</span></FormItem>
        <FormItem label="密度"><span>{{detailData.density}}</span></FormItem>
        <FormItem label="物流状态:">
          <span v-if="detailData.cargoStatus">
            <a class="cargo-status" :class="'status'+el" v-for="(el,i) in detailData.cargoStatus.split(',')" :key="i">
              {{ el | cargoStatusStr }}
            </a>
          </span>
        </FormItem>
        <FormItem label="理算方法:"><span>{{ detailData.formula }}</span></FormItem>
        <FormItem label="销项税:"><span>{{ detailData.outputTaxVal }}</span></FormItem>
        <FormItem label="进项税:"><span>{{ detailData.inputTaxVal }}</span></FormItem>
        <FormItem label="数量单位:"><span>{{ detailData.numberUnit }}</span></FormItem>
        <FormItem label="重量单位:"><span>{{ detailData.weightUnit }}</span></FormItem>
        <FormItem label="在库数量:"><span>{{ detailData.numbers }}</span></FormItem>
        <FormItem label="在途数量:"><span>暂无</span></FormItem>
        <FormItem label="理计单重:"><span>{{ detailData.singleWeight }}</span></FormItem>
        <FormItem label="过磅单重:"><span>{{ detailData.ponderanceCoiledSheetTotalWeights}}</span></FormItem>
        <FormItem label="剩余重量:"><span>{{ detailData.warehouseWeights }}</span></FormItem>
        <FormItem label="在库重量:"><span>{{ detailData.warehouseWeights }}</span></FormItem>
        <FormItem label="理计重量:"><span>{{ detailData.totalSingleWeight }}</span></FormItem>
        <FormItem label="过磅重量:"><span>{{ detailData.ponderanceCoiledSheetWeights }}</span></FormItem>
        <FormItem label="原(毛)卷重:"><span>{{ detailData.totalCoiledSheetWeights }}</span></FormItem>
        <FormItem label="预入库重量:"><span>{{ detailData.preInWareHouseWeight }}</span></FormItem>
        <FormItem label="各仓库重量/KG:">
          <p style="width:800px" v-for="(w,i) in whereHoses" :key="i">{{ w | isEmpty('未入库') }}</p>
        </FormItem>
        <FormItem label="备注:">
          <p style="width:800px">{{ detailData.remark | isEmpty('暂无')}}</p>
        </FormItem>
        <FormItem label="产品图片:">
          <p style="width:400px" v-if="detailData.productImg !=''" class="productImg">
            <img :src="detailData.productImg">
          </p>
          <p v-else>暂无</p>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="goodsDetailShow = false">关闭</Button>
      </div>
    </Modal>
    <Modal v-model="modalShow" :closable="false" :mask-closable="false" title="确定入库">
      <Form ref="intoForm" :model="intoData" :rules="intoRle" :label-width="90">
        <FormItem label="备注" prop="remark">
          <Input v-model="intoData.remark" placeholder="请输入备注"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="modalClose">取消</Button>
        <Button type="primary" @click="storageInto">确定</Button>
      </div>
    </Modal>
    <Modal title="打印入库单" width="400" v-model="printShow" :mask-closable="false">
      <Spin size="large" fix v-if="spinShow">
        <Icon type="load-c" size=18 class="spin-icon-load"></Icon>
        <div>正在生成打印入库单...</div>
      </Spin>
      <div class="card-contnet" style="padding-bottom: 10px;">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="12">销售单</Col>
            <Col class-name="col" span="12">操作</Col>
          </Row>
          <Row v-for="(item,index) in printData" :key="item.id">
            <Col class-name="col" span="12">{{`入库单_${item.orderNum}`}}</Col>
            <Col class-name="col" span="12">
            <a class="ivu-btn ivu-btn-warning ivu-btn-small" :href="item.viewUrl" target="_blank">打印</a>
            </Col>
          </Row>
          <Row v-if="printData.length == 0">
            <Col class-name="col" span="24">暂无数据</Col>
          </Row>
        </div>
      </div>
      <div slot="footer">
      </div>
    </Modal>
  </div>
</template>

<script>
import {dateformat} from '@/utils/filters'
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
        intoRle: {
          remark: [{
            required: true,
            message: '备注不能为空',
            trigger: 'blur'
          }]
        },
        printShow: false,
        spinShow: true,
        printData: [],
        storeHouseList: [],
        show: false,
        modalShow: false,
        detailItem: {},
        goodsDetailColumns: [{
            title: "序号",
            key: "cargoName",
            minWidth: 100,
            render: (h, params) => {
              let str = params.index + 1;
              return h("div", str);
            }
          },
          {
            title: "货物名称",
            key: "cargoName",
            minWidth: 150
          },
          {
            title: "型号",
            key: "model",
            minWidth: 240
          },
          {
            title: "品类",
            key: "category",
            minWidth: 150
          },
          {
            title: "产地",
            key: "proPlacesName",
            minWidth: 100
          },
          {
            title: "规格",
            key: "specifications",
            minWidth: 180,
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
            minWidth: 100
          },
          {
            title: "单件重量(KG)",
            key: "singleWeight",
            minWidth: 120
          },
          {
            title: "产品单位",
            key: "numberUnit",
            minWidth: 100,
            render: (h, params) => {
              let str = `${params.row.weightUnit}/${params.row.numberUnit}`;
              return h("div", str);
            }
          },
          {
            title: "创建时间",
            key: "createTime",
            minWidth: 180,
            render: (h, params) => {
              return h('span', params.row.createTime != '' ? dateformat(params.row.createTime,'yyyy-MM-dd hh:mm:ss'):'暂无')
            }
          },
          {
            title: "卷号",
            key: "coiledSheetNum",
            minWidth: 180,
          },
          {
            title: "数量",
            key: "number",
            minWidth: 120,
          },
          {
            title: "理计重量(KG)",
            key: "meterWeight",
            minWidth: 120,
          },
          {
            title: "过磅重量(KG)",
            key: "poundWeight",
            minWidth: 120,
          },
          {
            title: "过磅单重(KG)",
            key: "poundSingleWeight",
            minWidth: 120,
          },
          {
            title: "卷重(KG)",
            key: "coiledWeight",
            minWidth: 120,
          },
          {
            title: "原卷重(KG)",
            key: "oldCoiledWeight",
            minWidth: 120,
          },
          // {
          //   title: "成本价",
          //   key: "costPrice",
          //   minWidth: 120,
          //   render: (h, params) => {
          //     let str = `￥${params.row.costPrice}`;
          //     return h("span", str);
          //   }
          // },
          // {
          //   title: "成本金额",
          //   key: "costNumber",
          //   minWidth: 120,
          //   render: (h, params) => {
          //     let str = `￥${params.row.costNumber}`;
          //     return h("span", str);
          //   }
          // },{
          //   title: "销售底价",
          //   key: "floorPrice",
          //   width: 100,
          //   render: (h, params) => {
          //     let str =  params.row.floorPrice != '' ? `￥${params.row.floorPrice}`: `￥0`;
          //     return h("span", str);
          //   }
          // },
          {
            title: "内部编号",
            key: "internalNumber",
            width: 100
          },
          {
            title: "备注",
            key: "remark",
            minWidth: 120,
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
                    "显示产品信息"
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
      toMegerStatus(val) {
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
      },
      cargoStatusStr(value) {
          return ['无', '在途', '在库'][value]
      },
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
      },
      // 详情仓库
      whereHoses() {
        return this.detailData.wareHouseCargoStr ? this.detailData.wareHouseCargoStr.split(';') : []
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
  
          this.printShow = true;
          this.$http.post(this.api.storageInPrint, {
            storageInId: item.id
          }).then(res => {
            if (res.code === 1000) {
              this.spinShow = false;
              this.printData = res.data;
            } else {
              this.$Message.error(res.message);
            }
          })
        } else if (flag === 2) {
          //  确认入库
          this.modalShow = true;
          this.intoData.storageInId = item.id;
        } else if (flag === 3) {
          //  详情
          this.getDetail(item)
          this.show = true;
        }
      },
      // 确认 入库
      storageInto() {
        this.$refs.intoForm.validate((valid) => {
          if (valid) {
            this.$http.post(this.api.storageIn, this.intoData).then(res => {
              if (res.code === 1000) {
                this.modalShow = false;
                this.$Message.success('入库成功')
                this.getList(this.handleFilter)
                this.resetintoData();
              } else {
                this.$Message.error(res.message)
              }
            })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      getStoreHouse() {
        this.$http.post(this.api.findAWareHouse).then(res => {
          if (res.code === 1000) {
            this.storeHouseList = res.data;
          }
        })
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
      resetintoData() {
        this.intoData = {
          remark: '',
          storageInId: ''
        }
      },
      modalClose() {
        this.modalShow = false,
          this.resetintoData();
        this.$refs.intoForm.resetFields();
      },
      //  合并货品详情
      getcargoInfoDetail(data) {
        this.goodsDetailShow = true;
        this.$http.post(this.api.cargoInfoDetail, {
          id: data.row.mergeCargoId
        }).then(res => {
          if (res.code === 1000) {
            this.detailData = res.data;
          }
        })
      },
    },
    created() {
      this.getList(this.handleFilter);
      this.getStoreHouse();
    }
  }
</script>

<style lang='less' scoped>
  .card {
    position: relative;
    margin-bottom: 20px;
    .page-count {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  
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
  
  .row-list {
    margin-bottom: 16px;
  }
  
  .spin-icon-load {
    animation: ani-spin 1s linear infinite;
  }
  
  @keyframes ani-spin {
    from {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

    .cargo-info {
    span {
      display: block;
      width: 109px;
    }
    .ivu-form-item {
      margin: 0 0 10px 0;
    }
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
    margin-right: 3px;
    &:last-child{
      margin-right: 0;
    }
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
  
  .productImg {
    img {
      max-width: 100%;
    }
  }
</style>