<template>
    <div>
        <flow approvalName="采购合同申请" :detailId="businessId" :processInstanceId="processInstanceId"
            componentTag="purchaseApproval" >
        </flow>
    </div>
</template>

<script>
import flow from '@/components/flow/index'
export default {
    components: { flow },
    data() {
        return {
            processInstanceId: null
        }
    },
    mounted() {
        this.processInstanceId = this.$route.query.processInstanceId
        this.businessId = this.$route.query.businessId
    }
}
</script>