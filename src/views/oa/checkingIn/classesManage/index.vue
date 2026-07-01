<template>
    <basic-container>
        <avue-crud :option="option" :search.sync="search" :table-loading="loading" :data="data" ref="crud" v-model="form"
            :page.sync="page" @search-change="searchChange" @search-reset="searchReset" @current-change="currentChange"
            @size-change="sizeChange" @select="selectionRow" @refresh-change="refreshChange" @on-load="onLoad">
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
                <!-- <el-button icon="el-icon-delete" :size="size" :type="type" @click="deleteRow(row)">删除</el-button> -->
            </template>
        </avue-crud>
        <createClasses @getReflesh="onLoad(page)" ref="createClasses"></createClasses>
    </basic-container>
</template>

<script>
import upload from '@/components/upload/index'
import ClassesManageApi from '@/api/checkingIn/classesManage/index'
import createClasses from './createClasses.vue'
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
            multipleSelection:[],
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
                        label: "班次名称",
                        prop: "rankName",
                        searchLabelWidth: 120,
                        searchSpan: 8,
                        search: true,
                        display: false,
                    },
                    {
                        label: "考勤时间",
                        prop: "rangeHours",
                        slot: true,              
                        display: false,
                    },

                ],
            },
        }
    },
    components: {
        upload,createClasses
    },
    methods: {
        async onLoad(page, params = {}) {
            let obj = {
                size: page.pageSize,
                current: page.currentPage
            }
            let postdata = { ...obj, ...params, ...this.query, ...this.form }
            this.loading = true;
            await ClassesManageApi.list(
                postdata
            ).then((res) => {
                const data = res.data.data;
                this.page.total = data.total;
                this.data = data.records;
                this.data.map(ele=>{       
                    let rangeHours = `${ele.workHours} - ${ele.dutyTime}`
                    ele.rangeHours  = rangeHours
                })
                this.loading = false;
            });
        },

        handleAdd() {
            this.$refs.createClasses.dialogVisible = true
         
            this.$refs.createClasses.resetForm()
        },
        selectionRow(selection, row){
            console.log(selection)
            this.multipleSelection = selection
        },
        async editRow(row) {
            this.$refs.createClasses.dialogVisible = true
            this.$refs.createClasses.getDetails(row.id)
        },
        deleteBranch() {
            this.$confirm('此操作将永久批量删除文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let ids = this.multipleSelection.map(ele=>ele.id)
                let res = await ClassesManageApi.delete(ids)
                if (res.data.code === 0) {
                    this.$message.success('该条数据已删除')
                    this.onLoad(this.page)
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
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