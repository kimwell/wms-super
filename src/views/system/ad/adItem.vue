<template>
    <div class="upload-1" :style="{width:item.width+'px',height:item.height+'px'}">
        <img :src="item.url === '' ? item.defaultImg : item.url">
        <div class="action-cover" :style="{lineHeight:item.height+ 15 +'px'}">
            <Upload class="btn-grop" :show-upload-list="false" :headers="uplaodHeader" :format="['jpg','jpeg','png','gif']" :max-size="2048" :on-success="uploadSuccess" :action="api.uploadApi">
                <Icon :type="item.url === '' ? 'ios-cloud-upload' : 'ios-loop-strong'"></Icon>
            </Upload>
            <Icon type="trash-a" @click.native="removeImg"></Icon>
        </div>
        <Icon type="close-round" class="remove-item" @click.native="deleteImg"></Icon>
    </div>
</template>

<script>
    export default {
        props: {
            item: {
                type: Object,
                default: function() {
                    return {
                        url: '',
                        goupIndex: 0,
                        itemIndex: 0,
                        width: 100,
                        height: 100,
                        defaultImg: ''
                    }
                }
            }
        },
        computed: {
            //  设置文件上传headers
            uplaodHeader() {
                return {
                    authorization: this.$store.state.authorization,
                    loginId: this.$store.state.loginId
                }
            },
        },
        methods: {
            // 上传成功回调
            uploadSuccess(res) {
                let pres = JSON.parse(res);
                let path = 'http://tbxoss.oss-cn-hangzhou.aliyuncs.com'
                this.item.url = path + pres[0].url;
                this.$emit('on-upload', this.item);
            },
            //删除图片钩子
            deleteImg() {
                this.$emit('on-delete', this.item)
            },
            // 清空图片
            removeImg() {
                this.$emit('on-remove', this.item)
            }
        }
    }
</script>

<style lang="less" scoped>
    .upload-1 {
        position: relative;
        display: inline-block;
        margin-right: 5px;
        color: #fff;
        img {
            position: absolute;
            display: block;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            pointer-events: none;
        }
        .remove-item {
            display: none;
            position: absolute;
            font-size: 12px;
            right: 0;
            top: 0;
            background: red;
            padding: 3px;
            cursor: pointer;
        }
        .action-cover {
            position: absolute;
            display: none;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, .6);
            text-align: center;
            .btn-grop {
                display: inline-block;
                width: 30px;
                height: 30px;
            }
            i {
                color: #fff;
                font-size: 30px;
                cursor: pointer;
                margin: 0 2px;
            }
        }
        &:hover {
            .action-cover,
            .remove-item {
                display: block;
            }
        }
    }
</style>


