<template>
    <div>
        <basic-container>
            <div class="fr ">
                <el-button v-if="isEdit" type="primary" @click="submit">提 交</el-button>
                <el-button type="" @click="back">返 回</el-button>
            </div>
            <el-form label-width="110px">
                <div class="all-form pt15">
                    <el-row>
                        <el-col v-for="item in option.list" :span="span(item)">
                            <el-form-item :label="item.label">
                                <p v-if="!isEdit"> {{ item.format?item.format(form[item.prop]):form[item.prop] }}</p>
                                <div v-else>
                                    <el-date-picker :value-format="item.valueFormat" style='width: 100%;' v-if="isDateType(item)" v-model="form[item.prop]"
                                        :type="item.type">
                                    </el-date-picker>
                                    <avue-input-tree v-else-if="isDepartment(item)" :check-strictly="true" ref="deptTree"
                                        node-key="id" v-model="form.deptId" placeholder="请选择内容" :dic="departmentList"
                                        :props="deptProps"></avue-input-tree>
                                    <el-input v-else v-model="form[item.prop]"></el-input>
                                </div>
                            </el-form-item></el-col>
                    </el-row>
                </div>
            </el-form>

        </basic-container>
    </div>
</template>
  
<script>

import { mapGetters } from "vuex";
import option from './option.js'
import PayrollManagementApi from '@/api/payrollManagement/index'
import { getDeptTree } from "@/api/organizationalStructure/department";
export default {
    data() {
        return {
            deptProps: {
                label: "title",
                value: "id",
                children: "children",
            },
            form: {},
            option: {},
            isEdit: false
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },

    mounted() {
        this.option = option
        this.$nextTick(() => {
            this.isEdit = this.$route.query.isEdit
        })
        this.getDepartment()
        this.getDetail()
    },
    methods: {
        span(item) {
            return item.span ? item.span : 12
        },
        async getDetail() {
            let res = await PayrollManagementApi.yearEndBonusDetail(this.$route.query.id);
            if (res.data.code === 200||res.data.code === 0) {
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
            let res = await PayrollManagementApi.yearEndBonusUpdate(this.form)
            if(res.data.code===200||res.data.code===0){
                this.$message.success('提交成功')
                this.$router.back()
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
    width: 100%;
}

.text-center {
    text-align: center;
    padding: 20px;
}
</style>
  