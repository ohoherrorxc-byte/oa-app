<template>
    <basic-container>
        <avue-crud v-if="canShowList" :option="option" :search.sync="search" :table-loading="loading" :data="data"
            ref="crud" v-model="form" :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
            @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
            <template slot="menuLeft">
                <div class="btn ">
                    <el-button size="mini" plain icon="el-icon-download" @click="downModel">{{$t('annualBonusDataManagement.downloadTemplate')}}</el-button>
                    <div>
                        <upload @handleRequest="handleRequest" :showTip="false"
                            url="/api/oa-portal/salary/importAnnualWorkerSalary"> </upload>
                    </div>
                    <el-button size="mini" type="warning" plain icon="el-icon-delete" @click="handleDelete()">{{$t('annualBonusDataManagement.delete')}}
                    </el-button>
                </div>
            </template>
            <template slot-scope="{type,size,row,index}" slot="menu">
                <el-button icon="el-icon-delete" :size="size" :type="type" @click="handleDelete(row)">{{$t('annualBonusDataManagement.delete')}}</el-button>
                <el-button icon="el-icon-edit" :size="size" :type="type" @click="toEdit(row)">{{$t('commonContent.edit')}}</el-button>
                <el-button icon="el-icon-view" :size="size" :type="type" @click="toDetail(row)">{{$t('annualEmployeeSalaryManage.detail')}}</el-button>
            </template>
        </avue-crud>
        <secondDialog @canGetList="canGetList" ref="secondDialog"></secondDialog>
    </basic-container>
</template>

<script>
import upload from '@/components/upload/index'
import secondDialog from '../components/secondDialog.vue'
import PayrollManagementApi from '@/api/payrollManagement/index'
import { downBlobFile } from '@/util/util'
export default {
    components: { upload, secondDialog },
    data() {
        return {
            loading: false,
            data: [{}],
            form: {},
            selectionList: [],
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
                        label: this.$t('annualEmployeeSalaryManage.year'),
                        prop: "year",
                        display: false,
                        type: 'year',
                        valueFormat: 'yyyy',
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.employeeNumber'),
                        prop: "code",
                        slot: true,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.name'),
                        prop: "realName",
                        display: false,
                        search: false
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.department'),
                        prop: "deptName",
                        display: false,
                        search: false
                    },

                    {
                        label: this.$t('annualEmployeeSalaryManage.january'),
                        prop: "january",
                        searchSpan: 8,
                        searchLabelWidth: 80,
                        search: false,
                        display: false,
                    },

                    {
                        label: this.$t('annualEmployeeSalaryManage.february'),
                        prop: "february",
                        width: 100,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.march'),
                        prop: "march",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.april'),
                        prop: "april",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.may'),
                        prop: "may",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.june'),
                        prop: "june",
                        // display: false,
                        search: false,

                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.july'),
                        prop: "july",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.august'),
                        prop: "august",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.september'),
                        prop: "september",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.october'),
                        prop: "october",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.november'),
                        prop: "november",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.december'),
                        prop: "december",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.other'),
                        prop: "other",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.total'),
                        prop: "total",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.socialSecurityPaymentMonths'),
                        prop: "monthsSocialSecurityPayment",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('annualEmployeeSalaryManage.monthlyAverageWageIncome'),
                        prop: "monthlyAverageWageIncome",
                        display: false,
                        search: false,
                    },
                    {
                        prop: 'remark',
                        label: this.$t('annualEmployeeSalaryManage.remark')
                    },
                ],
            },
            canShowList: false,
        }
    },
    mounted() {
    },
    methods: {
        async onLoad(page, params = {}) {
            let obj = {
                size: page.pageSize,
                current:page.currentPage 
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
        canGetList(data) {
            this.canShowList = true
        },
        handleRequest() {
            this.onLoad()
        },
        async downModel() {
            let res = await PayrollManagementApi.exportAnnualWorkerSalary()
            // console.log(res)
            downBlobFile(res.data, '年度职工导入模板')
        },
        toDetail(row) {
            this.$router.push(`/annualEmployeeSalary/detail?id=${row.id}`)
        },
        toEdit(row) {
            this.$router.push(`/annualEmployeeSalary/detail?id=${row.id}&isEdit=true`)
        },
        selectionChange(list) {
            this.selectionList = list;
        },
        selectionClear() {
            this.selectionList = [];
            this.$refs.crud.toggleSelection();
        },
        handleDelete(row) {
            let ids = row ? [row.id] : this.selectionList.map(ele => ele.id)
            if (ids.length === 0) {
                this.$message.warning("请选择至少一条数据");
                return;
            }
            this.$confirm("确定将选择数据删除?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    return PayrollManagementApi.annualWorkerSalaryDelete(ids);
                })
                .then(() => {
                    this.onLoad(this.page);
                    this.$message({
                        type: "success",
                        message: "操作成功!",
                    });
                    this.$refs.crud.toggleSelection();
                });
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
