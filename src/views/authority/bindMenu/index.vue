<template>
  <div class="panel">
    <Card :bordered="false" class="card">
      <p slot="title">绑定菜单</p>
      <Button slot="extra" type="primary" @click="bindMenu(false)">绑定菜单</Button>
      <Row>
        <Col span="18" push="6">
        <Tree :data="menuDataSource" ref="Tree" @on-check-change="checkHandle" show-checkbox></Tree>
        <!-- <menuZtree :list.sync='menuDataSource' :func="nodeClick" :showCheckbox='true' :is-open='true'></menuZtree> -->
        </Col>
        <Col span="6" pull="18">
        <ztree :list.sync='ztreeDataSource' :func="nodeClick" :is-open='true'></ztree>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
import ztree from "@/components/basics/tree/ztree";
import menuZtree from "@/components/basics/menuZtree/ztree";
export default {
  components: {
    ztree,
    menuZtree
  },
  data() {
    return {
      nodeModel: null,
      ztreeDataSource: [],
      jsonInfo: {
        roleId: "",
        menuInfo: []
      },
      menuDataSource: [],
      menuDataArr: [],
      roleMenu: []
    };
  },
  computed: {
    activeRoleId() {
      // 当前选中的角色，如果没有选择，默认为当前登录的用户角色
      return {
        roleId:
          this.nodeModel != null
            ? this.nodeModel.id
            : this.$store.getters.roleId,
        rolePid: this.nodeModel != null ? this.nodeModel.pid : "-1" //@_@默认pid修改为当前角色的父级，而不是现在的-1
      };
    }
  },
  methods: {
    getMenuList() {
      this.$http.post(this.api.findMenuList).then(res => {
        if (res.code === 1000) {
          this.menuDataSource = res.data;
          this.treeMenu();
        }
      });
    },
    // 遍历菜单
    treeMenu() {
      var recurFunc = data => {
        data.forEach(i => {
          i.title = i.menuName;
          this.$set(i, "expand", true);
          if (i.children) {
            recurFunc(i.children);
          }
        });
      };
      recurFunc(this.menuDataSource);
    },
    getRoleList() {
      this.$http
        .post(this.api.getRolesById, {
          roleId: this.$store.getters.roleId
        })
        .then(res => {
          if (res.code === 1000) {
            let userData = res.data;
            delete userData.interfaceInfoList;
            this.ztreeDataSource = [userData];
          }
        });
    },
    nodeClick(m, parent) {
      this.nodeModel = m;
      this.jsonInfo.roleId = m.id;
      this.$http
        .post(this.api.findBindMenuList, {
          roleId: m.id
        })
        .then(res => {
          if (res.code === 1000) {
            this.roleMenu = res.data;
            this.setActiveMenu();
            this.jsonInfo.menuInfo = this.$refs.Tree.getCheckedNodes()
          }
        });
    },
    //  设置已选中的菜单
    setActiveMenu() {
      var recurFunc = data => {
        data.forEach(i => {
          this.$set(i, "checked", false);
          this.$set(i, "indeterminate", false);
          this.roleMenu.forEach(j => {
            if (i.id === j.id) {
              this.$set(i, "checked", true);
            }
          });
          if (i.children) {
            recurFunc(i.children);
          }
        });
      };
      recurFunc(this.menuDataSource);
    },
    checkHandle(data) {
      this.jsonInfo.menuInfo = data;
    },
    // 绑定菜单
    bindMenu() {
      if (this.activeRoleId.rolePid != "-1") {
        if (this.jsonInfo.roleId != "") {
          if (this.jsonInfo.menuInfo.length > 0) {
            this.$Modal.confirm({
              title: "绑定提示！",
              content: "确定绑定角色菜单？",
              onOk: () => {
                let params = JSON.stringify(this.jsonInfo);
                this.$http
                  .post(this.api.bindMenuToRole, {
                    jsonInfo: params
                  })
                  .then(res => {
                    if (res.code === 1000) {
                      this.$Message.success("绑定成功");
                    } else {
                      this.$Message.error(res.message);
                    }
                  });
              }
            });
          } else {
            this.$Message.error("请选择菜单");
          }
        } else {
          this.$Message.error("请选择角色");
        }
      } else {
        this.$Message.error("此角色不能绑定菜单");
      }
    }
  },
  created() {
    this.getRoleList();
    this.getMenuList();
  }
};
</script>

<style lang='less' scoped>

</style>