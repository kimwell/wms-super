<template>
    <div class="unit">
        <Card :bordered="false" class="card">
            <p slot="title">现货求购单位管理</p>
            <div class="card-contnet">
                <div class="table-contnet">
                    <Row class-name="head">
                        <Col class-name="col" span="7">求购品类</Col>
                        <Col class-name="col" span="7">数量（中文）</Col>
                        <Col class-name="col" span="7">重量（中文）</Col>
                        <Col class-name="col" span="3">操作</Col>
                    </Row>
                    <Row v-for="(item,index) in list" :key="item.id">
                        <Col class-name="col" span="7">{{ item.ironName }}</Col>
                        <Col class-name="col" span="7">{{ item.numUnitCName }}</Col>
                        <Col class-name="col" span="7">{{ item.weightUnitCName }}</Col>
                        <Col class-name="col" span="3">
                        <Button size="small" type="warning" @click="openModel(item)">编辑</Button>
                        </Col>
                    </Row>
                    <Row v-if="list.length == 0">
                        <Col class-name="col" span="24">暂无数据</Col>
                    </Row>
                </div>
                <Page class="page-count" size="small" :total="totalCount" :page-size="listApi.pageSize" @on-change="changePage"></Page>
            </div>
        </Card>
    
        <Modal v-model="show" title="编辑品类绑定计量单位" :closable="false" :mask-closable="false">
            <Form :label-width="80" ref="ironUnit" :model="dataApi" :rules="rules">
                <FormItem label="品类" prop="ironId">
                    <Select v-model="dataApi.ironId" size="small" style="width:200px"><Option v-for="type in ironTypes" :key="type.id" :value="type.id">{{ type.name }}</Option></Select>
                </FormItem>
                <FormItem label="数量单位">
                    <Select v-model="dataApi.numUnitId" size="small" style="width:200px"><Option v-for="type in numberUnits" :key="type.id" :value="type.id">{{ type.cName }}</Option></Select>
                </FormItem>
                <FormItem label="重量单位">
                    <Select v-model="dataApi.weightUnitId" size="small" style="width:200px"><Option v-for="type in weightUnits" :key="type.id" :value="type.id">{{ type.cName }}</Option></Select>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="show = false">取消</Button>
                <Button type="primary" :loading="loading" @click="edit">编辑</Button>
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
                dataApi: {
                    id: '',
                    ironId: '',
                    ironName: '',
                    weightUnitId: '',
                    weightUnitCName: '',
                    weightUnitEName: '',
                    numUnitId: '',
                    numUnitCName: '',
                    numUnitEName: ''
                },
                rules: {
                    ironId: [{
                        required: true,
                        message: '请选择品类',
                        trigger: 'change'
                    }],
                    numUnitId: [{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }],
                    weightUnitId: [{
                        required: true,
                        message: '请选择',
                        trigger: 'change'
                    }],
                },
                listApi: {
                    currentPage: 1,
                    pageSize: 10,
                },
                list: [],
                totalCount: 0,
                ironTypes: [],
                numberUnits: [],
                weightUnits: []
            }
        },
        watch: {
            'dataApi.ironId': {
                handler: function(nowVal, oldVal) {
                    let type = this.ironTypes.find(val => {
                        return val.id == nowVal
                    })
                    this.dataApi.ironName = type.name;
                }
            },
            'dataApi.numUnitId': {
                handler: function(nowVal, oldVal) {
                    let type = this.numberUnits.find(val => {
                        return val.id == nowVal
                    })
                    this.dataApi.numUnitCName = type.cName;
                    this.dataApi.numUnitEName = type.eName;
                }
            },
            'dataApi.weightUnitId': {
                handler: function(nowVal, oldVal) {
                    let type = this.weightUnits.find(val => {
                        return val.id == nowVal
                    })
                    this.dataApi.weightUnitCName = type.cName;
                    this.dataApi.weightUnitEName = type.eName;
                }
            }
        },
        methods: {
            // 分页
            changePage(page) {
                this.listApi.currentPage = page;
                this.getIronUnit();
            },
            // 打开面板
            openModel(item) {
                // console.log(item)
                this.dataApi = {
                    id: item.id,
                    ironId: item.ironId,
                    ironName: item.ironName,
                    weightUnitId: item.weightUnitId,
                    weightUnitCName: item.weightUnitCName,
                    weightUnitEName: item.weightUnitEName,
                    numUnitId: item.numUnitId,
                    numUnitCName: item.numUnitCName,
                    numUnitEName: item.numUnitEName
                }
                this.show = true;
            },
            // 获取基本计量单位列表
            getIronUnit() {
                this.$http.post(this.api.getAllIronUnit, {
                    currentPage: this.listApi.currentPage,
                    pageSize: this.listApi.pageSize
                }).then(res => {
                    if (res.code === 1000) {
                        this.list = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }
                })
            },
            // 获取品类数据
            getIronTypes() {
                this.$http.post(this.api.G_getTypes).then(res => {
                    if (res.code === 1000) {
                        Object.keys(res.data).forEach(key => {
                            this.ironTypes.push(res.data[key])
                        })
                    }
                })
            },
            // 获取计量单位数据
            getUnits() {
                this.$http.post(this.api.G_getAllUnits).then(res => {
                    if (res.code === 1000) {
                        Object.keys(res.data).forEach(key => {
                            let item = res.data[key];
                            if (item.type == 1) {
                                this.weightUnits.push(item)
                            } else {
                                this.numberUnits.push(item)
                            }
                        })
                    }
                })
            },
            edit() {
                this.$refs.ironUnit.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = JSON.parse(JSON.stringify(this.dataApi));
                        this.$http.post(this.api.updateIronUnit, params).then(res => {
                            if (res.code === 1000) {
                                this.getIronUnit();
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
            }
        },
        created() {
            this.getIronUnit();
            this.getIronTypes();
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
