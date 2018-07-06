<template>
  <div>
    <Form :mode="filterApi" :label-width="80">
      <FormItem label="供应商：">
        <!-- <Input type="text" v-model="filterApi.sellCompanyName" placeholder="请输入..."></Input> -->

      <Select v-model="filterApi.sellCompanyName" filterable remote :remote-method="remoteMethod" placeholder="选择供应商" :loading="queryLoading">
        <Option v-for="(option, index) in companyList" :value="`${option.companyName}`" :key="index">{{option.companyName}}</Option>
      </Select>
      </FormItem>
      <FormItem label="客户：">
        <Input type="text" v-model="filterApi.buyCompanyName" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="货物名称：">
        <Input type="text" v-model="filterApi.cargoName" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="型号：">
        <Input type="text" v-model="filterApi.model" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="品类：">
        <Select v-model="filterApi.ironType">
          <Option v-for="item in filterData[0].list" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="表面：">
        <Select v-model="filterApi.surface">
          <Option v-for="item in filterData[1].list" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="材质：">
        <Select v-model="filterApi.material">
          <Option v-for="item in filterData[2].list" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="产地：">
        <Select v-model="filterApi.proPlace">
          <Option v-for="item in filterData[3].list" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="仓库：">
        <Select v-model="filterApi.storeHouse">
          <Option v-for="item in filterData[4].list" :value="item" :key="item">{{ item }}</Option>
        </Select>
      </FormItem>
      <FormItem label="规格：" v-if="!isBJ">
        <Input type="text" v-model="filterApi.specification" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="公差：">
        <Input type="text" v-model="filterApi.tolerance" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="厚度：" v-if="isBJ">
        <Input type="text" v-model="filterApi.heightMax" style="width:77px;" placeholder="请输入..."></Input>
        <span class="line">-</span>
        <Input type="text" v-model="filterApi.heightMin" style="width:77px;" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="宽度：" v-if="isBJ">
        <Input type="text" v-model="filterApi.widthMax" style="width:77px;" placeholder="请输入..."></Input>
        <span class="line">-</span>
        <Input type="text" v-model="filterApi.widthMin" style="width:77px;" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem label="长度：" v-if="isBJ">
        <Input type="text" v-model="filterApi.lengthMax" style="width:77px;" placeholder="请输入..."></Input>
        <span class="line">-</span>
        <Input type="text" v-model="filterApi.lengthMin" style="width:77px;" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem>
        <Button type="text" @click="resetFilter">清空</Button>
        <Button type="primary" @click="searchFilter">查询</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        filterData: [{
            title: '品名',
            key: 'ironType',
            list: [],
          }, {
            title: '表面',
            key: 'surface',
            list: [],
          },
          {
            title: '材质',
            key: 'material',
            list: [],
          },
          {
            title: '产地',
            key: 'proPlace',
            list: [],
          }, {
            title: '仓库',
            key: 'storeHouse',
            list: []
          }
        ],
        filterApi: {
          sellCompanyName: '',
          buyCompanyName: '',
          cargoName: '',
          model: '',
          ironType: '',
          material: '',
          surface: '',
          specification: '',
          tolerance: '',
          proPlace: '',
          storeHouse: '',
          heightMax: '',
          heightMin: '',
          widthMax: '',
          widthMin: '',
          lengthMax: '',
          lengthMin: ''
        },
        companyList: [],
        queryLoading: false
      }
    },
    computed: {
      filters() {
        return {
          sellCompanyName: this.filterApi.sellCompanyName,
          buyCompanyName: this.filterApi.buyCompanyName,
          cargoName: this.filterApi.cargoName,
          model: this.filterApi.model,
          ironType: this.filterApi.ironType,
          material: this.filterApi.material,
          surface: this.filterApi.surface,
          specification: this.filterApi.specification,
          proPlace: this.filterApi.proPlace,
          storeHouse: this.filterApi.storeHouse,
          tolerance: this.filterApi.tolerance,
          heightMax: this.filterApi.heightMax,
          heightMin: this.filterApi.heightMin,
          widthMax: this.filterApi.widthMax,
          widthMin: this.filterApi.widthMin,
          lengthMax: this.filterApi.lengthMax,
          lengthMin: this.filterApi.lengthMin,
        };
      },
      isBJ() {
        return this.filterApi.ironType == '不锈钢板' || this.filterApi.ironType == '不锈钢卷'
      }
    },
    methods: {
      // 获取品类       
      getIronTypes() {
        return this.$http.get(this.api.findAllIronType)
      },
      // 获取材质
      getMaterials() {
        return this.$http.get(this.api.findAllMaterial)
      },
      // 获取表面
      getSurFaces() {
        return this.$http.get(this.api.findAllSurface)
      },
      // 获取产地
      getPlaces() {
        return this.$http.get(this.api.findAllProPlace)
      },
      //  获取仓库
      getHouse() {
        return this.$http.get(this.api.findAWareHouse)
      },
      searchFilter(){
        this.$emit('on-change', this.filters);
      },
      resetFilter() {
          Object.keys(this.filterApi).forEach(key => this.filterApi[key] = '');
          this.$emit('on-change', this.filters);
      },
      //  供应商
      remoteMethod(query) {
        if (query != '') {
          this.queryLoading = true;
          let params = {
            pageSize: 99,
            currentPage: 1,
            qq: '',
            fax: '',
            contactNum: '',
            contact: '',
            companyName: query
          }
          this.$http.post(this.api.findBusinessList, params).then(res => {
            if (res.code === 1000) {
              this.queryLoading = false;
              this.companyList = res.data.list;
            }
          })
        } else {
          this.companyList = [];
          this.filterApi.buser = '';
        }
      }
    },
    created() {
      this.$http.all([
        this.getIronTypes(),
        this.getSurFaces(),
        this.getMaterials(),
        this.getPlaces(),
        this.getHouse()
      ]).then(res => {
        res.forEach((el, index) => {
          if (el.code === 1000) {
            this.filterData[index].list.push(...el.data)
          }
        })
      })
    }
  }
</script>

<style lang='less' scoped>
  
</style>