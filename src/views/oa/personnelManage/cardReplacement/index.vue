<template>
  <div>
    <flow
      approvalName="补卡申请"
      :detailId="businessId"
      :processInstanceId="processInstanceId"
      componentTag="cardReplacement"
    ></flow>
  </div>
</template>

<script>
import flow from "@/components/flow/index";
export default {
  components: { flow },
  data() {
    return {
      processInstanceId: "",
    };
  },
  mounted() {
    console.log(this.$route.meta)
    this.processInstanceId = this.$route.query.processInstanceId;
    this.businessId = this.$route.query.businessId;
  },
  methods: {},
};
</script>