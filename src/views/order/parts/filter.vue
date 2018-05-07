<template>
    <div class="filter-container">
        <div v-show="!toggle">
            <div class="group" v-for="(group,index) in filterData" :key="index">
                <div class="head">
                    <h4><span class="title" :title="group.title">{{ group.title }}</span> ：</h4>
                </div>
                <div class="body">
                    <div class="item clearfix">
                        <a class="tag" :class="{ 'active':group.activeIndex == i} " @click="group.activeIndex = i" v-for="(item,i) in group.list" :key="i" v-show="item.show">{{ item.name }}</a>
                    </div>
                </div>
                <div class="foot">
                    <span class="more" @click="resetGroup(group)">重置</span>
                </div>
            </div>
            <div class="group">
                <div class="head">
                    <h4><span class="title" title="发起时间">详细</span> ：</h4>
                </div>
                <div class="body">
                    <Form ref="formInline" inline :label-width="75" style="margin-top:20px">
                        <FormItem label="订单编号：" class="magin0">
                            <Input type="text" v-model="detail.ironBuyId" placeholder="请输入..."></Input>
                        </FormItem>
                        <FormItem label="买家公司：" class="magin0">
                            <Input type="text" v-model="detail.buyCompanyName" placeholder="请输入..."></Input>
                        </FormItem>
                        <FormItem label="货源地：" prop="cityId" class="magin0">
                            <City ref="city" @on-pick="selectCity" :value="placeHolder"></City>
                        </FormItem>
                        <FormItem label="卖家公司：" class="magin0">
                            <Input type="text" v-model="detail.sellCompanyName" placeholder="请输入..."></Input>
                        </FormItem>
                        <FormItem label="下单时间：" class="magin0">
                            <DatePicker type="daterange" :options="dateOption" :clearable="false" v-model="dateValue" placement="bottom-end" placeholder="选择日期"></DatePicker>
                        </FormItem>
                        <FormItem label="负责专员：" class="magin0">
                            <Select v-model="detail.salesManId" style="width:120px">
                                    <Option v-for="item in salesMan" :value="item.saleId" :key="item.saleId">{{ item.saleName }}</Option>
                                </Select>
                        </FormItem>
                        <FormItem label="规格：" class="magin0">
                            <input type="text" class="ivu-input" @keyup="setInputClear" v-model="detail.specification" placeholder="请输入..." style="width:80px">
                        </FormItem>
                        <FormItem label="公差：" class="magin0">
                            <input type="number" class="ivu-input" @keyup="setInputClear" v-model="detail.tolerance" placeholder="请输入..." style="width:80px">
                        </FormItem>
                        <FormItem label="厚度：" class="magin0">
                            <input type="number" class="ivu-input" @keyup="setInputClears" v-model="detail.heightMin" placeholder="请输入..." style="width:80px">
                        </FormItem>
                        <div class="split" style="">-</div>
                        <FormItem label="" class="magin0" style="margin-left: -80px">
                            <input type="number" class="ivu-input" @keyup="setInputClears" v-model="detail.heightMax" placeholder="请输入..." style="width:80px">
                        </FormItem>
                        <FormItem label="宽度：" class="magin0">
                            <input type="number" class="ivu-input" @keyup="setInputClears" v-model="detail.widthMin" placeholder="请输入..." style="width:80px">
                        </FormItem>
                        <div class="split" style="">-</div>
                        <FormItem label="" class="magin0" style="margin-left: -80px">
                            <input type="number" class="ivu-input" @keyup="setInputClears" v-model="detail.widthMax" placeholder="请输入..." style="width:80px">
                        </FormItem>
                        <FormItem label="长度：" class="magin0">
                            <input type="text" class="ivu-input" @keyup="setInputClears" v-model="detail.lengthMin" placeholder="请输入..." style="width:80px">
                        </FormItem>
                        <div class="split" style="">-</div>
                        <FormItem label="" class="magin0" style="margin-left: -80px">
                            <input type="text" class="ivu-input" @keyup="setInputClears" v-model="detail.lengthMax" placeholder="请输入..." style="width:80px">
                        </FormItem>
                    </Form>
                </div>
                <div class="foot">
                    <span class="more" @click="resetDetail">重置</span>
                </div>
            </div>
        </div>
        <div class="selected" v-show="toggle">
            <table>
                <thead>
                    <tr>
                        <td>品类</td>
                        <td>表面</td>
                        <td>材质</td>
                        <td>产地</td>
                        <td>状态</td>
                        <td>发布平台</td>
                        <td>详细</td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{ filterData[0].list[filterData[0].activeIndex].name }}</td>
                        <td>{{ filterData[1].list[filterData[1].activeIndex].name}}</td>
                        <td>{{ filterData[2].list[filterData[2].activeIndex].name }}</td>
                        <td>{{ filterData[3].list[filterData[3].activeIndex].name }}</td>
                        <td>{{ filterData[4].list[filterData[4].activeIndex].name }}</td>
                        <td>{{ filters.appFlag | wherePublish }}</td>
                        <td>。。。</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="toggle"><span class="iconfont" :class="toggle ? 'icon-zhankai' : 'icon-shouqi'" @click="toggle = !toggle"></span></div>
    </div>
</template>

<script>
    import City from '@/components/basics/adress/citySelect.vue'
    export default {
        components: {
            City
        },
        data() {
            return {
                salesMan: [],
                toggle: false,
                filterData: [{
                        title: '品类',
                        key: 'ironTypeId',
                        list: [{
                            name: '全部',
                            id: '',
                            show: true
                        }],
                        activeIndex: 0
                    },
                    {
                        title: '表面',
                        key: 'surfaceId',
                        list: [{
                            name: '全部',
                            id: '',
                        show: true
                        }],
                        activeIndex: 0
                    },
                    {
                        title: '材质',
                        key: 'materialId',
                        list: [{
                            name: '全部',
                            id: '',
                        show: true
                        }],
                        activeIndex: 0
                    },
                    {
                        title: '产地',
                        key: 'proPlaceId',
                        list: [{
                            name: '全部',
                            id: '',
                            show: true
                        }],
                        activeIndex: 0,
                    }, {
                        title: '订单状态',
                        key: 'status',
                        list: [{
                            name: '全部',
                            id: '',
                            show: true
                        }, {
                            name: '待确认',
                            id: '0',
                            show: true
                        }, {
                            name: '已完成',
                            id: '1',
                            show: true
                        }, {
                            name: '未确认',
                            id: '2',
                            show: true
                        }, {
                            name: '已作废',
                            id: '3',
                            show: true
                        }],
                        activeIndex: 0,
                    },{
                        title: '详细状态',
                        key: 'orderStatus',
                        list: [{
                            name: '全部',
                            id: '',
                            show: true
                        }, {
                            name: '超管删除',
                            id: '9',
                            show: true
                        },{
                            name: '卖家取消',
                            id: '3',
                            show: false
                        }, {
                            name: '过期订单',
                            id: '4',
                            show: false
                        },{
                            name: '买家取消',
                            id: '5',
                            show: false
                        }, {
                            name: '超管取消',
                            id: '6',
                            show: false
                        }, {
                            name: '超管作废',
                            id: '7',
                            show: false
                        }],
                        activeIndex: 0,
                    }
                ],
                detail: {
                    sellCompanyName: '',
                    buyCompanyName: '',
                    ironBuyId: '',
                    locationId: '',
                    heightMin: '',
                    heightMax: '',
                    widthMin: '',
                    widthMax: '',
                    lengthMin: '',
                    lengthMax: '',
                    specification: '',
                    tolerance: '',
                    bgStatus: '',
                    salesManId: ''
                },
                dateValue: ['', ''],
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
                storeList: [],
            }
        },
        created() {
            this.filterData.forEach(el => {
                this.$set(el, 'activeIndex', 0);
            });
        },
        computed: {
            filters() {
                let data = {};
                this.filterData.forEach(el => {
                    data[el.key] = el.list[el.activeIndex].id;
                });
                data.startTime = this.dateValue[0] != '' ? this.dateValue[0].getTime() : '';
                data.endTime = this.dateValue[1] != '' ? this.dateValue[1].getTime() : '';
                data.ironBuyId = this.detail.ironBuyId;
                data.buyCompanyName = this.detail.buyCompanyName;
                data.sellCompanyName = this.detail.sellCompanyName;
                data.salesManId = this.detail.salesManId;
                data.locationId = this.detail.locationId;
                data.widthMin = this.detail.widthMin;
                data.widthMax = this.detail.widthMax;
                data.heightMin = this.detail.heightMin;
                data.heightMax = this.detail.heightMax;
                data.lengthMin = this.detail.lengthMin;
                data.lengthMax = this.detail.lengthMax;
                data.specification = this.detail.specification;
                data.tolerance = this.detail.tolerance
                return data
            },
            placeHolder() {
                return this.detail.provinceName = '' ? this.detail.provinceName + ' / ' + this.detail.cityName : '请选择地区'
            }
        },
        methods: {
            resetGroup(group) {
                group.activeIndex = 0;
            },
            resetDetail() {
                this.detail = {
                    sellCompanyName: '',
                    buyCompanyName: '',
                    ironBuyId: '',
                    locationId: '',
                    heightMin: '',
                    heightMax: '',
                    widthMin: '',
                    widthMax: '',
                    lengthMin: '',
                    lengthMax: '',
                    specification: '',
                    tolerance: '',
                    bgStatus: '',
                    salesManId: ''
                }
                this.dateValue = ['', '']
                this.$refs.city.clearData()
            },
            // 获取品类
            getIronTypes() {
                return this.$http.get(this.api.queryIronTypes)
            },
            // 获取材质
            getMaterials() {
                return this.$http.get(this.api.queryMaterials)
            },
            // 获取表面
            getSurFaces() {
                return this.$http.get(this.api.querySurFaces)
            },
            // 获取产地
            getPlaces() {
                return this.$http.get(this.api.queryPlaces)
            },
            // 选择城市
            selectCity(data) {
                this.detail.locationId = data.cityId;
                // this.detail.provinceId = data.provinceId;
            },
            //  处理如果输入规格、公差，厚度、宽度、长度公差为空
            setInputClear() {
                if (this.detail.specification != '' || this.detail.tolerance != '') {
                    this.detail.widthMin = '';
                    this.detail.widthMax = '';
                    this.detail.heightMin = '';
                    this.detail.heightMax = '';
                    this.detail.lengthMax = '';
                    this.detail.lengthMin = '';
                    this.detail.tolenceMin = '';
                    this.detail.tolenceMax = '';
                };
            },
            //  处理如果输入厚度、宽度、长度公差，规格、公差为空
            setInputClears() {
                if (this.detail.widthMin != '' || this.detail.widthMax != '' || this.detail.heightMin != '' || this.detail.heightMax != '' || this.detail.lengthMin != '' || this.detail.tolenceMin != '' || this.detail.tolenceMax != '') {
                    this.detail.specification = '';
                    this.detail.tolerance = ''
                }
            },
            getSalesMan() {
                this.$http.post(this.api.findSalemanInfo).then(res => {
                    if (res.code === 1000) {
                        this.salesMan = res.data;
                    }
                })
            }
        },
        watch: {
            filters: _.debounce(function(now) {
                this.$emit('on-change', now);
            }, 500),
            //  显示小订单状态
            'filters.status':_.debounce(function(val){
                this.filterData[5].activeIndex = 0
                if(val == 2 ){
                    this.filterData[5].list[2].show = true
                    this.filterData[5].list[3].show = true
                    this.filterData[5].list[4].show = false
                    this.filterData[5].list[5].show = false
                    this.filterData[5].list[6].show = false
                }else if( val ==3){
                    this.filterData[5].list[2].show = false
                    this.filterData[5].list[3].show = false
                    this.filterData[5].list[4].show = true
                    this.filterData[5].list[5].show = true
                    this.filterData[5].list[6].show = true
                }else{
                    this.filterData[5].list[2].show = false
                    this.filterData[5].list[3].show = false
                    this.filterData[5].list[4].show = false
                    this.filterData[5].list[5].show = false
                    this.filterData[5].list[6].show = false
                }
            },200)
        },
        created() {
            this.$http.all([
                this.getIronTypes(),
                this.getSurFaces(),
                this.getMaterials(),
                this.getPlaces()
            ]).then(res => {
                res.forEach((el, index) => {
                    if (el.code === 1000) {
                        el.data.map(sub =>{
                            sub.show = true;
                        })
                        this.filterData[index].list.push(...el.data)
                    }
                })
            })
            this.getSalesMan()
        }
    }
</script>


<style lang="less" scoped>
    .filter-container {
        background-color: #fff;
    }
    
    .filter-tip {
        padding: 20px;
        overflow: hidden;
        .active-item {
            display: inline-block;
            position: relative;
            margin-left: 10px;
            top: 4px;
            right: 5px;
            padding: 0 4px;
            max-width: 144px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border: 1px solid #e8e8e8;
            height: 18px;
            line-height: 18px;
            color: #666;
            text-decoration: none;
            i {
                font-size: 12px;
                margin-left: 5px;
            }
            &:hover {
                border-color: #007de4;
                color: #007de4;
            }
        }
    }
    
    .group {
        position: relative;
        margin: 0 8px;
        border-bottom: 1px dashed #dedede;
        &:last-child {
            border-bottom: none;
        }
        .head {
            position: absolute;
            left: 11px;
            top: 9px;
            color: #999;
        }
        .body {
            padding: 0 100px 0 112px;
            .item {
                // height: 36px;
                overflow: hidden;
            }
            .items-show2line {
                height: 72px;
            }
            .tag {
                float: left;
                margin: 9px 40px 9px 0;
                color: #000;
                text-decoration: none;
                &:hover {
                    color: #007de4;
                }
                &.active {
                    color: #007de4;
                }
            }
        }
        .foot {
            position: absolute;
            right: 0;
            top: 8px;
            .more {
                position: absolute;
                right: 10px;
                height: 18px;
                padding-right: 10px;
                line-height: 18px;
                cursor: pointer;
                white-space: nowrap;
                &:hover {
                    color: #007de4;
                }
            }
        }
    }
    
    .toggle {
        width: 100%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        span {
            font-size: 20px;
            color: #007de4;
            cursor: pointer;
        }
    }
    
    .selected {
        width: 100%;
        table {
            width: 100%;
            thead {
                td {
                    background-color: #ddd;
                }
            }
            tr {
                border-left: 1px solid #ddd;
            }
            td {
                height: 30px;
                line-height: 30px;
                text-align: center;
                border-right: 1px solid #ddd;
                border-bottom: 1px solid #ddd;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
    
    .split {
        display: inline-block;
        line-height: 32px;
        color: #dddee1;
        margin-right: 13px;
    }
    
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    
    input[type="number"] {
        -moz-appearance: textfield;
    }
</style>

