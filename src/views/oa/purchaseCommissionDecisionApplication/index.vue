<template>
    <div>
        <flow approvalName="采购委员会决议申请" :approvalSave="true" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="purchaseCommissionDecisionApplication" :showBaseInfo="false" :showOtherInfo="false"></flow>
    </div>
</template>

<script>
import flow from '@/components/flow/index'
export default {
    components: { flow },
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
