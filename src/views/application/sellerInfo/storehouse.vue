<template>
    <div class="panel">
        <Card :bordered="false" class="card">
            <p slot="title">仓库信息管理</p>
            <Button slot="extra" size="small" type="success" @click="openModel(false)">新增仓库信息</Button>
            <div class="card-contnet">
                <div class="table-contnet">
                    <Row class-name="head">
                        <Col class-name="col" span="7">仓库名称</Col>
                        <Col class-name="col" span="7">所在省市区</Col>
                        <Col class-name="col" span="7">备注</Col>
                        <Col class-name="col" span="3">操作</Col>
                    </Row>
                    <Row v-for="(item,index) in list" :key="item.id">
                        <Col class-name="col" span="7">{{ item.name }}</Col>
                        <Col class-name="col" span="7">{{ item.provinceName }}{{ item.cityName }}</Col>
                        <Col class-name="col" span="7">{{ item.notice }}</Col>
                        <Col class-name="col" span="3">
                        <Button size="small" type="warning" @click="openModel(true,item)">编辑</Button>
                        <Button size="small" type="error" @click="deleteItem(item)">删除</Button>
                        </Col>
                    </Row>
                    <Row v-if="list.length == 0">
                        <Col class-name="col" span="24">暂无数据</Col>
                    </Row>
                </div>
                <Page class="page-count" size="small" :total="totalCount" :page-size="apiData.pageSize" @on-change="changePage"></Page>
            </div>
        </Card>
    
        <Modal v-model="show" :title="isEdit?`编辑${title}数据`:`添加${title}数据`" :closable="false" :mask-closable="false">
            <Form :label-width="80" :ref="ref" :model="itemApi" :rules="rules">
                <FormItem :label="`${title}名称`" prop="name">
                    <Input type="text" v-model="itemApi.name" size="small" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem :label="`${title}地址`" prop="cityId" style="position:relative">
                    <City ref="city" @on-pick="selectCity" :value="placeHolder"></City>
                </FormItem>
                <FormItem :label="`备注`">
                    <Input type="text" v-model="itemApi.notice" size="small" placeholder="请输入..."></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button @click="show = false">取消</Button>
                <Button type="primary" @click="handleSubmit" :loading="loading">{{ isEdit ? '编辑' : '添加' }}</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import City from '@/components/basics/adress/citySelect'
    
    export default {
        components: {
            City
        },
        props: {
            title: String,
        },
        data() {
            return {
                ref: 'form' + new Date().getTime(),
                show: false,
                isEdit: false,
                loading: false,
                editItem: {},
                apiData: {
                    currentPage: 1,
                    pageSize: 10
                },
                itemApi: {
                    name: '',
                    notice: '',
                    provinceId: '',
                    provinceName: '',
                    cityId: '',
                    cityName: ''
                },
                rules: {
                    name: [{
                        required: true,
                        message: '姓名不能为空',
                        trigger: 'blur'
                    }],
                    cityId: [{
                        required: true,
                        message: '必须选择地址'
                    }],
                },
                totalCount: 0,
                list: []
            }
        },
        computed: {
          placeHolder(){
              return this.itemApi.provinceName != '' ? this.itemApi.provinceName+' / '+this.itemApi.cityName : '请选择地区'
          }  
        },
        methods: {
            // 获取数据列表
            getList() {
                this.$http.post(this.api.getHouse, this.apiData).then(res => {
                    if (res.code === 1000) {
                        this.list = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }
                })
            },
            changePage(page) {
                this.apiData.currentPage = page;
                this.getList();
            },
            // 打开面板
            openModel(isEdit, item) {
                this.$refs.city.init();
                this.isEdit = isEdit;
                if (isEdit) {
                    this.editItem = item || {};
                    this.itemApi = {
                        name: item.name,
                        notice: item.notice,
                        provinceId: item.provinceId,
                        provinceName: item.provinceName,
                        cityId: item.cityId,
                        cityName: item.cityName
                    }
                } else {
                    this.itemApi = {
                        name: '',
                        notice: '',
                        provinceId: '',
                        provinceName: '',
                        cityId: '',
                        cityName: ''
                    }
                }
                this.show = true;
            },
            // 删除单位
            deleteItem(item) {
                this.$Modal.confirm({
                    title: ' 删除提示！',
                    content: '删除后无法撤销，是否继续？',
                    onOk: () => {
                        let params = {
                            id: item.id
                        }
                        this.$http.post(this.api.deleteStoreHouse, params).then(res => {
                            if (res.code === 1000) {
                                this.$Message.success('删除成功！');
                                //  删除当前页最后一条数据时，返回上一分页
                                if (this.list.length == 1) {
                                    if (this.apiData.currentPage != 1)
                                        this.apiData.currentPage = this.apiData.currentPage - 1
                                    this.getList();
                                } else {
                                    this.getList();
                                }
                            } else {
                                this.$Message.error('删除失败！');
                            }
                        })
                    }
                })
            },
            // 提交表单添加、编辑
            handleSubmit() {
                this.$refs[this.ref].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        let params = JSON.parse(JSON.stringify(this.itemApi));
                        if (this.isEdit) {
                            params.id = this.editItem.id;
                        }
                        let apiUrl = this.isEdit ? this.api.updateStoreHouse : this.api.saveStoreHouse
                        this.$http.post(apiUrl, params).then(res => {
                            if (res.code === 1000) {
                                this.getList();
                                this.$Message.success('操作成功！');
                                this.show = false;
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false;
                        })
    
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            // 选择城市
            selectCity(data) {
                this.itemApi.cityId = data.cityId;
                this.itemApi.cityName = data.cityName;
                this.itemApi.provinceId = data.provinceId;
                this.itemApi.provinceName = data.provinceName;
            }
        },
        created() {
            this.getList();
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