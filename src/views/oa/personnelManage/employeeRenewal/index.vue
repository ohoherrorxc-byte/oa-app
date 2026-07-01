<template>
    <div>
        <flow approvalName="员工续签申请" @titleChange="titleChange" @getFormData="getFormData" :canWriteInfo='true'  :slotForm="form"  :detailId="businessId" :processInstanceId="processInstanceId" componentTag="employeeRenewal">
            <template slot="baseInfo">
                <el-form :model="form" :rules="rules">
                    <el-form-item label="续签说明" :label-width="isMobile ? '70px' : '120px'" prop="applyReason">
                        <el-input type="textarea" v-model="form.applyReason"
                        autosize  :disabled="this.businessId && !this.$route.query.isEdit"></el-input>
                    </el-form-item>
                </el-form>
            </template>
        </flow>
    </div>
</template>

<script>
import flow from '@/components/flow/index'
export default {
    components: { flow },
    data() {
        return {
            processInstanceId: "",
            form: {
                applyReason: null,
                titleName:'员工续签申请'
            },
            rules: {
                applyReason: [
                    { required: true, message: '续签说明不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.processInstanceId = this.$route.query.processInstanceId
        this.businessId = this.$route.query.businessId
    },
    methods: {
        getFormData(data) {
            console.log(data)
            this.form.applyReason = data.applyReason         
        },
        titleChange(data){
            // console.log(data)
            this.form.titleName = data
        }
    }
}
</script>