<template>
  <div class="comm-container">
        <h2 class="panel-title">专员管理查询</h2>
        <div class="action-div">
           <Form :mode="filterData" :label-width="80" inline style="margin-top:24px;">
               <FormItem prop="login" label="专员账号">
                    <Input type="text" v-model="filterData.login" @on-blur="onFilter" placeholder="请输入..."></Input>
                </FormItem>
               <FormItem prop="name" label="姓名">
                    <Input type="text" v-model="filterData.name" @on-blur="onFilter" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem>
                    <Button type="warning" @click.native="resetFilter">清除</Button>
                </FormItem>
            </Form>
            <div class="panel">
                <Card :bordered="false" class="card">
                    <div class="card-contnet">
                        <div class="table-contnet">
                            <Row class-name="head">
                                <Col class-name="col" span="7">专员编号</Col>
                                <Col class-name="col" span="6">专员账号</Col>
                                <Col class-name="col" span="6">专员姓名</Col>
                                <Col class-name="col" span="5">绑定用户数</Col>
                            </Row>
                            <Row v-for="(item,index) in listData" :key="item.id">
                                <Col class-name="col" span="7">{{ item.salesmanUserId }}</Col>
                                <Col class-name="col" span="6">{{ item.tel }}</Col>
                                <Col class-name="col" span="6">{{ item.name }}</Col>
                                <Col class-name="col" span="5">{{ item.bindNum }}</Col>
                            </Row>
                            <Row v-if="listData.length == 0">
                                <Col class-name="col" span="24">暂无数据</Col>
                            </Row>
                        </div>
                        <Page class="page-count" size="small" show-total :total="totalCount" :page-size="filterData.pageSize" @on-change="changePage"></Page>
                    </div>
                </Card>
            </div> 
        </div>
  </div>
</template>
<script>
export default {
    data () {
        return {
            filterData:{
                name: '',
                login: '',
                pageSize: 10,
                currentPage: 1
            },
            listData: [],
            totalCount: 0
        }
    },
    methods: {
        onFilter() {
            this.getList();
        },
         //  获取专员列表
        getList() {
            this.$http.post(this.api.getSalemanBind, this.filterData).then(res => {
                if (res.code === 1000) {
                    this.listData = res.data.list;
                    this.totalCount = res.data.totalCount;
                }
            })
        },
        changePage(page) {
            this.filterData.currentPage = page;
            this.getList();
        },
        //  清楚筛选 
        resetFilter() {
            this.filterData.name = '';
            this.filterData.login = '';
            this.getList();
        },
        openModel() {
            console.log('sdf');
        }
    },
    created () {
         this.getList();
    }
}
</script>
<style lang="less" scoped>
.panel-title{
  font-size: 16px;
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
        border-left: 1px solid #d0d0d0;
        .head {
            background-color: #ddd;
        }
        .col {
            height: 40px;
            border-right: 1px solid #d0d0d0;
            border-bottom: 1px solid #d0d0d0;
        }
    }
    .page-count {
        position: absolute;
        right: 0;
        bottom: 0;
    }
}
</style>




