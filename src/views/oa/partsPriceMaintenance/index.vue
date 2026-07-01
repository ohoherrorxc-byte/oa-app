<template>
    <div>
        <flow ref="flowSubmit" :showOtherInfo="false" approvalName="零件价格维护" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="partsPriceMaintenance"></flow>
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
        submit(){
            this.$refs.flowSubmit.submit()
        }
    }
}
</script>