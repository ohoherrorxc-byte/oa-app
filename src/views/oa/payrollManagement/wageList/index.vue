<template>
    <basic-container>
        <avue-crud v-if="canShowList" :option="option" :search.sync="search" :table-loading="loading" :data="data"
            ref="crud" v-model="form" :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
            @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
            <template slot-scope="{type,size,row,index}" slot="menu">
                <el-button icon="el-icon-view" :size="size" :type="type" @click="toDetail(row)">{{ $t('commonContent.view') }}</el-button>
            </template>
        </avue-crud>
        <secondDialog @canGetList="canGetList" ref="secondDialog"></secondDialog>
    </basic-container>
</template>

<script>
import secondDialog from '../components/secondDialog.vue'
import PayrollManagementApi from '@/api/payrollManagement/index'
import { mapGetters } from 'vuex'
export default {
    components: { secondDialog },
    data() {
        return {
            loading: false,
            canShowList: false,
            data: [{}],
            form: {
                userId: ''
            },
            option: {
                height: 300,
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
                        label: this.$t('payrollManagement.wageList.distributionDate'),
                        prop: "distributionDate",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.year'),
                        prop: "year",
                        display: false,
                        search: true,
                        valueFormat: 'yyyy',
                        type: 'year'
                    },
                    {
                        label: this.$t('payrollManagement.wageList.employeeNumber'),
                        prop: "code",
                        slot: true,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.name'),
                        prop: "realName",
                        searchSpan: 8,
                        searchLabelWidth: 80,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.department'),
                        prop: "deptName",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.monthlySalary'),
                        prop: "monthlySalary",
                        width: 100,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.retroactiveSalary'),
                        prop: "retroactiveSalary",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.housingAllowance'),
                        prop: "roomStickers",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.highTemperatureFee'),
                        prop: "highTemperatureFee",
                        display: false,
                        search: false,
                    },
                    {
                            label: this.$t('payrollManagement.wageList.oneChildPays'),
                        prop: "oneChildPays",
                        // display: false,
                        search: false,

                    },
                    {
                        label: this.$t('payrollManagement.wageList.other'),
                        prop: "other",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.variousDeductions'),
                        prop: "variousDeductions",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.salariesPayable'),
                        prop: "salariesPayable",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.endowmentInsurance'),
                        prop: "endowmentInsurance",
                        display: false,
                    }, {
                        label: this.$t('payrollManagement.wageList.medicalInsurance'),
                        prop: "medicalInsurance",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.unemploymentInsurance'),
                        prop: "unemploymentInsurance",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.housingFund'),
                        prop: "housingFund",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.accumulatedSalary'),
                        prop: "accumulatedSalary",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.accumulatedBasicDeduction'),
                        prop: "accumulatedBasicDeduction",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.accumulatedFiveInsurancesAndOneFund'),
                        prop: "accumulatedFiveInsurancesAndOneFund",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.childrenEducationExpenditure'),
                        prop: "childrenEducationExpenditure",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.continuingEducationExpenditure'),
                        prop: "continuingEducationExpenditure",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.housingLoanExpenses'),
                        prop: "housingLoanExpenses",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.expenditureElderly'),
                        prop: "expenditureElderly",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.criticalIllnessMedicalTreatment'),
                        prop: "criticalIllnessMedicalTreatment",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.infantCare'),
                        prop: "infantCare",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.privatePension'),
                        prop: "privatePension",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.taxableIncome'),
                        prop: "taxableIncome",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.accumulatedTaxableAmount'),
                        prop: "accumulatedTaxableAmount",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.paidTaxAmount'),
                        prop: "paidTaxAmount",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.monthPersonalIncome'),
                        prop: "monthPersonalIncome",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.partyExpenses'),
                        prop: "partyExpenses",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.unionMembershipFees'),
                        prop: "unionMembershipFees",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.otherPostTaxDeductions'),
                        prop: "otherPostTaxDeductions",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.wageList.actualNumber'),
                        prop: "actualNumber",
                        display: false,
                    },

                    {
                        prop: 'remark',
                        label: this.$t('payrollManagement.wageList.remark')
                    },

                ],
            },
        }
    },
    computed: {
        ...mapGetters(['userInfo'])
    },
    mounted() {
        this.form.userId = this.userInfo.user_id
    },
    methods: {
        async onLoad(page, params = {}) {
            let obj = {
                size:page.pageSize,
                current:  page.currentPage
            }
            let postdata = { ...obj, ...params, ...this.query, ...this.form }
            this.loading = true;
            await PayrollManagementApi.salaryInfoPage(
                postdata
            ).then((res) => {
                const data = res.data.data;
                if (data) {
                    this.page.total = data.total;
                    this.data = data.records;
                }
                this.loading = false;
            });
        },
        canGetList(data) {
            this.canShowList = true
        },
        toDetail(row) {
            this.$router.push(`/wageList/detail?id=${row.id}`)
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
