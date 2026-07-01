<template>
    <div>
        <flow approvalName="资产入库申请" :approvalSave="true" :slotForm="form" :canWriteInfo="true"  @titleChange="titleChange" @getFormData="getFormData" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="storageApplication"></flow>
    </div>
</template>

<script>
import flow from '@/components/flow/index'
export default {
    components: { flow },
    data() {
        return {
            processInstanceId: "",
            form:{
                titleName:'资产入库'
            }
        }
    },
    mounted() {
        this.processInstanceId = this.$route.query.processInstanceId
        this.businessId = this.$route.query.businessId
    },
    methods:{
        titleChange(data){
            // console.log(data)
            this.form.titleName = data
        }
    }
}
</script>