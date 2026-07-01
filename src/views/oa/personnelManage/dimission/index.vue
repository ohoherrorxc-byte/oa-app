<template>
    <div>
        <flow approvalName="人员离职申请" :approvalSave="true" :showBaseInfo="false" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="dimission"></flow>
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