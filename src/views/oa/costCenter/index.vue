<template>
    <basic-container>
        <el-button type="primary" @click="getList" class="mb10">查 询</el-button>
        <el-button type="primary" @click="dialogFormVisible = true" class="mb10">新 建</el-button>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="costName" label="成本中心名称">
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间">
            </el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
                    <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
                    <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :append-to-body="true" title="新增成本" :visible.sync="dialogFormVisible">
            <el-form :model="form">
                <el-form-item label="成本名称" label-width="120px">
                    <el-input v-model="form.costName" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </basic-container>
</template>

<script>
import CostApi from '@/api/cost/index'
export default {
    data() {
        return {
            tableData: [],
            dialogFormVisible: false,
            form: {
                costName: ""
            },
        }
    },
    created() {
        this.getList()
    },
    methods: {
        async getList() {
            let res = await CostApi.getList()
            if (res.data.code === 0) {
                this.tableData = res.data.data.records
            }
        },
        async save() {
            let res = this.form.id ? await CostApi.update(this.form) : await CostApi.add(this.form)
            if (res.data.code === 0 || res.data.code === 200) {
                this.$message.success('保存成功')
                this.dialogFormVisible = false
                this.getList()
            }
        },
        editRow(row) {
            this.dialogFormVisible = true
            this.form = row
        },
        async deleteRow(row) {
            let res = await CostApi.deleteRow(row.id)
            if (res.data.code === 0) {
                this.getList()
            }
        }
    }
}
</script>