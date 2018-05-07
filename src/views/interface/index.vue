<template>
    <div class="interface-container">
        <div class="group-content">
            <div class="group-head">
                接口分组
                <Button size="small" class="add" type="primary" @click.native="groupShow.is = true"><Icon type="plus-circled"></Icon>添加分组</Button>
            </div>
            <transition-group enter-active-class="animated zoomInLeft" leave-active-class="animated zoomOutRight">
                <div class="group-item" v-for="(panel,index) in groupList" :key="panel.groupId" :class="{'active':activeGroup === index}" @click="selectGroup(index)">
                    <div class="head">
                        {{ panel.groupName }}
                        <Icon type="close-round" @click.native.self="delGroup(index,panel.groupId)"></Icon>
                    </div>
                    <div class="interface-group clearfix">
                        <transition-group enter-active-class="animated zoomInRight" leave-active-class="animated zoomOutRight">
                            <div class="interface-item-small" :class="'status-'+inter.methodType" v-for="(inter,i) in panel.interfaceList" :key="inter.id">
                                <span class="iconfont icon" :class="inter.methodType | toIcon"></span> {{inter.name}}
                                <a class="cover"></a>
                                <a class="del">
                                    <span class="iconfont icon-bianji" style="color:orange" @click="editInterface(inter,i,false)"></span>
                                    <span class="iconfont icon-49jiantouyoubian" style="color:#007de4" @click="unBlind(index,i)"></span>
                                </a>
                            </div>
                        </transition-group>
                    </div>
                </div>
            </transition-group>
        </div>
        <div class="interface-content">
            <div class="head">
                接口池
                <Button size="small" class="add" type="primary" @click.native="inerfaceShow.is = true;editInter = {}"><Icon type="plus-circled"></Icon>添加接口</Button>
                <Button size="small" class="save" type="primary" @click.native="saveGroup"><Icon type="android-list"></Icon>保存</Button>
            </div>
            <div class="pool">
                <transition-group enter-active-class="animated bounceIn" leave-active-class="animated bounceOut">
                    <Tooltip placement="top" v-for="(item,index) in poolList" :key="item.id" :delay="1000">
                        <div class="item noselect" :class="'status-'+item.methodType">
                            <div class="title">
                                <span class="iconfont" :class="item.methodType | toIcon"></span> {{item.name}}
                            </div>
                            <div class="foot" style="background-color:#fff">
                                <a><span class="iconfont icon-50jiantouzuobian" style="color:#007de4" @click="bindingGroup(index)"></span></a>
                                <a><span class="iconfont icon-bianji" style="color:orange" @click="editInterface(item,index,true)"></span></a>
                                <a><span class="iconfont icon-iconfont" style="color:red" @click="delInterface(item.id,index)"></span></a>
                            </div>
                        </div>
                        <div slot="content">
                            <p>接口名称：{{ item.name }}</p>
                            <p>接口地址：{{ item.url }}</p>
                        </div>
                    </Tooltip>
                </transition-group>
            </div>
        </div>
        <addInterface :show="inerfaceShow" :inter="editInter" @on-added="reflashPool"></addInterface>
        <addGroup :show="groupShow" @on-added="reflashGroup"></addGroup>
    </div>
</template>

<script>
    import addInterface from './addInterface.vue'
    import addGroup from './addGroup.vue'
    export default {
        components: {
            addInterface,
            addGroup
        },
        data() {
            return {
                loadingText: '数据加载中',
                inerfaceShow: {
                    is: false
                },
                groupShow: {
                    is: false
                },
                poolList: [],
                groupList: [],
                activeGroup: 0,
                editInter: {}
            }
        },
        methods: {
            //接口绑定分组
            bindingGroup(index) {
                // 如果存在分组
                if (this.groupList.length > 0) {
                    // 接口信息
                    let interfaceData = JSON.parse(JSON.stringify(this.poolList[index]));
                    // 从pool里移除，加入group
                    this.poolList.splice(index, 1);
                    // 当前选中group
                    this.groupList[this.activeGroup].interfaceList.push(interfaceData);
                } else {
                    this.$Message.warning('请先建立接口分组')
                }
            },
            //解除绑定
            unBlind(parent, child) {
                this.activeGroup = parent;
                let interfaceData = JSON.parse(JSON.stringify(this.groupList[this.activeGroup].interfaceList[child]));
                this.groupList[this.activeGroup].interfaceList.splice(child, 1);
                this.poolList.push(interfaceData);
            },
            // 删除接口
            delInterface(id, index) {
                this.$Modal.confirm({
                    title: '删除确认',
                    content: '此操作将无法撤销,是否继续？',
                    loading: true,
                    onOk: () => {
                        this.$http.post(this.api.delInterface, {
                            id: id
                        }).then(res => {
                            this.$Modal.remove();
                            if (res.code === 1000) {
                                this.poolList.splice(index, 1);
                                this.$Message.success('已删除!');
                            } else {
                                this.$Message.error('删除失败!');
                            }
                        })
                    }
                })
            },
            // 删除分组
            delGroup(index, groupId) {
                this.$Modal.confirm({
                    title: '删除确认',
                    content: '此操作将无法撤销,是否继续？',
                    loading: true,
                    onOk: () => {
                        this.$http.post(this.api.delInterfaceGroup, {
                            groupId: groupId
                        }).then(res => {
                            this.$Modal.remove();
                            if (res.code === 1000) {
                                // 获取操作group数据
                                let group = JSON.parse(JSON.stringify(this.groupList[index]));
                                this.groupList.splice(index, 1);
                                this.poolList.push(...group.interfaceList);
                                this.activeGroup = 0;
                                this.$Message.success('已删除!');
                            } else {
                                this.$Message.error('删除失败!');
                            }
                        })
                    }
                });
            },
            //编辑接口inter:接口数据，index接口下标,isPool是在池中还是分组中
            editInterface(inter, index, isPool) {
                this.editInter = {
                    index: index,
                    isPool: isPool,
                    data: inter
                }
                this.inerfaceShow.is = true;
            },
            // 选择接口组
            selectGroup(index) {
                this.activeGroup = index;
            },
            // 刷新接口池
            reflashPool(data) {
                // 如果是编辑，更新接口，如果不是，添加接口
                if (this.editInter.index != undefined) {
                    // 更新池中的接口还是组中的接口
                    if (this.editInter.isPool) {
                        let inter = this.poolList[this.editInter.index];
                        Object.keys(inter).forEach(key => {
                            inter[key] = this.editInter.data[key];
                        })
                    } else {
                        let inter = this.groupList[this.activeGroup].interfaceList[this.editInter.index];
                        Object.keys(inter).forEach(key => {
                            inter[key] = this.editInter.data[key];
                        })
                    }
                } else {
                    this.poolList.push(data);
                }
            },
            // 刷新组列表
            reflashGroup(data) {
                this.groupList.push(data);
            },
            //接口分组绑定
            saveGroup() {
                this.loadingText = '保存中';
                let jsonObject = {
                    groupList: this.groupList,
                    defaultList: this.poolList
                }
                this.$http.post(this.api.interfaceBlindGroup, {
                    jsonObject: JSON.stringify(jsonObject)
                }).then(res => {
                    if (res.code === 1000) {
                        this.$Message.success('保存成功!');
                    } else {
                        this.$Message.error('保存失败!');
                    }
                })
            },
            // 获取接口列表
            getPoolList() {
                this.$http.post(this.api.getInterfaceList).then(res => {
                    if (res.code === 1000) {
                        this.poolList = res.data.interfaceList;
                        this.groupList = res.data.groupList;
                    }
                })
            }
        },
        created() {
            this.getPoolList();
        }
    }
</script>

<style lang="less" scoped>
    .interface-container {
        position: relative;
        width: 100%;
        height: 100%;
        .group-content {
            position: absolute;
            width: 350px;
            height: auto;
            min-height: 600px;
            left: 0;
            background-color: #fff;
            // overflow-x: hidden;
            .group-head {
                position: relative;
                width: 100%;
                height: 50px;
                line-height: 30px;
                text-align: center;
                padding: 10px;
                font-size: 16px;
                border-bottom: 1px solid #ddd;
                button.add {
                    position: absolute;
                    right: 10px;
                    top: 12px;
                }
            }
            .group-item {
                width: 340px;
                margin: 10px auto;
                border: 1px solid #ddd;
                border-radius: 5px;
                overflow: hidden;
                .head {
                    position: relative;
                    width: 100%;
                    height: 30px;
                    line-height: 30px;
                    background-color: #eee;
                    color: #000;
                    font-size: 14px;
                    font-weight: bold;
                    padding: 0 10px;
                    cursor: pointer;
                    i {
                        position: absolute;
                        display: block;
                        overflow: hidden;
                        width: 0;
                        height: 0;
                        transition: all .3s;
                        top: 15px;
                        right: 24px;
                    }
                    &:hover i {
                        width: 14px;
                        height: 14px;
                        top: 8px;
                        right: 10px;
                    }
                }
                &.active {
                    border-color: #007de4;
                }
                &.active .head {
                    background-color: #007de4;
                    color: #fff;
                    border-color: #fff;
                }
                .interface-group {
                    transition: height .3s;
                    overflow: hidden;
                    .interface-item-small {
                        position: relative;
                        float: left;
                        margin: 5px;
                        height: 30px;
                        line-height: 30px;
                        text-indent: 35px;
                        color: #fff;
                        font-weight: bold;
                        font-size: 14px;
                        border: 1px solid #ddd;
                        border-radius: 5px;
                        padding-right: 30px;
                        overflow: hidden;
                        box-sizing: content-box;
                        cursor: pointer;
                        .icon {
                            position: absolute;
                            text-indent: 0;
                            left: 3px;
                            font-size: 20px;
                        }
                        .del {
                            position: absolute;
                            display: block;
                            text-indent: 0;
                            width: 0;
                            height: 100%;
                            right: 0;
                            top: 0;
                            transition: width .3s;
                            text-align: center;
                            background-color: #fff;
                            overflow: hidden;
                            .iconfont {
                                font-size: 20px;
                                font-weight: bold;
                            }
                        }
                        &:hover .del {
                            width: 55px;
                        }
                        .cover {
                            position: absolute;
                            display: block;
                            width: 0;
                            height: 100%;
                            left: 0;
                            top: 0;
                            transition: width .3s;
                            background-color: #000;
                            opacity: .7;
                        }
                        &:hover .cover {
                            width: calc(~"100% - 55px");
                        }
                    }
                }
                &.active .interface-group {
                    height: auto;
                }
            }
        }
        .interface-content {
            position: relative;
            height: 100%;
            min-height: 600px;
            background-color: #fff;
            padding: 0 20px;
            margin-left: 370px;
            // overflow-x: hidden;
            .head {
                position: relative;
                width: 100%;
                height: 50px;
                line-height: 50px;
                font-size: 20px;
                border-bottom: 1px solid #ddd;
                text-align: center;
                button {
                    position: absolute;
                    top: 10px;
                    &.add {
                        right: 60px;
                    }
                    &.save {
                        right: 0;
                    }
                }
            }
            .pool {
                width: 100%;
                padding: 10px 0;
                .item {
                    position: relative;
                    width: 180px;
                    float: left;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                    margin: 0 10px 10px 0;
                    padding-bottom: 35px;
                    cursor: pointer;
                    overflow: hidden;
                    color: #fff;
                    .title {
                        position: relative;
                        width: 100%;
                        height: 40px;
                        line-height: 40px;
                        font-weight: bold;
                        font-size: 18px;
                        text-indent: 40px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        .iconfont {
                            position: absolute;
                            text-indent: 0;
                            font-size: 38px;
                            left: 0;
                            top: 0;
                        }
                    }
                    .desc {
                        width: 100%;
                        height: 90px;
                        line-height: 20px;
                        padding: 10px;
                        text-indent: 10px;
                    }
                    .foot {
                        position: absolute;
                        width: 100%;
                        height: 30px;
                        line-height: 30px;
                        bottom: 0;
                        left: 0;
                        padding: 0 10px;
                        transition: height .3s;
                        border-top: 1px solid #ddd;
                        text-align: right;
                        .iconfont {
                            font-size: 20px;
                        }
                    }
                    &:hover .foot {
                        height: 30px;
                    }
                }
            }
        }
    }
</style>
