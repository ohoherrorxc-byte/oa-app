<template>
    <basic-container>
        <avue-crud v-if="canShowList" :option="option" :search.sync="search" :table-loading="loading" :data="data"
            ref="crud" v-model="form" :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
            @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
            <template slot-scope="{type,size,row,index}" slot="menu">
                <el-button icon="el-icon-view" :size="size" :type="type" @click="toDetail(row)">{{$t('commonContent.view')}}</el-button>
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
            data: [{}],
            form: {
                userId: ''
            },
            canShowList: false,
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
                        label: this.$t('payrollManagement.yearEndBonus.distributionDate'),
                        prop: "distributionDate",
                        display: false,
                        search: true,
                        type: 'date',
                        valueFormat: "yyyy-MM-dd"
                    },
                    {
                        label: this.$t('payrollManagement.yearEndBonus.year'),
                        prop: "year",
                        display: false,
                        search: true,
                        type: 'year',
                        valueFormat: 'yyyy',
                    },
                    {
                        label: this.$t('payrollManagement.yearEndBonus.employeeNumber'),
                        prop: "code",
                        slot: true,
                        search: false,
                        display: false,
                    },

                    {
                        label: this.$t('payrollManagement.yearEndBonus.department'),
                        prop: "deptName",
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.yearEndBonus.name'),
                        prop: "realName",
                        searchSpan: 8,
                        searchLabelWidth: 80,
                        search: false,
                        display: false,
                    },

                    {
                        label: this.$t('payrollManagement.yearEndBonus.floatingTargetSalary'),
                        prop: "floatingTargetSalary",
                        width: 100,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.yearEndBonus.projectAward'),
                        prop: "projectAward",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.yearEndBonus.generalManagerSpecialAward'),
                        prop: "generalManagerSpecialAward",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.yearEndBonus.other'),
                        prop: "other",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('payrollManagement.yearEndBonus.totalYearEndBonus'),
                        prop: "totalYearEndBonus",
                        search: false,

                    },
                    {
                        label: this.$t('payrollManagement.yearEndBonus.tax'),
                        prop: "personalIncome",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('payrollManagement.yearEndBonus.actualNumber'),
                        prop: "actualNumber",
                        display: false,
                        search: false,
                    },
                    {
                        prop: 'remark',
                        label: this.$t('payrollManagement.yearEndBonus.remark'),
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
                size: page.pageSize,
                current: page.currentPage
            }
            let postdata = { ...obj, ...params, ...this.query, ...this.form }
            this.loading = true;
            await PayrollManagementApi.yearEndBonusPage(
                postdata
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
            });
        },
        canGetList(data) {
            this.canShowList = true
        },
        toDetail(row) {
            this.$router.push(`/yearEndBonus/detail?id=${row.id}`)
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
