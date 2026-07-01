<template>
    <basic-container>
        <avue-crud :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud" v-model="form"
            :page.sync="page" @search-change="searchChange" @search-reset="searchReset" @current-change="currentChange"
            @size-change="sizeChange" @select="select" @refresh-change="refreshChange" @on-load="onLoad">
            <template slot="menuLeft">
                <div class="btn ">
                    <el-button size="small" type="primary" icon="el-icon-plus" @click="handleAdd">新增
                    </el-button>
                    <el-button type="primary" size="small" plain icon="el-icon-download" @click="deleteBranch">批量删除
                    </el-button>
                </div>
            </template>
            <template slot-scope="{type,size,row,index}" slot="menu">
                <el-button icon="el-icon-edit" :size="size" :type="type" @click="editRow(row)">编辑</el-button>
            </template>
        </avue-crud>

        <createAttendance @getReflesh="onLoad(page)" ref="createAttendance"></createAttendance>
    </basic-container>
</template>

<script>
import AttendanceManageApi from '@/api/checkingIn/attendanceManage/index'
import createAttendance from './createAttendance'
export default {
    data() {
        return {
            activeName: "all",
            search: {},
            page: {
                pageSize: 10,
                currentPage: 1,
                total: 0,
            },
            data: [],
            form: {
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
                dialogClickModal: false,
                searchShowBtn: false,
                column: [
                    {
                        label: "考勤组名称",
                        prop: "groupName",
                        searchLabelWidth: 120,
                        searchSpan: 8,
                        search: true,
                        display: false,
                    },
                    {
                        label: "班次",
                        prop: "rankName",
                        slot: true,
                        search: false,
                        display: false,
                    },
                    {
                        label: "人数",
                        prop: "personNumber",
                        slot: true,
                        search: false,
                        display: false,
                    },
                ],
            },
            multipleSelection: []
        }
    },
    components: {
        createAttendance
    },
    activated() {
        if (this.$refs.crud && this.$refs.crud.doLayout) {
            this.$refs.crud.doLayout();
        }
    },

    methods: {
        async onLoad(page, params = {}) {
            let obj = {
                size: page.pageSize,
                current: page.currentPage,
            }
            let postdata = { ...obj, ...params, ...this.query, ...this.form }
            this.loading = true;
            await AttendanceManageApi.selectPage(
                postdata
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.loading = false;
            });
        },

        handleAdd() {
            this.$refs.createAttendance.dialogVisible = true
            this.$refs.createAttendance.resetForm()
        },

        async editRow(row) {
            this.$refs.createAttendance.dialogVisible = true
            this.$refs.createAttendance.getDetails(row.id)
        },
        deleteBranch() {
            this.$confirm('此操作将永久删除文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let ids = this.multipleSelection.map(ele => ele.id)
                let res = await AttendanceManageApi.delete(ids)
                if (res.data.code === 0) {
                    this.$message.success('已删除')
                    this.onLoad(this.page)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        select(selection, row) {
            console.log(selection)
            console.log(row)
            this.multipleSelection = selection
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