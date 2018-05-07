<template>
    <div class="relation-container">
        <div class="head">现货求购推荐配置</div>
        <div class="group-content">
            <div class="contnet">
                <div class="group-item" :class="{'active':activeGroupIndex === index}" v-for="(item,index) in groups" :key="index" @click="selectGroup(index)">{{ `${item.ironTypeName} & ${item.surfaceName}` }}</div>
            </div>
            <div class="add">
                <Button type="primary" size="small" @click="groupShow = true">添加分组</Button>
            </div>
        </div>
        <div class="gg-content">
            <div class="head">
                {{ activeGroup.ironTypeName }} & {{ activeGroup.surfaceName }}
                <a class="del" @click="delGroup()">删除本组</a>
            </div>
            <Form inline style="margin:10px">
                <FormItem>
                    <Input type="text" v-model="height" placeholder="厚"></Input>
                </FormItem>
                <FormItem>
                    <Input type="text" v-model="width" placeholder="宽"></Input>
                </FormItem>
                <FormItem>
                    <Input type="text" v-model="length" placeholder="长"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="addGG">添加一条</Button>
                </FormItem>
            </Form>
            <div class="gg-list">
                <p>录入规格:</p>
                <Tag closable color="blue" v-for="(tag,index) in GGlist" :key="index" @on-close="delTag(tag,index)">{{ `${tag.height}*${tag.width}*${tag.length}` }}</Tag>
            </div>
        </div>
        <Modal v-model="groupShow" title="添加关联组">
            <Form :model="groupData" :label-width="80">
                <FormItem label="品类">
                    <Select v-model="groupData.ironType" size="small"><Option v-for="type in ironTypes" :key="type.id" :value="type.id+'+'+type.name">{{ type.name }}</Option></Select>
                </FormItem>
                <FormItem label="表面">
                    <Select v-model="groupData.surFace" size="small"><Option v-for="type in surFaces" :key="type.id" :value="type.id+'+'+type.name">{{ type.name }}</Option></Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="groupShow = false">取消</Button>
                <Button type="primary" @click="addGroup">添加</Button>
            </div>
        </Modal>
    </div>
</template>


<script>
    export default {
        data() {
            return {
                groupShow: false,
                groups: ['不锈钢板&NO.1'],
                GGlist: [],
                groupData: {
                    ironType: '',
                    surFace: ''
                },
                width: '',
                height: '',
                length: '',
                ironTypes: [],
                surFaces: [],
                activeGroupIndex: 0
            }
        },
        computed: {
            groupApiData() {
                return {
                    ironTypeId: this.groupData.ironType.split("+")[0],
                    ironTypeName: this.groupData.ironType.split("+")[1],
                    surfaceId: this.groupData.surFace.split("+")[0],
                    surfaceName: this.groupData.surFace.split("+")[1]
                }
            },
            GGapiData() {
                return {
                    surface: this.activeGroup.surfaceId,
                    ironType: this.activeGroup.ironTypeId
                }
            },
            activeGroup() {
                return this.groups[this.activeGroupIndex] ? this.groups[this.activeGroupIndex] : ''
            },
            addGGApi() {
                return {
                    surface: this.activeGroup.surfaceId,
                    ironType: this.activeGroup.ironTypeId,
                    width: this.width,
                    height: this.height,
                    length: this.length
                }
            }
        },
        methods: {
            addGroup() {
                if (this.groupData.ironType != '' && this.groupData.surFace != '') {
                    this.$http.post(this.api.saveIronAndSurface, this.groupApiData).then(res => {
                        if (res.code === 1000) {
                            this.groupShow = false;
                            this.getGroups();
                        } else {
                            this.$Message.error(res.message)
                        }
                    })
                } else {
                    this.$Message.error('请选择完毕！')
                }
            },
            // 删除分组
            delGroup() {
                this.$Modal.confirm({
                    title: '删除提示！',
                    content: '是否要删除？删除后将无法撤销！',
                    onOk: () => {
                        let params = _.cloneDeep(this.activeGroup);
                        this.$http.post(this.api.delIronAndSurface, {
                            ironTypeId: params.ironTypeId,
                            surfaceId: params.surfaceId
                        }).then(res => {
                            if (res.code === 1000) {
                                this.getGroups();
                                this.$Message.success('分组已删除')
                            } else {
                                this.$Message.error(res.message)
                            }
                        })
                    }
                })
            },
            selectGroup(index) {
                this.resetFrom();
                this.activeGroupIndex = index;
                this.getGGlist();
            },
            // 获取分组列表
            getGroups() {
                this.$http.post(this.api.getIronAndSurface).then(res => {
                    this.groups = res.data;
                    if (res.data.length > 0) {
                        this.getGGlist();
                    }
                })
            },
            // 获取分组下规格信息
            getGGlist() {
                this.$http.post(this.api.getGGlist, this.GGapiData).then(res => {
                    if (res.code === 1000) {
                        this.GGlist = res.data;
                    }
                })
            },
            // 添加规格
            addGG() {
                if (this.width != '' && this.height != '' && this.length != '') {
                    this.$http.post(this.api.addGG, this.addGGApi).then(res => {
                        if (res.code === 1000) {
                            this.resetFrom();
                            this.getGGlist();
                            this.$Message.success('添加成功')
                        } else {
                            this.$Message.error(res.message)
                        }
                    })
                } else {
                    this.$Message.error('请输入正确的信息')
                }
            },
            //删除规格
            delTag(tag) {
                this.$Modal.confirm({
                    title: '删除提示！',
                    content: '是否要删除？删除后将无法撤销！',
                    onOk: () => {
                        let params = _.cloneDeep(tag);
                        params.status = 0;
                        this.$http.post(this.api.delGG, params).then(res => {
                            if (res.code === 1000) {
                                this.getGGlist();
                                this.$Message.success('已删除.')
                            } else {
                                this.$Message.error(res.message)
                            }
                        })
                    }
                })
            },
            resetFrom() {
                this.width = '';
                this.length = '';
                this.height = '';
            }
        },
        created() {
            this.$http.post(this.api.G_getTypes).then(res => {
                this.ironTypes = res.data
            })
    
            this.$http.post(this.api.G_getSurFaces).then(res => {
                this.surFaces = res.data
            })
    
            this.getGroups();
    
        }
    }
</script>


<style lang="less" scoped>
    .relation-container {
        position: relative;
        width: 100%;
        min-height: 600px;
        background-color: #fff;
        overflow: hidden;
    }
    
    .head {
        width: 100%;
        text-indent: 20px;
        line-height: 40px;
        border-bottom: 1px solid #ddd;
    }
    
    .group-content {
        position: absolute;
        width: 200px;
        border-right: 1px solid #ddd;
        .add {
            width: 100%;
            height: 30px;
            text-align: center;
            margin-top: 10px;
        }
        .group-item {
            width: 100%;
            height: 40px;
            line-height: 40px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            cursor: pointer;
            &.active,
            &:hover {
                background-color: #007de4;
                color: #fff;
            }
        }
    }
    
    .gg-content {
        width: 100%;
        padding-left: 200px;
        .head {
            height: 50px;
            line-height: 50px;
            color: #000;
            font-size: 14px;
            .del {
                float: right;
                margin-right: 20px;
            }
        }
        .gg-list {
            width: 100%;
            padding: 10px;
        }
    }
</style>
