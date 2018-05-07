
<style lang="less" scoped>
    // @import '../../../assets/base.less';
    @bg_color: #edeef2;

//color
@dark_blue:#2856B6;
@light_blue:#2E71F0;
@mask_blue:#609EE9;
@goast_blue:#E8F3FD;
@hover_blue:#517edc;

@dark_red:#FF5555;
@light_red:#FF7A7A;
@goast_red:#FADBDB;

@light_yellow:#FFCB30;
@light_green:#6CBF0D;
@cheng:#F5A623;
@bao:#C16BD6;

// font_color
@f_dark: #3c3d41;
@f_ligth: #757575;
@f_goast: #888888;
@goast_gray:#EEEEEE;

// border_color
@b_gray: #dddddd;
@b_d1: 1px solid #d1d1d1;

.opacity(@factor) {
    @iefactor: @factor*100;
    filter: ~"alpha(opacity=@{iefactor})";
    opacity: @factor;
}

// autofix
.borderRadius(@radius:4px) { 
    -moz-border-radius: @radius; 
    -webkit-border-radius: @radius; 
    border-radius: @radius; 
} 

.ellipsis(){
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
}
.noselect() {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}
    .scope-container {
        width: 100%;
        background-color: #fff;
        padding: 20px;
        .tit {
            position: relative;
            width: 100%;
            height: 30px;
            border-bottom: @b_d1;
            .btn {
                position: absolute;
                display: inline-block;
                width: 80px;
                height: 30px;
                right: 0;
                top: -10px;
                line-height: 30px;
                text-align: center;
                border: 1px solid @mask_blue;
                color: @mask_blue;
                .borderRadius;
                .ellipsis;
                &:active {
                    background-color: @mask_blue;
                    color: #fff;
                }
            }
        }
        .group {
            width: 100%;
            margin-top: 30px;
            padding: 0 10px;
            .head {
                position: relative;
                width: 100%;
                height: 18px;
                a {
                    position: absolute;
                    right: 0;
                    color: @mask_blue;
                    cursor: pointer;
                }
                .iconfont {
                    margin-right: 5px;
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
                    background-color: @goast_gray;
                    color: @f_goast;
                    cursor: pointer;
                    .borderRadius;
                    .noselect;
                    .iconfont {
                        font-size: 14px;
                    }
                    .icon-duihao {
                        display: none;
                    }
                    &:hover {
                        background-color: @mask_blue;
                        color: #fff;
                    }
                    &.selected {
                        background-color: @mask_blue;
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

<template>
    <div class="scope-container">
        <div class="group" v-for="(item,index) in list" :key="index">
            <div class="head">
                {{ item.title }}
                <a @click="setCheckAll(index)"><span class="iconfont" :class="checkAll[index] ? 'icon-checkbox' : 'icon-check-box-outline-blank'" ></span>全选</a>
            </div>
            <div class="item-content clearfix">
                <div class="item" :class="{'selected':sub.isCheck}" v-for="(sub,i) in item.arr" :ref="sub.id" :key="sub.id" @click="selectItem(item,sub,i)">
                    {{ sub.name }}
                    <span class="iconfont icon-jiahao"></span>
                    <span class="iconfont icon-duihao"></span>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        props: {
            id: String,
        },
        data() {
            return {
                list: [{
                    title: '种类',
                    key: 'ironType',
                    arr: [],
                    api: this.api.queryIronTypes
                }, {
                    title: '材质',
                    key: 'material',
                    arr: [],
                    api: this.api.queryMaterials
                }, {
                    title: '表面',
                    key: 'surface',
                    arr: [],
                    api: this.api.querySurFaces
                }, {
                    title: '产地',
                    key: 'proPlace',
                    arr: [],
                    api: this.api.queryPlaces
                }],
                apiData: {
                    ironType: [],
                    material: [],
                    surface: [],
                    proPlace: []
                }
            }
        },
        computed: {
            checkAll() {
                let arr = []
                this.list.forEach(el => {
                    let check = true;
                    el.arr.forEach(sub => {
                        if (!sub.isCheck) {
                            check = false;
                            return false
                        }
                    })
                    arr.push(check)
                })
                return arr
            }
        },
        methods: {
            init() {
                // 获取基础数据
                this.$http.all([
                    this.$http.get(this.list[0].api),
                    this.$http.get(this.list[1].api),
                    this.$http.get(this.list[2].api),
                    this.$http.get(this.list[3].api)
                ]).then(res => {
                    this.list.forEach((el, index) => {
                        let data = res[index].data;
                        if (res[index].code === 1000) {
                            _.map(data, (n) => {
                                return n.isCheck = false
                            });
                            el.arr = data;
                        }
                    });
                    this.getUerScope(res);
                });
            },
            // 获取用户设置的经营范围
            getUerScope(lists) {
                let list = _.cloneDeep(lists);
                this.$http.post(this.api.scopeByUserId,{
                    buserId: this.id
                }).then(res => {
                    if (res.code === 1000) {
                        // 用户没有设置过，默认所有都选择
                        if (!_.isEmpty(res.data))
                            this.apiData = {
                                ironType: res.data.ironType != '' ? res.data.ironType : [],
                                surface: res.data.surface != '' ? res.data.surface : [],
                                material: res.data.material != '' ? res.data.material : [],
                                proPlace: res.data.proPlace != '' ? res.data.proPlace : []
                            };
                        this.setClass();
                    }
                })
            },
            // 选择操作
            selectItem(item, sub, i) {
                if (sub.isCheck) {
                    _.remove(this.apiData[item.key], n => {
                        return n.id == item.arr[i].id;
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
                    })
                } else {
                    this.apiData[this.list[i].key] = [];
                    let data = _.cloneDeep(this.list[i].arr);
                    data.forEach(el => {
                        this.apiData[this.list[i].key].push({
                            id: el.id,
                            name: el.name
                        })
                    })
                }
                this.setClass();
            },
            // 设置高亮
            setClass() {
                this.list.forEach(el => {
                    el.arr.forEach(subEl => {
                        this.apiData[el.key].forEach(inEl => {
                            if (subEl.id == inEl.id) {
                                subEl.isCheck = true;
                            }
                        })
                    })
                });
            },
            // 保存经营范围
            saveScope() {
                let params = this.$clearData(this.apiData);
                _.forEach(params, (n, key) => {
                    params[key] = JSON.stringify(n);
                })
                params.buserId = this.id;
                // this.$spinToggle(true);
                this.$http.post(this.api.saveScopeByUserId, params).then(res => {
                    // this.$spinToggle(false);
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
    }
</script>



