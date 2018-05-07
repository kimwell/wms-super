<template>
    <div class="jurisdiction-container">
        <div class="left-tree">
            <Affix :offset-top="50">
                <ul class="action-btn" :class="{'on':nodeModel}">
                    <!-- <li><a @click='delNode'><span class="iconfont icon-delete"></span></a></li> -->
                    <li><a @click='openEdit(true)'><span class="iconfont icon-bianji"></span></a></li>
                    <li><a @click='openEdit(false)'><span class="iconfont icon-addcontacts"></span></a></li>
                </ul>
            </Affix>
            <ztree :list.sync='ztreeDataSource' :func="nodeClick" :is-open='true'></ztree>
        </div>
        <div class="right-content">
            <interfacePanel @on-item-click="cacheIn" :id="activeRoleId"></interfacePanel>
        </div>
    
        <!-- 角色添加修改面板 -->
        <Modal v-model="rolePanelShow" width="400" :title="roleIsEdit?`编辑<${nodeModel != null ? nodeModel.name : ''}>的信息`:`向角色<${nodeModel != null ? nodeModel.name : ''}>中添加节点`" @on-cancel="resetData">
            <Form ref="roleEdit" :model="apiData" :rules="ruleValidate">
                <FormItem label="角色名称：" prop="name">
                    <Input v-model="apiData.name" placeholder="请输入"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" :loading="loading" @click="addNode"><span v-if="!loading">{{ roleIsEdit ? '编辑' : '添加' }}</span><span v-else>提交中...</span></Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import ztree from '@/components/basics/tree/ztree'
    import interfacePanel from './interfacePanel.vue'
    export default {
        components: {
            ztree,
            interfacePanel
        },
        data() {
            return {
                rolePanelShow: false,
                roleIsEdit: false,
                loading: false,
                apiData: {
                    name: ""
                },
                ruleValidate: {
                    name: [{
                        required: true,
                        message: '名称不能为空',
                        trigger: 'blur'
                    }]
                },
                parentNodeModel: [], //当前点击节点父亲对象
                nodeModel: null, // 当前点击节点对象
                ztreeDataSource: [], //树数据
                cacheArr: [], //待绑定接口ID集合
            }
        },
        computed: {
            activeRoleId() {
                // 当前选中的角色，如果没有选择，默认为当前登录的用户角色
                return {
                    roleId: this.nodeModel != null ? this.nodeModel.id : this.$store.getters.roleId,
                    rolePid: this.nodeModel != null ? this.nodeModel.pid : '-1' //@_@默认pid修改为当前角色的父级，而不是现在的-1
                }
            }
        },
        methods: {
            // 打开添加、编辑面板 false为添加true为编辑
            openEdit(isEdit) {
                // 是否选中节点？
                if (this.nodeModel != null) {
                    this.roleIsEdit = isEdit;
                    if (isEdit) this.apiData.name = this.nodeModel.name;
                    this.rolePanelShow = true;
                }
            },
            // 新增角色
            addNode: function() {
                this.loading = true;
                this.$refs.roleEdit.validate((valid) => {
                    if (valid && this.nodeModel) {
                        this.addRole();
                    } else {
                        this.$Message.error('表单验证失败!');
                        this.loading = false;
                    }
                })
            },
            //重置角色面板数据
            resetData() {
                this.apiData = {
                    name: ""
                }
                this.$refs.roleEdit.resetFields();
            },
            addRole() {
                let apiUrl = this.roleIsEdit ? this.api.editRole : this.api.addRole;
                this.$http.post(apiUrl, {
                    name: this.apiData.name,
                    id: this.nodeModel.id,
                    pid: this.nodeModel.pid
                }).then(res => {
                    if (res.code === 1000) {
                        let data = res.data;
                        if (this.roleIsEdit) {
                            this.nodeModel.name = data.name;
                            this.$Message.success('修改成功！');
                        } else {
                            data.clickNode = false;
                            data.isFolder = false;
                            data.isExpand = false;
                            data.loadNode = 0;
                            this.nodeModel.children.push(data);
                            this.nodeModel.isFolder = true;
                            this.$Message.success('添加成功！');
                        }
                    } else {
                        this.$Message.error('添加失败！');
                    }
                    this.resetData();
                    this.loading = false;
                    this.rolePanelShow = false;
                    this.$Modal.remove();
                })
            },
            // 删除节点
            delNode: function() {
                if (this.nodeModel) {
                    if (this.parentNodeModel.hasOwnProperty("children")) {
                        this.parentNodeModel.children.splice(this.parentNodeModel.children.indexOf(this.nodeModel), 1);
                    } else if (this.parentNodeModel instanceof Array) {
                        // 第一级根节点处理
                        this.parentNodeModel.splice(this.parentNodeModel.indexOf(this.nodeModel), 1);
                    }
                    this.nodeModel = null;
                }
            },
            // 点击节点
            nodeClick: function(m, parent) {
                this.show = !this.show;
                this.nodeModel = m; // 当前点击节点对象
                this.parentNodeModel = parent; //当前点击节点父亲对象
            },
            //获取权限列表
            gettreeData(id) {
                this.$http.post(this.api.getRolesById, {
                    roleId: this.$store.getters.roleId
                }).then(res => {
                    if (res.code === 1000) {
                        let userData = res.data;
                        delete userData.interfaceInfoList;
                        this.ztreeDataSource = [userData];
                    }
                })
            },
            cacheIn(list) {
                let params = {
                    roleId: this.nodeModel.id,
                    interfaceGroupList: list
                }
                params = JSON.stringify(params);
                this.$http.post(this.api.roleBlindInterface, {
                    jsonObject: params
                }).then(res => {
    
                })
            }
        },
        created() {
            this.gettreeData();
        }
    }
</script>


<style lang="less" scoped>
    .jurisdiction-container {
        position: relative;
        width: 100%;
        height: 100%;
        .left-tree {
            position: absolute;
            width: 350px;
            height: 99%;
            left: 0;
            background-color: #fff;
            padding: 10px 20px;
            // overflow-x: hidden;
            .action-btn {
                position: absolute;
                right: 10px;
                .iconfont {
                    font-size: 24px;
                    color: #ddd;
                }
            }
            .on {
                .icon-addcontacts {
                    color: green
                }
                .icon-delete {
                    color: red
                }
                .icon-bianji {
                    color: orange
                }
                .icon-moveup,
                .icon-movedown {
                    color: #007de4;
                }
            }
        }
        .right-content {
            position: relative;
            height: 99%;
            background-color: #fff;
            padding: 10px 20px;
            margin-left: 370px;
            .interface-group {
                margin-bottom: 20px;
                // .item{
                //     width: 80px;
                //     height: 80px;
                // }
            }
        }
    }
</style>

