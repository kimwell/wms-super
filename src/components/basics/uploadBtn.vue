<template>
  <div class="upload-wrapper">
    <Upload :show-upload-list="false" :headers="ajaxHead" :action="api.uploadApi" :format="['jpg','jpeg','png']" :max-size="2048" :on-success="handleSuccess" :on-format-error="handleFormatError" :on-exceeded-size="handleMaxSize" :before-upload="setLoading" :on-error="ctryErr">
      <Button type="ghost" :loading="loading" icon="ios-cloud-upload-outline">上传图片</Button>
    </Upload>
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import * as types from "@/store/types";
  export default {
    props: {
      value: {
        type: String
      }
    },
    data() {
      return {
        imgSrc: '',
        loading: false
      }
    },
    computed: {
      ...mapGetters(['authorization', 'loginId']),
      ajaxHead() {
        return {
          authorization: this.authorization,
          loginId: this.loginId
        }
      }
    },
    watch: {
      imgSrc(val) {
        this.$emit('input', val)
      },
      value(val) {
        this.imgSrc = val;
      }
    },
    methods: {
      setLoading() {
        this.loading = true;
      },
      handleSuccess(res, file) {
        let pres = JSON.parse(res);
        this.imgSrc = this.api.baseAliyun + pres[0].url;
        this.$Message.success('上传成功！');
        this.loading = false;
      },
      ctryErr(error) {
        this.$Notice.warning({
          title: '上传异常!',
          desc: error
        });
        this.loading = false;
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '上传文件类型错误！',
          desc: '您上传的： ' + file.name + ' 格式不正确, 请选择(.png,.jpg,.jpeg)后缀的文件。'
        });
        this.loading = false;
      },
      handleMaxSize(file) {
        this.$Notice.warning({
          title: '上传文件超出尺寸',
          desc: '您上传的：  ' + file.name + ' 太大了, 不得超过2MB。'
        });
        this.loading = false;
      }
    },
    mounted() {
      if (this.value)
        this.imgSrc = this.value;
    }
  }
</script>

<style lang='less' scoped>
  .upload-wrapper{
    display: inline-block;
  }
</style>