<template>
    <div>
        <basic-container>
            <span>{{ $t('businessHospitality.applyInfo') }}</span>
            <avue-form ref="formBaseInfo" :option="option" v-model="form">
                <template slot="subjectName">
                    <div v-if="!disabled" class="input-tree-container">
                        <elSelectTree :value="{ name: form.subjectName }" @getValue="getSubjetRow" :disabled="disabled"
                            :options="subjectList" :accordion="false" :props="deptProps"></elSelectTree>
                        <!-- <avue-input-tree class="inputTree" ref="tree"  :disabled="disabled"
                    :append-to-body="false"
                    :popperAppendToBody="false"
                    :defaultExpandAll="true" :check-strictly="true" node-key="id" v-model="form.subjectId"
                        placeholder="请选择内容" :dic="subjectList" :props="deptProps" @change="getSubjetRow"></avue-input-tree> -->
                    </div>
                    <div v-else class="font12">{{ form.subjectName }}</div>
                </template>
                <template slot="subjectCode">
                    <div class="font12">{{ form.subjectCode }}</div>
                </template>
                <template slot="payee">
                    <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100" @getPerson="getPerson"
                        :initData="form.payee" :disabled="disabled" :multiple="false">
                    </autoAddress>
                </template>
                <template slot="bankName">
                    <div class="font12">{{ form.bankName }}</div>
                </template>
                <template slot="bankAccount">
                    <div class="font12">{{ form.bankAccount }}</div>
                </template>
            </avue-form>
            <el-form ref="form" :model="form" :rules="rules" :disabled="disabled">
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow">+</span>
                    </div>
                    <el-table :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }" ref="multipleTable"
                        :data="form.expenseList" @selection-change="handleSelectionChange" class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" label="序号">
                        </el-table-column>
                        <el-table-column property="feeDate" label="费用日期" align="center">
                            <template slot="header">
                                {{ $t('businessHospitality.feeDate') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'expenseList.' + scope.$index + '.feeDate'" :rules="rules.feeDate">
                                    <el-date-picker v-if="!disabled" value-format="yyyy-MM-dd" v-model="scope.row.feeDate"
                                        type="date" placeholder="选择日期">
                                    </el-date-picker>
                                    <div v-else>{{ scope.row.feeDate }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="hostPerson" label="被招待人" align="center">
                            <template slot="header">
                                {{ $t('businessHospitality.hostPerson') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'expenseList.' + scope.$index + '.hostPerson'"
                                    :rules="rules.hostPerson">
                                    <el-input v-if="!disabled" v-model="scope.row.hostPerson"></el-input>
                                    <div v-else>{{ scope.row.hostPerson }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="hostDept" label="招待部门" align="center">
                            <template slot="header">
                                {{ $t('businessHospitality.hostDept') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'expenseList.' + scope.$index + '.hostDept'" :rules="rules.hostDept">
                                    <el-input v-if="!disabled" v-model="scope.row.hostDept"></el-input>
                                    <div v-else>{{ scope.row.hostDept }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="reason" label="招待事由" align="center">
                            <template slot="header">
                                {{ $t('businessHospitality.reason') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'expenseList.' + scope.$index + '.reason'"
                                    :rules="rules.reason">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.reason"></el-input>
                                    <div v-else>{{ scope.row.reason }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="金额" align="center">
                            <template slot="header">
                                {{ $t('businessHospitality.amount') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'expenseList.' + scope.$index + '.amount'"
                                    :rules="rules.amount">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.amount"
                                        @blur="getRMB(scope.row, scope.$index)"></el-input>
                                    <div v-else>{{ scope.row.amount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="currency" label="币种" align="center">
                            <template slot="header">
                                {{ $t('businessHospitality.currency') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'expenseList.' + scope.$index + '.currency'"
                                    :rules="rules.currency">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.currency"></el-input>
                                    <div v-else>{{ scope.row.currency }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="exchangeRate" label="汇率" align="center">
                            <template slot="header">
                                {{ $t('businessHospitality.exchangeRate') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'expenseList.' + scope.$index + '.exchangeRate'"
                                    :rules="rules.exchangeRate">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.exchangeRate"
                                        @blur="getRMB(scope.row, scope.$index)"></el-input>
                                    <div v-else>{{ scope.row.exchangeRate }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="rmbAmount" :label="$t('businessHospitality.rmbAmount')" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input v-if="!disabled" disabled clearable v-model="scope.row.rmbAmount"></el-input>
                                    <div v-else>{{ scope.row.rmbAmount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="form.expenseList.length > 1 && !disabled"
                            :label="$t('businessHospitality.operation')" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-button type="text" @click="deleteRow(scope.row)" style="color:red">删除</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <div @click="downModel" class="blue pl40 pb20">{{ $t('other.downloadLink') }}</div>
                <el-form   >
                    <el-form-item :disabled="disabled && !financialBillPerson()"
                        :label="$t('commonContent.Corporatehospitalitylist')" style="width: 100%;"
                        prop="corporatehospitalitylist" label-width="140px" :required="true">
                        <upload :isHistory="isHistory" :fileList="form.corporatehospitalitylist" btnName="上传"
                            @handleRequest="handleRequestCorporatehospitalitylist" :multiple="true" :showFileList="true">
                        </upload>
                    </el-form-item>
                </el-form>

            </el-form>
        </basic-container>
    </div>
</template>

<script>
import { mixins } from '../Mixin'
import upload from '@/components/upload/index'
import FinancialManagementApi from '@/api/financialManagement/index'
import { fileDownload, downloadFileBlob } from '@/util/util'
import UploadApi from "@/api/upload";
export default {
    mixins: [mixins],
    components: { upload },
    data() {
        return {
            form: {
                expenseList: [{}],
                subjectName: null,
                corporatehospitalitylist: []
            },
            formPay: {},
            option: {
                column: [
                    {
                        type: "input",
                        label: this.$t('businessHospitality.subjectName'),
                        span: 12,
                        prop: "subjectName",
                        rules: [
                            {
                                required: true,
                                message: this.$t('businessHospitality.subjectNameRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('businessHospitality.costName'),
                        span: 12,
                        disabled: true,
                        prop: "costName",
                        rules: [
                            {
                                required: true,
                                message: this.$t('businessHospitality.costNameRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        disabled: true,
                        label: this.$t('businessHospitality.subjectCode'),
                        span: 12,
                        prop: "subjectCode",
                    },
                    {

                        type: 'textarea',
                        label: this.$t('businessHospitality.budgetInfo'),
                        disabled: true,
                        span: 12,
                        prop: "budgetInfo",
                    },
                    {
                        type: "input",
                        label: this.$t('businessHospitality.payee'),
                        span: 12,
                        rules: [
                            {
                                required: true,
                                message: this.$t('businessHospitality.payeeRequired'),
                            },
                        ],
                        prop: "payee",
                    },
                    {
                        type: "input",
                        label: this.$t('businessHospitality.bankName'),
                        span: 12,
                        prop: "bankName",
                        disabled: true
                    },
                    {
                        type: "input",
                        label: this.$t('businessHospitality.bankAccount'),
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
                emptyText: this.$t('businessHospitality.clear'),
                menuPosition: "center",
                detail: false,
                tabs: false,
                disabled: this.disabled,
                labelSuffix: " ",
            },
            rules: {
                corporatehospitalitylist: [{ required: true, message: '请上传', trigger: 'change' }]
            }
        }
    },
    props: {
        isPdfDown: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        // this.$refs.tree.popperClass={
        //     width:'300px'
        // }
        // console.log(this.$refs.tree)
    },
    methods: {
        financialBillPerson() {
            return this.form.flow && this.form.flow.assigneeName === '黄蓓川'
        },
        async getDetail() {
            let res = await FinancialManagementApi.businessHospitalityDetails(this.businessId);
            if (res.data.code === 200) {
                this.form = res.data.data;
                this.form.expenseList = this.form.expenseList || [{}]
                this.getFeeDetail()
                this.$emit("getFormData", this.form);
            }
        },
        handleRequestCorporatehospitalitylist(data, arr) {
            arr.map(ele => {
                ele.businessName = 'corporatehospitality'
            })
            this.form.corporatehospitalitylist = arr
        },
        getRMB(row, index) {
            if (row.amount && row.exchangeRate) {
                row.rmbAmount = (Number(row.amount) * Number(row.exchangeRate)).toFixed(2)
            }
            this.$set(this.form['expenseList'], index, row)
            var arr = this.form['expenseList'].map(ele => Number(ele.rmbAmount) || 0)
            var sum = arr.reduce(function (a, b) { return a + b }, 0)
            // console.log(sum + 'eee')
            this.$emit('allTotalAmount', sum)
        },
        async downModel() {
            let obj = {
                url: 'http://10.30.4.68:9000/license-prd/upload/20250117/43eee785f975eaa84ae1bc9ef3c7821b.xlsx'
            }
            let res = await UploadApi.getUrl(obj)
            if (this.isGoogleChrome()) {
                downloadFileBlob(res.data.data, '公司招待清单.xlsx')
            } else {
                console.log('非谷歌浏览器')
                console.log(res.data.data)
                window.open(res.data.data)
            }
        },
        isGoogleChrome() {
            var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
            return isChrome;
        },
        formOption(v) {
            console.log(v)
            return {
                width: '300px'
            }
        },
        addRow() {
            this.form.expenseList.push({})
        },
        deleteRow(row) {
            this.form.expenseList = this.form.expenseList.filter(ele => {
                return ele !== row
            })
            var arr = this.form['expenseList'].map(ele => Number(ele.rmbAmount) || 0)
            var sum = arr.reduce(function (a, b) { return a + b }, 0)
            // console.log(sum + 'eee')
            this.$emit('allTotalAmount', sum)
        },
        getPerson(data) {
            this.form.payeeId = data.id
            this.form.payee = data.realName
        },
        testForm() {
            if(this.form.corporatehospitalitylist.length===0){
                this.$message.error('请上传公司招待清单')
                return
            }
            return new Promise((resolve) => {
                this.$refs.formBaseInfo.validate((valid, done, msg) => {
                    msg &&
                        this.$message({
                            message: Object.values(msg)[0][0].message,
                            type: "warning",
                        });
                    this.$refs.form.validate((validForm) => {
                        resolve(valid && validForm && this.testValue('expenseList'));
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

.blue {
    color: blue;
}
</style>
