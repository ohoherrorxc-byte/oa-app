<template>
    <div>
        <flow approvalName="BOM及框架采购合同订单" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="bomPurchaseOrderApplication" :showBaseInfo="false" :showOtherInfo="false"></flow>
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
