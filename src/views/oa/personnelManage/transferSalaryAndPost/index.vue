<template>
    <div>
      <flow
        approvalName="调薪调岗申请单"
        :detailId="businessId"
        :processInstanceId="processInstanceId"
        componentTag="transferSalaryAndPost"
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