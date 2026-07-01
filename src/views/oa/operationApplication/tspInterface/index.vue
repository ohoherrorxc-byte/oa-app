<template>
    <div>
        <flow :showOtherInfo="false" approvalName="TSP/FOTA接口申请" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="tspInterface" :approvalSave="true"></flow>
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