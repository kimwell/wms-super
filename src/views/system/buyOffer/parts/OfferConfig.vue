<template>
  <div class="panel">
    <Card :bordered="false" class="card">
      <p slot="title">{{title}}参数配置</p>
      <div class="card-contnet">
        <div class="table-contnet">
          <Row class-name="head">
            <Col class-name="col" span="5">参数名称</Col>
            <Col class-name="col" span="5">有效时间</Col>
            <Col class-name="col" span="5">类型备注</Col>
            <Col class-name="col" span="3">最近操作人</Col>
            <Col class-name="col" span="3">最近操作时间</Col>
            <Col class-name="col" span="3">操作</Col>
          </Row>
          <Row>
            <Col class-name="col" span="5">{{item.name}}</Col>
            <Col class-name="col" span="5">{{item.time | formatDuring(params = 2)}}</Col>
            <Col class-name="col" span="5">{{item.remark != ''? item.remark: "暂无备注"}}</Col>
            <Col class-name="col" span="3">{{item.updateUser}}</Col>
            <Col class-name="col" span="3">{{item.updateTime | dateformat}}</Col>
            <Col class-name="col" span="3">
            <Button size="small" type="warning" @click="openModel(item)">编辑</Button>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
    <Modal v-model="show" title="编辑" :closable="false" :mask-closable="false">
      <Form :label-width="110" :ref="ref" :model="apiData" :rules="rules">
        <FormItem label="参数名称：" prop="name">
          <Input v-model="apiData.name" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="有效时间：">
          <TimePicker type="time" v-model="apiData.time" format="HH’mm’ss" confirm placeholder="选择时间" style="width: 168px;"></TimePicker>
        </FormItem>
        <FormItem label="备注：">
          <Input v-model="apiData.remark" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
        <Button type="primary" @click="handleSubmit" :loading="loading">编辑</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {
    dataToTime,
    formatDuring
  } from '@/utils/filters.js'
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      type: [Number, String]
    },
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        item: {},
        show: false,
        editItem: {},
        apiData: {
          name: '',
          time: '',
          configType: '',
          remark: '',
          id: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          }]
        },
        loading: false
      }
    },
    computed: {
      //  时分秒转毫秒
      formateMsec() {
        let time = dataToTime(this.apiData.time);
        let times;
        if (time != '' && time != undefined && time != NaN) {
          let h = parseFloat(time.split(':')[0].toString());
          let m = parseFloat(time.split(':')[1].toString())
          let s = parseFloat(time.split(':')[2].toString())
          times = (h * 60 * 60 * 1000) + (m * 60 * 1000) + (s * 1000)
        } else {
          times = 0;
        }
        return times
      }
    },
    methods: {
      getList() {
        let params = {
          configType: this.type
        }
        this.$http.post(this.api.findByPage, params).then(res => {
          this.item = res.data.ironSellTimeInfo;
        })
      },
      openModel(item) {
        this.editItem = item || ''
        this.show = true;
        this.apiData.name = item.name;
        this.apiData.time = formatDuring(this.item.time);
        this.apiData.remark = item.remark;
      },
      handleSubmit() {
        this.$refs[this.ref].validate((valid) => {
          if (valid) {
            if(this.apiData.time != ''){
            this.loading = true;
            let params = {
              configType: this.type,
              id: this.editItem.id,
              name: this.apiData.name,
              remark: this.apiData.remark,
              time: this.formateMsec
            }
            this.$http.post(this.api.saveConfigTime, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('编辑成功')
                this.getList();
                this.show = false;
              } else {
                this.$Message.error(res.message)
              }
            })
            this.loading = false
            }else{
              this.$Message.error('请选择有效时间');
            }
          } else {
            this.$Message.error('表单验证失败');
          }
        })
      }
    },
    created() {
      this.getList();
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