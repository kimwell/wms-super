<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">加工单详情<span class="status-header">状态：{{item.status | toStatus}}</span><span class="status-header">加工单号:{{item.id}}</span></p>
      <div slot="extra">
        <Button type="primary" @click="saveMerge" v-if="item.status === '2'">提交</Button>
        <Button type="warning" @click="goBack">返回</Button>
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
          <Col span="6">剩余重量：{{item.remainWeight}}KG</Col>
          <Col span="6">原重量：{{item.weight}}KG</Col>
          <Col span="6">卷号：{{item.coiledSheetNum}}</Col>
        </Row>
        <Row class="row-list">
          <Col span="6">规格：{{item.specification !=''? item.specification: `${item.height}*${item.width}*${item.length}`}}</Col>
          <Col span="6">公差：{{item.tolerance | isEmpty('-')}}</Col>
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
      <p slot="title">加工明细</p>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="4">序号</Col>
            <Col class-name="col" span="5">规格</Col>
            <Col class-name="col" span="5">公差</Col>
            <Col class-name="col" span="5">数量</Col>
            <Col class-name="col" span="5">重量(KG)</Col>
          </Row>
          <Row v-for="(sub,index) in item.processTicketInfos" :key="index">
            <Col class-name="col" span="4">{{index + 1}}</Col>
            <Col class-name="col" span="5">{{`${sub.height}*${sub.width}*${sub.length}`}}</Col>
            <Col class-name="col" span="5">{{sub.tolerance}}</Col>
            <Col class-name="col" span="5">{{sub.number}}</Col>
            <Col class-name="col" span="5">{{sub.weight}}</Col>
          </Row>
          <div v-if="item.processTicketInfos">
            <Row v-if="item.processTicketInfos.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
            </Row>
          </div>
        </div>
      </div>
      <div class="totalNum"><span>数量合计：{{item.number}}</span><span>加工重量合计： {{item.processWeight}}KG</span></div>
    </Card>
    <Card :bordered="false" class="card">
      <p slot="title">加工入库货物明细</p>
      <div slot="extra">
        <span>货物数量合计：{{total.number}}</span>
        <span style="display:inline-block;margin: 0 15px;">货物重量合计：{{total.weight}}kg</span>
        <Button type="warning" v-if="item.status === '2'" @click="selectGoods">选择库存货物</Button>
      </div>
      <div class="detail-wrapper">
        <div class="extra-form" v-if="item.status === '2'">
          <Form :mode="dataApi" :label-width="100" inline>
            <FormItem label="余卷过磅重量：">
              <Input type="text" v-model="dataApi.coildSheetWeight" placeholder="请输入..."></Input>
            </FormItem>
            <FormItem label="余卷备注：">
              <Input type="text" v-model="dataApi.remark" placeholder="请输入..."></Input>
            </FormItem>
          </Form>
        </div>
        <div class="extra-form" v-if="item.status != '2'">
          <Form :label-width="100" inline>
            <FormItem label="余卷过磅重量：">
              {{item.coildSheetWeight}}
            </FormItem>
            <FormItem label="余卷备注：">
              {{item.coilSheetRemark}}
            </FormItem>
            <FormItem label="货物数量合计：">
              {{showTotal.number}}
            </FormItem>
            <FormItem label="货物重量合计：">
              {{showTotal.weight}}kg
            </FormItem>
          </Form>
        </div>
        <div>
          <Table width="100%" v-if="item.status === '2'" border :columns="goodsColumns" :data="dataApi.goods"></Table>
          <Table width="100%" v-if="item.status === '3' || item.status === '4' || item.status === '5'" border :columns="goodsDetailColumns" :data="item.processIns"></Table>
        </div>
      </div>
    </Card>
    <Modal title="选择库存货物" width="1000" v-model="show" :closable="false" :mask-closable="false">
      <Form :mode="pageApi" :label-width="85" inline>
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
        <FormItem label="内部编号：">
          <Input type="text" v-model="pageApi.internalNumber" style="width:130px;" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Table width="100%" ref="tableList" :columns="columns" :data="list" @on-selection-change="onSelected"></Table>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
      <div slot="footer">
        <Button @click="cancelModal(false)">取消</Button>
        <Button type="primary" @click="saveData(false)">添加</Button>
      </div>
    </Modal>
    <Modal title="选择合并货物" width="1000" v-model="mergeShow" :mask-closable="false">
      <Form :mode="mergeApi" :label-width="85" inline>
        <FormItem label="产品编号：">
          <Input type="text" v-model="mergeApi.productNumber" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="内部编号：">
          <Input type="text" v-model="mergeApi.internalNumber" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="库存：">
          <Select v-model="mergeApi.hasStore" style="width: 130px;">
                  <Option v-for="item in [{name:'有',value: '1'},{name:'无',value: '0'}]" :value="item.value" :key="item.name">{{ item.name }}</Option>
                </Select>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetMergeApi">清除</Button>
        </FormItem>
      </Form>
      <Table width="100%" border :columns="mergeColumns" :data="mergeList"></Table>
      <div slot="footer">
      </div>
    </Modal>
    <Modal title="当前合并货品" width="800" v-model="goodsDetailShow" :mask-closable="false">
      <Form :label-width="120" label-position="right" inline class="cargo-info">
        <FormItem label="货品名称:"><span>{{ detailItem.cargoName }}</span></FormItem>
        <FormItem label="型号:"><span>{{ detailItem.model }}</span></FormItem>
        <FormItem label="卷号:"><span>{{ detailItem.coiledSheetNum }}</span></FormItem>
        <FormItem label="品类:"><span>{{ detailItem.category }}</span></FormItem>
        <FormItem label="材质:"><span>{{ detailItem.material }}</span></FormItem>
        <FormItem label="表面:"><span>{{ detailItem.surface }}</span></FormItem>
        <FormItem label="公差:"><span>{{ detailItem.tolerance }}</span></FormItem>
        <FormItem label="产地:"><span>{{ detailItem.proPlacesName }}</span></FormItem>
        <FormItem label="规格:"><span>{{ detailItem.specifications != "" ? detailItem.specifications : `${detailItem.height}*${detailItem.width}*${detailItem.length}` }}</span></FormItem>
        <FormItem label="销售底价:"><span>{{ detailItem.salePrice}}</span></FormItem>
        <FormItem label="成本价:"><span>{{ detailItem.costPrice }}</span></FormItem>
        <FormItem label="计价方式:"><span v-if="detailItem.pricingWay !=''">{{ detailItem.pricingWay == '1' ? '按重量':'按数量' }}</span><span v-else>暂无</span></FormItem>
        <FormItem label="内部编号:"><span>{{ detailItem.internalNumber }}</span></FormItem>
        <FormItem label="属性:"><span>{{ detailItem.qualitativeTypeDes }}</span></FormItem>
        <FormItem label="类型:"><span>{{ detailItem.productTypeDes }}</span></FormItem>
        <FormItem label="密度"><span>{{detailItem.density}}</span></FormItem>
        <FormItem label="物流状态:">
          <span v-if="detailItem.cargoStatus">
              <a class="cargo-status" :class="'status'+el" v-for="(el,i) in detailItem.cargoStatus.split(',')" :key="i">
                {{ el | cargoStatusStr }}
              </a>
            </span>
        </FormItem>
        <FormItem label="理算方法:"><span>{{ detailItem.formula }}</span></FormItem>
        <FormItem label="销项税:"><span>{{ detailItem.outputTaxVal }}</span></FormItem>
        <FormItem label="进项税:"><span>{{ detailItem.inputTaxVal }}</span></FormItem>
        <FormItem label="数量单位:"><span>{{ detailItem.numberUnit }}</span></FormItem>
        <FormItem label="重量单位:"><span>{{ detailItem.weightUnit }}</span></FormItem>
        <FormItem label="在库数量:"><span>{{ detailItem.numbers }}</span></FormItem>
        <FormItem label="在途数量:"><span>暂无</span></FormItem>
        <FormItem label="理计单重:"><span>{{ detailItem.singleWeight }}</span></FormItem>
        <FormItem label="过磅单重:"><span>{{ detailItem.ponderanceCoiledSheetTotalWeights}}</span></FormItem>
        <FormItem label="剩余重量:"><span>{{ detailItem.warehouseWeights }}</span></FormItem>
        <FormItem label="在库重量:"><span>{{ detailItem.warehouseWeights }}</span></FormItem>
        <FormItem label="理计重量:"><span>{{ detailItem.totalSingleWeight }}</span></FormItem>
        <FormItem label="过磅重量:"><span>{{ detailItem.ponderanceCoiledSheetWeights }}</span></FormItem>
        <FormItem label="原(毛)卷重:"><span>{{ detailItem.totalCoiledSheetWeights }}</span></FormItem>
        <FormItem label="预入库重量:"><span>{{ detailItem.preInWareHouseWeight }}</span></FormItem>
        <FormItem label="各仓库重量/KG:">
          <p style="width:800px" v-for="(w,i) in whereHoses" :key="i">{{ w | isEmpty('未入库') }}</p>
        </FormItem>
        <FormItem label="备注:">
          <p style="width:800px">{{ detailItem.remark | isEmpty('暂无')}}</p>
        </FormItem>
        <FormItem label="产品图片:">
          <p style="width:400px" v-if="detailItem.productImg !=''" class="productImg">
            <img :src="detailItem.productImg">
          </p>
          <p v-else>暂无</p>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="giveMerge" v-if="item.status === '2'">放弃合并</Button>
        <Button type="primary" @click="changeMerge" v-if="item.status === '2'">变更合并</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dateformat
  } from '@/utils/filters.js'
  export default {
    data() {
      return {
        item: {},
        dataApi: {
          coildSheetWeight: "",
          processId: "",
          remark: "",
          goods: []
        },
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          specifications: "",
          category: "",
          surface: "",
          proPlacesName: "",
          tolerance: "",
          heightBegin: "",
          heightEnd: "",
          widthBegin: "",
          widthEnd: "",
          lengthBegin: "",
          lengthEnd: "",
          material: "",
          hasStore: "",
          cargoName: "",
          status: "1",
          cargoStatus: "",
          model: "",
          costPrice: "",
          wareHouseName: "",
          productNumber: "",
          ownerName: "",
          ownerId: "",
          hasCoiledSheetNum: '0',
          internalNumber: ''
        },
        activeGoods: {},
        goodsDetailColumns: [{
            title: "序号",
            key: "cargoName",
            width: 100,
            render: (h, params) => {
              let str = params.index + 1;
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
            title: "单件重量(KG)",
            key: "singleWeight",
            width: 120
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
            title: "数量",
            key: "number",
            width: 120,
          },
          {
            title: "理计重量(KG)",
            key: "meterWeight",
            width: 120,
          },
          {
            title: "过磅重量(KG)",
            key: "poundWeight",
            width: 120,
          },
          {
            title: "过磅单重(KG)",
            key: "poundSingleWeight",
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
            minWidth: 120,
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
        mergeColumns: [{
            title: "产品编号",
            key: "productNumber",
            width: 200
          },
          {
            title: "仓库",
            key: "wareHouseCargoSet",
            width: 150,
            render: (h, params) => {
              let str = params.row.wareHouseCargoSet[0].wareHouseName;
              return h("div", str);
            }
          },
          {
            title: "日期",
            key: "createTime",
            width: 135,
            render: (h, params) => {
              return h("div", dateformat(params.row.createTime));
            }
          },
          {
            title: "型号",
            key: "model",
            width: 100
          },
          {
            title: "品类",
            key: "category",
            minWidth: 240
          },
          {
            title: "材质",
            key: "material",
            width: 100
          },
          {
            title: "表面",
            key: "surface",
            width: 100
          },
          {
            title: "规格",
            key: "specifications",
            width: 120,
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
            title: "产地",
            key: "proPlacesName",
            width: 100
          },
          {
            title: "卷号",
            key: "coiledSheetNum",
            width: 100
          },
          {
            title: "货物状态",
            key: "cargoStatus",
            width: 100,
            render: (h, params) => {
              return h("div", this.toStatus(params.row.cargoStatus));
            }
          },
          {
            title: "备注",
            key: "remark",
            width: 100
          },
          {
            title: "操作",
            key: "action",
            width: 100,
            fixed: "right",
            render: (h, params) => {
              let status = params.row.selected;
              let _this = this;
              if (!status) {
                return h("div", [
                  h(
                    "Button", {
                      props: {
                        type: "warning"
                      },
                      on: {
                        click: () => {
                          this.mergeShow = false;
                          delete _this.dataApi.goods[_this.activeGoods.index].mergeCargoId;
                          delete _this.dataApi.goods[_this.activeGoods.index].autoStauts;
                          delete _this.dataApi.goods[_this.activeGoods.index].merge;
                          delete _this.mergeList[params.index].selected;
                          _this.$set(_this.dataApi.goods[_this.activeGoods.index], 'mergeCargoId', params.row.id);
                          _this.$set(_this.dataApi.goods[_this.activeGoods.index], 'autoStauts', undefined)
                          _this.$set(_this.dataApi.goods[_this.activeGoods.index], 'merge', true)
                          _this.$set(_this.mergeList[params.index], "selected", true);
                        }
                      }
                    },
                    "选择"
                  )
                ]);
              } else {
                return h("div", "已选择");
              }
            }
          }
        ],
        goodsColumns: [{
            title: "序号",
            key: "cargoName",
            width: 100,
            render: (h, params) => {
              let str = params.index + 1;
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
            minWidth: 240
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
            title: "单件重量(KG)",
            key: "singleWeight",
            width: 120
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
            title: "理计重量(KG)",
            key: "ljWeight",
            width: 120
          },
          {
            title: "数量",
            key: "number",
            width: 100,
            render: (h, params) => {
              let _this = this;
              return h("Input", {
                props: {
                  type: "text",
                  placeholder: "请输入",
                  value: _this.dataApi.goods[params.index].number
                },
                on: {
                  "on-blur": event => {
                    let e = event.target.value;
                    _this.dataApi.goods[params.index].number = e;
                    if (e != "") {
                      let result = Number(e * _this.dataApi.goods[params.index].singleWeight).toFixed(3)
                      delete _this.dataApi.goods[params.index].ljWeight;
                      _this.$set(_this.dataApi.goods[params.index], "ljWeight", result);
                    }
                  }
                }
              });
            }
          },
          {
            title: "过磅重量(KG)",
            key: "poundWeight",
            width: 120,
            render: (h, params) => {
              let _this = this;
              return h("Input", {
                props: {
                  type: "text",
                  placeholder: "请输入",
                  value: _this.dataApi.goods[params.index].poundWeight
                },
                on: {
                  "on-blur": event => {
                    let e = event.target.value;
                    _this.dataApi.goods[params.index].poundWeight = e;
                    if (e != "" && _this.dataApi.goods[params.index].number != '') {
                      let result = Number(e / _this.dataApi.goods[params.index].number).toFixed(3);
                      delete _this.dataApi.goods[params.index].gbWeight;
                      _this.$set(_this.dataApi.goods[params.index], "gbWeight", result);
                    }
                  }
                }
              });
            }
          },
          {
            title: "过磅单重(KG)",
            key: "gbWeight",
            width: 120
          },
          {
            title: "内部编号",
            key: "internalNumber",
            width: 100,
            render: (h, params) => {
              let _this = this;
              return h("Input", {
                props: {
                  type: "text",
                  placeholder: "请输入",
                  value: _this.dataApi.goods[params.index].internalNumber
                },
                on: {
                  "on-blur": event => {
                    _this.dataApi.goods[params.index].internalNumber =
                      event.target.value;
                  }
                }
              });
            }
          },
          {
            title: "备注",
            key: "remark",
            width: 200,
            render: (h, params) => {
              let _this = this;
              return h("Input", {
                props: {
                  type: "text",
                  placeholder: "请输入",
                  value: _this.dataApi.goods[params.index].remark
                },
                on: {
                  "on-blur": event => {
                    _this.dataApi.goods[params.index].remark = event.target.value;
                  }
                }
              });
            }
          },
          {
            title: "入库后是否自动合并",
            key: "action",
            width: 180,
            fixed: "right",
            render: (h, params) => {
              let _this = this;
              let status = params.row.autoStauts;
              let merge = params.row.merge;
              if (merge) {
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
                if (status === undefined) {
                  return h("div", [
                    h(
                      "Button", {
                        props: {
                          type: "warning",
                          size: "small"
                        },
                        style: {
                          marginRight: '5px'
                        },
                        on: {
                          click: () => {
                            _this.handleMerge(params);
                          }
                        }
                      },
                      "选择"
                    ), h(
                      "Button", {
                        props: {
                          type: "warning",
                          size: "small"
                        },
                        on: {
                          click: () => {
                            _this.delMerge(params);
                          }
                        }
                      },
                      "删除"
                    )
                  ]);
                } else if (status === 1) {
                  return h("div", [h("span", "不合并")]);
                }
              }
  
            }
          }
        ],
        columns: [{
            type: "selection",
            width: 60,
            align: "center",
            fixed: 'left'
          },
          {
            title: "货品名称",
            key: "cargoName",
            width: 150
          },
          {
            title: "日期",
            key: "createTime",
            width: 135,
            render: (h, params) => {
              return h("div", dateformat(params.row.createTime));
            }
          },
          {
            title: "型号",
            key: "model",
            width: 100
          },
          {
            title: "品类",
            key: "category",
            width: 100
          },
          {
            title: "材质",
            key: "material",
            width: 100
          },
          {
            title: "表面",
            key: "surface",
            width: 100
          },
          {
            title: "规格",
            key: "specifications",
            width: 220,
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
            title: "产地",
            key: "proPlacesName",
            width: 100
          },
          {
            title: "密度",
            key: "density",
            width: 100
          },
          {
            title: "内部编号",
            key: "internalNumber",
            width: 100
          },
          {
            title: "理算方法",
            key: "formula",
            width: 100
          },
          {
            title: "单件重量(KG)",
            key: "singleWeight",
            width: 120
          },
          {
            title: "备注",
            key: "remark",
            width: 100
          }
        ],
        list: [],
        totalCount: 0,
        show: false,
        ironTypeList: [],
        surfaceList: [],
        materialList: [],
        proPlaceList: [],
        goods: [],
        mergeShow: false,
        mergeList: [],
        mergeTotalCount: 0,
        mergeApi: {
          currentPage: 1,
          pageSize: 6,
          cargoName: "",
          category: "",
          surface: "",
          material: "",
          proPlacesName: "",
          tolerance: "",
          specifications: "",
          heightBegin: "",
          heightEnd: "",
          widthBegin: "",
          widthEnd: "",
          lengthBegin: "",
          lengthEnd: "",
          status: "",
          cargoStatus: '',
          model: '',
          costPrice: '',
          wareHouseName: '',
          productNumber: '',
          internalNumber: ''
        },
        goodsDetailShow: false,
        detailItem: {
          wareHouseCargoSet: []
        },
        pageFilterData: {
          row: {}
        }
      };
    },
    computed: {
      id() {
        return this.$route.params.id;
      },
      total() {
        let datas = {
          number: 0,
          weight: 0
        };
        this.dataApi.goods.forEach(el => {
          datas.number += Number(el.number)
          datas.weight += Number(el.poundWeight)
        })
        return datas;
      },
      showTotal() {
        let datas = {
          number: 0,
          weight: 0
        };
        if (this.item.processIns) {
          this.item.processIns.forEach(el => {
            datas.number += Number(el.number)
            datas.weight += Number(el.poundWeight)
          })
        }
        return datas;
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
          wareHouseName: this.pageApi.wareHouseName,
          productNumber: this.pageApi.productNumber,
          ownerName: this.pageApi.ownerName,
          ownerId: this.item.customerId,
          hasCoiledSheetNum: '0',
          internalNumber: this.pageApi.internalNumber
        };
      },
      mergeFilter() {
        return {
          currentPage: this.mergeApi.currentPage,
          pageSize: this.mergeApi.pageSize,
          cargoName: this.pageFilterData.row.cargoName,
          category: this.pageFilterData.row.category,
          surface: this.pageFilterData.row.surface,
          material: this.pageFilterData.row.material,
          proPlacesName: this.pageFilterData.row.proPlacesName,
          tolerance: this.pageFilterData.row.tolerance,
          specifications: this.pageFilterData.row.specifications,
          heightBegin: this.pageFilterData.row.height,
          heightEnd: this.mergeApi.heightEnd,
          widthBegin: this.pageFilterData.row.width,
          widthEnd: this.mergeApi.widthEnd,
          lengthBegin: this.pageFilterData.row.length,
          lengthEnd: this.mergeApi.lengthEnd,
          status: this.mergeApi.status,
          hasStore: this.mergeApi.hasStore,
          cargoStatus: this.mergeApi.cargoStatus,
          model: this.mergeApi.model,
          costPrice: this.mergeApi.costPrice,
          wareHouseName: this.item.storeHouseName,
          productNumber: this.mergeApi.productNumber,
          internalNumber: this.mergeApi.internalNumber
        };
      },
      productImg() {
        // return this.editItem.productImg != undefined ? this.editItem.productImg.split(',') : []
      },
      isBJ() {
        return this.pageApi.category == '不锈钢板' || this.pageApi.category == '不锈钢卷'
      },
      // 详情仓库
      whereHoses() {
        return this.detailItem.wareHouseCargoStr ? this.detailItem.wareHouseCargoStr.split(';') : []
      }
    },
    filters: {
      toStatus(val) {
        switch (val * 1) {
          case 1:
            return "待加工";
            break;
          case 2:
            return "加工中";
            break;
          case 3:
            return "待入库";
            break;
          case 4:
            return "已入库";
            break;
          case 5:
            return "已取消";
            break;
          case 6:
            return "入库重申";
            break;
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
      }
    },
  
    watch: {
      handleFilter: {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage) this.pageApi.currentPage = 1;
          this.getList(this.handleFilter);
        }, 200),
        deep: true
      },
      mergeFilter: {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage) this.mergeApi.currentPage = 1;
          this.getmergeData(this.mergeFilter);
        }, 200),
        deep: true
      }
    },
    methods: {
      toStatus(val) {
        switch (val * 1) {
          case 1:
            return "待加工";
            break;
          case 2:
            return "加工中";
            break;
          case 3:
            return "待入库";
            break;
          case 4:
            return "已入库";
            break;
          case 5:
            return "已取消";
            break;
          case 6:
            return "入库重申";
            break;
        }
      },
      getData() {
        this.$http
          .post(this.api.findProcess, {
            processId: this.id
          })
          .then(res => {
            if (res.code === 1000) {
              this.item = res.data;
            }
          });
      },
      // 返回
      goBack() {
        this.$router.go(-1);
      },
      //  选择货物
      selectGoods() {
        this.show = true;
      },
      saveData(status) {
        if (this.goods.length > 0) {
          this.goods.forEach(el => {
            el.cargoId = el.id,
              el.coiledSheetNum = "",
              el.number = "",
              el.poundWeight = "",
              el.coiledWeight = "",
              el.oldCoiledWeight = "",
              el.merge = false,
              el.mergeCargoId = ""
              el.autoStauts = undefined
          });
          this.show = false;
          this.dataApi.goods = this.goods;
          this.$refs.tableList.selectAll(status)
        } else {
          this.$Message.error("请选择货品");
        }
      },
      cancelModal(status) {
        this.show = false;
        this.$refs.tableList.selectAll(status)
      },
      onSelected(data) {
        this.goods = data;
      },
      getList(params) {
        this.$http.post(this.api.findCargoInfo, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount;
          }
        });
      },
      resetFilter() {
        this.pageApi = {
          currentPage: 1,
          pageSize: 10,
          specifications: "",
          category: "",
          surface: "",
          proPlacesName: "",
          tolerance: "",
          heightBegin: "",
          heightEnd: "",
          widthBegin: "",
          widthEnd: "",
          lengthBegin: "",
          lengthEnd: "",
          material: "",
          hasStore: "",
          cargoName: "",
          status: "1",
          cargoStatus: "",
          model: "",
          costPrice: "",
          productNumber: "",
          ownerName: "",
          internalNumber: ''
        };
        this.getList(this.handleFilter);
      },
      // 清除合并货物筛选
      resetMergeApi() {
        this.mergeApi = {
          currentPage: 1,
          pageSize: 6,
          cargoName: this.pageFilterData.row.cargoName,
          category: this.pageFilterData.row.category,
          surface: this.pageFilterData.row.surface,
          material: this.pageFilterData.row.material,
          proPlacesName: this.pageFilterData.row.proPlacesName,
          tolerance: this.pageFilterData.row.tolerance,
          specifications: this.pageFilterData.row.specifications,
          heightBegin: this.pageFilterData.row.height,
          heightEnd: '',
          widthBegin: this.pageFilterData.row.width,
          widthEnd: '',
          lengthBegin: this.pageFilterData.row.length,
          lengthEnd: "",
          status: "",
          cargoStatus: '',
          model: '',
          costPrice: '',
          wareHouseName: this.item.storeHouseName,
          productNumber: '',
          internalNumber: '',
          hasCoiledSheetNum: '0'
        }
        this.getmergeData(this.mergeFilter)
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter);
      },
      //   品类
      getTypeList() {
        this.$http.post(this.api.findAllIronType).then(res => {
          if (res.code === 1000) {
            this.ironTypeList = res.data;
          }
        });
      },
      //   表面
      getSurfaceList() {
        this.$http.post(this.api.findAllSurface).then(res => {
          if (res.code === 1000) {
            this.surfaceList = res.data;
          }
        });
      },
      //   材质
      getMaterialList() {
        this.$http.post(this.api.findAllMaterial).then(res => {
          if (res.code === 1000) {
            this.materialList = res.data;
          }
        });
      },
      //   产地
      getProPlaceList() {
        this.$http.post(this.api.findAllProPlace).then(res => {
          if (res.code === 1000) {
            this.proPlaceList = res.data;
          }
        });
      },
      async asyncGoods() {
        await this.getData();
        this.getTypeList();
        this.getSurfaceList();
        this.getMaterialList();
        this.getProPlaceList();
      },
      //  合并货品详情
      getcargoInfoDetail(data) {
        this.goodsDetailShow = true;
        this.$http.post(this.api.cargoInfoDetail, {
          id: data.row.mergeCargoId
        }).then(res => {
          if (res.code === 1000) {
            this.detailItem = res.data;
          }
        })
      },
      //  放弃合并
      giveMerge() {
        this.goodsDetailShow = false;
        delete this.dataApi.goods[this.activeGoods.index].merge;
        delete this.dataApi.goods[this.activeGoods.index].autoStauts;
        this.$set(this.dataApi.goods[this.activeGoods.index], "merge", false);
        this.$set(this.dataApi.goods[this.activeGoods.index], "autoStauts", undefined);
      },
      //  变更合并
      changeMerge() {
        this.goodsDetailShow = false;
        this.mergeShow = true
      },
      //  是否合并
      handleMerge(params) {
        this.activeGoods = params;
        this.$Modal.confirm({
          title: "请选择",
          content: "入库后是否自动合并？",
          okText: "合并",
          cancelText: "不合并",
          onOk: () => {
            this.mergeShow = true
            this.pageFilterData = params
            this.getmergeData(this.mergeFilter);
          },
          onCancel: () => {
            delete this.dataApi.goods[params.index].merge;
            delete this.dataApi.goods[params.index].autoStauts;
            this.$set(this.dataApi.goods[params.index], "merge", false);
            this.$set(this.dataApi.goods[params.index], "autoStauts", 1);
          }
        });
      },
      delMerge(data) {
        this.dataApi.goods.splice(data.index, 1)
      },
      //  选择合并货物
      getmergeData(params) {
        this.$http.post(this.api.findCargoInfoList, params).then(res => {
          if (res.code === 1000) {
            res.data.data.forEach(el => {
              el.selected = false;
            });
            this.mergeList = res.data.data;
            this.mergeTotalCount = res.data.totalCount;
          }
        });
      },
      //  保存加工单
      saveMerge() {
        if (this.dataApi.goods.length === 0) {
          this.$Message.error('加工货物不能为空！')
        } else {
          let params = this.$clearData(this.dataApi)
          params.processId = this.id;
          params.goods = JSON.stringify(params.goods)
          this.$Modal.confirm({
            title: '确认加工',
            content: '是否确认开始加工？',
            onOk: () => {
              this.$http.post(this.api.saveProcessIn, params).then(res => {
                if (res.code === 1000) {
                  this.$Message.success('加入成功')
                  this.$router.push({
                    name: 'machining'
                  })
                } else {
                  this.$Message.error(res.message)
                }
              })
            }
          })
        }
      }
    },
    created() {
      this.asyncGoods();
    }
  };
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
      .extra-form {
        position: absolute;
        top: -58px;
        left: 150px;
      }
    }
    .totalNum {
      span {
        display: inline-block;
        margin-right: 30px;
      }
    }
  }
  
  .row-list {
    margin-bottom: 15px;
  }
  
  .page-count {
    position: absolute;
    left: 20px;
    bottom: 15px;
  }
  
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
  
  .remrak-warpper {
    display: inline-block;
    font-weight: normal;
    padding-left: 50px;
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
    &:last-child {
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
