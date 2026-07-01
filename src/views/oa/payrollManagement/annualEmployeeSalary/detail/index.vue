<template>
    <div>
        <div v-for="(item, index) in formList">
            <basic-container>
                <div v-if="index === 0 " class="fr pr30">
                    <el-button v-if="isEdit" type="primary" @click="submit">保 存</el-button>
                    <el-button type="" @click="back">返 回</el-button>
                </div>
                <div class="mb15">{{ item.label }}</div>
                <el-form label-width="130px">
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
                                <el-input v-model="form[subItem.prop]" v-else></el-input>
                            </div>
                        </el-form-item>
                    </div>
                </el-form>
                <div class="p20 textHtml" v-if="index === 1" v-html="textHtml"></div>
                <!-- 1584788026586959873 -->
            </basic-container>
        </div>

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
                value: "title",
                children: "children",
            },
            form: {},
            formList: [],
            departmentList: [],
            isEdit: false,
            textHtml: ` 注：</br>

1、年度工资性收入仅统计当年度发放的部分，跨年度发放不计入。工资性收入的统计口径以国家和地方相关部门发布的文件为准</br>

2、【其他】涵盖当年度发放的目标浮动奖金、项目奖、特别奖励等各类收入</br>

3、【社保缴费月份数】为当年度实际缴纳社保的月份数，以社保局统计数字为准</br>

4、【月平均工资性收入】作为职工下一周期社保和公积金的缴费基数（相关部门有其他通知的除外）</br>

5、如对统计数字有疑问的，请于发布之日起五个工作日内至综管组进行沟通反馈；如在期限内无反馈的，视作认可数字准确性，对数据无异议`
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
        this.getDepartment()
        this.getDetail()
    },
    methods: {
        async getDetail() {
            let res = await PayrollManagementApi.annualWorkerSalaryDetail(this.$route.query.id);
            console.log(res)
            if (res.data.code === 200 || res.data.code === 0) {
                this.form = res.data.data;
            }
            console.log(this.form)
        },
        async getDepartment() {
            let res = await getDeptTree(629965)
            if (res.data.code === 0 || res.data.code === 200) {
                this.departmentList = res.data.data
            }
        },
        async submit() {
            let res = await PayrollManagementApi.annualWorkerSalaryUpdate(this.form)
            if (res.data.code === 200 || res.data.code === 0) {
                this.$router.back()
            }
        },
        back() {
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
        width: 50%;
    }
}

.textHtml {
    line-height: 28px;
    font-size: 14px;
}

.text-center {
    text-align: center;
    padding: 20px;
}
</style>
  