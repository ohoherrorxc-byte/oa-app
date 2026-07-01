<template>
    <div>
        <basic-container>
            <span>申请信息</span>
            <avue-form ref="formBaseInfo" :option="option" v-model="form">
                <template slot="subjectName">
                    <elSelectTree v-if="!disabled" :value="{name:form.subjectName}" :disabled="disabled" @getValue="getSubjetRow" :options="subjectList" :accordion="false" :props="deptProps"></elSelectTree>
                   <div v-else class="font12">{{ form.subjectName }}</div>
                    <!-- <avue-input-tree   ref="tree" :disabled="disabled" :defaultExpandAll="true" :check-strictly="true"
                        node-key="id" v-model="form.subjectId" placeholder="请选择内容" :dic="subjectList" :props="deptProps"
                        @change="getSubjetRow" :popper-append-to-body="true"></avue-input-tree> -->
                </template>
                <template slot="payee">
                    <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100" @getPerson="getPerson"
                        :initData="form.payee" :disabled="disabled" :multiple="false">
                    </autoAddress>
                </template>
                <!-- <template slot="costName">
                    <el-select v-model="form.costName" :disabled="disabled" @change="getCostItem">
                        <el-option v-for="item in costList" :label="item.costName" :value="item.costName"></el-option>
                    </el-select>
                </template> -->
            </avue-form>
            <el-form ref="form" :model="form" :rules="rules" :disabled="disabled">
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow">+</span>
                    </div>
                    <el-table ref="multipleTable" :data="form.expenseList" @selection-change="handleSelectionChange"
                        class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column property="feeDate" label="费用日期" align="center">
                            <template slot="header">
                                {{ $t('cityTraffic.feeDate') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'expenseList.' + scope.$index + '.feeDate'" :rules="rules.feeDate" style="width: 100%;">
                                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.feeDate"
                                        type="date" placeholder="选择日期" style="width: 100%;">
                                    </el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="startTime" label="开始日期" align="center">
                            <template slot="header">
                                {{ $t('cityTraffic.startTime') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'expenseList.' + scope.$index + '.startTime'" :rules="rules.startTime" style="width: 100%;">
                                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.startTime"
                                        type="date" placeholder="选择日期" @change="changeRow(scope.row)" style="width: 100%;">
                                    </el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="endTime" label="结束日期" align="center">
                            <template slot="header">
                                {{ $t('cityTraffic.endTime') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'expenseList.' + scope.$index + '.endTime'" :rules="rules.endTime" style="width: 100%;">
                                    <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="scope.row.endTime"
                                        type="date" placeholder="选择日期" @change="changeRow(scope.row)" style="width: 100%;">
                                    </el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="startPlace" label="起始地" align="center">
                            <template slot="header">
                                {{ $t('cityTraffic.startPlace') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'expenseList.' + scope.$index + '.startPlace'"
                                    :rules="rules.startPlace">
                                    <el-input clearable v-model="scope.row.startPlace"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="endPlace" label="目的地" align="center">
                            <template slot="header">
                                {{ $t('cityTraffic.endPlace') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'expenseList.' + scope.$index + '.endPlace'"
                                    :rules="rules.endPlace">
                                    <el-input clearable v-model="scope.row.endPlace"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="reason" label="事由" align="center">
                            <template slot="header">
                                {{ $t('cityTraffic.reason') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'expenseList.' + scope.$index + '.reason'"
                                    :rules="rules.reason">
                                    <el-input clearable v-model="scope.row.reason"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额" align="center">
                            <template slot="header">
                                {{ $t('cityTraffic.amount') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'expenseList.' + scope.$index + '.amount'"
                                    :rules="rules.amount">
                                    <el-input clearable v-model="scope.row.amount"
                                        @blur="getRMB(scope.row, scope.$index)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="currency" label="币种" align="center">
                            <template slot="header">
                                {{ $t('cityTraffic.currency') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'expenseList.' + scope.$index + '.currency'"
                                    :rules="rules.currency">
                                    <el-input clearable v-model="scope.row.currency"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="exchangeRate" label="汇率" align="center">
                            <template slot="header">
                                {{ $t('cityTraffic.exchangeRate') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'expenseList.' + scope.$index + '.exchangeRate'"
                                    :rules="rules.exchangeRate">
                                    <el-input clearable v-model="scope.row.exchangeRate"
                                        @blur="getRMB(scope.row, scope.$index)"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                          <el-table-column property="rmbAmount" :label="$t('cityTraffic.rmbAmount')" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input disabled clearable v-model="scope.row.rmbAmount"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('cityTraffic.operation')" align="center" v-if="!disabled&&form.expenseList.length>1">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-button  type="text" @click="deleteRow(scope.row,'expenseList')" style="color:red">删除</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </basic-container>
    </div>
</template>

<script>
import { mixins } from '../Mixin'
import FinancialManagementApi from '@/api/financialManagement/index'
export default {
    mixins: [mixins],
    data() {
        return {
            form: {
                expenseList: [{}],
                subjectName: null
            },
            formPay: {},
            option: {
                column: [
                    {
                        type: "input",
                        label: this.$t('cityTraffic.subjectName'),
                        span: 12,
                        prop: "subjectName",
                        rules: [
                            {
                                required: true,
                                message: this.$t('cityTraffic.subjectNameRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('cityTraffic.costName'),
                        span: 12,
                        disabled: true,
                        prop: "costName",
                        rules: [
                            {
                                required: true,
                                message: this.$t('cityTraffic.costNameRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        disabled: true,
                        label: this.$t('cityTraffic.subjectCode'),
                        span: 12,
                        prop: "subjectCode",
                    },
                    {

                        type: 'textarea',
                        label: this.$t('cityTraffic.budgetInfo'),
                        disabled: true,
                        span: 12,
                        prop: "budgetInfo",
                    },
                    {
                        type: "input",
                        label: this.$t('cityTraffic.payee'),
                        span: 12,
                        rules: [
                            {
                                required: true,
                                message: this.$t('cityTraffic.payeeRequired'),
                            },
                        ],
                        prop: "payee",
                    },
                    {
                        type: "input",
                        label: this.$t('cityTraffic.bankName'),
                        span: 12,
                        prop: "bankName",
                        disabled: true
                    },
                    {
                        type: "input",
                        label: this.$t('cityTraffic.bankAccount'),
                        span: 12,
                        prop: "bankAccount",
                        disabled: true
                    },
                ],
                labelPosition: "right",
                labelWidth: 160,
                gutter: 0,
                menuBtn: true,
                submitBtn: false,
                emptyBtn: false,
                emptyText: this.$t('cityTraffic.clear'),
                menuPosition: "center",
                detail: false,
                tabs: false,
                disabled: false,
                labelSuffix: " ",
            },
            rules: {
                startTime: [
                    { required: true, message: this.$t('cityTraffic.startTimeRequired'), trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: this.$t('cityTraffic.endTimeRequired'), trigger: 'change' }
                ],

                feeDate: [
                    { required: true, message: this.$t('cityTraffic.feeDateRequired'), trigger: 'change' }
                ],
                startPlace: [
                    { required: true, message: this.$t('cityTraffic.startPlaceRequired'), trigger: 'blur' }
                ],
                endPlace: [
                    { required: true, message: this.$t('cityTraffic.endPlaceRequired'), trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: this.$t('cityTraffic.amountRequired'), trigger: 'blur' }
                ],
                currency: [
                    { required: true, message: this.$t('cityTraffic.currencyRequired'), trigger: 'blur' }
                ],
                exchangeRate: [
                    { required: true, message: this.$t('cityTraffic.exchangeRateRequired'), trigger: 'blur' }
                ],
                reason: [
                    { required: true, message: this.$t('cityTraffic.reasonRequired'), trigger: 'blur' }
                ],
                hotelName: [
                    { required: true, message: this.$t('cityTraffic.hotelNameRequired'), trigger: 'blur' }
                ],
                perkPlace: [
                    { required: true, message: this.$t('cityTraffic.perkPlaceRequired'), trigger: 'blur' }
                ],
                projectType: [
                    { required: true, message: this.$t('cityTraffic.projectTypeRequired'), trigger: 'change' }
                ],
                time: [
                    { required: true, message: this.$t('cityTraffic.timeRequired'), trigger: 'change' }
                ],
                projectName: [
                    { required: true, message: this.$t('cityTraffic.projectNameRequired'), trigger: 'blur' }
                ],
            }
        }
    },
    props: {
        slotForm: {
            type: Object,
            default: {}
        }
    },
    mounted(){
        // console.log('11111111111111111111111')
        // console.log(this.$refs.tree)
    },
    methods: {
        async getDetail() {
            let res = await FinancialManagementApi.cityTrafficDetails(this.businessId);
            if (res.data.code === 200) {
                this.form = res.data.data;
                this.getFeeDetail()
                this.form.expenseList = this.form.expenseList || [{}]
                this.$emit("getFormData", this.form);
            }
        },
        getPerson(data) {
            this.form.payeeId = data.id
            this.form.payee = data.realName
        },
        getRMB(row, index) {
            if (row.amount && row.exchangeRate) {
                row.rmbAmount = (Number(row.amount) * Number(row.exchangeRate)).toFixed(2)
            }
            this.$set(this.form['expenseList'], index, row)
            var arr = this.form['expenseList'].map(ele => Number(ele.rmbAmount) || 0)
            var sum = arr.reduce(function (a, b) { return a + b }, 0)
            this.$emit('allTotalAmount', sum)
        },
        deleteRow(row,key){
            this.form[key] = this.form[key].filter(ele=>{return ele!==row})
            var arr = this.form['expenseList'].map(ele => Number(ele.rmbAmount) || 0)
            var sum = arr.reduce(function (a, b) { return a + b }, 0)
            this.$emit('allTotalAmount', sum)
        },
        addRow() {
            this.form.expenseList.push({})
        },
        testForm() {
            return new Promise((resolve) => {
                this.$refs.formBaseInfo.validate((valid, done, msg) => {
                    msg &&
                        this.$message({
                            message: Object.values(msg)[0][0].message,
                            type: "warning",
                        });
                    this.$refs.form.validate((validForm) => {
                        resolve(valid && validForm&&this.testValue('expenseList'));
                    })
                    done();
                });
            });

        }
    }
}

</script>

<style lang="scss" scoped>
.add-icon {
    color: #1D76FF;
    background-color: #DEEBFF;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}

</style>
