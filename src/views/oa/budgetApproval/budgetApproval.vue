<template>
    <div>
        <flow approvalName="项目预算申请" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="budgetApproval" :approvalSave="true"></flow>
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