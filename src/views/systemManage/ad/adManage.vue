<template>
    <div class="ad-container">
        <Card v-for="(item,index) in allAdList" :key="item.groupId" style="margin-bottom:10px">
            <p slot="title">{{ item.groupName }}
                <Icon class="preview" type="eye" @click.native="imgView(item.previewImg)"></Icon>
            </p>
            <div slot="extra" style="margin-top:-4px">
                <!-- <Button type="info" icon="code-download" style="margin-right:10px" @click="testData(item.groupId)">测试</Button> -->
                <Button type="error" icon="trash-a" style="margin-right:10px" @click.native="delGroup(index,item.groupId)">删除</Button>
                <Button type="warning" icon="edit" style="margin-right:10px" @click.native="editGroup(item,index)">编辑</Button>
                <Button type="primary" icon="android-upload" :loading="false" @click.native="undateGroup(item)">保存</Button>
            </div>
            <div class="content">
                <AdItem v-for="(subItem,i) in item.adList" :item="{url:subItem.url,goupIndex: index,itemIndex: i,width: item.width,height: item.height, defaultImg: item.defaultImg,id: subItem.id,groupId: item.groupId}" @on-delete="removeAd" @on-remove="removeAdBg" @on-upload="undateItem"
                    :key="subItem.id"></AdItem>
                <div class="add-one-btn" :style="{height:item.height+'px',lineHeight:item.height +'px'}">
                    <div class="cover">
                        <Button type="primary" icon="plus-round" @click.native="addAd(index,item.groupId)">添加广告位</Button>
                    </div>
                </div>
            </div>
        </Card>
        <Card class="add-ad-group" @click.native="addShow = true">
            <h3>创建广告分组
                <Icon type="android-add"></Icon>
            </h3>
        </Card>
        <!-- 添加、编辑广告分组弹出框 -->
        <Modal v-model="addShow" title="新建分组" width="500" @on-ok="groupAction">
            <Form v-model="groupApiData" :label-width="80">
                <FormItem label="分组名称">
                    <Input v-model="groupApiData.groupName" size="small" placeholder="请输入分组名"></Input>
                </FormItem>
                <FormItem label="广告位宽">
                    <InputNumber :min="1" size="small" v-model="groupApiData.width" placeholder="单位px"></InputNumber>
                    单位px
                </FormItem>
                <FormItem label="广告位高">
                    <InputNumber :min="1" size="small" v-model="groupApiData.height" placeholder="单位px"></InputNumber>
                    单位px
                </FormItem>
                <FormItem label="广告位个数">
                    <InputNumber :min="1" size="small" :disabled="mode" v-model="groupApiData.adNums"></InputNumber>
                </FormItem>
                <FormItem label="默认背景图">
                    <Input v-model="groupApiData.defaultImg" size="small" placeholder="输入图片地址或上传"></Input>
                    <Upload style="display:inline-block" :action="api.uploadApi" :headers="uplaodHeader" :show-upload-list="false" :format="['jpg','jpeg','png']" :max-size="2048" :on-success="defaultImgSuccess">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                    <Button type="ghost" v-show="groupApiData.defaultImg!=''" icon="eye" @click="imgView(groupApiData.defaultImg)">预览</Button>
                </FormItem>
                <FormItem label="效果对比图">
                    <Input v-model="groupApiData.previewImg" size="small" placeholder="输入图片地址或上传"></Input>
                    <Upload style="display:inline-block" :action="api.uploadApi" :headers="uplaodHeader" :show-upload-list="false" :format="['jpg','jpeg','png']" :max-size="2048" :on-success="previewImgSuccess">
                        <Button type="ghost" icon="ios-cloud-upload-outline">上传图片</Button>
                    </Upload>
                    <Button type="ghost" v-show="groupApiData.previewImg!=''" icon="eye" @click="imgView(groupApiData.previewImg)">预览</Button>
                </FormItem>
            </Form>
        </Modal>
    
        <Modal title="查看图片" v-model="visible" width="1200">
            <img :src="viewImg" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
    import AdItem from './adItem.vue';
    export default {
        components: {
            AdItem
        },
        data() {
            return {
                // 图片预览
                visible: false,
                viewImg: '',
                // 所有广告列表
                allAdList: [],
                addShow: false, //创建广告组显、隐
                // 创建分组api参数
                groupApiData: {
                    groupName: '',
                    adNums: 5,
                    width: 100,
                    height: 100,
                    defaultImg: '',
                    previewImg: ''
                },
                // 分组创建/编辑 false为创建
                mode: false
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
            //获取所有广告
            getAll() {
                this.$http.post(this.api.allAd).then(res => {
                    if (res.code === 1000) {
                        this.allAdList = res.data;
                    }
                })
            },
            //添加广告分组api
            addGroup() {
                this.$http.post(this.api.addAdGroup, this.groupApiData).then(res => {
                    if (res.code === 1000) {
                        this.addShow = false;
                        this.resetGroupData();
                        this.allAdList.push(res.data);
                        this.$Message.success({
                            content: '创建成功！'
                        })
                    }
                })
            },
            // 分组编辑框确定回调
            groupAction() {
                if (this.mode) {
                    this.editGroupApi(this.groupApiData);
                } else {
                    this.addGroup();
                }
            },
            // 编辑广告位分组信息
            editGroupApi(data) {
                let index = data.index;
                this.$http.post(this.api.editGroup, data).then(res => {
                    if (res.code === 1000) {
                        this.allAdList[index].groupName = data.groupName;
                        this.allAdList[index].width = data.width;
                        this.allAdList[index].height = data.height;
                        this.allAdList[index].defaultImg = data.defaultImg;
                        this.allAdList[index].previewImg = data.previewImg;
                        this.addShow = false;
                        this.mode = false;
                        this.$delete(data, 'index');
                        this.resetGroupData();
                        this.$Message.success({
                            content: '修改成功！'
                        })
                    }
                })
            },
            // 更新广告分组
            undateGroup(data) {
                this.$http.post(this.api.updateGroup, {
                    jsonObject: JSON.stringify(data)
                }).then(res => {
                    if (res.code === 1000) {
                        this.$Message.success({
                            content: '保存完毕!'
                        })
                    }
                })
            },
            //删除广告分组
            delGroup(goupIndex, groupId) {
                this.$Modal.confirm({
                    content: '此操作将无法撤销，是否继续？',
                    cancelText: '再考虑下',
                    okText: '确认删除',
                    onOk: () => {
                        this.$http.post(this.api.delAdGroup, {
                            groupId: groupId
                        }).then(res => {
                            if (res.code === 1000) {
                                this.$Message.success({
                                    content: '已删除.'
                                });
                                this.allAdList.splice(goupIndex, 1);
                            }
                        })
                    }
                })
            },
            // 编辑广告分组
            editGroup(item, index) {
                this.groupApiData = {
                    groupName: item.groupName,
                    adNums: item.adList.length,
                    width: item.width,
                    height: item.height,
                    defaultImg: item.defaultImg,
                    previewImg: item.previewImg
                }
                this.$set(this.groupApiData, 'id', item.groupId);
                this.$set(this.groupApiData, 'index', index);
                this.mode = true;
                this.addShow = true;
            },
            //测试广告分组获取
            testData(groupId) {
                this.$http.post(this.api.getAdGroup, {
                    groupId: groupId
                }).then(res => {
                    if (res.code === 1000) {
                        console.log(res.data)
                    }
                })
    
            },
            // 预览图片
            imgView(url) {
                this.viewImg = url;
                this.visible = true;
            },
            // 广告分组默认图片上传
            defaultImgSuccess(res) {
                let pres = JSON.parse(res);
                let path = 'http://tbxoss.oss-cn-hangzhou.aliyuncs.com'
                this.groupApiData.defaultImg = path + pres[0].url;
            },
            // 广告分组效果图片上传
            previewImgSuccess(res) {
                let pres = JSON.parse(res);
                let path = 'http://tbxoss.oss-cn-hangzhou.aliyuncs.com'
                this.groupApiData.previewImg = path + pres[0].url;
            },
            //重置添加API参数
            resetGroupData() {
                this.groupApiData = {
                    groupName: '',
                    adNums: 5,
                    width: 100,
                    height: 100,
                    defaultImg: '',
                    previewImg: ''
                }
                this.$delete(this.groupApiData, 'id');
            },
            //上传图片后更新item数据
            undateItem(data) {
                this.allAdList[data.goupIndex].adList[data.itemIndex].url = data.url;
            },
            // 添加广告位
            addAd(goupIndex, groupId) {
                this.$http.post(this.api.addAd, {
                    groupId: groupId
                }).then(res => {
                    if (res.code === 1000) {
                        this.allAdList[goupIndex].adList.push(res.data);
                    }
                })
            },
            // 删除广告位
            removeAd(data) {
                this.$Modal.confirm({
                    content: '此操作将无法撤销，是否继续？',
                    cancelText: '再考虑下',
                    okText: '确认删除',
                    onOk: () => {
                        this.$http.post(this.api.removeAd, {
                            id: data.id,
                            groupId: data.groupId
                        }).then(res => {
                            if (res.code === 1000) {
                                this.$Message.success({
                                    content: '已删除.'
                                });
                                this.allAdList[data.goupIndex].adList.splice(data.itemIndex, 1)
                            }
                        })
                    }
                })
            },
            // 删除广告位图片
            removeAdBg(data) {
                this.allAdList[data.goupIndex].adList[data.itemIndex].url = '';
            }
        },
        created() {
            // 获取所有广告位
            this.getAll();
        }
    }
</script>

<style lang="less" scoped>
    .ad-container {
        .preview {
            margin-left: 20px;
            font-size: 18px;
            cursor: pointer;
        }
        .mt10 {
            margin-top: 10px;
        }
        .add-ad-group {
            width: 320px;
            margin: 10px auto;
            text-align: center;
            cursor: pointer;
            background-color: #007de4;
            color: #fff;
        }
        .content {
            // width: 1200px;
            .add-one-btn {
                position: relative;
                display: inline-block;
                width: 110px;
                .cover {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    text-align: center;
                }
                i {
                    font-size: 30px;
                    color: #007de4;
                }
            }
        }
    }
</style>


