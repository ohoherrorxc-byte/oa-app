<template>
    <basic-container>
        <avue-crud  v-if="canShowList" :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud" v-model="form"
            :page.sync="page" @search-change="searchChange" @search-reset="searchReset" @current-change="currentChange"
            @selection-change="selectionChange"
            @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
            <template slot="menuLeft">
                <div class="btn ">
                    <el-button size="mini" plain icon="el-icon-download" @click="downModel">{{$t('annualBonusDataManagement.downloadTemplate')}}</el-button>
                    <div>
                        <upload @handleRequest="handleRequest" :showTip="false" url="/api/oa-portal/salary/importYearEndBonus"> </upload>
                    </div>
                    <el-button size="mini" type="warning" plain  icon="el-icon-delete" @click="handleDelete()">{{$t('annualBonusDataManagement.delete')}}
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
import PayrollManagementApi from '@/api/payrollManagement/index'
import {downBlobFile} from '@/util/util'
import secondDialog from '../components/secondDialog.vue'
export default {
    components: { upload,secondDialog },
    data() {
        return {
            loading:false,
            data:[{}],
            form: {},
            page:{
                currentPage:1,
                pageSize:10
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
                        label: this.$t('annualBonusDataManagement.distributionDate'),
                        prop: "distributionDate",
                        display: false,
                        valueFormat:"yyyy-MM-dd",
                        type:'date',
                        search:true
                    },
                    {
                        label: this.$t('annualBonusDataManagement.year'),
                        prop: "year",
                        display: false,
                        search:true,
                        valueFormat:'yyyy',
                        type:'year'
                    },
                    {
                        label: this.$t('annualBonusDataManagement.employeeNumber'),
                        prop: "code",
                        slot: true,
                        search: false,
                        display: false,
                    },


                    {
                        label: this.$t('annualBonusDataManagement.department'),
                        prop: "deptName",
                        display: false,
                    },
                    {
                        label: this.$t('annualBonusDataManagement.name'),
                        prop: "realName",
                        searchSpan: 8,
                        searchLabelWidth: 80,
                        search: false,
                        display: false,
                    },

                    {
                        label: this.$t('annualBonusDataManagement.floatingTargetSalary'),
                        prop: "floatingTargetSalary",
                        width: 100,
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualBonusDataManagement.projectAward'),
                        prop: "projectAward",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualBonusDataManagement.generalManagerSpecialAward'),
                        prop: "generalManagerSpecialAward",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualBonusDataManagement.other'),
                        prop: "other",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('annualBonusDataManagement.totalYearEndBonus'),
                        prop: "totalYearEndBonus",
                        // display: false,
                        search: false,

                    },
                    {
                        label: this.$t('annualBonusDataManagement.tax'),
                        prop: "personalIncome",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('annualBonusDataManagement.actualNumber'),
                        prop: "actualNumber",
                        display: false,
                        search: false,
                    },
                    {
                        label: this.$t('annualBonusDataManagement.remark'),
                        prop: "remark",
                        display: false,
                    },
                ],
                selectionList:[],

            },
            canShowList:false,
        }
    },
    mounted() {

    },
    methods: {
        async onLoad(page, params = {}) {
            let obj = {
                size:page.pageSize,
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
                console.log(this.data)
                this.loading = false;
            });
        },
        canGetList(data){
            this.canShowList = true

        },
        async downModel(){
            let res = await PayrollManagementApi.exportYearEndBonusTemplate()
            console.log(res)
            downBlobFile(res.data,'年终奖导入模板')
        },
        handleRequest(){
            this.onLoad()
        },
        handleDelete(row) {
            let ids = row?[row.id]:this.selectionList.map(ele=>ele.id)
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
                    return PayrollManagementApi.yearEndBonusInfoDelete(ids);
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
        selectionChange(list) {
            this.selectionList = list;
        },
        selectionClear() {
            this.selectionList = [];
            this.$refs.crud.toggleSelection();
        },
        toDetail(row){
            this.$router.push(`/yearEndBonus/detail?id=${row.id}`)
        },
        toEdit(row){
            this.$router.push(`/yearEndBonus/detail?id=${row.id}&isEdit=true`)
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
