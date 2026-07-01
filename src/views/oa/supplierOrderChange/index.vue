<template>
    <div>
        <flow ref="flowSubmit" :showOtherInfo="false" approvalName="供应商订单变更" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="supplierOrderChange"></flow>
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