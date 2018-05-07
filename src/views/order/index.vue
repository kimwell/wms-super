<template>
  <div>
    <orderFilter @on-change="doFilter"></orderFilter>
    <p style="text-align:center;padding: 20px 0;" v-show="list.length<=0">暂无数据</p>
    <div class="data-list">
      <div class="list-card" v-for="(item,i) in list" :key="i">
        <div class="card-head">
          <span>订单编号：{{item.storeOrderId}}</span>
          <span style="margin-left:15px;" v-if="item.zyName != ''">({{item.zyName}}  {{item.zyMobile}})</span>
          <div class="action">
            <a @click="detailAction(item)">查看详情</a>
            <a @click="delAction(item,1)" v-if="item.status == 1">作废订单</a>
            <a @click="delAction(item,2)" v-if="item.status == 2">取消订单</a>
            <a @click="delAction(item,3)" v-if="item.status != 9">删除订单</a>
          </div>
        </div>
        <div class="card-body clearfix">
          <div class="item">订单状态：{{item.status | status}}</div>
          <div class="item">下单时间：{{item.createTime | dateformat}}</div>
          <div class="item" v-if="item.status == 1">完成时间：{{item.comfirmTime | dateformat}}</div>
          <div class="item" v-if="item.status == 2">确认期限：{{item.valityTime | dateformat}}</div>
          <div class="item" v-if="item.status == 3 || item.status == 4">放弃时间：{{item.updateTime | dateformat}}</div>
          <div class="item" v-if="item.status == 5 || item.status == 6 || item.status == 7">作废时间：{{item.updateTime | dateformat}}</div>
          <div class="item">买家公司：{{item.buyCompanyName}}</div>
          <div class="item">买家联系人：{{item.buyContactName}}-{{item.buyContactNum}}</div>
          <div class="item">卖家公司：{{item.sellCompanyName != ''? item.sellCompanyName : '-'}}</div>
          <div class="item">卖家联系人：{{item.sellContactName}}-{{item.sellContactNum}}</div>
          <div class="item">卖家业务员：{{item.saleName}}-{{item.saleMobile}}</div>
          <div class="item">订单单价：{{item.price}}元/{{item.sellBaseUnit}}</div>
          <div class="item">交货时间：{{item.deliveryTime | dateformatZ}}</div>
          <div class="item">品类：{{item.ironType}}</div>
          <div class="item">材质|表面：{{item.material}}|{{item.surface}}</div>
          <div class="item">规格：{{item.specification != '' ? item.specification : `${item.height}*${item.width}*${item.length}`}}</div>
          <div class="item">求购产地|公差：{{item.proPlace}}<span v-if="item.tolerance != ''">|{{item.tolerance}}</span></div>
          <div class="item">供货产地公差：{{item.sellProPlace}}<span v-if="item.sellTolerance != ''">|{{item.sellTolerance}}</span></div>
        </div>
      </div>
      <div class="pages">
        <Page :total="totalCount" @on-change="pageChange" show-total :current="screenApi.currentPage" :page-size="screenApi.pageSize"></Page>
      </div>
    </div>
    <Modal v-model="optionShow" :title="optionStatus == 1? '作废订单':'取消订单'">
      <Form :label-width="80">
        <p>请选择{{optionStatus == 1? '作废订单':'取消订单'}}的原因</p>
        <FormItem>
          <RadioGroup v-model="optionApi.remark" vertical v-if="reason" @on-change="radioChange">
            <Radio v-for="(item,i) in reason" :key="i" :label="item">
              <span>{{item}}</span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="原因">
          <Input v-model="remark" type="textarea" :disabled="radioDisabled" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="onCancel">取消</Button>
        <Button type="primary" @click="onOk" :loading="loading">{{ optionStatus == 1 ? '作废订单' : '取消订单' }}</Button>
      </div>
    </Modal>
    <Modal v-model="detailShow" title="查看订单详情" width="1000" :closable="false" :mask-closable="false">
      <orderDetail :detailData="detailData"></orderDetail>
      <div slot="footer">
        <Button @click="detailShow = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import orderFilter from './parts/filter'
  import orderDetail from './parts/detail'
  export default {
    components: {
      orderFilter,
      orderDetail
    },
    data() {
      return {
        params: {},
        screenApi: {
          currentPage: 1,
          pageSize: 10
        },
        list: [],
        totalCount: 0,
        optionShow: false,
        optionApi: {
          id: '',
          remark: ''
        },
        optionStatus: '',
        mark: '',
        remark: '',
        radioDisabled: true,
        loading: false,
        detailShow: false,
        detailData:{}
      }
    },
    filters: {
      status(val) {
        switch (val * 1) {
          case 1:
            return '已完成'
            break
          case 2:
            return '待确认'
            break
          case 3:
            return '卖家取消'
            break
          case 4:
            return '过期失效'
            break
          case 5:
            return '买家取消'
            break
          case 6:
            return '超管取消'
            break
          case 7:
            return '超管作废'
            break
          case 9:
            return '超管删除'
            break
        }
      }
    },
    computed: {
      reason() {
        if (this.mark != '' && this.mark != undefined) {
          return this.mark.split(',')
        } else {
          return ''
        }
      }
    },
    methods: {
      //  筛选
      doFilter(data) {
        let params = _.cloneDeep(data);
        this.screenApi.currentPage = 1;
        params.currentPage = this.screenApi.currentPage;
        params.pageSize = this.screenApi.pageSize;
        this.params = params;
        this.getList(params);
      },
      //  分页
      pageChange(page) {
        this.screenApi.currentPage = page;
        let params = _.cloneDeep(this.params);
        params.currentPage = page;
        this.getList(params);
      },
      getList(params) {
        this.$http.post(this.api.findStoreOrder, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.list;
            this.totalCount = res.data.totalCount
          }
        })
      },
      getDictionary(data) {
        let params = {
          code: data
        }
        this.$http.post(this.api.findDateDictionary, params).then(res => {
          if (res.code === 1000) {
            this.mark = res.data.vals + ',其他'
            this.optionApi.remark = res.data.vals.split(',')[0]
          }
        })
      },
      radioChange(data) {
        if (data == '其他') {
          this.radioDisabled = false
        } else {
          this.radioDisabled = true;
          this.remark = ''
        }
      },
      //  查看详情
      detailAction(data) {
        this.detailShow = true
        this.$http.post(this.api.findStoreOrderInfo, {
          storeOrderId: data.storeOrderId
        }).then(res => {
          if (res.code == 1000) {
            this.detailData = res.data
          }
        })
      },
      //  删除订单
      delAction(data, status) {
        this.optionStatus = status
        this.optionApi.id = data.storeOrderId;
        if (status == 2 || status == 1) {
          this.optionShow = true
        }
        if (status == 2) {
          this.getDictionary('AdminCancelReason')
        }
        if (status == 1) {
          this.getDictionary('AdminDeleteReason')
        }
        //  删除
        if (status == 3) {
          this.del(data);
        }
      },
      del(data) {
        this.$Modal.confirm({
          title: '删除提示',
          content: '确认删除？删除后将无法恢复！',
          onOk: () => {
            let params = {
              id: data.storeOrderId,
              remark: ''
            }
            this.$http.post(this.api.deleteStoreOrder, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功!')
                this.getList(this.params)
              } else {
                this.$Message.error(res.message)
              }
            })
          }
        })
      },
      onOk() {
        if (this.optionApi.remark == '其他' && this.remark == '') {
          this.$Message.error('请填写原因')
        } else {
          this.loading = true
          let urlApi = this.optionStatus == 1 ? this.api.invalidStoreOrder : this.api.cancelStoreOrder
          let params = _.cloneDeep(this.optionApi)
          if(this.optionApi.remark == '其他'){
            params.remark = this.remark;
          }
          this.$http.post(urlApi, params).then(res => {
            if (res.code === 1000) {
              this.$Message.success('操作成功！')
              this.getList(this.params)
              this.optionShow = false
              this.remark = ''
            } else {
              this.$Message.error(res.message)
            }
            this.loading = false
          })
        }
      },
      onCancel() {
        this.optionShow = false
        this.optionApi.remark = ''
      }
    },
    created() {}
  }
</script>

<style lang='less' scoped>
  .data-list {
    position: relative;
    padding-bottom: 50px;
    .pages {
      position: absolute;
      right: 0;
      bottom: 0
    }
  }
  
  .list-card {
    background: #fff;
    border: 1px solid #e6e6e6;
    margin-top: 15px;
    font-size: 14px;
    color: #333;
    .card-head {
      position: relative;
      border-bottom: 1px solid #e6e6e6;
      height: 46px;
      line-height: 46px;
      padding: 0 20px;
      .action {
        position: absolute;
        right: 20px;
        top: 0;
        a {
          margin-left: 15px;
        }
      }
    }
    .card-body {
      position: relative;
      padding: 20px;
      padding-bottom: 10px;
      .item {
        width: 20%;
        float: left;
        margin-bottom: 10px;
      }
    }
  }
</style>


