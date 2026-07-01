<template>
    <basic-container>
        <avue-crud :option="option" :table-loading="loading" :data="data" :page="false" v-model="form" ref="crud"
            @search-change="searchChange" @search-reset="searchReset" @current-change="currentChange"
            @size-change="sizeChange" @refresh-change="refreshChange">
            <!-- <template slot-scope="{ row }" slot="titleName">
                <div @click="toDetail(row)">{{ row.titleName }}</div>
            </template> -->
            <template slot-scope="{disabled,size}" slot="createUserNameSearch">
                <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100" @getPerson="getPerson"
                    :initData="form.createUserName" :multiple="false">
                </autoAddress>
            </template>
            <template slot-scope="{ row }" slot="operate">
                <el-button type="text" @click="reBack(row)">退回</el-button>
            </template>
        </avue-crud>
    </basic-container>
</template>

<script>
import { findTask, backTask } from '@/api/myFlow/index'
import autoAddress from '@/components/autoAddress/index'
export default {
    components: { autoAddress },
    data() {
        return {
            initList: [],
            data: [],
            form: {
                "assigneeName": "",
                "createDateEnd": "",
                "createDateStart": "",
                "createUserName": "",
                "processDefinitionName": "",
                "titleName": "",
                userId: '',
                flowTabList: [0],
                current: 1,
                size: 1000000
            },
            query: {},
            loading: false,
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
                        label: "流程标题",
                        prop: "titleName",
                        search: true,
                        // slot: true,
                    },
                    {
                        label: "创建日期",
                        prop: "createTime",
                        type: "datetime",
                        search: false,
                        startPlaceholder: "开始时间",
                        endPlaceholder: "结束时间",
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
                        label: "创建人",
                        prop: "createUserName",
                        search: true,
                    },
                    {
                        label: "流程类型",
                        prop: "processDefinitionName",
                        search: false,
                    },

                    {
                        label: "当前节点",
                        prop: "taskName",
                        search: false,
                    },
                    {
                        label: "当前状态",
                        prop: "status",
                        search: false,
                    },
                    {
                        label: "接收日期",
                        prop: "taskStartTime",
                        search: false,
                    },
                    {
                        label: "流程编号",
                        prop: "taskId",
                        search: false,
                    },
                    {
                        label: "未操作者",
                        prop: "assigneeName",
                        search: false,
                    },
                    {
                        label: "操作",
                        prop: "operate",
                        float: 'right',
                        search: false,
                    },
                ]
            }
        }
    },
    methods: {
        onLoad(page, param) {
            // console.log(this.form)
            let obj = {
                titleName: this.query.titleName,
                userId: this.form.userId
            }
            findTask(
                obj
            ).then((res) => {
                if (res.data.code === 200 || res.data.code === 0) {
                    const data = res.data.data;
                    this.page.total = data.total;
                    this.data = data
                    this.loading = false;
                }
            });
        },
        getPerson(data) {
            // console.log(data)
            this.form.userId = data.id
        },
        toDetail(row) {
            this.$router.push(`${row.path}?businessId=${row.businessId}&taskId=${row.taskId}&processIsFinished=${row.processIsFinished}&status=${row.status}`)
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
            this.query = {};
            this.onLoad(this.page);
        },
        searchChange(params, done) {
            this.query = params;
            console.log('titleName')
            console.log(this.query)
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
        async reBack(row) {
            this.$confirm('是否确认退回该流程?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let res = await backTask({ proInstId: row.processInstanceId })
                console.log(res)
                if(res.data.code===200||res.data.code===0){
                    this.$message.success('已退回')
                    this.onLoad()
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            })

        }
    }
}
</script>