<template>
    <basic-container>
        <avue-crud v-if="canShowList" :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud" v-model="form"
            :page.sync="page" @search-change="searchChange" @search-reset="searchReset" @current-change="currentChange"
            @selection-change="selectionChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
            <template slot="menuLeft">
                <div class="btn ">
                    <el-button size="mini" plain icon="el-icon-download" @click="downModel">{{$t('payrollManagement.payrollDataManagement.downloadTemplate')}}</el-button>
                    <div>
                        <upload @handleRequest="handleRequest" :showTip="false" url="/api/oa-portal/salary/importSalary">
                        </upload>
                    </div>
                    <el-button size="mini" type="warning" plain icon="el-icon-download" @click="handleDelete()">{{$t('payrollManagement.payrollDataManagement.delete')}}
                    </el-button>
                </div>
            </template>
            <template slot-scope="{type,size,row,index}" slot="menu">
                <el-button icon="el-icon-delete" :size="size" :type="type" @click="handleDelete(row)">{{$t('payrollManagement.payrollDataManagement.delete')}}</el-button>
                <el-button icon="el-icon-edit" :size="size" :type="type" @click="toEdit(row)">{{$t('commonContent.edit')}}</el-button>
                <el-button icon="el-icon-view" :size="size" :type="type" @click="toDetail(row)">{{$t('commonContent.view')}}</el-button>
            </template>
        </avue-crud>
        <secondDialog  @canGetList="canGetList" ref="secondDialog"></secondDialog>
    </basic-container>
</template>

<script>
import upload from '@/components/upload/index'
import { downBlobFile } from '@/util/util'
import secondDialog from '../components/secondDialog.vue'
import PayrollManagementApi from '@/api/payrollManagement/index'
export default {
    components: { upload,secondDialog },
    data() {
        return {
            loading: false,
            selectionList: [],
            data: [{}],
            canShowList:false,
            form: {},
            option: {
                // height: 300,
                calcHeight: 80,
                tip: false,
                searchShow: true,
                searchMenuSpan: 100,
                border: true,
                index: true,
                selection: true,
                viewBtn: false,
                addBtn: false,
                editBtn: false,
                delBtn: false,
                // menu: false,
                //dialogType: 'drawer',
                dialogClickModal: false,
                searchShowBtn: false,
                column: [
                {
                        label: this.$t('payrollManagement.payrollDataManagement.distributionDate'),
                        prop: "distributionDate",
                        display: false,
                        type:'date',
                        valueFormat:"yyyy-MM-dd"
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.year'),
                        prop: "year",
                        display: false,
                        search: true,
                        valueFormat: 'yyyy',
                        type: 'year'
                    },
                    {
                          label: this.$t('payrollManagement.payrollDataManagement.employeeNumber'),
                        prop: "code",
                        slot: true,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.name'),
                        prop: "realName",
                        searchSpan: 8,
                        searchLabelWidth: 80,
                        search: false,
                        display: false,
                    },
                    {
                          label: this.$t('payrollManagement.payrollDataManagement.department'),
                        prop: "deptName",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.monthlySalary'),
                        prop: "monthlySalary",
                        width: 100,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.retroactiveSalary'),
                        prop: "retroactiveSalary",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.roomStickers'),
                        prop: "roomStickers",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.highTemperatureFee'),
                        prop: "highTemperatureFee",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.oneChildPays'),
                        prop: "oneChildPays",
                        // display: false,
                        search: false,

                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.other'),
                        prop: "other",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.variousDeductions'),
                        prop: "variousDeductions",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.salariesPayable'),
                        prop: "salariesPayable",
                        display: false,
                    },
                    {
                          label: this.$t('payrollManagement.payrollDataManagement.endowmentInsurance'),
                        prop: "endowmentInsurance",
                        display: false,
                    }, {
                        label: this.$t('payrollManagement.payrollDataManagement.medicalInsurance'),
                        prop: "medicalInsurance",
                        display: false,
                    },
                    {
                          label: this.$t('payrollManagement.payrollDataManagement.unemploymentInsurance'),
                        prop: "unemploymentInsurance",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.housingFund'),
                        prop: "housingFund",
                        display: false,
                    },
                    {
                          label: this.$t('payrollManagement.payrollDataManagement.accumulatedSalary'),
                        prop: "accumulatedSalary",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.accumulatedBasicDeduction'),
                        prop: "accumulatedBasicDeduction",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.accumulatedFiveInsurancesAndOneFund'),
                        prop: "accumulatedFiveInsurancesAndOneFund",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.childrenEducationExpenditure'),
                        prop: "childrenEducationExpenditure",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.continuingEducationExpenditure'),
                        prop: "continuingEducationExpenditure",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.housingLoanExpenses'),
                        prop: "housingLoanExpenses",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.expenditureElderly'),
                        prop: "expenditureElderly",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.criticalIllnessMedicalTreatment'),
                        prop: "criticalIllnessMedicalTreatment",
                        display: false,
                    },
                    {
                          label: this.$t('payrollManagement.payrollDataManagement.infantCare'),
                        prop: "infantCare",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.privatePension'),
                        prop: "privatePension",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.taxableIncome'),
                        prop: "taxableIncome",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.accumulatedTaxableAmount'),
                        prop: "accumulatedTaxableAmount",
                        display: false,
                    },
                    {
                          label: this.$t('payrollManagement.payrollDataManagement.paidTaxAmount'),
                        prop: "paidTaxAmount",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.monthPersonalIncome'),
                        prop: "monthPersonalIncome",
                        display: false,
                    },
                    {
                          label: this.$t('payrollManagement.payrollDataManagement.partyExpenses'),
                        prop: "partyExpenses",
                        display: false,
                    },
                    {
                          label: this.$t('payrollManagement.payrollDataManagement.unionMembershipFees'),
                        prop: "unionMembershipFees",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.payrollDataManagement.otherPostTaxDeductions'),
                        prop: "otherPostTaxDeductions",
                        display: false,
                    },
                    {
                          label: this.$t('payrollManagement.payrollDataManagement.actualNumber'),
                        prop: "actualNumber",
                        display: false,
                    },

                    {
                        label: this.$t('payrollManagement.payrollDataManagement.remark'),
                        prop: "remark",
                        display: false,
                    },

                ],
            },
        }
    },
    mounted() {

    },
    methods: {
        async onLoad(page, params = {}) {
            let obj = {
                size: page.pageSize,
                current: page.currentPage
            }
            let postdata = { ...obj, ...params, ...this.query, ...this.form }
            this.loading = true;
            await PayrollManagementApi.salaryInfoPage(
                postdata
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
                this.selectionClear();
            });
        },
        canGetList(data){
            this.canShowList = true
        },
        async downModel() {
            let res = await PayrollManagementApi.exportSalaryTemplate()
            // console.log(res)
            downBlobFile(res.data, '工资导入模板')
        },
        handleRequest(data) {
            if (data) {
                this.onLoad()
            }
        },
        toDetail(row) {
            this.$router.push(`/wageList/detail?id=${row.id}`)
        },
        handleDelete(row) {
            let ids = row ? [row.id] : this.selectionList.map(ele => ele.id)
            console.log(this.selectionList)
            console.log(ids)
            if (ids.length === 0) {
                this.$message.warning("请选择至少一条数据");
                return;
            }
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(async () => {
                    let res = await PayrollManagementApi.salaryInfoDelete(ids)
                    if (res.data.code === 0 || res.data.code === 200) {
                        this.onLoad(this.page);
                        this.$message({
                            type: "success",
                            message: "操作成功!",
                        });
                        this.$refs.crud.toggleSelection();
                    } else {
                        this.$message.success(res.data.message)
                    }
                })
        },
        toEdit(row) {
            this.$router.push(`/wageList/detail?id=${row.id}&isEdit=true`)
        },
        selectionChange(list) {
            this.selectionList = list;
        },
        selectionClear() {
            this.selectionList = [];
            this.$refs.crud.toggleSelection();
        },
        searchReset() {
            this.query = {};
            this.onLoad(this.page);
        },
        searchChange(params, done) {
            this.query = params;
            this.page.currentPage = 1;
            this.onLoad(this.page, params);
            done();
        },

        currentChange(currentPage) {
            this.page.currentPage = currentPage;
        },
        sizeChange(pageSize) {
            this.page.pageSize = pageSize;
        },
        refreshChange() {
            this.onLoad(this.page, this.query);
        },
    }
}
</script>
