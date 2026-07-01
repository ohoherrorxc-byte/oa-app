<template>
    <div>
        <flow approvalName="预算追加与调整" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="budgetAdditionsAndAdjustments"></flow>
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