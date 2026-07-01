<template>
    <basic-container>
        <p class="table-title">
            <span></span>{{ $t('budgetAdditions.applyInfo') }}
        </p>
        <p class="text-hint">
            {{ $t('budgetAdditions.note') }}
        </p>
        <el-form :disabled="disabled" ref="form" :model="form" label-width="120px" :rules="rules">
            <el-form-item :label="$t('budgetAdditions.isProjectRelated')" prop="isAboutProject">
                <el-select v-model="form.isAboutProject" @change="changeTypeProject">
                    <el-option value="是" label="是"></el-option>
                    <el-option value="否" label="否"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('budgetAdditions.relatedProject')" prop="projectNo">
                <el-select v-model="form.projectNo" clearable filterable :disabled="form.isAboutProject === '否'">
                    <el-option v-for="item in projectList" :key="item.id" :label="item.projectName"
                        :value="item.projectNo"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('budgetAdditions.signDept')">
                <el-select v-model="form.deptList" multiple>
                    <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('budgetAdditions.adjustTotal')" prop="changeTotal">
                {{ getAmountTotal() }}
            </el-form-item>
            <el-form-item label-width="0" style="width: 100%;">
                <div class="fr" v-if="!disabled">
                    <span class="add-icon" @click="addExpenseList">+</span>
                    <span class="dec-icon" @click="deleteExpenseList">―</span>
                    <img @click="copyExpenseList" class="mt3" src="@/assets/svg/copy.svg" width="24" alt="">
                </div>
                <el-table ref="multipleTable" :data="form.expenseList"
                    :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }" @selection-change="budgetSelectionChange"
                    class="mb20 table-now">
                    <el-table-column type="selection" width="42"></el-table-column>
                    <el-table-column :label="$t('budgetAdditions.costCenter')" prop="costName" :width="isPdfDown ? 60 : ''">
                        <template slot="header">
                            {{ $t('budgetAdditions.costCenter') }}
                            <span class="red">*</span>
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'expenseList.' + scope.$index + '.costName'" :rules="rules.costName"
                                style="width: 100%;">
                                <el-select v-if="!disabled" v-model="scope.row.costName"
                                    @change="getCostItem(scope.row, scope.$index)" placeholder="">
                                    <el-option v-for="item in costList" :label="item.costName"
                                        :value="item.costName"></el-option>
                                </el-select>
                                <div v-else>{{ scope.row.costName }}</div>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="costId" label="成本代码"></el-table-column> -->
                    <el-table-column :label="$t('budgetAdditions.budgetSubject')" prop="subjectName" :width="isPdfDown ? 90 : 450">
                        <template slot="header">
                            {{ $t('budgetAdditions.budgetSubject') }}
                            <span class="red">*</span>
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'expenseList.' + scope.$index + '.subjectName'" :rules="rules.subjectName"
                                style="width: 100%;">
                                <elSelectTree v-if="!disabled" @getValue="getSubjetRow($event, scope.row, scope.$index)"
                                    :value="{ name: scope.row.subjectName }" :options="subjectList" :accordion="false"
                                    :disabled="disabled" :props="deptProps"></elSelectTree>
                                <div v-else>{{ scope.row.subjectName }}</div>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('budgetAdditions.subjectCode')" prop="subjectCode" :width="isPdfDown ? 60 : ''">
                    </el-table-column>
                    <el-table-column :label="$t('budgetAdditions.budgetInfo')" :width="isPdfDown ? 100 : ''">
                        <template slot-scope="scope">
                            <div v-html="scope.row.budgetInfo"></div>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('budgetAdditions.adjustAmount')" :width="isPdfDown ? 60 : ''">
                        <template slot="header">
                            {{ $t('budgetAdditions.adjustAmount') }}
                            <span class="red">*</span>
                        </template>
                        <template slot-scope="scope">
                            <el-form-item :prop="'expenseList.' + scope.$index + '.changeMoney'" :rules="rules.changeMoney"
                                style="width: 100%;">
                                <el-input v-if='!disabled' v-model="scope.row.changeMoney"
                                    @change="updateMoney(scope.row)"></el-input>
                                <div v-else>{{ $formatAmt(scope.row.changeMoney) }}</div>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </basic-container>
</template>

<script>
import CostApi from '@/api/cost/index'
import Upload from '@/components/upload/index'
import subjectManageApi from '@/api/subjectManage'
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import { getProjectList } from "@/api/contract/contractProject";
import BudgetAdditionsApi from "@/api/budgetAdditions/index.js";
import elSelectTree from '@/components/elSelectTree/index'
export default {
    data() {
        return {
            form: {
                expenseList: [
                    {
                        costName: null,
                        costId: null,
                        subjectName: null,
                        subjectCode: null,
                        parentSubjectId: null,
                        subjectId: null,
                        avaliableFee: null,
                        costedFee: null,
                        underApprovalFee: null,
                        budgetInfo: null,
                        key: Date.now()
                    }
                ],
                isAboutProject: null,
                projectNo: null,
                changeTotal: null,
                deptList: []
            },
            deptProps: {
                label: "subjectName",
                value: "id",
                children: "childList",
            },
            searchForm: {
                currentPage: 1,
                pageSize: 10000,
                costCenterId: null
            },
            rules: {
                projectNo: [{ required: false, message: this.$t('budgetAdditions.relatedProjectRequired'), trigger: 'change' }],
                subjectName: [{ required: true, message: this.$t('budgetAdditions.budgetSubjectRequired'), trigger: 'change' }],
                changeMoney: [{ required: true, message: this.$t('budgetAdditions.adjustAmountRequired'), trigger: 'blur' }],
            },

            rowSum: [],
            subjectList: [],
            projectList: [],
            deptList: [],
            costList: [],
            multipleSelection: [],
            businessId: null,
            isEdit: false,
        };
    },
    components: { elSelectTree, Upload },
    props: {
        isPdfDown: {
            type: Boolean,
            default: false
        },
        slotForm: {
            type: Object,
            default: {}
        }
    },
    mounted() {
        this.getCostList()
        this.getContractProjectList()
        this.businessId = this.$route.query.businessId;
        this.isEdit = this.$route.query.isEdit;
        if (this.businessId) {
            this.getDetail();
        }
        this.getDeptList();
    },
    computed: {
        disabled() {
            return this.businessId && !this.isEdit;
        },
    },
    methods: {
        async getDetail() {
            let res = await BudgetAdditionsApi.getDetail({ businessId: this.businessId });
            if (res.data.code === 200 || res.data.code === 0) {
                this.form = res.data.data;
                console.log(this.form)
                this.form.expenseList.map((ele, index) => {
                    this.getFeeDetail(ele, index)
                    ele.key = new Date()+index
                })
                this.$emit("getFormData", this.form);
            }
        },
        changeTypeProject() {
            this.rules.projectNo[0].required = this.form.isAboutProject === '否' ? false : true
            if (this.form.isAboutProject === '否') {
                this.form.projectNo = null
                this.form.projectName = null
            }
        },
        updateMoney(row) {
            if (row.changeMoney) {
                let value =  this.convertToNumber(row.changeMoney)
                if(!this.isNumber(Number(value))){
                    this.$message.error('请填写数字')
                    row.changeMoney = null
                }
            }
        },
        convertToNumber(formattedNumber) {
            if (formattedNumber) {
                return parseFloat(formattedNumber.toString().replace(/,/g, ''));
            }

        },
        isNumber(value) {
            return typeof value === "number" && !isNaN(value);
        },
        getAmountTotal() {
            let sum
            const values = this.form.expenseList.map(item => Number(this.convertToNumber(item.changeMoney)));
            if (!values.every(value => isNaN(value))) {
                sum = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                }, 0);

            } else {
                sum = null;
            }
            this.form.changeTotal = Number(sum).toFixed(2)
            this.$emit('changeFileRequest', Number(this.form.changeTotal) > 0)
            return this.$formatAmt(this.form.changeTotal)
        },
        getContractProjectList() {
            getProjectList().then((res) => {
                this.projectList = res.data.data;
            });
        },
        getDeptList() {
            getLazyList(this.parentId, this.tenantId).then((res) => {
                this.deptList = res.data.data;
            });
        },
        async getCostList() {
            let res = await CostApi.getList()
            if (res.data.code === 0) {
                this.costList = res.data.data.records
            }
        },
        async getSubjectList(costId) {
            this.searchForm.costCenterId = costId
            let res = await subjectManageApi.getList(this.searchForm)
            if (res.data.code === 0) {
                this.subjectList = res.data.data
            }
        },
        getSubjetRow(item, row, index) {
            if (!item) return
            row.subjectName = `${item.parentSubjectName}/${item.subjectName}`//${item.parentSubjectName}/
            row.subjectCode = item.subjectCode
            row.parentSubjectId = item.parentSubjectId
            row.subjectId = item.subjectId
            row.avaliableFee = item.availableBudget
            row.costedFee = item.expensesIncurred
            row.underApprovalFee = item.expensesUnderReview
            row.budgetInfo = `可用预算:  ${item.availableBudget || 0.00}<br/><span style='color:blue'>已发生费用:  ${item.expensesIncurred || 0.00}</span><br/><span style='color:green'>审批中费用: ${item.expensesUnderReview || 0.00}</span>`
            this.getFeeDetail(row, index)
        },
        getCostItem(row, index) {
            let obj = this.costList.find(ele => {
                return ele.costName === row.costName
            })
            this.dealDept(row.costName)
            if (!obj) return
            row.costId = obj.id
            row.subjectName = null
            row.subjectCode = null
            row.parentSubjectId = null
            row.subjectId = null
            row.avaliableFee = null
            row.costedFee = null
            row.underApprovalFee = null
            row.budgetInfo = null
            this.$set(this.form.expenseList, index, row)
            this.getSubjectList(row.costId)
        },
        dealDept(costName) {
            let row = this.deptList.find(ele => {
                return ele.deptName === costName
            })
            // console.log(row)
            if (!row) return
            if (!this.form.deptList.includes(row.id)) {
                this.form.deptList.push(row.id)
            }
        },
        async getFeeDetail(row, index) {
            if (row.costId && row.subjectId) {
                let res = await subjectManageApi.subjectMoney(row.subjectId, row.costId)
                if (res.data.code === 0) {
                    let data = res.data.data
                    row.parentSubjectId = data.parentSubjectId
                    row.budgetInfo = `可用预算:  ${data.availableBudget || 0.00}<br/><span style='color:blue'>已发生费用:  ${data.expensesIncurred || 0.00}</span><br/><span style='color:green'>审批中费用: ${data.expensesUnderReview || 0.00}</span>`
                    this.$set(this.form.expenseList, index, row)
                }
            }
        },
        addExpenseList() {
            this.form.expenseList.push({
                key: Date.now(),
                costName: null,
                costId: null,
                subjectName: null,
                subjectCode: null,
                parentSubjectId: null,
                subjectId: null,
                avaliableFee: null,
                costedFee: null,
                underApprovalFee: null,
                budgetInfo: null,
            })
        },
        deleteExpenseList() {
            let keys = this.multipleSelection.map(ele => ele.key)
            this.form.expenseList = this.form.expenseList.filter(ele => {
                return !keys.includes(ele.key)
            })
        },
        copyExpenseList() {
            let arr = JSON.parse(JSON.stringify(this.multipleSelection))
            arr.map((ele, index) => {
                ele.key = Date.now() + index
                this.form.expenseList.push(ele)
            })
        },
        budgetSelectionChange(val) {
            this.multipleSelection = val;
        },
        testAmount() {
            if (isNaN(this.form.totalAmount)) {
                this.$message.error("请输入数字");
                this.form.totalAmount = null;
            } else {
                this.form.totalAmount = Number(
                    Number(this.form.totalAmount).toFixed(2)
                );
            }
        },
        groupedByCode() {
            return this.form.expenseList.reduce((acc, item) => {
                acc[item.subjectCode + item.costId] = acc[item.subjectCode + item.costId] || []
                acc[item.subjectCode + item.costId].push(item)
                return acc
            }, {})
        },
        getValue(row, value, key) {
            this.form.subjectList.map((ele) => {
                if (ele.name === row.name) {
                    if (isNaN(value)) {
                        this.$message.error("请输入数字");
                        ele[key] = null;
                    } else {
                        ele[key] = Number(ele[key]).toFixed(2);
                    }
                }
            });
        },
        testMoney() {
            console.log(this.form.expenseList)
            let parentIds = this.form.expenseList.map(ele => ele.parentSubjectId)
            this.form.expenseList.map(ele=>{
                ele.changeMoney = this.convertToNumber(ele.changeMoney)
            })
            let onlyParentIds = [...new Set(parentIds)]
            console.log(onlyParentIds)
            if (onlyParentIds.length > 1) {
                this.$message.error('不能跨项目调整预算')
                return
            }
            let arrGroup = this.groupedByCode()
            // console.log(arrGroup)
            for (let key in arrGroup) {
                if (arrGroup[key].length > 0) {
                    let avaliableFee = Number(arrGroup[key][0].avaliableFee)
                    let arrMoney = arrGroup[key].map(ele => Number(ele.changeMoney))
                    let sum = arrMoney.reduce(function (previousValue, currentValue) {
                        return (Number(previousValue) || 0) + (Number(currentValue) || 0);
                    });
                    if (Number(sum) + Number(avaliableFee) < 0) {
                        this.$message.error('可用预算不足')
                        return false
                    }
                }
            }
            return true
        },
        testForm() {
            if (!this.slotForm.applyReason) {
                this.$message.error('请输入调整说明')
                return
            }
            if (!this.testMoney()) {
                return
            }
            return new Promise((resolve) => {
                this.$refs.form.validate((valid, msg) => {
                    resolve(valid);
                    if (valid) {
                    } else {
                        msg &&
                            this.$message({
                                message: `${Object.values(msg)[0][0].message}`,
                                type: "warning",
                            });
                    }
                });
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.el-form {
    display: flex;
    flex-wrap: wrap;
}

@media (min-width: 768px) {
    .el-form-item {
        width: 48%;
    }
}

.button-bottom {
    width: 100%;
    text-align: center;
}

.text-hint {
    padding: 0 10px 10px;
    color: red;
}
</style>
