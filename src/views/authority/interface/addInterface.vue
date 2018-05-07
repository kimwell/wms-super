<template>
    <Modal v-model="show.is" width="400" title="添加接口" @on-cancel="resetData">
        <Form ref="formValidate" :model="apiData" :rules="ruleValidate">
            <FormItem label="接口名：" prop="name">
                <Input v-model="apiData.name" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="接口地址：" prop="url">
                <Input v-model="apiData.url" placeholder="请输入"></Input>
            </FormItem>
            <FormItem label="接口类型：">
                <RadioGroup v-model="apiData.methodType">
                    <Radio :label="type.methodType" v-for="type in types" :key="type.methodType">
                        <span class="iconfont" :class="type.icon" :style="{'color':type.color}"></span>
                        <span>{{ type.title }}</span>
                    </Radio>
                </RadioGroup>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" :loading="loading" @click="ok">
                        <span v-if="!loading">{{ isEdit?'编辑':'添加' }}</span>
                        <span v-else>提交中...</span>
                    </Button>
        </div>
    </Modal>
</template>

<script>
    export default {
        props: {
            show: {
                type: Object
            },
            inter: {
                type: Object
            }
        },
        computed: {
            isEdit(){
                return this.inter.index != undefined
            }
        },
        data() {
            return {
                loading: false,
                apiData: {
                    name: "",
                    url: "",
                    methodType: 0
                },
                types: [{
                        methodType: 0,
                        title: '未标识',
                        icon: "icon-weizhi",
                        color: "#c16bd6"
                    },
                    {
                        methodType: 1,
                        title: '查询',
                        icon: "icon-chaxun",
                        color: "#3fa6e3"
                    },
                    {
                        methodType: 2,
                        title: '增加',
                        icon: "icon-zengjia",
                        color: "#66c549"
                    },
                    {
                        methodType: 3,
                        title: '更新',
                        icon: "icon-gengxin",
                        color: "#f89d34"
                    },
                    {
                        methodType: 4,
                        title: '删除',
                        icon: "icon-shanchu",
                        color: "#ff5c55"
                    }
                ],
                ruleValidate: {
                    name: [{
                        required: true,
                        message: '名称不能为空',
                        trigger: 'blur'
                    }],
                    url: [{
                        required: true,
                        message: '接口地址不能为空',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            ok() {
                this.loading = true;
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.$http.post(this.api.addInterface, this.apiData).then(res => {
                            if (res.code === 1000) {
                                // 是否为编辑
                                if (this.isEdit) {
                                    this.inter.data = res.data;
                                    this.$emit('on-added', this.inter.data);
                                } else {
                                    this.$emit('on-added', res.data);
                                }
                                this.$Message.success('提交成功!');
                                this.resetData();
                                this.loading = false;
                                this.show.is = false;
                            }
                        })
                    } else {
                        this.$Message.error('表单验证失败!');
                        this.loading = false;
                    }
                })
            },
            resetData() {
                this.apiData = {
                    name: "",
                    url: "",
                    methodType: 0
                }
                this.$refs.formValidate.resetFields();
            }
        },
        watch: {
            inter(n) {
                // console.log("观察者数据："+inter)
                if (n.index != undefined) {
                    this.apiData = {
                        name: n.data.name,
                        url: n.data.url,
                        methodType: n.data.methodType
                    }
                    this.$set(this.apiData, 'id', n.data.id);
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    .iconfont {
        font-size: 12px;
    }
</style>

