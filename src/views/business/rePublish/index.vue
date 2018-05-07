<template>
    <div>
        <Row style="height:40px;line-height:40px">
            <Col span="4">
                <Select v-model="user" filterable remote :remote-method="remoteMethod1" :loading="loading">
                    <Option v-for="(option, index) in options" :value="`${option.id}-${option.companyName}`" :key="index" :label="option.companyName"></Option>
                </Select>
            </Col>
            <Col span="2">&nbsp;</Col>
            <Col span="6" v-if="showPanel">
                已选中:  {{ splitUser[1] }}
            </Col>
        </Row>
    
        <publish :id="splitUser[0]" v-if="showPanel"></publish>
        <Row v-if="!showPanel">请先输入公司名称并选中需要代发求购的公司</Row>
    </div>
</template>

<script>
    import publish from '@/components/business/publish/batchRelease.vue'
    export default {
        components: {
            publish
        },
        data() {
            return {
                loading: false,
                shopDone: false,
                user: '',
                options: []
            }
        },
        computed: {
            splitUser() {
                return this.user.split('-')
            },
            showPanel() {
                return this.splitUser.length > 1 && this.splitUser[0] != ''
            }
        },
        methods: {
            remoteMethod1(query) {
                if (query !== '') {
                    this.loading = true;
                    this.$http.post(this.api.isShop, {
                        name: query
                    }).then(res => {
                        this.loading = false;
                        this.options = res.data
                    })
                } else {
                    this.options1 = [];
                }
            }
        }
    }
</script>

