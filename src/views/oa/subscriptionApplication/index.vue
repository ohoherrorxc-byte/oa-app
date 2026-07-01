<template>
    <div>
        <flow approvalName="认款申请单" :approvalSave="true" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="subscriptionApplication" :showBaseInfo="false" :showOtherInfo="false"></flow>
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
