<template>
    <div>
        <flow approvalName="资产报废申请" :approvalSave="true" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="scrappingApplication"></flow>
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