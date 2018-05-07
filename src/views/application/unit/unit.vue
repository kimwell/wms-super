<template>
    <div class="unit">
        <Card :bordered="false" class="card">
            <p slot="title">计量单位管理</p>
            <Button slot="extra" size="small" type="success" @click="openModel(false)">新增计量单位</Button>
            <div class="card-contnet">
                <div class="table-contnet">
                    <Row class-name="head">
                        <Col class-name="col" span="7">单位种类</Col>
                        <Col class-name="col" span="7">单位名称（中文）</Col>
                        <Col class-name="col" span="7">单位名称（英文）</Col>
                        <Col class-name="col" span="3">操作</Col>
                    </Row>
                    <Row v-for="(item,index) in list" :key="item.id">
                        <Col class-name="col" span="7">{{ item.type == '1' ? '重量' : '数量' }}</Col>
                        <Col class-name="col" span="7">{{ item.cName }}</Col>
                        <Col class-name="col" span="7">{{ item.eName }}</Col>
                        <Col class-name="col" span="3">
                        <Button size="small" type="warning" @click="openModel(true,item)">编辑</Button>
                        <Button size="small" type="error" @click="deleteItem(item)">删除</Button>
                        </Col>
                    </Row>
                    <Row v-if="list.length == 0">
                        <Col class-name="col" span="24">暂无数据</Col>
                    </Row>
                </div>
                <Page class="page-count" size="small" :total="totalCount" :page-size="listApi.pageSize" @on-change="changePage"></Page>
            </div>
        </Card>
    
        <Modal v-model="show" :title="isEdit?'编辑计量单位':' 添加计量单位'" :closable="false" :mask-closable="false">
            <Form :label-width="80" ref="unit" :model="unitApi" :rules="rules">
                <FormItem label="种类" prop="type">
                    <Select v-model="unitApi.type" size="small" style="width:100px"><Option v-for="(sub,i) in options" :key="i" :value="sub.val">{{ sub.label }}</Option></Select>
                </FormItem>
                <FormItem label="中文单位" prop="cName">
                    <Input type="text" v-model="unitApi.cName" size="small" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="英文单位" prop="eName">
                    <Input type="text" v-model="unitApi.eName" size="small" placeholder="请输入..."></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="onClose">取消</Button>
                <Button type="primary" @click="handleSubmit('unit')" :loading="loading">{{ isEdit ? '编辑' : '添加' }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                loading: false,
                show: false,
                isEdit: false,
                editItem: {},
                unitApi: {
                    type: '1',
                    cName: '',
                    eName: ''
                },
                rules: {
                    eName: [{
                        required: true,
                        message: '英文单位不能为空',
                        trigger: 'blur'
                    }],
                    cName: [{
                        required: true,
                        message: '中文单位不能为空',
                        trigger: 'blur'
                    }],
                    type: [{
                        required: true,
                        message: '请选择种类',
                        trigger: 'change'
                    }],
                },
                listApi: {
                    currentPage: 1,
                    pageSize: 10,
                },
                list: [],
                totalCount: 0,
                options: [{
                    val: '1',
                    label: '重量'
                }, {
                    val: '2',
                    label: '数量'
                }]
            }
        },
        methods: {
            // 分页
            changePage(page) {
                this.listApi.currentPage = page;
                this.getUnits();
            },
            // 打开面板
            openModel(isEdit, item) {
                this.isEdit = isEdit;
                if (isEdit) {
                    this.editItem = item || {};
                    this.unitApi = {
                        type: item.type,
                        cName: item.eName,
                        eName: item.cName
                    }
                } else {
                    this.unitApi = {
                        type: '1',
                        cName: '',
                        eName: ''
                    }
                }
                this.show = true;
            },
            // 关闭面板
            onClose() {
                this.show = false;
            },
            // 删除单位
            deleteItem(item) {
                this.$Modal.confirm({
                    title: ' 删除提示！',
                    content: '删除后无法撤销，是否继续？',
                    onOk: () => {
                        let params = {
                            id: item.id,
                            status: 0
                        }
                        this.$http.post(this.api.updateUnit, params).then(res => {
                            if (res.code === 1000) {
                                this.$Message.success('删除成功！');
                                this.getUnits();
                            } else {
                                this.$Message.error('删除失败！');
                            }
                        })
                    }
                })
            },
            // 提交表单添加、编辑
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = JSON.parse(JSON.stringify(this.unitApi));
                        if (this.isEdit) {
                            params.id = this.editItem.id;
                            params.status = this.editItem.status;
                        }
                        let apiUrl = this.isEdit ? this.api.updateUnit : this.api.addUnit
                        this.$http.post(apiUrl, params).then(res => {
                            if (res.code === 1000) {
                                this.getUnits();
                                this.$Message.success('操作成功！');
                            } else {
                                this.$Message.error('操作失败！');
                            }
                            this.loading = false;
                            this.show = false;
                        })
    
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            // 获取基本计量单位列表
            getUnits() {
                this.$http.post(this.api.getAllUnits, {
                    currentPage: this.listApi.currentPage,
                    pageSize: this.listApi.pageSize
                }).then(res => {
                    if (res.code === 1000) {
                        this.list = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }
                })
            },
        },
        created() {
            this.getUnits();
        }
    }
</script>

<style lang="less" scoped>
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
                border-right: 1px solid #d0d0d0;
                border-bottom: 1px solid #d0d0d0;
            }
        }
        .page-count {
            position: absolute;
            right: 0;
            bottom: 0;
        }
    }
</style>
