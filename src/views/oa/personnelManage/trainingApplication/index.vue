<template>
    <div>
      <flow
        approvalName="培训申请"
        :detailId="businessId"
        :processInstanceId="processInstanceId"
        componentTag="trainingApplication"
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