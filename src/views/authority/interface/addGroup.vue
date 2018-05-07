<template>
    <Modal v-model="show.is" width="400" title="添加接口分组" @on-cancel="resetData">
        <Form ref="interfaceGroup" :model="apiData" :rules="ruleValidate">
            <FormItem label="接口名：" prop="name">
                <Input v-model="apiData.name" placeholder="请输入"></Input>
            </FormItem>
        </Form>
        <div slot="footer">
            <Button type="primary" :loading="loading" @click="ok">
                <span v-if="!loading">添加</span>
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
            }
        },
        data() {
            return {
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
                }
            }
        },
        methods: {
            ok() {
                this.loading = true;
                this.$refs.interfaceGroup.validate((valid) => {
                    if (valid) {
                        this.$http.post(this.api.addInterfaceGroup,this.apiData).then(res => {
                            if(res.code === 1000){
                                this.$emit('on-added',res.data)
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
                    name: ""
                }
                this.$refs.interfaceGroup.resetFields();
            }
        }
    }
</script>

<style lang="less" scoped>
    .iconfont {
        font-size: 12px;
    }
</style>

