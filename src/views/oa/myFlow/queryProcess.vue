<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane :label="$t('myFlow.viewableProcesses')" name="my">
                <avue-crud :option="option" :table-loading="loading" :data="data" :page.sync="page" v-model="form"
                    ref="crud" @search-change="searchChange" @search-reset="searchReset" @current-change="currentChange"
                    @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
                    <template  slot="processDefinitionNameSearch">
                        <elSelectTree ref="elSelectTree" @getValue="getValue" :options="flowList" :accordion="false"
                            :props="deptProps"></elSelectTree>
                    </template>
                    <template slot-scope="{ row }" slot="titleName">
                        <div @click="toDetail(row)">{{ row.titleName }}</div>
                    </template>
                    <template slot="menuLeft">
                        <div class="btn">
                            <el-button size="small" type="warning" plain icon="el-icon-download" @click="handleExport"> {{$t('commonContent.exportL')}}
                            </el-button>
                        </div>
                    </template>
                </avue-crud>
            </el-tab-pane>
            <el-tab-pane :label="$t('myFlow.ccToMe')" name="sendMe">
                <avue-crud :option="option" :table-loading="loading" :data="data" :page.sync="page" v-model="form"
                    ref="crud" @search-reset="searchReset" @selection-change="selectionChange"
                    @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange"
                    @on-load="onLoad">
                    <template slot-scope="{ row }" slot="titleName">
                        <div @click="toDetail(row)">{{ row.titleName }}</div>
                    </template>
                </avue-crud>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import list from './components/list.vue'
import elSelectTree from './components/elSelectTree'
import { getList, getListQuery, flowTaskExport } from '@/api/myFlow/index'
import dictionaryApi from '@/api/dictionary'
import { downBlobFile } from "@/util/util";
export default {
    components: {
        list, elSelectTree
    },
    data() {
        return {
            deptProps: {
                label: "dictValue",
                value: "dictValue",
                children: "childList",
                isLeaf: 'leaf'
            },
            flowList: [],
            data: [],
            activeName: 'my',
            flowNameList: [],
            form: {
                "assigneeName": "",
                "createDateEnd": "",
                "createDateStart": "",
                "createUserName": "",
                "processDefinitionName": "",
                "titleName": "",
                flowTabList: [0],
                current: 1,
                size: 10
            },
            query: {},
            loading: true,
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            selectionList: [],
            option: {
                height: "auto",
                calcHeight: 30,
                tip: false,
                align: 'center',
                searchShow: true,
                searchMenuSpan: 6,
                border: true,
                index: true,
                viewBtn: false,
                addBtn: false,
                editBtn: false,
                delBtn: false,
                selection: true,
                dialogClickModal: false,
                menu: false,
                column: [
                    {
                        label: this.$t('myFlow.processTitle'),
                        prop: "titleName",
                        search: true,
                        slot: true,
                        width:130
                    },
                    {
                        label: this.$t('commonContent.createDate'),
                        prop: "createTime",
                        type: "datetime",
                        search: true,
                        startPlaceholder: this.$t('commonContent.startTime'),
                        endPlaceholder: this.$t('commonContent.endTime'),
                        searchRange: true,
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                        searchOrder: 4,
                        searchSpan: 12,
                        width: 150,
                        overHidden: true,
                        change: this.getTimer
                    },
                    {
                        label: this.$t('commonContent.creator'),
                        prop: "createUserName",
                        search: true,
                    },
                    {
                        label: this.$t('myFlow.processType'),
                        prop: "processDefinitionName",
                        search: true,
                        type: 'select',
                        dicData: [],
                        filterable: true,
                        change: this.getDefinition,
                        width:130
                    },
                    {
                        label: this.$t('myFlow.currentNode'),
                        prop: "taskName",
                        search: false,
                        width:130
                    },
                    {
                        label: this.$t('commonContent.status'),
                        prop: "status",
                        search: false,
                    },
                    {
                        label: this.$t('myFlow.receiveDate'),
                        prop: "taskStartTime",
                        search: false,
                    },
                    {
                        label: this.$t('myFlow.processNumber'),
                        prop: "taskId",
                        search: false,
                    },
                    {
                        label: this.$t('myFlow.pendingOperator'),
                        prop: "assigneeName",
                        search: true,
                    },
                ]
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        async init() {
            let res = await dictionaryApi.getDictionary('flow')
            this.flowList = res.data.data
            this.flowList.map(ele => {
                ele.children = []
            })
        },
        getValue(value) {
            this.form.processDefinitionName = value.dictValue
        },
        onLoad(page, param) {     
            this.loading = true;
            this.form = { ...this.form, ...param }
            getListQuery(
                this.form
            ).then((res) => {
                if (res.data.code === 200 || res.data.code === 0) {
                    const data = res.data.data;
                    this.page.total = data.total;
                    this.data = data.records;
                    this.loading = false;
                }
            });
        },
       async handleExport(){
            let res = await flowTaskExport(this.form)
            console.log(res)
            downBlobFile(res.data, '流程管理')
        },
        getDefinition(v) {
            // console.log(v)
            this.form.processDefinitionName = v.value
        },
        toDetail(row) {
            //this.$router.push(`${row.path}?businessId=${row.businessId}&taskId=${row.taskId}&processIsFinished=${row.processIsFinished}&status=${row.status}`)
            let url =`${row.path}?businessId=${row.businessId}&titleName=${row.titleName}&taskId=${row.taskId}&processIsFinished=${row.processIsFinished}&status=${row.status}`
            window.open(this.$router.resolve({ path: url }).href, '_blank')
        },
        handleClick() {
            if (this.activeName === 'my') {
                this.form.flowTabList = [0]
            } else {
                this.form.flowTabList = [1]
            }
            this.onLoad()
        },
        getTimer(v) {
            if (v.value.length > 0) {
                this.form.createDateStart = `${v.value[0]} 00:00:00`
                this.form.createDateEnd = `${v.value[1]} 00:00:00`
            } else {
                this.form.createDateStart = null
                this.form.createDateEnd = null
            }
        },
        searchReset() {
            this.form = {
                current: 1,
                size: 10,
                flowTabList: this.form.flowTabList
            }
            this.query = {};
            this.$refs.elSelectTree.doClean()
            this.onLoad(this.page);
        },
        searchChange(params, done) {
            this.query = params;
            this.page.currentPage = 1;
            this.form.current = this.page.currentPage
            this.form.size = this.page.pageSize
            this.onLoad(this.page, params);
            done();
        },
        currentChange(currentPage) {
            this.page.currentPage = currentPage;
            this.form.current = this.page.currentPage
            this.form.size = this.page.pageSize
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