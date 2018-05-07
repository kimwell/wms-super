<style lang="less" scoped>
    .filter-bar {
        width: 100%;
        padding: 10px 10px 0 10px;
        background-color: #fff;
        border: 1px solid #ddd;
        margin-bottom: 10px;
        .magin0 {
            margin-bottom: 10px;
        }
    }
    
    .item-group {
        width: 100%;
        background-color: #fff;
        border: 1px solid #ddd;
        margin-bottom: 10px;
        .head {
            position: relative;
            padding: 0 10px;
            border-bottom: 1px solid #ddd;
            height: 40px;
            line-height: 40px;
            font-weight: bold;
            .option {
                position: absolute;
                right: 20px;
                top: 0;
            }
        }
        .card {
            padding: 10px;
            .item {
                float: left;
                width: 25%;
                height: 30px;
                line-height: 30px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    .previewImg{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 30px;
        line-height: 30px;
        color: #fff;
        text-align: right;
        padding-right: 20px;
        background-color: rgba(0, 0, 0, .6);
        span{
            cursor: pointer;
        }
    }
    .prveimg{
        text-align: center;
        img{
            max-width: 100%;
            display: block;
            margin: 0 auto;
        }
    }
</style>

<template>
    <div class="business-container">
        <div class="filter-bar">
            <Form ref="formInline" inline :label-width="100">
                <FormItem label="商户名称：" class="magin0">
                    <Input type="text" :value="apiData.name" @input="asyncValue($event)" placeholder="输入商家名称"></Input>
                </FormItem>
                <!-- <FormItem label="诚信商户：" class="magin0">
                        <i-switch v-model="apiData.isFU">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="担保商户：" class="magin0">
                        <i-switch v-model="apiData.isGU">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="开通店铺：" class="magin0">
                        <i-switch v-model="apiData.isHS">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem> -->
                <FormItem label="入驻时间：" class="magin0">
                    <DatePicker type="daterange" :options="dateOption" v-model="apiData.bUTime" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="诚信联盟会员：" class="magin0">
                    <Select v-model="apiData.isSellUser" style="width:100px">
                        <Option v-for="item in [{id:1,label:'是'},{id:0,label:'不是'}]" :value="item.id" :key="item.id">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="保证金等级：" class="magin0">
                    <Select v-model="apiData.marginLevel" style="width:100px">
                        <Option v-for="item in marginLevelList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <!-- <FormItem label="成为诚信商户：" class="magin0">
                        <DatePicker type="daterange" :options="dateOption" v-model="apiData.bFUTime" placement="bottom-end" placeholder="选择日期"></DatePicker>
                    </FormItem>
                    <FormItem label="成为担保商户：" class="magin0">
                        <DatePicker type="daterange" :options="dateOption" v-model="apiData.bGUTime" placement="bottom-end" placeholder="选择日期"></DatePicker>
                    </FormItem>
                    <FormItem label="开通店铺时间：" class="magin0">
                        <DatePicker type="daterange" :options="dateOption" v-model="apiData.bHSTime" placement="bottom-end" placeholder="选择日期"></DatePicker>
                </FormItem> -->
            </Form>
            <div style="margin-bottom:10px;text-align:right">
                <Button type="warning" @click="reset">清空筛选</Button>
            </div>
        </div>
        <div class="item-group" v-for="(item,index) in list" :key="item.id">
            <div class="head">
                {{ item.companyName }}
                <span class="iconfont icon-cheng" v-show="item.isSellUser == 1" style="color:#f90;vertical-align: -1px;"></span>
                <grade :value="item.marginLevel"></grade>
                <div class="option">
                    <Button size="small" v-show="item.isSellUser == 1" type="info" @click="showUnion(item)">客户管理</Button>
                    <Button size="small" type="info" @click="showInfo(index)">详情</Button>
                    <Button size="small" v-show="item.isSellUser == 1" type="info" @click="showRangeInfo(index)">报价经营范围</Button>
                    <Button size="small" type="info" @click="modityInfo(index)">修改账号</Button>
                </div>
            </div>
            <div class="card clearfix">
                <div class="item">入驻时间：{{ item.beBuserTime | dateformat }}</div>
                <div class="item">注册账号：{{ item.buserMobile }}</div>
                <div class="item">联系人：{{ item.contact }}</div>
                <div class="item">联系方式：{{ item.contactNum }}</div>
                <div class="item">办公地址：{{ item.address }}</div>
                <div class="item">注册资金：{{ item.regMoney }}万</div>
                <div class="item">负责专员：{{ item.saleName }}</div>
                <div class="item">专员手机：{{ item.saleMobile }}</div>
            </div>
        </div>
        <p v-if="list.length == 0" style="text-align: center;">暂无数据</p>
        <Page :total="totalCount" @on-change="pageChange" show-total :current="apiData.currentPage" :page-size="apiData.pageSize"></Page>
    
    
        <Modal title="商家详情编辑" v-model="showEdit" loading :mask-closable="false" @on-ok="edit" v-if="activeItem">
            <Form :label-width="100">
                <FormItem label="商户名称">
                    <Input v-model="editData.companyName" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="注册资金">
                    <Input v-model="editData.regMoney" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="联系人">
                    <Input v-model="editData.contact" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="联系方式">
                    <Input v-model="editData.contactNum" placeholder="请输入..."></Input>
                </FormItem>
                <!-- <FormItem label="诚信商家">
                        <i-switch size="large" v-model="editData.isFaithUser">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem> -->
                <FormItem label="诚信联盟">
                    <RadioGroup v-model="editData.isSellUser">
                        <Radio label="1">
                            <span>是</span>
                        </Radio>
                        <Radio label="0">
                            <span>否</span>
                        </Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="加入联盟时间" v-if="editData.isSellUser == 1 && activeItem.beUserTime !=''">
                    {{ activeItem.beUserTime | dateformat}}
                </FormItem>
                <!--<FormItem label="担保商家">
                        <i-switch size="large" v-model="editData.isGuaranteeUser">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem>
                    <FormItem label="开通店铺">
                        <i-switch size="large" v-model="editData.isHaveShop">
                            <span slot="open">是</span>
                            <span slot="close">否</span>
                        </i-switch>
                    </FormItem> -->
                <!-- <FormItem label="成为诚信商家" v-if="activeItem.isFaithUser == 1">
                        {{ activeItem.beFaithUserTime | dateformat }}
                    </FormItem>
                    <FormItem label="开通店铺时间" v-if="activeItem.isHaveShop == 1">
                        {{ activeItem.beHaveShopTime | dateformat }}
                    </FormItem>
                    <FormItem label="成为担保商家" v-if="activeItem.isGuaranteeUser == 1">
                        {{ activeItem.beGuaranteeUserTime | dateformat }}
                    </FormItem> -->
    
                <FormItem label="保证金等级">
                    <Select v-model="editData.marginLevel" placeholder="请选择" :clearable="true" style="width:200px">
                        <Option v-for="item in marginLevelList" :value="item.name" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="求购等级">
                    <Select v-model="editData.purchaseLevel" placeholder="请选择" :clearable="true" style="width:200px">
                        <Option v-for="item in purchaseLevelList"  :value="item.name" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="QQ">
                    <Input v-model="editData.qq" placeholder="请输入qq"></Input>
                </FormItem>
                <FormItem label="仓库">
                    <Select v-model="editData.storeHouseName" placeholder="请选择" :clearable="true" style="width:200px">
                        <Option v-for="item in houseList" :value="`${item.name}-${item.id}`" :key="item.id">{{ item.name }}</Option>
                    </Select>
                    <!-- <ajaxSelect class="form-input" :api="api.getStroeHouse" :value="editData.storeHouseId+'-'+editData.storeHouseName" @on-select="asyncStore"></ajaxSelect> -->
                </FormItem>
                <FormItem label="商户优惠信息">
                    <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="editData.proInfo" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="店铺详情">
                    <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="editData.sellerProfile" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="三证合一照" v-if="activeItem.allCer !=''">
                    <img :src="activeItem.allCer" style="max-width: 100%;">
                    <div class="previewImg">
                        <span class="iconfont icon-fangda"  @click="previewImg(activeItem.allCer)"></span>
                    </div>
                </FormItem>
                <FormItem label="营业执照" v-if="activeItem.bussinessLic !=''">
                    <img :src="activeItem.bussinessLic"  style="max-width: 100%;">
                    <div class="previewImg">
                        <span class="iconfont icon-fangda"  @click="previewImg(activeItem.bussinessLic)"></span>
                    </div>
                </FormItem>
                <FormItem label="组织机构代码证" v-if="activeItem.codeLic !=''">
                    <img :src="activeItem.codeLic"  style="max-width: 100%;">
                    <div class="previewImg">
                        <span @click="previewImg(activeItem.codeLic)" class="iconfont icon-fangda"></span>
                    </div>
                </FormItem>
                <FormItem label="税务登记证" v-if="activeItem.financeLic !=''">
                    <img :src="activeItem.financeLic"  style="max-width: 100%;">
                    <div class="previewImg">
                        <span class="iconfont icon-fangda" @click="previewImg(activeItem.financeLic)"></span>
                    </div>
                </FormItem>
            </Form>
        </Modal>
        <Modal title="报价经营范围" width="900" v-model="showRange" loading :mask-closable="false" @on-ok="saveScope">
            <rang v-if="showRange" :id="activeItem.id" ref="scope"></rang>
        </Modal>
        <Modal title="商家客户管理" width="1000" v-model="unionShow" loading :mask-closable="false" @on-ok="saveUnion" @on-cancel="closeUnion">
            <union v-if="unionItem" :unionData="unionItem" ref="union"></union>
            <div slot="footer"></div>
        </Modal>
        <Modal title="修改商家账号" width="500" v-model="modityShow" :mask-closable="false" @on-cancel="resetmodi">
            <Form :label-width="100" :ref="ref" :model="modityApi" :rules="rules">
                <FormItem label="旧账号">
                    <Input v-model="modityApi.originalMobile" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="新账号" prop="nowMoblie">
                    <Input v-model="modityApi.nowMoblie" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="密码" prop="passwordOne">
                    <Input type="password" v-model="modityApi.passwordOne" placeholder="请输入..."></Input>
                </FormItem>
                <FormItem label="确认密码" prop="passwordTwo">
                    <Input type="password" v-model="modityApi.passwordTwo" placeholder="请输入..."></Input>
                </FormItem>
            </Form>
    
            <div slot="footer">
                <Button @click="resetmodi">取消</Button>
                <Button type="primary" @click="saveAccount" :loading="loading">修改</Button>
            </div>
        </Modal>
        <Modal title="查看大图" width="800" v-model="showImg" :mask-closable="false" >
            <div class="prveimg" v-if="showImgUrl !=''">
                <img :src="showImgUrl">
            </div>
            <div slot="footer">
                <Button @click="showImg = false">关闭</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import rang from './rangInfor';
    import union from './union';
    import ajaxSelect from '@/components/basics/ajaxSelect'
    import grade from '@/components/basics/grade'
    export default {
        components: {
            rang,
            ajaxSelect,
            union,
            grade
        },
        data() {
            return {
                showImg: false,
                showImgUrl: '',
                ref: 'form' + new Date().getTime(),
                showEdit: false,
                showRange: false,
                unionShow: false,
                apiData: {
                    name: '',
                    isFU: false,
                    isGU: false,
                    isHS: false,
                    bUTime: ['', ''],
                    bFUTime: ['', ''],
                    bGUTime: ['', ''],
                    bHSTime: ['', ''],
                    isSellUser: '',
                    marginLevel:'',
                    currentPage: 1,
                    pageSize: 10
                },
                list: [],
                houseList: [],
                totalCount: 0,
                activeIndex: 0,
                marginLevelList: [],
                purchaseLevelList: [],
                editData: {
                    companyName: '',
                    regMoney: '',
                    companyId: '',
                    isFaithUser: false,
                    isGuaranteeUser: false,
                    // isStore: false,
                    isHaveShop: false,
                    qq: '',
                    // storeHouseId:'',
                    storeHouseName: '',
                    proInfo: '',
                    marginLevel: '',
                    purchaseLevel: '',
                    isSellUser: '0',
                    sellerProfile: '',
                    contactNum: '',
                    contactNum: '',
                },
                dateOption: {
                    shortcuts: [{
                            text: '最近一周',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近一个月',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                                return [start, end];
                            }
                        },
                        {
                            text: '最近三个月',
                            value() {
                                const end = new Date();
                                const start = new Date();
                                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                                return [start, end];
                            }
                        }
                    ]
                },
                unionItem: {},
                modityApi: {
                    id: '',
                    originalMobile: '',
                    nowMoblie: '',
                    passwordOne: '',
                    passwordTwo: ''
                },
                modityShow: false,
                loading: false,
                rules: {
                    nowMoblie: [{
                        required: true,
                        message: '请输入新账号',
                        trigger: 'blur'
                    }],
                    passwordOne: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }],
                    passwordTwo: [{
                        required: true,
                        message: '请输入确认密码',
                        trigger: 'blur'
                    }],
    
                },
            }
        },
        computed: {
            pipApi() {
                return {
                    name: this.apiData.name.replace(/'/g, ''),
                    isFU: this.apiData.isFU ? 1 : '',
                    isGU: this.apiData.isGU ? 1 : '',
                    isHS: this.apiData.isHS ? 1 : '',
                    bUStartTime: this.apiData.bUTime[0] != '' && this.apiData.bUTime[0] != null ? this.apiData.bUTime[0].getTime() : '',
                    bUEndTime: this.apiData.bUTime[1] != '' && this.apiData.bUTime[1] != null ? this.apiData.bUTime[1].getTime() : '',
                    bFUStartTime: this.apiData.bFUTime[0] != '' && this.apiData.bFUTime[0] != null ? this.apiData.bFUTime[0].getTime() : '',
                    bFUEndTime: this.apiData.bFUTime[1] != '' && this.apiData.bFUTime[1] != null ? this.apiData.bFUTime[1].getTime() : '',
                    bGUStartTime: this.apiData.bGUTime[0] != '' && this.apiData.bGUTime[0] != null ? this.apiData.bGUTime[0].getTime() : '',
                    bGUEndTime: this.apiData.bGUTime[1] != '' && this.apiData.bGUTime[1] != null ? this.apiData.bGUTime[1].getTime() : '',
                    bHSStartTime: this.apiData.bHSTime[0] != '' && this.apiData.bHSTime[0] != null ? this.apiData.bHSTime[0].getTime() : '',
                    bHSEndTime: this.apiData.bHSTime[1] != '' && this.apiData.bHSTime[1] != null ? this.apiData.bHSTime[1].getTime() : '',
                    isSellUser: this.apiData.isSellUser,
                    marginLevel: this.apiData.marginLevel,
                    currentPage: this.apiData.currentPage,
                    pageSize: this.apiData.pageSize
                }
            },
            activeItem() {
                return this.list.length != 0 ? this.list[this.activeIndex] : {}
            },
            checkPsd() {
                return this.modityApi.passwordOne == this.modityApi.passwordTwo
            }
        },
        methods: {
            previewImg(data){
                this.showImgUrl = data;
                this.showImg = true;
            },
            // 商户列表
            getBusinesses() {
                this.$http.post(this.api.getBusiness, this.pipApi).then(res => {
                    if (res.code === 1000) {
                        this.list = res.data.list;
                        this.totalCount = res.data.totalCount;
                    }
                })
            },
            //  全部保证金
            getAllMarginLevel() {
                let params = {
                    name: ''
                }
                this.$http.post(this.api.findAllMarginLevel, params).then(res => {
                    if (res.code === 1000) {
                        this.marginLevelList = res.data
                    }
                })
            },
            //  全部求购等级
            getAllPurchaseLevel() {
                let params = {
                    name: ''
                }
                this.$http.post(this.api.findAllPurchaseLevel, params).then(res => {
                    if (res.code === 1000) {
                        this.purchaseLevelList = res.data
                    }
                })
            },
            showInfo(i) {
                // this.getAllMarginLevel();
                this.getAllPurchaseLevel();
                this.getStroeHouse();
                this.activeIndex = i;
                let data = _.cloneDeep(this.activeItem);
                this.editData.companyId = data.id;
                this.editData.isFaithUser = data.isFaithUser == 1;
                this.editData.isGuaranteeUser = data.isGuaranteeUser == 1;
                this.editData.isHaveShop = data.isHaveShop == 1;
                this.editData.proInfo = data.proInfo;
                this.editData.storeHouseId = data.storeHouseId;
                this.editData.storeHouseName = this.activeItem.storeHouseName !=''? data.storeHouseName +'-'+data.storeHouseId:'';
                this.editData.marginLevel = data.marginLevel;
                this.editData.purchaseLevel = data.purchaseLevel;
                this.editData.isSellUser = data.isSellUser;
                this.editData.sellerProfile = data.sellerProfile;
                this.editData.qq = data.qq;
                this.editData.companyName = data.companyName,
                this.editData.regMoney = data.regMoney,
                this.editData.contact = data.contact,
                this.editData.contactNum = data.contactNum,
                this.showEdit = true;
            },
            showRangeInfo(index) {
                this.activeIndex = index;
                this.showRange = true;
            },
            asyncStore(data) {
                this.editData.storeHouseId = data.id;
                this.editData.storeHouseName = data.name;
            },
            edit() {
                let params = _.cloneDeep(this.editData);
                params.isFaithUser = params.isFaithUser ? 1 : 0;
                params.isGuaranteeUser = params.isGuaranteeUser ? 1 : 0;
                params.isHaveShop = params.isHaveShop ? 1 : 0;
                if(this.editData.storeHouseName != ''){
                    let stores = this.editData.storeHouseName.split('-');
                    params.storeHouseName = stores[0]
                    params.storeHouseId = stores[1]
                }else{
                    params.storeHouseName = ''
                    params.storeHouseId = ''
                }
                this.$http.post(this.api.eidtBusiness, params).then(res => {
                    if (res.code === 1000) {
                        this.$Message.success('修改成功！');
                        this.getBusinesses();
                    } else {
                        this.$Message.error('修改失败');
                    }
                    this.showEdit = false;
                })
            },
            // 分页
            pageChange(page) {
                this.apiData.currentPage = page;
            },
            // 获取仓库
            getStroeHouse() {
                this.$http.post(this.api.getStroeHouse).then(res => {
                    if (res.code === 1000) {
                        this.houseList = res.data;
                    }
                })
            },
            // 清空筛选
            reset() {
                this.apiData = {
                    name: '',
                    isFU: false,
                    isGU: false,
                    isHS: false,
                    bUTime: ['', ''],
                    bFUTime: ['', ''],
                    bGUTime: ['', ''],
                    bHSTime: ['', ''],
                    isSellUser: '',
                    // marginLevel:'',
                    currentPage: 1,
                    pageSize: 10
                }
            },
            // 实时检索
            asyncValue: _.debounce(function(value) {
                this.apiData.currentPage = 1;
                this.apiData.name = value;
                this.getBusinesses();
            }, 500),
            //  保存经营范围
            saveScope() {
                this.$refs.scope.saveScope();
                this.showRange = false;
            },
            showUnion(item) {
                this.unionItem = item || {}
                this.unionShow = true;
                if (this.unionShow) {
                    this.$refs.union.getSalesman();
                    this.$refs.union.getCompany();
                }
            },
            saveUnion() {
                this.$refs.union.allotAction();
            },
            closeUnion() {
                this.$refs.union.reset();
                this.unionShow = false;
            },
            //   修改账号
            modityInfo(index) {
                this.modityShow = true
                this.modityApi.originalMobile = this.list[index].buserMobile;
                this.modityApi.id = this.list[index].id
            },
            resetmodi(){
                this.modityShow = false
                this.modityApi = {
                    id: '',
                    originalMobile: '',
                    nowMoblie: '',
                    passwordOne: '',
                    passwordTwo: ''
                }
            },
            //  保存新账号
            saveAccount() {
                this.$refs[this.ref].validate((valid) => {
                    if (valid) {
                        if(this.checkPsd){
                        this.loading = true;
                        this.$http.post(this.api.updateMainAccountMobile, this.modityApi).then(res => {
                            if (res.code === 1000) {
                                this.getBusinesses();
                                this.$Message.success('操作成功');
                                this.resetmodi();
                            } else {
                                this.$Message.error(res.message);
                            }
                            this.loading = false
                        })
                        }else{
                            this.$Message.error('两次密码输入不一致');
                        }
                    } else {
                        this.$Message.error('表单验证失败');
                    }
                })
            }
        },
        watch: {
            pipApi(a, b) {
                // 如果分页参数没变过，其他筛选参数变了，说明是筛选不是分页，把页码设为1
                if (a.currentPage == b.currentPage)
                    this.apiData.currentPage = 1;
                this.getBusinesses();
            }
        },
        created() {
            this.getBusinesses();
            this.getAllMarginLevel();
        }
    }
</script>
