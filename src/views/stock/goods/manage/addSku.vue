<template>
  <div>
 
  </div>
</template>

<script>
import uploadPic from '@/components/basics/uploadPic'
  export default {
    components:{
      uploadPic
    },
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      item: {
        type: Object
      }
    },
    data() {
      return {
        ref: 'form' + new Date().getTime(),
        rules: {
          ownerName: [{
            required: true,
            message: '不能为空',
            trigger: 'change'
          }],
        },
        companyList: [],
        queryLoading: false,
        ownerName: '',
        itemData: {},
        isSku: false
      }
    },
    computed:{

    },
    methods: {
      save() {
        console.log('save')
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
          this.itemData.ownerName = '';
          this.itemData.ownerId = '';
        }
      },
      //  显示添加sku
      showAdd(){
        this.isSku = true;
      },
    },
    created() {
      console.log(this.isEdit)
      console.log(this.item)
      this.itemData = this.item || {};
      this.itemData.productImg = this.itemData.productImg.split(',')
      if (this.isEdit) {
        this.ownerName = this.item.ownerName;
        this.item.ownerName = `${this.item.ownerName}-${this.item.ownerId}`
      }
    }
  }
</script>

<style lang='less' scoped>

</style>