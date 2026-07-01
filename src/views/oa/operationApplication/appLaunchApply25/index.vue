<template>
    <div>
        <flow approvalName="APP上线申请单(25版)" :approvalSave="true"
              :detailId="businessId" :processInstanceId="processInstanceId" componentTag="appOnline25"></flow>
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
