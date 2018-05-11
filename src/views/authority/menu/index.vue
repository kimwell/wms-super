<template>
  <div class="panel">
    <Card :bordered="false" class="card">
      <p slot="title">菜单管理</p>
      <Button slot="extra" type="primary" @click="openModel(false)">新增菜单</Button>
      <menuZtree :list.sync='ztreeDataSource' :func="nodeClick" :is-open='true'></menuZtree>
    </Card>
    <!-- 添加修改面板 -->
    <Modal v-model="panelShow" :title="isEdit ? '编辑':'新增'">
      <Form :label-width="110" ref="menuEdit" :model="itemApi" :rules="ruleValidate">
        <FormItem label="菜单名称：" prop="menuName">
          <Input v-model="itemApi.menuName" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="菜单地址">
          <Input v-model="itemApi.url" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="菜单图标：">
          <Input v-model="itemApi.icon" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="打开方式：">
          <RadioGroup v-model="itemApi.openType">
            <Radio :label="1"><span>内部打开</span></Radio>
            <Radio :label="2"><span>外部打开</span></Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="排序号：">
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
        itemApi: {
          pid: "",
          menuName: "",
          icon: "",
          url: "",
          orderNum: "",
          openType: 1,
          levels: "",
          id: ""
        },
        ruleValidate: {
          menuName: [{
            required: true,
            message: "不能为空",
            trigger: "blur"
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
        if (o == 1) {
          //  新增
          this.panelShow = true;
          this.isEdit = false;
          this.itemApi = {
            icon: "",
            menuName: "",
            pid: m.id,
            url: "",
            orderNum: "",
            openType: 1,
            levels: "",
            id: ""
          };
        } else if (o == 2) {
          // 编辑
          this.panelShow = true;
          this.isEdit = true;
          this.itemApi = {
            icon: m.icon,
            menuName: m.menuName,
            pid: m.pid,
            url: m.url,
            orderNum: m.orderNum,
            openType: m.openType,
            levels: m.levels,
            id: m.id
          };
        } else if (o == 3) {
          // 删除
          let params = {
            id: m.id
          };
          this.$Modal.confirm({
            title: "删除提示！",
            content: "删除后无法撤销，是否继续？",
            onOk: () => {
              this.$http.post(this.api.deleteMenu, params).then(res => {
                if (res.code === 1000) {
                  this.$Message.success("删除成功");
                  this.getList();
                } else {
                  this.$Message.error(res.message);
                }
              });
            }
          });
        }
      },
      //  保存、编辑
      addNode() {
        this.$refs.menuEdit.validate((valid) => {
          if (valid) {
            this.loading = true;
            let params = this.itemApi;
            this.$http.post(this.api.saveMenu, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success("操作成功");
                this.getList();
              } else {
                this.$Message.error(res.message);
              }
              this.panelShow = false;
              this.loading = false;
            });
          } else {
            this.$Message.error('请输入菜单名称');
          }
        })
      },
      openModel() {
        this.panelShow = true;
        this.resetData();
      },
      resetData() {
        this.itemApi = {
          icon: "",
          menuName: "",
          pid: "",
          url: "",
          orderNum: "",
          openType: 1,
          levels: "",
          id: ""
        };
      }
    },
    created() {
      this.getList();
    }
  };
</script>

<style lang='less' scoped>
  
</style>