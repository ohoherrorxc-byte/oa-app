<template>
    <basic-container>
        <el-form v-model="searchForm" ref="searchFormRef" :rules="searchRule" label-width="100px" class="form-search">
            <el-form-item :label="$t('subjectManage.subjectName')">
                <el-input v-model="searchForm.subjectName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('subjectManage.budgetYear')">
                <el-date-picker class="w-100" value-format="yyyy" v-model="searchForm.yearDate" type="year"
                    placeholder="选择年">
                </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('subjectManage.costCenter')" prop="costCenterId">
                <el-select v-model="searchForm.costCenterId" @change="getList">
                    <el-option v-for="item in costList" :key="item.id" :value="item.id" :label="item.costName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('subjectManage.status')">
                <el-select v-model="searchForm.useStatus" placeholder="" clearable>
                    <el-option label="已封存" :value="1"></el-option>
                    <el-option label="未封存" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item :label="$t('subjectManage.projectName')">
                <el-input v-model="searchForm.projectName"></el-input>
            </el-form-item>
            <el-form-item :label="$t('subjectManage.subjectType')">
                <el-select v-model="searchForm.subjectType" placeholder="" clearable>
                    <el-option label="研发类" value="研发类"></el-option>
                    <el-option label="非研发类" value="非研发类"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="pb10 pl30 flex-center">
            <el-button size="mini" type="primary" @click="getList" icon="el-icon-search">{{$t('commonContent.search')}}</el-button>
            <el-button size="mini" type="primary" icon="el-icon-delete" @click="clearSearch">{{$t('commonContent.refresh')}}</el-button>
            <el-button size="mini" icon="el-icon-plus" type="primary" @click="dealSubject('one')">{{$t('commonContent.add')}}</el-button>
            <el-button size="mini" type="primary" @click="downloadModle">{{$t('commonContent.downloadTemplate')}}</el-button>
            <!-- <el-button>导 入</el-button> -->
            <upload @handleRequest="handleRequest" class="mx10 mt10" url="/api/oa-portal/subject/import"></upload>
            <el-button size="mini" type="primary" @click="exportTable">{{$t('commonContent.export')}}</el-button>
        </div>
        <el-table ref="tableRef" @selection-change="handleSelectionChange" :data="tableData" @select-all="selectAllRow"
            @select="selectRow" style="width: 100%;margin-bottom: 20px;" row-key="rowKey" border default-expand-all
            :tree-props="{ children: 'childList', hasChildren: 'hasChildren' }" height="550">
            <el-table-column type="selection" width="55" align="center">
            </el-table-column>
            <el-table-column class="one-row" prop="subjectName" :label="$t('subjectManage.subjectName')" sortable width="340">
            </el-table-column>
            <el-table-column prop="costName" :label="$t('subjectManage.costCenter')" sortable width="120">
            </el-table-column>
            <el-table-column prop="subjectCode" :label="$t('subjectManage.subjectCode')" sortable align="center" width="280">
            </el-table-column>
            <el-table-column prop="totalAvailableBudget" :label="$t('subjectManage.totalAvailableBudget')" align="center" sortable width="120">
            </el-table-column>
            <el-table-column prop="expensesUnderReview" :label="$t('subjectManage.expensesUnderReview')" align="center" width="100">
            </el-table-column>
            <el-table-column prop="expensesIncurred" :label="$t('subjectManage.expensesIncurred')" sortable align="center" width="120">
            </el-table-column>
            <el-table-column prop="availableBudget" :label="$t('subjectManage.availableBudget')" align="center" sortable width="120">
            </el-table-column>
            <el-table-column prop="lastAvailableBudget" :label="$t('subjectManage.lastAvailableBudget')" align="center" width="120">
            </el-table-column>
            <el-table-column prop="planAvailableBudget" :label="$t('subjectManage.planAvailableBudget')" sortable align="center" width="120">
            </el-table-column>
            <el-table-column prop="addAvailableBudget" :label="$t('subjectManage.addAvailableBudget')" align="center" sortable width="120">
            </el-table-column>
            <el-table-column prop="useProportion" :label="$t('subjectManage.useProportion')" align="center" width="100">
            </el-table-column>
            <el-table-column prop="projectManager" :label="$t('subjectManage.projectManager')" sortable align="center" width="120">
            </el-table-column>
            <el-table-column prop="useStatus" :label="$t('subjectManage.status')" :formatter="formatStatus" align="center" width="120">
            </el-table-column>
            <el-table-column prop="subjectLevel" :formatter="formatSubject" :label="$t('subjectManage.subjectLevel')" align="center" width="120">
            </el-table-column>
            <el-table-column prop="parentSubjectName" :label="$t('subjectManage.parentSubjectName')" align="center" width="300">
            </el-table-column>
            <el-table-column prop="budgetCycle" :label="$t('subjectManage.budgetCycle')" align="center">
            </el-table-column>
            <el-table-column prop="isBudgeTable" :label="$t('subjectManage.isBudgeTable')" :formatter="formatBudget" width="120" align="center">
            </el-table-column>
            <el-table-column prop="describeInfo" :label="$t('subjectManage.describeInfo')" align="center">
            </el-table-column>
            <el-table-column prop="name" :label="$t('commonContent.operation')" sortable width="120" align="center" fixed="right">
                <template slot-scope="scope">
                    <!-- 非编制预算可以新增 -->
                    <el-button v-if="!scope.row.isBudgeTable" icon="el-icon-plus" type="text"
                        @click="dealSubject('', scope.row)">{{$t('commonContent.add')}}</el-button>
                    <el-button icon="el-icon-edit" type="text" @click="editRow(scope.row)">{{$t('commonContent.edit')}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- <el-pagination background class="fr" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="searchForm.currentPage" :page-sizes="[100, 200, 300, 400]" :page-size="searchForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination> -->
        <el-dialog :append-to-body="true" :title="$t('subjectManage.newSubject')" :visible.sync="dialogFormVisible">
            <el-form :model="form" ref="ruleForm" label-width="120px" :rules="rules">
                <el-form-item :label="$t('subjectManage.subjectName')" prop="subjectName">
                    <el-input :disabled="isEdit" v-model="form.subjectName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!isEdit" :label="$t('commonContent.remarks')" prop="remarks">
                    <el-input type="textarea" v-model="form.remarks" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!isEdit" :label="$t('subjectManage.subjectCode')" prop="subjectCode">
                    <el-input v-model="form.subjectCode" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('subjectManage.status')" prop="useStatus">
                    <el-select v-model="form.useStatus" placeholder="请选择">
                        <el-option label="已封存" :value="1"></el-option>
                        <el-option label="未封存" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!isEdit" :label="$t('subjectManage.subjectLevel')" prop="subjectLevelName">
                    <el-input v-model="form.subjectLevelName" disabled autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!isEdit" :label="$t('subjectManage.parentSubjectName')" prop="parentSubjectName">
                    <el-input v-model="form.parentSubjectName" disabled autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!isEdit" :label="$t('subjectManage.budgetCycle')" prop="budgetCycle">
                    <el-input v-model="form.budgetCycle" disabled autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="!isEdit" :label="$t('subjectManage.isBudgeTable')" prop="isBudgeTable">
                    <el-select v-model="form.isBudgeTable" placeholder="">
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('subjectManage.describeInfo')" prop="describeInfo">
                    <el-input type="textarea" v-model="form.describeInfo" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">{{$t('commonContent.cancel')}}</el-button>
                <el-button type="primary" @click="remarkAdd">{{$t('commonContent.confirm')}}</el-button>
            </div>
        </el-dialog>
    </basic-container>
</template>

<script>
import CostApi from '@/api/cost'
import { downBlobFile } from "@/util/util";
import upload from '@/components/upload'
import subjectManageApi from '@/api/subjectManage'
export default {
    data() {
        return {
            form: {
                subjectName: '',
                remarks: "",
                subjectCode: "",
                useStatus: "",
                subjectLevel: "",
                subjectLevelName: '',
                parentSubjectName: '',
                budgetCycle: "每年",
                isBudgeTable: "",
                describeInfo: "",
            },
            searchForm: {
                subjectName: "",
                useStatus: null,
                costCenterId: null,
                currentPage: 1,
                pageSize: 10000,
                yearDate: null,
                projectName:null,
                subjectType:null
            },
            dialogFormVisible: false,
            tableData: [],
            rules: {
                subjectName: [{
                    required: true, message: this.$t('subjectManage.subjectName'), trigger: 'blur'
                }],
                subjectCode: [{
                    required: true, message: this.$t('subjectManage.subjectCode'), trigger: 'blur'
                }],
                useStatus: [{
                    required: true, message: this.$t('subjectManage.status'), trigger: 'change'
                }],
            },
            searchRule: {
                // costCenterId: [{ required: true, message: '请选择成本中心', trigger: 'blur' }]
            },
            curRow: {},
            isEdit: false,
            costList: [],
            multipleSelection: []
        }
    },
    mounted() {
        this.getCost()
        this.getList()
    },
    components: {
        upload
    },
    methods: {
        async getList() {
            let result = this.testCost()
            if (!result) return
            this.$refs.tableRef.clearSelection();
            let res = await subjectManageApi.getListSubject(this.searchForm)
            if (res.data.code === 0) {
                this.tableData = res.data.data
                this.addListKey(this.tableData)
            }
        },
        addListKey(arr){
            arr.map((ele,index)=>{
                ele.rowKey = ele.id+index
                if(ele.childList&&ele.childList.length>0){
                    this.addListKey(ele.childList)
                }
            })
        },
        testCost() {
            // if (!this.searchForm.costCenterId) {
            //     this.$message.error('请先选择成本中心')
            //     return false
            // }
            return true
        },
        //父子关系勾选同步
        selectRow(selection, row) {
            let data = selection.some((item) => {
                return row.id === item.id;
            });
            if (data) {
                // 勾选节点时
                if (row.childList) {
                    this.setChildren(row.childList, true);
                }
            } else {
                // 取消勾选节点时
                if (row.childList) {
                    this.setChildren(row.childList, false);
                }
            }
        },
        setChildren(children, type) {
            children.map((item) => {
                this.toggleSelection(item, type);
                if (item.childList) {
                    this.setChildren(item.childList, type);
                }
            });
        },
        toggleSelection(row, select) {
            if (row) {
                this.$nextTick(() => {
                    this.$refs.tableRef.toggleRowSelection(row, select);
                });
            }
        },
        // 全选按钮
        selectAllRow(selection) {
            // 全选
            let isSelect = selection.some((item) => {
                let tableDataIds = this.tableData.map((data) => data.id);
                if (tableDataIds.indexOf(item.id) !== -1) {
                    return true;
                } else {
                    return false;
                }
            });
            // 全不选
            let isCancel = !this.tableData.every((item) => {
                let selectIds = selection.map((data) => data.id);
                if (selectIds.indexOf(item.id) !== -1) {
                    return true;
                } else {
                    return false;
                }
            });
            if (isSelect) {
                selection.map((item) => {
                    if (item.childList) {
                        this.setChildren(item.childList, true);
                    }
                });
            }
            if (isCancel) {
                this.tableData.map((item) => {
                    if (item.childList) {
                        this.setChildren(item.childList, false);
                    }
                });
            }
        },
        async getCost() {
            let res = await CostApi.getCostList()
            this.costList = res.data.data
        },
        dealSubject(key, row) {
            this.dialogFormVisible = true
            this.isEdit = false
            this.$nextTick(() => {
                this.$refs.ruleForm.resetFields()
                if (key === 'one') {
                    this.form.subjectLevel = 1
                    this.form.subjectLevelName = '一级'
                } else {
                    let obj = {
                        1: '一级',
                        2: '二级',
                        3: '三级',
                        4: '四级'
                    }
                    this.form.subjectLevel = Number(row.subjectLevel) + 1
                    this.form.subjectLevelName = obj[row.subjectLevel]
                    this.form.parentSubjectName = row.subjectName
                    this.form.parentSubjectId = row.id
                }
            })

        },
        clearSearch() {
            for (let key in this.searchForm) {
                if (key !== 'currentPage' && key !== 'pageSize') {
                    this.searchForm[key] = null
                }
            }
            this.getList()
        },
        addRowChildren(row) {
            this.dialogFormVisible = true
            this.curRow = row
            this.isEdit = false
        },
        handleRequest() {
            this.getList()
        },
        editRow(row) {
            this.dialogFormVisible = true
            this.form = row
            this.isEdit = true
        },
        formatStatus(row, column, cellValue) {
            let obj = {
                0: '未封存',
                1: '已封存'
            }
            return obj[cellValue]
        },
        formatBudget(row, column, cellValue) {
            let obj = {
                0: '否',
                1: '是'
            }
            return obj[cellValue]
        },
        formatSubject(row, column, cellValue) {
            let obj = {
                1: '一级',
                2: '二级',
                3: '三级',
                4: '四级'
            }
            return obj[cellValue]
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        async remarkAdd() {
            this.$refs.ruleForm.validate(async (vaild) => {
                if (vaild) {
                    let res = this.form.id ? await subjectManageApi.update(this.form) : await subjectManageApi.add(this.form)
                    if (res.data.code === 0) {
                        this.$message.success('已提交')
                        this.dialogFormVisible = false
                        this.getList()
                    }
                }
            })
        },
        async exportTable() {
            let res = await subjectManageApi.exportSubject(this.searchForm.costCenterId)
            downBlobFile(res.data, '科目管理')
        },

        async downloadModle() {
            let res = await subjectManageApi.downModel()
            downBlobFile(res.data, '科目管理下载模板')
            this.$refs.tableRef.clearSelection();
        }
    }
}
</script>

<style lang="scss" scoped>
.form-search {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
        width: 48%;
    }
}

.w-100 {
    width: 100%;
}

::v-deep ep .el-table .cell {
    white-space: nowrap !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
}
</style>
