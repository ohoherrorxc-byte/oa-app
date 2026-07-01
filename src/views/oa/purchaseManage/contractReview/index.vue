<template>
    <div>
        <flow approvalName="一般通用采购合同评审" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="contractReview"></flow>
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