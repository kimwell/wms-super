<template>
  <div class="panel">
    <Card :bordered="false" class="card">
      <p slot="title" class="title">商家入驻待审核列表</p>
      <Form :mode="apiData" :label-width="100" inline style="margin-top:24px;">
          <FormItem label="认证状态:">
            <Select v-model="apiData.pass" @on-change="onFilter" placeholder="请选择" style="width:150px">
                <Option v-for="item in statusData" :key="item.id" :value="item.id" >{{ item.name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="公司名称:">
            <Input type="text" v-model="apiData.companyName" placeholder="请输入..."></Input>
          </FormItem>
          <FormItem label="注册手机号:">
            <Input type="text" v-model="apiData.buserMobile" placeholder="请输入..."></Input>
          </FormItem>
          <FormItem label="提交审核时间:">
            <DatePicker type="daterange" :clearable="false" :options="dateOption" v-model="dataValue" placement="bottom-end" placeholder="选择日期"></DatePicker>
          </FormItem>
          <FormItem>
              <Button type="warning" @click.native="resetFilter">清除</Button>
          </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
            <Row class-name="head">
                <Col class-name="col" span="4">商户名称</Col>
                <Col class-name="col" span="2">三证合一</Col>
                <Col class-name="col" span="4">专员绑定</Col>
                <Col class-name="col" span="2">联系人</Col>
                <Col class-name="col" span="4">注册手机号</Col>
                <Col class-name="col" span="3">认证状态</Col>
                <Col class-name="col" span="3">提交审核时间</Col>
                <Col class-name="col" span="2">操作</Col>
            </Row>
            <Row v-for="(item,index) in list" :key="item.id">
                <Col class-name="col" span="4">{{item.companyName}}</Col>
                <Col class-name="col" span="2">{{item.allCer !=''?'是':'否'}}</Col>
                <Col class-name="col" span="4">{{item.saleName}}{{item.saleMobile}}</Col>
                <Col class-name="col" span="2">{{item.contact}}</Col>
                <Col class-name="col" span="4">{{item.buserMobile}}</Col>
                <Col class-name="col" span="3">{{item.pass | passStatus}}</Col>
                <Col class-name="col" span="3">{{item.onBuserTime | dateformat}}</Col>
                <Col class-name="col" span="2">
                  <Button type="warning" v-if="item.pass == 2" size="small" @click.native="goRouter(item)">审核</Button>
                  <Button type="warning" v-if="item.pass == 3" size="small" @click.native="goRouter(item)">查看</Button>
                </Col>
            </Row>
            <Row v-if="list.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
            </Row>
        </div>
      </div>
      </Card>
    </div>
</template>

<script>
  export default {
    data() {
      return {
        apiData: {
          currentPage: 1,
          pageSize: 10,
          pass: '',
          companyName: '',
          buserMobile: '',
        },
        dataValue: ['',''],
        list: [],
        totalCount: 0,
        statusData: [{
          name: '认证待审核',
          id: 2
        },{
          name: '认证失败',
          id: 3
        }],
        dateOption: {
          shortcuts: [{
                  text: '最近一周',
                  value() {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                      return [start, end];
                  }
              },
              {
                  text: '最近一个月',
                  value() {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                      return [start, end];
                  }
              },
              {
                  text: '最近三个月',
                  value() {
                      const end = new Date();
                      const start = new Date();
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      return [start, end];
                  }
              }
          ]
      },
      }
    },
    computed: {
      filterData() {
        return {
          currentPage: this.apiData.currentPage,
          pageSize: this.apiData.pageSize,
          pass: this.apiData.pass,
          companyName: this.apiData.companyName,
          buserMobile: this.apiData.buserMobile,
          onBusrTimeStart: this.dataValue[0] != '' ? this.dataValue[0].getTime() : '',
          onBusrTimeEnd: this.dataValue[1] != '' ? this.dataValue[1].getTime() : '',
        }
      }
    },
    filters: {
      passStatus(val){
        switch (val * 1) {
          case 1:
            return '认证通过'
            break;
          case 2:
            return '认证待审核'
            break;
          case 3:
            return '认证失败'
            break;
          default:
            break;
        }
      }
    },
    watch: {
      'filterData': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if(val.currentPage == oldVal.currentPage)
              this.apiData.currentPage = 1;
            this.getList();
        }, 200),
        deep: true
      }
    },
    methods: {
      onFilter(){
        this.filterData.currentPage = 1
        this.getList();
      },
      resetFilter(){
        this.apiData = {
          currentPage: 1,
          pageSize: 10,
          pass: '',
          companyName: '',
          buserMobile: '',
        }
        this.dataValue = ['',''];
        this.getList();
      },
      getList() {
        this.$http.post(this.api.findNotBuserInfoPage,this.filterData).then(res => {
          if(res.code === 1000){
            this.list = res.data.list;
            this.totalCount = res.data.totalCount;
          }
        })
      },
      goRouter(data) {
        this.$router.push('examineDetail/'+data.companyId+'/'+data.userId+'/'+ data.pass)
      }
    },
    created () {
      this.getList();
    }
  }
</script>

<style lang='less' scoped>
.card {
    position: relative;
    margin-bottom: 20px;
    padding-bottom: 40px;
    .title{
      span{
        font-size: 12px;
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
    .page-count {
        position: absolute;
        right: 0;
        bottom: 10px;
    }
} 
</style>