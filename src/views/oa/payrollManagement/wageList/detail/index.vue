<template>
    <div>
        <div v-for="(item, index) in formList">
            <basic-container>
                <div v-if="index === 0" class="fr pr30">
                    <el-button v-if="isEdit" type="primary" @click="submit">保 存</el-button>
                    <el-button @click="back">返回</el-button>
                </div>
                <div class="mb15">{{ item.label }}</div>
                <el-form label-width="110px">
                    <div class="all-form">
                        <el-form-item v-for="subItem in item.children" :label="subItem.label">
                            <p v-if="!isEdit"> {{ form[subItem.prop] }}</p>
                            <div v-else>
                                <el-date-picker style='width: 100%;' v-if="isDateType(subItem)" v-model="form[subItem.prop]"
                                    :type="subItem.type">
                                </el-date-picker>
                                <avue-input-tree v-else-if="isDepartment(subItem)" :check-strictly="true" ref="deptTree"
                                    node-key="id" v-model="form.deptName" placeholder="请选择内容" :dic="departmentList"
                                    :props="deptProps"></avue-input-tree>
                                <el-input v-else v-model="form[subItem.prop]"></el-input>
                            </div>
                        </el-form-item>
                    </div>
                </el-form>

            </basic-container>
        </div>
    </div>
</template>
<script>

import { mapGetters } from "vuex";
import option from './option.js'
import { getDeptTree } from "@/api/organizationalStructure/department";
import PayrollManagementApi from '@/api/payrollManagement/index'
export default {
    data() {
        return {
            deptProps: {
                label: "title",
                value: "title",
                children: "children",
            },
            form: {},
            formList: [],
            departmentList: [],
            isEdit: false
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),

    },
    mounted() {
        this.formList = option
        this.$nextTick(() => {
            this.isEdit = this.$route.query.isEdit
        })
        this.getDetail()
        this.getDepartment()
    },
    methods: {
        async getDetail() {
            let res = await PayrollManagementApi.salaryInfoDetail(this.$route.query.id);
            if (res.data.code === 200 || res.data.code === 0) {
                this.form = res.data.data;
            }
        },
        async getDepartment() {
            let res = await getDeptTree(629965)
            if (res.data.code === 0 || res.data.code === 200) {
                this.departmentList = res.data.data
            }
        },
        async submit() {
            let res = await PayrollManagementApi.salaryInfoUpdate(this.form)
            if (res.data.code === 0 || res.data.code === 200) {
                this.$message.success('提交成功')
                this.$router.push('/oa/payrollManagement/payrollDataManagement/index')
            }
        },
        back(){
            this.$router.back()
        },
        isDepartment(item) {
            return item.slot
        },
        isDateType(item) {
            return item.type === 'date' || item.type === 'year'
        }
    },
};
</script>
  
<style lang="scss" scoped>
.all-form {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
        width: 31%;
    }
}
</style>
  