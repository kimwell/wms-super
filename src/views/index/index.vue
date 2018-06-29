<template>
  <div class="layout">
    <div class="app-sidebar">
      <div class="layout-menu-left">
        <Menu ref="menu" :active-name="activeIndex" theme="dark" width="auto" @on-select="openSubpage" :open-names="openArr" style="overflow: hidden;">
          <div class="layout-logo-left">超管后台管理系统</div>
          <Submenu :name="index" v-for="(item,index) in menu" :key="index">
            <template slot="title">
              <span class="pointer" v-show="item.showPointer"></span>
              <span class="iconfont menuicon" :class="item.icon"></span>{{ item.menuName }}
            </template>
            <MenuItem :name="index+'-'+i" v-for="(sub,i) in item.children" :key="i">
              {{ sub.menuName }}
              <span class="pointer" v-show="sub.showPointer"></span>
            </MenuItem>
          </Submenu>
        </Menu>
      </div>
    </div>
      <div class="app-header">
        <div class="layout-header" ref="layoutHeader">
          <div class="layout-ceiling-main">
            <a @click="loginout"><Icon type="log-out" style="margin-right:3px;font-size:14px;"></Icon>退出</a>
          </div>   
        </div>
      </div>
      <div class="app-body">
        <div class="layout-breadcrumb">
          <Breadcrumb>
            <BreadcrumbItem v-for="(tag,index) in activeMenu.path" :key="index">{{ tag }}</BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div class="layout-content" :style="{'min-height':contentHeight + 'px'}">
          <router-view></router-view>
        </div>
      </div>
    </div>
</template>

<script>
  // import menu from "./mainMenu.js";
  import * as types from "@/store/types";
  import {
    mapGetters
  } from "vuex";
  import pushs from "@/utils/push.js";
  export default {
    mixins: [pushs],
    data() {
      return {
        // menu: [],
        openArr: [],
        // 导航初始选中菜单
        activeIndex: "",
        contentHeight: "700",
        pointData: {}
      };
    },
    computed: {
      //获取当前选中菜单
      activeMenu() {
        if (this.activeIndex != "") {
          let activeItem = this.activeIndex.split("-");
          let key1 = activeItem[0] || 0;
          let key2 = activeItem[1] || 0;
          // 返回信息，path 用于导航面包屑 ， router用于路由跳转信息源
          return {
            path: [
              this.menu[key1].menuName,
              this.menu[key1].children[key2].menuName
            ],
            router: {
              name: this.menu[key1].children[key2].url
            }
          };
        } else {
          return {
            path: ["首页"]
          };
        }
      },
      menu() {
        return this.$store.state.menuData;
      },
      user() {
        return this.$store.state.user;
      },
      menuData() {
        let arr = [];
        this.menu.forEach((el, index) => {
          if (el.children) {
            el.showPointer = false;
            el.children.forEach((sub, i) => {
              sub.showPointer = false;
              if (sub.url == "stockOut") {
                sub.showPointer = this.pointData.ckdgl;
              }
              if(sub.url == 'machining'){
                sub.showPointer = this.pointData.jgd;
              }
              if(sub.url == 'stockInto'){
                sub.showPointer = this.pointData.rkdgl;
              }
              if(sub.url == 'stockCancel'){
                sub.showPointer = this.pointData.zfgl;
              }
              if(sub.url == 'saleOrder'){
                sub.showPointer = this.pointData.xsdgl;
              }
              if(sub.showPointer){
                el.showPointer = true;
              }
            });
          }
        });
        arr.push(...this.menu);
        return arr
      }
    },
    methods: {
      // 跳转子页面
      openSubpage(name) {
        this.activeIndex = name;
        if (this.activeMenu.router.name == "nadd") {
          this.activeMenu.router.params = {
            id: 0,
            type: "add"
          };
        }
        this.$router.push(this.activeMenu.router);
      },
      // 设置菜单全部展开,匹配当前页面选中菜单
      setActiveMenu() {
        this.menuData.forEach((el, index) => {
          this.openArr.push(index);
          el.children.forEach((sub, i) => {
            if (sub.children.length != 0) {
              sub.children.forEach((ch, j) => {
                if (this.$route.fullPath === ch.url)
                  this.activeIndex = `${index}-${i}`;
              });
            } else {
              if (this.$route.name === sub.url)
                this.activeIndex = `${index}-${i}`;
            }
          });
        });
      },
      // 设置内容区域高度
      resizeContent() {
        // 获取屏幕高度
        let winHeight = document.body.clientHeight;
        let headerHeight = this.$refs.layoutHeader.clientHeight;
        let contnetHeight = winHeight - headerHeight - 60;
        this.contentHeight = contnetHeight;
      },
      getUserInfo() {
        this.$http.post(this.api.getUser).then(res => {
          if (res.code === 1000) {
            this.$store.commit(types.MENU_DATA, JSON.parse(res.data.menuInfo));
            this.$store.commit(types.USER, res.data);
            document.addEventListener("visibilitychange", () => {
              let isHidden = document.hidden;
              if (isHidden) {
                this.isFocus = false;
              } else {
                this.isFocus = true;
                document.title = this.titleInit;
                window.clearInterval(this.stl);
                if (!this.isNotice) {
                  this.notify(this.msg);
                }
              }
            });
            this.initScoket();
          }
        });
      },
      messagePrompt() {
        this.$http.post(this.api.messagePrompt).then(res => {
          if (res.code === 1000) {
            this.pointData = res.data || {};
          }
        });
      },
      //  退出登录
      loginout(data) {
        this.$store.commit(types.LOGOUT, data);
        window.location.href = "/bg/login";
      }
    },
    created() {
      this.messagePrompt();
      this.getUserInfo();
    },
    mounted() {
      this.$nextTick(function() {
        this.$refs.menu.updateActiveName();
      });
      this.resizeContent();
    },
    watch: {
      $route(a) {
        //如果回到首页，就去掉菜单的选中效果
        if (a.name === "/") {
          this.activeIndex = "";
        } else {
          this.$nextTick(function() {
            this.$refs.menu.updateActiveName();
          });
          this.setActiveMenu();
        }
      },
      menuData() {
        this.setActiveMenu();
        this.$nextTick(function() {
          this.$refs.menu.updateActiveName();
          this.$refs.menu.updateOpened();
        });
      }
    }
  };
</script>

<style lang='less' scoped>
  .layout {
    background: #f5f7f9;
    position: absolute;
    width: 100%;
    height: 100%;
    .app-sidebar {
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 21;
      width: 210px;
      overflow: auto;
      background-color: #1c2438;
      /deep/ .ivu-menu-vertical .ivu-menu-submenu-title,
      /deep/ .ivu-menu-vertical .ivu-menu-item {
        padding: 12px 24px;
      }
    }
    .app-header {
      box-sizing: border-box;
      position: fixed;
      display: block;
      padding-left: 210px;
      width: 100%;
      height: auto;
      z-index: 20;
      box-shadow: 0 2px 1px 1px hsla(0, 0%, 39%, 0.1);
      transition: padding 0.3s;
    }
    .app-body {
      position: absolute;
      top: 60px;
      right: 0;
      bottom: 0;
      left: 210px;
      overflow: auto;
      background-color: #f0f0f0;
      z-index: 1;
      transition: left 0.3s;
    }
  }
  
  .layout-breadcrumb {
    padding: 10px 10px 0;
  }
  
  .layout-content {
    margin: 10px;
    /* overflow-x: hidden; */
    border-radius: 4px;
    min-width: 1200px;
  }
  
  .layout-content-main {
    padding: 10px;
    height: 100%;
  }
  
  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }
  
  .layout-menu-left {
    background: #464c5b;
  }
  
  .layout-header {
    position: relative;
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }
  
  .layout-logo-left {
    width: 90%;
    height: 40px;
    line-height: 40px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  
  .content-container {
    width: 100%;
    height: 100%;
    background-color: #fff;
  }
  
  .layout-ceiling-main {
    float: right;
    margin-right: 15px;
    line-height: 60px;
  }
  
  .layout-ceiling-main a {
    color: #9ba7b5;
    font-size: 14px;
  }
  
  .menuicon {
    margin-right: 4px;
    vertical-align: middle;
  }
  .pointer{
    position: absolute;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color:red;
    top: 20px;
    right: 60px;
  }
</style>