<template>
  <div>
    <flow
      approvalName="请假申请"
      :detailId="businessId"
      :processInstanceId="processInstanceId"
      componentTag="askForLeave"
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
    this.processInstanceId = this.$route.query.processInstanceId;
    this.businessId = this.$route.query.businessId;
  },
  methods: {},
};
</script>
