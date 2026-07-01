<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="item in tabList" :label="item.label" :name="item.name">
                <avue-crud :option="option"  :table-loading="loading" :data="data" ref="crud"
                    v-model="form" :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
                    @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange"
                    @on-load="onLoad">
                    <template slot-scope="{disabled,size}" slot="subjectNameSearch">
                        <elSelectTree ref="elSelectTreeRef" :multiple="true" @getValue="getSubjetRow" :options="subjectList"  :accordion="false"
                            :props="deptProps"></elSelectTree>
                    </template>
                    <template slot="menuLeft">
                        <el-button type="warning" plain icon="el-icon-download" @click="handleExport">{{$t('financialStatement.exportAcceptanceInfo')}}
                        </el-button>
                        <el-button type="warning" plain icon="el-icon-download" @click="handleExportDetail">{{$t('financialStatement.exportSubjectDetail')}}
                        </el-button>
                    </template>
                </avue-crud>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import list from './components/list.vue'
import { downBlobFile } from '@/util/util'
import { mapGetters } from "vuex";
import CostInquiryApi from '@/api/costInquiry/financialStatement'
import CostApi from '@/api/cost/index';
import subjectManageApi from '@/api/subjectManage/index'
import elSelectTree from '@/components/elSelectTree/index'
export default {
    data() {
        return {
            activeName: "costInquiry",
            dicData: [],
            subjectList:[],
            deptProps: {
                label: "subjectName",
                value: "id",
                children: "childList",
            },

            tabList: [
                {
                    name: 'costInquiry',
                    label: this.$t('financialStatement.costInquiry')
                },
                // {
                //     name: 'budgetPerformance',
                //     label: "预算执行情况表"
                // },
                // {
                //     name: 'summary',
                //     label: "费用汇总表"
                // },
            ],
            search: {
                subjectIdList: null,
                "applyEndTime": "",
                "applyStartTime": "",
                "costNameList": null,
                "finishEndTime": "",
                "finishStartTime": "",
                year:new Date().getFullYear()
            },
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            data: [],
            form: {},
            option: {
                height: "auto",
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
                menu: false,
                dialogClickModal: false,
                searchShowBtn: false,
                column: [
                    {
                        label: this.$t('financialStatement.costCenter'),
                        prop: "costName",
                        searchLabelWidth: 80,
                        searchSpan: 8,
                        search: true,
                        display: false,
                        dicData: this.dicData,
                        type: 'select',
                        props: {
                            label: "costName",
                            value: 'costName'
                        },
                        searchMultiple: true,
                        change:this.costChange
                    },
                    {
                        label: this.$t('financialStatement.budgetYear'),
                        prop: "year",
                        slot: true,
                        search: true,
                        type: "year",
                        display: false,
                        hide: true,
                        format: 'yyyy',
                        searchSpan:10,
                        valueFormat: 'yyyy',
                        change:this.getYear
                    },
                    {
                        label: this.$t('financialStatement.applyDate'),
                        prop: "applyTimeArr",
                        slot: true,
                        search: true,
                        display: false,
                        hide: true,
                        searchSpan:12,
                        type: "daterange",
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        searchRange: true,
                        change:this.getStartTime
                    },
                    {
                        label: this.$t('financialStatement.filingDate'),
                        prop: "finishTimeArr",
                        slot: true,
                        search: true,
                        display: false,
                        hide: true,
                        type: "daterange",
                        searchSpan:12,
                        valueFormat: "yyyy-MM-dd HH:mm:ss",
                        searchRange: true,
                        change:this.changefinishTime
                    },
                    {
                        label: this.$t('financialStatement.budgetSubject'),
                        prop: "subjectName",
                        slot: true,
                        searchSpan:16,
                        search: true,
                        display: false,
                        searchslot: true
                    },
                    {
                        label: this.$t('financialStatement.subjectCode'),
                        prop: "subjectCode",
                        searchSpan: 8,
                        searchLabelWidth: 80,
                        search: false,
                        display: false,

                        type: 'select',
                        props: {
                            label: 'dictValue',
                            value: 'dictValue'
                        }
                    },
                    {
                        label: this.$t('financialStatement.costTime'),
                        prop: "applyTime",
                        display: false,
                    },
                    {
                        label: this.$t('financialStatement.budgetOccupiedAmount'),
                        prop: "totalAmount",
                        search: false,
                        display: false,
                    },
                    {
                        label: this.$t('financialStatement.costType'),
                        prop: "amountType",
                        display: false,
                    },
                    {
                        label: this.$t('financialStatement.flowName'),
                        prop: "titleName",
                        search: false,
                        // display: false,
                        searchValue: ''
                        // searchValue:this.userInfo.user_name

                    },
                    {
                        label: this.$t('financialStatement.flowCode'),
                        prop: "approvalCode",

                        display: false,
                    },
                    {
                        label: this.$t('financialStatement.createUserName'),
                        prop: "createUserName",
                        search: false,
                        display: false,

                    },
                    {
                        label: this.$t('financialStatement.flowStatus'),
                        prop: "flowStatus",
                        display: false,
                    },
                ],
            },
        }
    },
    components: {
        list, elSelectTree
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    mounted() {
        this.init()
        this.getSubjetList()
    },
    methods: {
        async onLoad(page, params = {}) {
            let postdata = this.search
            postdata.size = this.page.pageSize
            postdata.current = this.page.currentPage
            this.loading = true;
            await CostInquiryApi.getList(
                postdata
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
            });
            this.init()
        },
        getSubjetRow(data) {
            this.search.subjectIdList = data.map(ele=>ele.id)
        },
        async init() {
            let colomn = this.findObject(this.option.column, 'costName');
            let res = await CostApi.getList()
            colomn.dicData = res.data.data.records
            console.log(colomn)
        },
        getYear(v){
            this.search.year = v.value
        },
        async getSubjetList() {
            let res = await subjectManageApi.getListSubject({ currentPage: 1, pageSize: 10000 })
            console.log(res)
            this.subjectList = res.data.data
        },
        costChange(v){
            if( v.value.length>0){
                this.search.costNameList = v.value
            }
        },
        getStartTime(v){
            if(v){
                this.search.applyStartTime = v[0]
                this.search.applyEndTime = v[1]
            }else{
                this.search.applyStartTime = null
                this.search.applyEndTime = null
            }
        },
        changefinishTime(v){
            if(v){
                this.search.finishStartTime = v[0]
                this.search.finishEndTime = v[1]
            }else{
                this.search.finishStartTime = null
                this.search.finishEndTime = null
            }
        },
        async handleExport() {
            let obj = { ...this.form, ...this.search }
            let res = await CostInquiryApi.exportReport(obj)
            console.log(res)
            downBlobFile(res.data, this.$t('financialStatement.exportAcceptanceInfo'))
        },
        async  handleExportDetail(){
            let obj = { ...this.form, ...this.search }
            let res = await CostInquiryApi.exportReportDetail(obj)
            console.log(res)
            downBlobFile(res.data, this.$t('financialStatement.exportSubjectDetail'))
        },
        searchReset() {
            this.search = {
                subjectIdList: null,
                "applyEndTime": "",
                "applyStartTime": "",
                "costNameList": null,
                "finishEndTime": "",
                "finishStartTime": "",
            }
            this.page.currentPage = 1
            this.page.pageSize = 10
            this.$refs.elSelectTreeRef[0].doClean()
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
