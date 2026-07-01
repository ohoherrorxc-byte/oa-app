<template>
    <div>
        <flow approvalName="一般通用采购申请" :detailId="businessId"  :processInstanceId="processInstanceId" componentTag="purchaseApplication" :showBaseInfo="false"></flow>
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
