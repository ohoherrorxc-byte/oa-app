<template>
    <div>
        <flow approvalName="License数据核对验收单" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="licensePurchaseContractApplication" :showBaseInfo="false"></flow>
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
