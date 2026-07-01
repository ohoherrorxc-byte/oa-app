<template>
    <div>
        <flow approvalName="TSP/FOTA上线申请单" :showOtherInfo="false" :approvalSave="true" :showBaseInfo="false" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="tspOnline"></flow>
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