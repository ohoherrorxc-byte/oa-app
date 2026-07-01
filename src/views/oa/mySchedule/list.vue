<template>
    <basic-container>
        <avue-form v-model="form" :option="option" @submit="handleSubmit" ref="form">
            <template slot-scope="{ size }" slot="menuForm">
                <el-button type="primary" :size="size" icon="el-icon-refresh" @click="refresh">{{$t('commonContent.refresh')}}</el-button>
            </template>
        </avue-form>
        <el-table :data="tableData" ref="multipleTable" v-if="!isSwiper" row-key="id" style="width: 100%; margin-top: 20px"
            stripe align="center" border>
            <el-table-column prop="schedule" :label="$t('commonContent.title')" align="center">
            </el-table-column>
            <el-table-column prop="createUserName" :label="$t('mySchedule.createUserName')" align="center" />
            <el-table-column prop="scheduleStatus" :label="$t('mySchedule.scheduleStatus')" :formatter="statusFormatter" align="center" />
            <el-table-column prop="startTime" width="200" :label="$t('commonContent.startTime')" align="center" />
            <el-table-column prop="endTime" width="200" :label="$t('commonContent.endTime')" align="center" />
            <el-table-column fixed="right" :label="$t('commonContent.operation')" width="80" align="center">
                <template slot-scope="scope">
                    <el-button @click="deleteRow(scope.row)" style="color:#f56c6c ;" v-if="isFinish(scope.row)"
                        icon="el-icon-delete" type="text">{{$t('commonContent.delete')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination v-if="!isSwiper" background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="queryInfo.pageNum" :page-sizes="[2, 5, 10, 20, 50]" :page-size="queryInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="queryInfo.total"></el-pagination>

    </basic-container>
</template>

<script>

import scheduleApi from '@/api/schedule/index'
export default {
    data() {
        return {
            intervalId: null,
            isSwiper: false,
            curRow: null,
            option: {
                size: "mini",
                span: 6,
                menuPosition: "left",
                submitText: this.$t('commonContent.search'),
                submitIcon: "el-icon-search",
                emptyBtn: false,
                column: [
                    {
                        type: "input",
                        label: this.$t('commonContent.title'),
                        allowCreate: true,
                        filterable: true,
                        prop: "schedule",
                    },
                    {
                        type: "input",
                        label: this.$t('mySchedule.createUserName'),
                        allowCreate: true,
                        filterable: true,
                        prop: "createUserName",
                    },
                    {
                        type: "select",
                        label: this.$t('mySchedule.scheduleStatus'),
                        allowCreate: true,
                        filterable: true,
                        dicData: [
                            {
                                label: "待完成",
                                value: 0
                            },
                            {
                                label: "已完成",
                                value: 1
                            }
                        ],
                        prop: "scheduleStatus",
                    },
                    {
                        type: "daterange",
                        label: this.$t('mySchedule.scheduleTime'),
                        format: 'yyyy-MM-dd',
                        valueFormat: 'yyyy-MM-dd',
                        allowCreate: true,
                        filterable: true,
                        prop: "scheduelTimer",
                        change: this.getTimer
                    },
                ],
            },
            tableData: [],
            queryInfo: {
                query: "",
                pageNum: 1,
                pageSize: 10,
                total: 0,
            },
            form: {
                createUserName: '',
                scheduleStatus: "",
                scheduelTimer: [],
                endTime: "",
                startTime: ""
            }
        };
    },
    created() {
        this.getList({});
    },
    mounted() {

    },
    methods: {
        getList() {
            this.form.current = this.queryInfo.pageNum
            this.form.size = this.queryInfo.pageSize
            let obj = {}
            for (let key in this.form) {
                if (this.form[key]||this.form[key]===0) {
                    obj[key] = this.form[key]
                }
            }
            scheduleApi.getList(obj).then(
                (res) => {
                    this.tableData = res.data.data.records;
                    this.queryInfo.total = res.data.data.total;
                }
            );
        },
        getTimer(e) {
            if (e.value) {
                this.form.startTime = e.value[0]
                this.form.endTime = e.value[1]
            } else {
                this.form.startTime = ''
                this.form.endTime = ''
            }
        },
        async deleteRow(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let res = await scheduleApi.deleteRow(row.id)
                if (res.data.code === 0) {
                    this.getList()
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        isFinish(row) {
            return row.scheduleStatus === 1
        },
        statusFormatter(row, column, cellValue) {
            let statusKeyValue = {
                0: '待完成',
                1: '已完成',
            }
            return statusKeyValue[cellValue]
        },
        handleSubmit(form, done) {
            this.form = form;
            this.queryInfo.pageNum = 1;
            this.getList(form);
            done();
        },
        resetEditForm() {

        },
        refresh() {
            this.$refs.form.resetForm();
            this.queryInfo.pageNum = 1;
            this.queryInfo.pageSize = 10
            this.getList({});
        },
        handleCurrentChange(currentPage) {
            this.queryInfo.pageNum = currentPage;
            this.getList({});
        },
        handleSizeChange(pageSize) {
            this.queryInfo.pageSize = pageSize;
            this.getList({});
        },

    }
};
</script>

<style></style>
