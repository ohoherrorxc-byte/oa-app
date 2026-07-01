<template>
    <div>
        <flow approvalName="零件转让申请" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="transferParts"></flow>
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