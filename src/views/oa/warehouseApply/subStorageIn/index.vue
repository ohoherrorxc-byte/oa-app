<template>
    <div>
        <flow approvalName="供应链子零件入库通知" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="subStorageIn"></flow>
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
