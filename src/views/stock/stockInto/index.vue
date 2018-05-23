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
        loading: false
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
          this.$http.post(this.api.storageIn,this.intoData).then(res => {
            if(res.code === 1000){
              this.$Message.success('入库成功')
              this.getList(this.handleFilter)
            }else{
              this.$Message.error(res.message)
            }
          })
        } else if (flag === 3) {
          //  详情
  
        }
      }
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
</style>