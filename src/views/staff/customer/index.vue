<template>
  <div>
    <Card :bordered="false" class="card">
      <p slot="title">客户管理</p>
      <Button slot="extra" type="primary" @click="openModel(false)">新增客户</Button>
      <Form :mode="pageApi" :label-width="100" inline>
        <FormItem label="供应商名称：">
          <Input type="text" v-model="pageApi.buserName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="客户名称：">
          <Input type="text" v-model="pageApi.companyName" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="拼音：">
          <Input type="text" v-model="pageApi.spell" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem label="联系电话：">
          <Input type="text" v-model="pageApi.phone" placeholder="请输入..."></Input>
        </FormItem>
        <FormItem>
          <Button type="warning" @click.native="resetFilter">清除</Button>
        </FormItem>
      </Form>
      <div class="card-contnet">
        <div class="table-contnet">
          <Table width="100%" :columns="columns" :data="list"></Table>
        </div>
        <Page class="page-count" size="small" :total="totalCount" show-total :current="pageApi.currentPage" :page-size="pageApi.pageSize" @on-change="changePage"></Page>
      </div>
    </Card>
    <Modal v-model="show" :closable="false" width="600" :mask-closable="false" :title="isEdit ? '编辑客户':'添加客户'">
      <Form :ref="ref" :model="dataApi" :rules="rules" :label-width="100">
        <FormItem label="供应商名称：" prop="buserName">
          <Select v-if="!isEdit" v-model="dataApi.buserName" filterable remote :remote-method="remoteMethod" :loading="queryLoading">
                                <Option v-for="(option, index) in companyList" :value="`${option.companyName}-${option.id}`" :key="index">{{option.companyName}}</Option>
                              </Select>
          <span v-else>{{buserName}}</span>
        </FormItem>
        <Row>
          <Col span="12">
          <FormItem label="单位名称：" prop="companyName">
            <Input v-model="dataApi.companyName" @on-blur="characterToSpell" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="拼音：">
            <Input v-model="dataApi.spell" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <FormItem label="联系人：">
          <Input v-model="dataApi.contactPeople" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="单位地址：">
          <ajaxAdress ref="city" @on-pick="selectCity" :value="placeHolder" style="width: 150px;margin-right:10px;display:inline-block;"></ajaxAdress>
          <Input v-model="dataApi.address" placeholder="请输入详细地址" style="width: 304px;"></Input>
        </FormItem>
        <Row>
          <Col span="12">
          <FormItem label="所属部门：">
            <Select v-model="dataApi.department" clearable>
                              <Option v-for="item in [{name:'全部'}]" :value="item.name" :key="item.name">{{ item.name }}</Option>
                            </Select>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="所属单位：">
            <Input v-model="dataApi.belongBuserName" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <FormItem label="客户性质：">
          <CheckboxGroup v-model="dataApi.customerRole">
            <Checkbox label="0">
              <span>供货单位</span>
            </Checkbox>
            <Checkbox label="1">
              <span>一般客户</span>
            </Checkbox>
            <Checkbox label="2">
              <span>加工单位</span>
            </Checkbox>
            <Checkbox label="3">
              <span>车主</span>
            </Checkbox>
            <Checkbox label="4">
              <span>收货单位</span>
            </Checkbox>
            <Checkbox label="5">
              <span>特殊客户</span>
            </Checkbox>
            <Checkbox label="6">
              <span>进项客户</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        <FormItem label="开户行：">
          <div class="idCard">
            <div class="add-wrap">
              <Button type="primary" @click="addIDCard">添加</Button>
            </div>
            <div class="idCard-wrap">
              <div class="idCard-item" v-for="(item,index) in dataApi.bankCardString" :key="index">
                <Input v-model="item.cardNo" @on-blur="autoCardName(index)" style="width:225px;margin:0 15px;" placeholder="请输入开户账号"></Input>
                <Input v-model="item.bankName" style="width:115px;" placeholder="请输入开户行">
                </Input>
                <Button type="error" @click="delIDCard(index)">删除</Button>
              </div>
            </div>
          </div>
        </FormItem>
        <Row>
          <Col span="12">
          <FormItem label="客户类型：">
            <Input v-model="dataApi.customerType" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="供应商类型：">
            <Input v-model="dataApi.supplierType" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="法人代表：">
            <Input v-model="dataApi.legalPerson" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="邮编：">
            <Input v-model="dataApi.postCode" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="传真：">
            <Input v-model="dataApi.fax" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="电话：">
            <Input v-model="dataApi.contact" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="移动电话：">
            <Input v-model="dataApi.phone" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="备注：">
            <Input v-model="dataApi.remark" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="税号：">
            <Input v-model="dataApi.taxNo" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="地区：">
            <Input v-model="dataApi.areaPlace" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="信用金额：">
            <Input v-model="dataApi.creditAmount" placeholder="请输入"></Input>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="操作人：">
            <Input v-model="dataApi.operator" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          <FormItem label="利息计算方式：">
            <RadioGroup v-model="dataApi.interestWay" vertical>
              <Radio label="1">
                <span>按吨位计算</span>
              </Radio>
              <Radio label="2">
                <span>按金额计算</span>
              </Radio>
            </RadioGroup>
          </FormItem>
          </Col>
          <Col span="12">
          <FormItem label="利息起始天数：">
            <Input v-model="dataApi.interestDay" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="利息利率：">
            <Input v-model="dataApi.interestPercent" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="账期类型：">
            <!-- <Select v-model="dataApi.paymentDayType" clearable>
                              <Option v-for="item in [{name:'全部'}]" :value="item.name" :key="item.name">{{ item.name }}</Option>
                          </Select> -->
          </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
          </Col>
          <Col span="12">
          <FormItem label="账期天数：">
            <Input v-model="dataApi.paymentDays" placeholder="请输入"></Input>
          </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="show = false">取消</Button>
        <Button type="primary" :loading="loading" @click="handleAction">{{isEdit ? '编辑':'添加'}}</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import ajaxAdress from '@/components/basics/adress/citySelect'
  export default {
    components: {
      ajaxAdress
    },
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        pageApi: {
          currentPage: 1,
          pageSize: 10,
          companyName: '',
          spell: '',
          phone: '',
          buserName: ''
        },
        list: [],
        isEdit: false,
        show: false,
        totalCount: 0,
        cardIndex: 0,
        editItem: {},
        loading: false,
        queryLoading: false,
        companyList: [],
        buserName: '',
        dataApi: {
          companyName: '',
          address: '',
          customerRole: [],
          customerType: '',
          department: '',
          supplierType: '',
          legalPerson: '',
          postCode: '',
          fax: '',
          contact: '',
          phone: '',
          remark: '',
          taxNo: '',
          creditAmount: '',
          areaPlace: '',
          operator: '超级管理员',
          belongBuserName: '',
          interestWay: '1',
          interestDay: '',
          interestPercent: '',
          paymentDayType: '',
          paymentDays: '',
          spell: '',
          city: '',
          province: '',
          area: '',
          buserName: '',
          buserId: '',
          id: '',
          contactPeople: '',
          bankCardString: [{
            customerId: '',
            bankName: '',
            cardNo: '',
            realName: '',
            phone: ''
          }]
        },
        rules: {
          buserName: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
          companyName: [{
            required: true,
            message: '不能为空',
            trigger: 'blur'
          }]
        },
        columns: [{
          title: '客户名称',
          key: 'companyName',
          width: 200,
          fixed: 'left'
        }, {
          title: '客户编号',
          key: 'id',
          width: 280,
        }, {
          title: '供应商名称',
          key: 'buserName',
          width: 200,
        }, {
          title: '客户性质',
          key: 'customerRole',
          width: 200,
          render: (h, params) => {
            let arr = params.row.customerRole.split(',')
            let _this = this;
            if (arr.length) {
              return h('div', arr.map(function(item) {
                return h('Tag', {
                  props:{
                    color:"blue"
                  },
                }, _this.strNature(item))
              }))
            } else {
              return h('span', '暂无')
            }
          }
        }, {
          title: '税务号',
          key: 'taxNo',
          width: 180,
        }, {
          title: '开户行',
          key: 'bankName',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.bankCardString.length > 0 ? params.row.bankCardString[0].bankName : '暂无')
            ]);
          }
        }, {
          title: '账号',
          key: 'cardNo',
          width: 200,
          render: (h, params) => {
            return h('div', [
              h('span', params.row.bankCardString.length > 0 ? params.row.bankCardString[0].cardNo : '暂无')
            ]);
          }
        }, {
          title: '联系电话',
          key: 'phone',
          width: 130,
        }, {
          title: '联系人',
          key: 'legalPerson',
          width: 100,
        }, {
          title: '地址',
          key: 'address',
          width: 200,
        }, {
          title: '传真',
          key: 'fax',
          width: 150,
        }, {
          title: '拼音',
          key: 'spell',
          width: 100,
        }, {
          title: '备注',
          key: 'remark',
          width: 100,
        }, {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 140,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.openModel(true, params.row)
                  }
                }
              }, '编辑'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.deleteItem(params.row)
                  }
                }
              }, '删除')
            ]);
          }
        }]
      }
    },
    computed: {
      handleFilter() {
        return {
          currentPage: this.pageApi.currentPage,
          pageSize: this.pageApi.pageSize,
          companyName: this.pageApi.companyName,
          spell: this.pageApi.spell,
          phone: this.pageApi.phone,
          buserName: this.pageApi.buserName,
        }
      },
      placeHolder() {
        return this.dataApi.province != '' ? `${this.dataApi.province}/${this.dataApi.city}/${this.dataApi.area}` : '请选择地区'
      },
    },
    watch: {
      'handleFilter': {
        handler: _.debounce(function(val, oldVal) {
          // 是否是翻页操作
          if (val.currentPage == oldVal.currentPage)
            this.dataApi.currentPage = 1;
          this.getList();
        }, 200),
        deep: true
      }
    },
    methods: {
      //  转换 客户性质
      strNature(str) {
        let strArr = ['供货单位', '一般客户', '加工单位', '车主', '收货单位', '特殊客户', '进项客户']
        return strArr[str]
      },
      //  转为拼音
      characterToSpell(data) {
        let charact = this.dataApi.companyName;
        if (charact != '') {
          this.$http.post(this.api.characterToSpell, {
            character: charact
          }).then(res => {
            if (res.code === 1000) {
              this.dataApi.spell = res.data[0];
            }
          })
        }
      },
      //  查找商户
      remoteMethod(query) {
        if (query != '') {
          this.queryLoading = true;
          this.$http.post(this.api.findBusinessList, {
            companyName: query,
            contact: '',
            contactNum: '',
            currentPage: 1,
            pageSize: 20,
            fax: '',
            qq: ''
          }).then(res => {
            if (res.code === 1000) {
              this.queryLoading = false;
              this.companyList = res.data.list
            }
          })
        } else {
          this.companyList = [];
          this.dataApi.buserName = '';
          this.dataApi.buserId = '';
        }
      },
      changePage(page) {
        this.pageApi.currentPage = page;
        this.getList();
      },
      //  选择省市区
      selectCity(data) {
        this.dataApi.province = data.provinceName;
        this.dataApi.city = data.cityName;
        this.dataApi.area = data.districtName
      },
      getList() {
        this.$http.post(this.api.findCustomer, this.pageApi).then(res => {
          if (res.code === 1000) {
            res.data.data.forEach(el => {
              el.bankCardString = JSON.parse(el.bankCardString)
            })
            this.list = res.data.data;
            this.totalCount = res.data.totalCount
          }
        })
      },
      // 添加银行卡
      addIDCard() {
        this.cardIndex++;
        this.dataApi.bankCardString.push({
          customerId: '',
          bankName: '',
          cardNo: '',
          realName: '',
          phone: ''
        });
      },
      // 删除银行卡
      delIDCard(index) {
        this.dataApi.bankCardString.splice(index, 1)
      },
      autoCardName(index){
          let str = this.dataApi.bankCardString[index].cardNo;
          if(str != ''){
            this.$http.post(this.api.bankName,{card: str}).then(res =>{
              if(res.code === 1000){
                if(res.data !=''){
                  this.dataApi.bankCardString[index].bankName = res.data;
                }
              }
            })
          }
      },
      //  删除客户
      deleteItem(item) {
        this.$Modal.confirm({
          title: "删除提示！",
          content: "删除后无法撤销，是否继续？",
          onOk: () => {
            let params = {
              id: item.id
            }
            this.$http.post(this.api.deleteCustomer, params).then(res => {
              if (res.code === 1000) {
                this.$Message.success('删除成功');
                this.getList();
              } else {
                this.$Message.error(res.message)
              }
            })
          }
        })
      },
      openModel(isEdit, item) {
        this.isEdit = isEdit;
        if (isEdit) {
          this.editItem = item || {};
          this.dataApi = {
            id: this.editItem.id,
            address: this.editItem.address,
            area: this.editItem.area,
            areaPlace: this.editItem.areaPlace,
            bankCardString: this.editItem.bankCardString.length > 0 ? this.editItem.bankCardString : [{
              customerId: '',
              bankName: '',
              cardNo: '',
              realName: '',
              phone: ''
            }],
            belongBuserName: this.editItem.belongBuserName,
            city: this.editItem.city,
            companyName: this.editItem.companyName,
            contact: this.editItem.contact,
            creditAmount: this.editItem.creditAmount,
            customerRole: this.editItem.customerRole.split(','),
            customerType: this.editItem.customerType,
            department: this.editItem.department,
            fax: this.editItem.fax,
            interestDay: this.editItem.interestDay,
            interestPercent: this.editItem.interestPercent,
            interestWay: this.editItem.interestWay.toString(),
            legalPerson: this.editItem.legalPerson,
            operator: this.editItem.operator,
            paymentDayType: this.editItem.paymentDayType,
            paymentDays: this.editItem.paymentDays,
            phone: this.editItem.phone,
            postCode: this.editItem.postCode,
            province: this.editItem.province,
            remark: this.editItem.remark,
            spell: this.editItem.spell,
            supplierType: this.editItem.supplierType,
            taxNo: this.editItem.taxNo,
            buserName: `${this.editItem.buserName}-${this.editItem.buserId}`,
            buserId: this.editItem.buserId,
            contactPeople: this.editItem.contactPeople
          }
          this.buserName = this.editItem.buserName
        } else {
          this.dataApi = {
            id: '',
            companyName: '',
            address: '',
            customerRole: [],
            customerType: '',
            department: '',
            supplierType: '',
            legalPerson: '',
            postCode: '',
            fax: '',
            contact: '',
            phone: '',
            remark: '',
            taxNo: '',
            creditAmount: '',
            areaPlace: '',
            operator: '超级管理员',
            belongBuserName: '',
            interestWay: '1',
            interestDay: '',
            interestPercent: '',
            paymentDayType: '',
            paymentDays: '',
            spell: '',
            city: '',
            province: '',
            area: '',
            buserName: '',
            buserId: '',
            contactPeople: '',
            bankCardString: [{
              customerId: '',
              bankName: '',
              cardNo: '',
              realName: '',
              phone: ''
            }]
          }
        }
        this.show = true;
      },
      //  编辑、新增客户
      handleAction() {
        this.$refs[this.ref].validate((valid) => {
          if (valid) {
            this.loading = true
            let params = this.$clearData(this.dataApi);
            let ids = params.buserName.split('-');
            params.buserName = ids[0];
            params.buserId = ids[1];
            params.customerRole = params.customerRole.toString();
            params.bankCardString = JSON.stringify(params.bankCardString)
            this.$http.post(this.api.saveCustomer, params).then(res => {
              if (res.code === 1000) {
                this.show = false;
                this.$Message.success(this.isEdit ? '编辑成功' : '添加成功')
                this.getList();
              } else {
                this.$Message.error(res.message)
              }
              this.loading = false
            })
          }
        })
      },
      //  清除筛选
      resetFilter() {
        this.pageApi = {
          currentPage: 1,
          pageSize: 10,
          companyName: '',
          spell: '',
          phone: '',
          buserName:''
        }
      },
    },
    created() {
      this.getList();
    }
  }
</script>

<style lang='less' scoped>
  .card {
    position: relative;
    margin-bottom: 20px;
    .card-contnet {
      position: relative;
      padding-bottom: 40px;
    }
    .page-count {
      position: absolute;
      right: 0;
      bottom: 0;
    }
  }
  
  .idCard {
    .add-wrap {
      margin-bottom: 15px;
    }
    .idCard-wrap {
      .idCard-item {
        margin-bottom: 15px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
</style>