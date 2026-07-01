<template>
    <basic-container>
        <avue-crud v-if="canShowList" :option="option" :search.sync="search" :table-loading="loading" :data="data"
            ref="crud" v-model="form" :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
            @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
            <template slot-scope="{type,size,row,index}" slot="menu">
                <el-button icon="el-icon-view" :size="size" :type="type" @click="toDetail(row)">{{$t('annualEmployeeSalaryManage.detail')}}</el-button>
            </template>
        </avue-crud>
        <secondDialog @canGetList="canGetList" ref="secondDialog"></secondDialog>
    </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import secondDialog from '../components/secondDialog.vue'
import PayrollManagementApi from '@/api/payrollManagement/index'
export default {
    components: { secondDialog },
    data() {
        return {
            canShowList: false,
            loading: false,
            data: [{}],
            form: {
                userId: null
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
                        label: this.$t('payrollManagement.annualEmployeeSalary.year'),
                        prop: "year",
                        display: false,
                        valueFormat: 'yyyy',
                        type: 'year'
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.employeeNumber'),
                        prop: "code",
                        slot: true,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.name'),
                        prop: "realName",
                        display: false,
                        search: false
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.department'),
                        prop: "deptName",
                        display: false,
                        search: false
                    },

                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.january'),
                        prop: "january",
                        searchSpan: 8,
                        searchLabelWidth: 80,
                        search: false,
                        display: false,
                    },

                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.february'),
                        prop: "february",
                        width: 100,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.march'),
                        prop: "march",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.april'),
                        prop: "april",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.may'),
                        prop: "may",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.june'),
                        prop: "june",
                        // display: false,
                        search: false,

                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.july'),
                        prop: "july",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.august'),
                        prop: "august",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.september'),
                        prop: "september",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.october'),
                        prop: "october",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.november'),
                        prop: "november",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.december'),
                        prop: "december",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.other'),
                        prop: "other",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.total'),
                        prop: "total",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.socialSecurityPayment'),
                        prop: "monthsSocialSecurityPayment",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.monthlyAverageWageIncome'),
                        prop: "monthlyAverageWageIncome",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.annualEmployeeSalary.remark'),
                        prop: "remark",
                        display: false,
                    },
                ],
            },
            selectionList: []
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
                size:page.pageSize ,
                current: page.currentPage
            }
            let postdata = { ...obj, ...params, ...this.query, ...this.form }
            this.loading = true;
            await PayrollManagementApi.annualWorkerSalaryPage(
                postdata
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
            });
        },
        toDetail(row) {
            this.$router.push(`/annualEmployeeSalary/detail?id=${row.id}`)
        },
        canGetList(data) {
            this.canShowList = true
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
