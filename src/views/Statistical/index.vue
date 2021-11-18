<template>
<div class="statistical">
        <iframe id="reportFrame" frameBorder="0"
        :src="frStaffUrl + '/demo/analytics/hr/员工变化查询分析.cpt'"></iframe>
</div>
</template>

<script>
export default {
    data () {
        return {
            frStaffUrl: window.location.origin + '/webroot/decision/view/report?viewlet='
        }
    },
    methods: { }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.statistical {
    width: calc(100vw - 24px);
    height: calc(100vh - #{$headerHeight + 28px});
    overflow: hidden;
    display: flex;
    flex-direction: column;
    #reportFrame {
        flex: 1;
    }
}

</style>