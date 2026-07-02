<template>
  <div>
    <flow approvalName="验收申请单" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="acceptApply" :showBaseInfo="false"></flow>
  </div>
</template>

<script>
// 异步加载 flow 组件，避免点击菜单时一次性把 flow 全家桶（baseInfo / tableForm /
// timeline / wordModel / emailModel / signature + 全部子依赖）同步塞进首屏 chunk，
// 造成肉眼可见的白屏等待。
export default {
  components: {
    flow: () => import(/* webpackChunkName: "flow" */ '@/components/flow/index')
  },
  data() {
    return {
      processInstanceId: "",
    }
  },
  mounted() {
    this.processInstanceId = this.$route.query.processInstanceId
    this.businessId = this.$route.query.businessId
  },
  methods:{
  }
}
</script>
