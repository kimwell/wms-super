<template>
  <div>
    <storehouse title="仓库"></storehouse>
    <discount title="优惠信息模板"></discount>
  </div>
</template>

<script>
    import storehouse from './storehouse.vue'
    import discount from './discount.vue'
    export default {
        components: {
            storehouse,
            discount,
        }
    }
</script>
