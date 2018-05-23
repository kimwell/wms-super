<template>
  <div class="scope-container">
    <div class="group" v-for="(item,index) in list" :key="index">
      <div class="head">
        {{ item.title }}
        <a @click="setCheckAll(index)"><span class="iconfont" :class="checkAll[index] ? 'icon-yduifuxuankuangxuanzhong all-checked' : 'icon-yduifuxuankuang'" ></span>全选</a>
      </div>
      <div class="item-content clearfix">
        <div class="item" :class="{'selected':sub.isCheck}" v-for="(sub,i) in item.arr" :ref="sub.name" :key="i" @click="selectItem(item,sub,i)">
          {{ sub.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      id: String
    },
    data() {
      return {
        list: [{
            title: "品类",
            key: "ironTypes",
            arr: [],
            api: this.api.findAllIronType
          },
          {
            title: "材质",
            key: "materials",
            arr: [],
            api: this.api.findAllMaterial
          },
          {
            title: "表面",
            key: "surfaces",
            arr: [],
            api: this.api.findAllSurface
          },
          {
            title: "产地",
            key: "proPlaces",
            arr: [],
            api: this.api.findAllProPlace
          }
        ],
        apiData: {
          materials: [],
          ironTypes: [],
          proPlaces: [],
          surfaces: []
        }
      };
    },
    computed: {
      checkAll() {
        let arr = [];
        this.list.forEach(el => {
          let check = true;
          el.arr.forEach(sub => {
            if (!sub.isCheck) {
              check = false;
              return false;
            }
          });
          arr.push(check);
        });
        return arr;
      }
    },
    methods: {
      init() {
        // 获取基础数据
        this.$http
          .all([
            this.$http.get(this.list[0].api),
            this.$http.get(this.list[1].api),
            this.$http.get(this.list[2].api),
            this.$http.get(this.list[3].api)
          ])
          .then(res => {
            this.list.forEach((el, index) => {
              let data = res[index].data;
              if (res[index].code === 1000) {
                var obj = {};
                let newArr = [];
                for (var i = 0; i < data.length; i++) {
                  newArr.push({
                    name: data[i],
                    isCheck: false
                  });
                }
                el.arr = newArr;
              }
            });
            this.getUserData(res);
          });
      },
      getUserData() {
        this.$http.post(this.api.findDataList, {
          buserId: this.id
        }).then(res => {
          if (res.code === 1000) {
            // 用户没有设置过，默认所有都选择
            if(res.data.ironType !=''){
                var obj = {};
                let newArr = [];
                for (var i = 0; i < res.data.ironType.length; i++) {
                  newArr.push({
                    name: res.data.ironType[i],
                  });
                }
                this.apiData.ironTypes = newArr;
            }
            if(res.data.surface !=''){
                var obj = {};
                let newArr = [];
                for (var i = 0; i < res.data.surface.length; i++) {
                  newArr.push({
                    name: res.data.surface[i],
                  });
                }
                this.apiData.surfaces = newArr;
            }
            if(res.data.material !=''){
                var obj = {};
                let newArr = [];
                for (var i = 0; i < res.data.material.length; i++) {
                  newArr.push({
                    name: res.data.material[i],
                  });
                }
                this.apiData.materials = newArr;
            }
            if(res.data.proPlace !=''){
                var obj = {};
                let newArr = [];
                for (var i = 0; i < res.data.proPlace.length; i++) {
                  newArr.push({
                    name: res.data.proPlace[i],
                  });
                }
                this.apiData.proPlaces = newArr;
            }
            // if (!_.isEmpty(res.data))
            //   this.apiData = {
            //     ironTypes: res.data.ironType != '' ? res.data.ironType : [],
            //     surfaces: res.data.surface != '' ? res.data.surface : [],
            //     materials: res.data.material != '' ? res.data.material : [],
            //     proPlaces: res.data.proPlace != '' ? res.data.proPlace : []
            //   };
            this.setClass();
          }
        })
      },
      // 选择操作
      selectItem(item, sub, i) {
        if (sub.isCheck) {
          _.remove(this.apiData[item.key], n => {
            return n.name == item.arr[i].name;
          });
        } else {
          this.apiData[item.key].push(sub);
        }
        sub.isCheck = !sub.isCheck;
      },
      // 全选
      setCheckAll(i) {
        let isCheck = this.checkAll[i];
        if (isCheck) {
          this.apiData[this.list[i].key] = [];
          this.list[i].arr.forEach(el => {
            el.isCheck = false;
          });
        } else {
          this.apiData[this.list[i].key] = [];
          let data = _.cloneDeep(this.list[i].arr);
          data.forEach(el => {
            this.apiData[this.list[i].key].push({
              name: el.name,
              isCheck: true
            });
          });
        }
        this.setClass();
      },
      // 设置高亮
      setClass() {
        this.list.forEach(el => {
          el.arr.forEach(subEl => {
            this.apiData[el.key].forEach(inEl => {
              if (subEl.name == inEl.name) {
                subEl.isCheck = true;
              }
            });
          });
        });
      },
      // 保存分类数据
      saveBaseData() {
        let params = this.$clearData(this.apiData);
        _.forEach(params, (n, key) => {
          let arr = []
          if(n){
            n.forEach(el => {
              arr.push(el.name)
            })
          }
          params[key] = JSON.stringify(arr);
        })
        params.buserId = this.id;
        this.$http.post(this.api.saveBaseData, params).then(res => {
          if (res.code === 1000) {
            this.$Message.success('已保存！');
          } else {
            this.$Message.error(res.message)
          }
        })
      }
    },
    created() {
      this.init();
    }
  };
</script>

<style lang='less' scoped>
  .scope-container {
    width: 100%;
    background-color: #fff;
    .tit {
      position: relative;
      width: 100%;
      height: 30px;
      .btn {
        position: absolute;
        display: inline-block;
        width: 80px;
        height: 30px;
        right: 0;
        top: -10px;
        line-height: 30px;
        text-align: center;
        border: 1px solid blue;
        color: blue;
        // .borderRadius;
        // .ellipsis;
        &:active {
          // background-color: @mask_blue;
          color: #fff;
        }
      }
    }
    .group {
      width: 100%;
      margin-top: 20px;
      padding: 0 10px;
      .head {
        position: relative;
        width: 100%;
        height: 18px;
        font-weight: bold;
        a {
          position: absolute;
          right: 0;
          color: #666;
          cursor: pointer;
        }
        .iconfont {
          margin-right: 5px;
          color: #666;
          &.all-checked {
            color: #2d8cf0;
          }
        }
      }
      .item-content {
        .item {
          position: relative;
          display: inline-block;
          margin: 10px 10px 0 0;
          padding: 5px 10px;
          height: 30px;
          line-height: 20px;
          background-color: #e6e6e6;
          color: #333;
          cursor: pointer;
          border-radius: 4px;
          .iconfont {
            font-size: 14px;
          }
          .icon-duihao {
            display: none;
          }
          &.selected {
            background-color: #2d8cf0;
            color: #fff;
            .icon-jiahao {
              display: none;
            }
            .icon-duihao {
              display: inline-block;
            }
          }
        }
      }
    }
  }
</style>