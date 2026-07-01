<template>
    <basic-container>
        <avue-form v-model="form" :option="option" @submit="handleSubmit" ref="form">
            <template slot-scope="{ size }" slot="menuForm">
                <el-button type="primary" :size="size" icon="el-icon-refresh" @click="refresh">刷新</el-button>
            </template>
        </avue-form>
        <el-table :data="tableData" ref="multipleTable" v-if="!isSwiper" row-key="id" style="width: 100%; margin-top: 20px"
            stripe align="center" border>
            <el-table-column prop="schedule" label="新闻标题" align="center">
            </el-table-column>
            <el-table-column prop="createUserName" label="创建人" align="center" />
            <el-table-column prop="scheduleStatus" label="创建时间" :formatter="statusFormatter" align="center" />
            <el-table-column fixed="right" label="操作" width="220" align="center">
                <template slot-scope="scope">
                    <el-dropdown size="mini" :hide-on-click="hideDown">
                        <span class="el-dropdown-link font12" @click="hideDown=false">
                            展示<i class="el-icon-arrow-down el-icon--right font12"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="item in dropdownList">
                            <div class="row" @click="item.checked=!item.checked">
                                {{ item.label }} 
                                <i class="el-icon-check checked"   v-if="item.checked"></i>
                            </div>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-button type="primary" @click="remarkShow" class="fr mb10">确定</el-button>
                            </el-dropdown-item>
                          
                        </el-dropdown-menu>
                    </el-dropdown>
                   
                    <el-button @click="deleteRow(scope.row)" style="color:#f56c6c ;" v-if="isFinish(scope.row)"
                        icon="el-icon-delete" type="text">删除</el-button>
                    <el-button @click="edit(scope.row)" style="color:#6ca1f5 ;" v-if="isFinish(scope.row)"
                        icon="el-icon-edit" type="text">编辑</el-button>
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
            hideDown:false,
            option: {
                size: "mini",
                span: 6,
                menuPosition: "left",
                submitText: "搜索",
                submitIcon: "el-icon-search",
                emptyBtn: false,
                column: [
                    {
                        type: "input",
                        label: "新闻标题",
                        allowCreate: true,
                        filterable: true,
                        prop: "schedule",
                    },
                    {
                        type: "input",
                        label: "创建人",
                        allowCreate: true,
                        filterable: true,
                        prop: "createUserName",
                    },
                    {
                        type: "daterange",
                        label: "创建时间",
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
            },
            dropdownList:[
                {
                    label:'轮播块',
                    checked:false
                },
                {
                    label:'公司新闻',
                    checked:false
                },
                {
                    label:'通知公告',
                    checked:false
                },
                {
                    label:'公司制度',
                    checked:false
                },
                {
                    label:'系统帮助',
                    checked:false
                }
            ]
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
                if (this.form[key] || this.form[key] === 0) {
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
        remarkShow(){
            this.hideDown = true
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
        edit(row) { },
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
  
<style scoped lang="scss">
.font12{
    font-size: 12px;
}
.row{
    width: 200px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.checked{
    color: #409EFF;
}
</style>
  