<template>
  <div class="page-wrapper">
    <Form :mode="pageApi" :label-width="100" inline>
      <FormItem label="客户公司名称：">
        <Input type="text" v-model="pageApi.customerName" placeholder="请输入..."></Input>
      </FormItem>
      <FormItem>
        <Button type="warning" @click.native="resetFilter">清除</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pageApi: {
          customerName: '',

        }
      }
    },
    methods: {
      resetFilter(){

      }
    }
  }
</script>

<style lang='less' scoped>
  
</style>