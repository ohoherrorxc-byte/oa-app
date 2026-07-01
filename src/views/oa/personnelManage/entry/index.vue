<template>
    <div>
        <flow approvalName="人员入职申请"  :slotForm="form" :canWriteInfo='true' :detailId="businessId"
            :processInstanceId="processInstanceId" :approvalSave="true" componentTag="entryWorkshop">
            <template slot="baseInfo">
                <el-form>
                    <el-form-item :label="$t('entry.instructions')"  label-width="100px">
                        <el-input :disabled="!isStep1()" type="textarea" v-model="form.joinRemark"></el-input>
                    </el-form-item>
                </el-form>
            </template>
        </flow>
    </div>
</template>

<script>
import flow from '@/components/flow/index'
import EntryWorkshopApi from "@/api/entryWorkshop/index.js";
export default {
    components: { flow },
    data() {
        return {
            processInstanceId: "",
            form: {
                joinRemark: ''
            }
        }
    },
    mounted() {
        this.processInstanceId = this.$route.query.processInstanceId
        this.businessId = this.$route.query.businessId
        if (this.businessId) {
            this.getDetail();
        }
    },
    methods: {
        isStep1() {
            return !this.$route.query.businessId || this.$route.query.isEdit;
        },
        async getDetail() {
            let res = await EntryWorkshopApi.details(this.businessId);
            if (res.data.code === 200) {
                this.form.joinRemark = res.data.data.joinRemark;
                this.$emit("getFormData", this.form);
            }
        },
    }
}
</script>

<style scoped>
.avue-form__menu{
  display: none;
}
</style>