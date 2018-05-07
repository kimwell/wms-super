<template>
  <div>
    <subNav :navData="routerTabs"></subNav>
    <router-view></router-view>
  </div>
</template>

<script>
  import subNav from '@/components/basics/nav/index'
  export default {
    components: {
      subNav
    },
    data() {
      return {
        routerTabs: [{
          name: '需要处理的任务',
          pathName: 'treated',
        }, {
          name: '已经处理的任务',
          pathName: 'untreated',
        }]
      }
    },
    methods: {},
    created() {}
  }
</script>

<style lang='less' scoped>
  
</style>