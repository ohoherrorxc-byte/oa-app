<template>
    <div>
      <flow ref="flowRef"  approvalName="公司内部划款申请单" @getFormData="getFormData" @allTotalAmount="allTotalAmount" :slotForm="form"
        :detailId="businessId" :processInstanceId="processInstanceId" componentTag="internalTransfer" >
      
      </flow>
    </div>
  </template>
  
  <script>
  import flow from '@/components/flow/index'
  import { mapGetters } from 'vuex'
  export default {
    components: { flow },
    data() {
      return {
        processInstanceId: "",
        form: {
         
  
        },
        rules: {
         
        }
      }
    },
    computed: {
      ...mapGetters(["isMobile"]),
      disabled() {
        return this.businessId && !this.$route.query.isEdit;
      },
    },
    mounted() {
      this.processInstanceId = this.$route.query.processInstanceId
      this.businessId = this.$route.query.businessId
    },
    methods: {
     
    }
  }
  </script>
  
  <style lang="scss" scoped>
  .form-all {
    display: flex;
    flex-wrap: wrap;
  
    @media (min-width: 768px) {
      .el-form-item {
        width: 50%;
      }
    }
    @media (max-width: 768px) {
      .el-form-item {
        width: 100%;
      }
    }
  }
  </style>