<template>
  <div class="panel">
    <Card :bordered="false" class="card">
      <p slot="title">菜单管理</p>
      <menuZtree :list.sync='ztreeDataSource' :func="nodeClick" :is-open='true'></menuZtree>
    </Card>
    <!-- 添加修改面板 -->
    <Modal v-model="panelShow" :title="isEdit ? '编辑':'新增'">
      <Form :label-width="110" ref="roleEdit" :model="itemApi" :rules="ruleValidate">
        <FormItem label="菜单名称：" >
          <Input v-model="itemApi.menuName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="菜单地址：" >
          <Input v-model="itemApi.url" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="菜单图标：">
          <Input v-model="itemApi.icon" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="打开方式：">
          <!-- <Input v-model="itemApi.openType" placeholder="请输入"></Input> -->
          <RadioGroup v-model="itemApi.openType">
              <Radio :label="1"><span>内部打开</span></Radio>
              <Radio :label="2"><span>外部打开</span></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序号：" >
          <Input v-model="itemApi.orderNum" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" :loading="loading" @click="addNode">{{ isEdit ? '编辑' : '添加' }}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import menuZtree from "@/components/basics/menuZtree/ztree";
  export default {
    components: {
      menuZtree
    },
    data() {
      return {
        ztreeDataSource: [],
        isEdit: false,
        panelShow: false,
        loading: false,
        itemApi:{
          pid: '',
          menuName: '',
          icon:'',
          url:'',
          orderNum:'',
          openType: 1,
          levels:''
        },
        ruleValidate:{
          menuName: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        }
      };
    },
    methods: {
      getList() {
        this.$http.post(this.api.findMenuList).then(res => {
          if (res.code === 1000) {
            this.ztreeDataSource = res.data;
          }
        });
      },
      nodeClick(m, p, d, o) {
        console.log(m)
        if (o == 1) { //  新增
          this.panelShow = true;
          this.isEdit = false;
          this.itemApi = {
            icon: '',
            menuName: '',
            pid: m.node.id,
            url: '',
            orderNum:'',
            openType: 1,
            levels:''
          }
        } else if (o == 2) { // 编辑
          this.panelShow = true
          this.isEdit = true
          this.itemApi = {
              icon: m.node.icon,
              menuName: m.node.menuName,
              pid: m.node.id,
              url: m.node.url,
              orderNum: m.node.orderNum,
              openType: m.node.openType,
              levels: m.node.levels
          }
        } else if (o == 3) { // 删除
          let params = {
            id: m.node.id
          }
          // this.$Modal.confirm({
          //   title: '删除提示！',
          //   content: '删除后无法撤销，是否继续？',
          //   onOk: () => {
          //     this.$http.post(this.api.deleteLogisticsGoods, params).then(res => {
          //       if (res.code === 1000) {
          //         this.$Message.success('删除成功');
          //         this.getAll();
          //       } else {
          //         this.$Message.error(res.message)
          //       }
          //     })
          //   }
          // })
        }
      },
      addNode(){

      }
    },
    created() {
      this.getList();
    }
  };
</script>

<style lang='less' scoped>
  
</style>