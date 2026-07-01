<template>
    <div>
        <flow :otherFileMsg="otherFileMsg" :slotForm="form" @getFormData="getFormData"  approvalName="预算追加与调整" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="budgetAdditions">
            <template slot="baseInfo">
                <el-form class="form-all" :model="form" :rules="rules" :label-width="isMobile ? '70px' : '120px'" :disabled="disabled">
                    <el-form-item  :label="$t('budgetAdditions.adjustReason')" style="width: 100%;" prop="applyReason" >
                        <el-input autosize type="textarea" v-model="form.applyReason" :disabled="this.businessId && !this.$route.query.isEdit"></el-input>
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
            form:{
                applyReason:null
            },
            rules: {
                applyReason: [
                    { required: true, message: '调整说明不能为空', trigger: 'blur' }
                ]
            },
            otherFileMsg:"请上传总办会纪要",
           
        }
    },
    mounted() {
        this.processInstanceId = this.$route.query.processInstanceId
        this.businessId = this.$route.query.businessId
    },
    methods:{
        getFormData(data) {
            this.form.applyReason = data.applyReason
        }
    }
}
</script>