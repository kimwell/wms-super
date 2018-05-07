<template>
  <div class="panel">
      <Card :bordered="false" class="card">
      <p slot="title">求购开放时间配置</p>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
              <!-- <Col class-name="col" span="3">资源类型</Col> -->
              <Col class-name="col" span="4">常规开市时间</Col>
              <Col class-name="col" span="5">常规休市日</Col>
              <Col class-name="col" span="3">自定义开闭市</Col>
              <Col class-name="col" span="3">当前状态</Col>
              <Col class-name="col" span="3">最近操作人</Col>
              <Col class-name="col" span="3">最近操作时间</Col>
              <Col class-name="col" span="3">操作</Col>
          </Row>
          <Row v-for="item in list" :key="item.id">
              <!-- <Col class-name="col" span="3">{{ item.StoreTypeName }}</Col> -->
              <Col class-name="col" span="4">
                <template v-if="item.beginTime != ''">{{item.beginTime | dataToTime }} - {{item.endTime | dataToTime}}</template>
                <template v-else>无限制</template>
              </Col>
              <Col class-name="col" span="5">{{item.restDay | dealRestDay}}</Col>
              <Col class-name="col" span="3">
                <template v-if="item.status === 1 || item.status === 3 || item.status === 2">
                  <Button size="small" type="info" @click="changeTimeStatus(item)">开市</Button>
                </template>
                <template v-else>
                  <Button size="small" type="info" @click="changeTimeStatus(item)">闭市</Button>
                </template>
              </Col>
              <Col class-name="col" span="3"> {{item.status | nowStatus}}</Col>
              <Col class-name="col" span="3">{{ item.updateUser }}</Col>
              <Col class-name="col" span="3">{{ item.updateTime | dateformat}}</Col>
              <Col class-name="col" span="3">
                <Button size="small" @click="setUnlimited(item)">设为无限制</Button>
                <Button size="small" type="warning" @click="modifyData(item)">编辑</Button>
              </Col>
          </Row>
          <Row v-if="list.length == 0">
              <Col class-name="col" span="24">暂无数据</Col>
          </Row>
          </div>
        </div>
      </Card>
      <Modal v-model="show" title="编辑求购开放时间" :closable="false" :mask-closable="false">
        <Form :label-width="100" :ref="ref" :model="itemApi">
          <!-- <FormItem label="数据类型：">
            {{itemData.StoreTypeName}}
          </FormItem> -->
          <FormItem label="常规开市时间：">
            <TimePicker type="time" v-model="timeValue[0]" confirm placeholder="时分秒" size="small" style="width: 168px;display:inline-block"></TimePicker>至
            <TimePicker type="time" v-model="timeValue[1]" confirm placeholder="时分秒" size="small" style="width: 168px;display:inline-block"></TimePicker>
          </FormItem>
          <FormItem label="常规休市日：">
              <Select v-model="itemApi.restDay" multiple>
                  <Option v-for="item in weekData" size="small" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
          </FormItem>
        </Form>
        <div slot="footer">
            <Button @click="show = false">取消</Button>
            <Button type="primary" @click="sortSubmit" :loading="loading">确认保存</Button>
        </div>
        </Modal>
  </div>
</template>
<script>
import {dataToTime} from '@/utils/filters.js'
export default {
  data () {
    return {
      ref: 'form' + new Date().getTime(),
      loading:false,
      filterData: {
        currentPage: 1,
        pageSize: 99,
        storeTypeId: ''
      },
      itemApi: {
        id: '',
        storeTypeId: '',
        beginTime: '',
        endTime: '',
        restDay: []
      },
      itemData: {
        StoreTypeName: '',
      },
      show: false,
      typeData: [],
      totalCount: 0,
      list: [],
      timeValue:[' ',' '],
      weekData: [{
        name: '周一',
        id: '1',
      },{
        name: '周二',
        id: '2',
      },{
        name: '周三',
        id: '3',
      },{
        name: '周四',
        id: '4',
      },{
        name: '周五',
        id: '5',
      },{
        name: '周六',
        id: '6',
      },{
        name: '周日',
        id: '7',
      }],
    }
  },
  methods: {
    //  获取列表
    getAllList() {
      this.$http.post(this.api.selectStoreTimePage,this.filterData).then(res => {
        if(res.code === 1000){
          this.list = res.data.list;
          this.totalCount = res.data.totalCount;
        }
      })
    },
    //  编辑时，数据展示处理
    modifyData(data) {
      this.show = true;
      this.itemData = {
        StoreTypeName: data.StoreTypeName
      }
      this.itemApi = {
        id: data.id,
        storeTypeId: data.StoreTypeId,
        beginTime: data.beginTime,
        endTime: data.endTime,
        restDay: data.restDay != '' ? data.restDay.split(',') : []
      }
      this.timeValue[0] = data.beginTime != '' ? dataToTime(data.beginTime) : ''
      this.timeValue[1] = data.endTime != '' ? dataToTime(data.endTime) : ''
    },
    //  设置开、闭市
    changeTimeStatus(item){
      this.$Modal.confirm({
        title: '设置开闭市',
        content: '确认设置开闭市？',
        onOk: () =>{
          let params;
          if(item.status === 4){
            params = {
              id: item.id,
              status: 1
            }
          }else{
            params = {
              id: item.id,
              status: 4
            }
          }
          this.$http.post(this.api.updateStoreTimeStatusById,params).then(res => {
            if(res.code === 1000){
              this.getAllList();
              this.$Message.success('操作成功')
            }else{
              this.$$Message.error('操作失败')
            }
          })
        }
      })
    },
    //  设为无限制
    setUnlimited(item) {
      this.$Modal.confirm({
        title: '设为无限制',
        content: '确认设为无限制？',
        onOk: () =>{
          let params = {
            id: item.id
          }
          this.$http.post(this.api.updateStoreTimeParamById,params).then(res =>{
            if(res.code === 1000){
              this.getAllList();
              this.$Message.success('操作成功');
            }else{
              this.$Message.error('操作失败')
            }
          })
        }
      })
      
    },
    //  提交编辑表单
    sortSubmit() {
      let params = JSON.parse(JSON.stringify(this.itemApi))
      params.beginTime = this.timeValue[0] != '' ? this.timeValue[0].getTime() : '';
      params.endTime = this.timeValue[1] != '' ? this.timeValue[1].getTime() : '';
      params.restDay = params.restDay.toString();
      this.$http.post(this.api.updateStoreTime, params).then(res => {
        if(res.code === 1000){
          this.$Message.success('操作成功');
          this.show = false;
          this.getAllList();
        }else{
          this.$Message.error('操作失败')
        }
      })
    }
  },
  created () {
    this.getAllList();
  }
}
</script>
<style lang="less" scoped>
.card {
    position: relative;
    margin-bottom: 20px;
    padding-bottom: 40px;
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
