<style lang="less" scoped>
    .unit-container {
        width: 100%;
    }
</style>

<template>
    <div class="unit-container">
        <unitSection></unitSection>
        <goodsSection></goodsSection>
    </div>
</template>

<script>
    import unitSection from './unit.vue'
    import goodsSection from './goodsUnit.vue'
    export default {
        components: {
            unitSection,
            goodsSection
        },
    }
</script>
