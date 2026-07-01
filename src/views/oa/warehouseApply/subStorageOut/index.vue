<template>
    <div>
        <flow approvalName="供应链子零件出库通知" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="subStorageOut"></flow>
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
