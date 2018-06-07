<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">付款管理列表</p>
      <Button slot="extra" type="primary" @click="openModel">新增</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="客户名称：">
          <Input type="text" v-model="pageApi.customerName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="进账时间：">
          <DatePicker type="daterange" placement="bottom-end" v-model="dataValue" placeholder="选择日期" style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card">
        <div class="card-contnet">
          <div class="table-contnet">
            <Row class-name="head">
              <Col class-name="col" span="3">客户名称</Col>
              <Col class-name="col" span="1">出账金额</Col>
              <Col class-name="col" span="3">客户账号</Col>
              <Col class-name="col" span="3">公司账号</Col>
              <Col class-name="col" span="2">出账时间</Col>
              <Col class-name="col" span="2">银行账号流水号</Col>
              <Col class-name="col" span="2">附件</Col>
              <Col class-name="col" span="2">操作人</Col>
              <Col class-name="col" span="2">操作时间</Col>
              <Col class-name="col" span="2">备注</Col>
              <Col class-name="col" span="2">操作</Col>
            </Row>
            <Row v-for="(item,index) in list " :key="index">
              <Col class-name="col" span="3">{{item.customerName}}</Col>
              <Col class-name="col" span="1">{{item.amount}}</Col>
              <Col class-name="col" span="3">{{item.customerBankCardNo}}</Col>
              <Col class-name="col" span="3">{{item.bankCardNo}}</Col>
              <Col class-name="col" span="2">{{item.inTime | dateformat}}</Col>
              <Col class-name="col" span="2">{{item.bankTradeNo}}</Col>
              <Col class-name="col" span="2">
              <Button v-if="item.fileAddress != ''" size="small" type="warning" @click.native="previewImg(item.fileAddress)">查看</Button>
              <span v-else>暂无</span>
              </Col>
              <Col class-name="col" span="2">{{item.updateUser}}</Col>
              <Col class-name="col" span="2">{{item.updateTime | dateformat}}</Col>
              <Col class-name="col" span="2">{{item.remark}}</Col>
              <Col class-name="col" span="2">
              <Button size="small" type="warning" @click="deleteItem(item)">作废</Button>
              </Col>
            </Row>
            <Row v-if="list.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
            </Row>
          </div>
          <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="cancelShow" width="500" :mask-closable="false" title="作废">
      <Form :label-width="110" ref="cancelForm" :model="cancelData" :rules="cancelRules">
        <FormItem label="备注：" prop="deleteRemark">
          <Input type="text" v-model="cancelData.deleteRemark" style="width: 300px;" placeholder="请输入..."></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelShow = false">取消</Button>
        <Button type="primary" @click="cancelAction">确定</Button>
      </div>
    </Modal>
    <Modal v-model="prevShow" width="800" :mask-closable="false" title="预览附件">
      <div class="showImg">
        <img :src="prevImgSrc">
      </div>
    </Modal>
  </div>
</template>

<script>
  import uploadBtn from '@/components/basics/uploadBtn'
  export default {
    components: {
      uploadBtn
    },
    data() {
      return {
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          inTimeBegin: '',
          inTimeEnd: '',
          customerName: ''
        },
        list: [],
        totalCount: 0,
        dataValue: ['', ''],
        cancelShow: false,
        cancelData: {
          id: '',
          deleteRemark: ''
        },
        cancelRules: {
          deleteRemark: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        prevShow: false,
        prevImgSrc: ''
      }
    },
    computed: {
      handleFilter() {
        return {
          currentPage: this.pageApi.currentPage,
          pageSize: this.pageApi.pageSize,
          customerName: this.pageApi.customerName,
          inTimeBegin: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          inTimeEnd: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
        }
      },
      inTime() {
        return this.dataApi.inTime != '' ? this.dataApi.inTime.getTime() : ''
      },
      allPlus(){
        let arr = 0;
        if(this.selectAllList.length !=0){
          this.selectAllList.forEach(el =>{
            console.log(el)
            return arr += Number(el.account)
          })
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
        this.$http.post(this.api.paymentOrderPage, params).then(res => {
          if (res.code === 1000) {
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
          }
        })
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList(this.handleFilter)
      },
      resetFilter() {
        this.pageApi = {
          currentPage: 1,
          pageSize: 10,
          inTimeBegin: '',
          inTimeEnd: '',
          customerName: ''
        }
        this.dataValue = ['', '']
        this.getList(this.handleFilter);
      },
      openModel() {
        this.$router.push('addPaymentOrder');
      },
      deleteItem(data) {
        this.cancelShow = true;
        this.cancelData.id = data.id;
      },
      // 确定作废
      cancelAction() {
        this.$refs.cancelForm.validate((valid) => {
          if (valid) {
            let params = this.$clearData(this.cancelData);
            this.$http.post(this.api.paymentOrderCancel, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('作废成功');
                this.cancelShow = false;
                this.getList(this.handleFilter)
              } else {
                this.$Message.error(res.message)
              }
            })
          } else {
            this.$Message.error('表单验证失败!');
          }
        })
      },
      //  查看附件
      previewImg(data) {
        this.prevShow = true
        this.prevImgSrc = data;
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
  
  .showImg {
    text-align: center;
    img {
      max-width: 100%;
    }
  }

</style>