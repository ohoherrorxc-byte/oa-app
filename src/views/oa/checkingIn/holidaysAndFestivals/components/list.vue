<template>
    <el-table :data="list" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column align="center" prop="day" label="日期" width="180">
        </el-table-column>
        <el-table-column align="center" prop="remark" label="说明" width="180">
        </el-table-column>
        <el-table-column align="center" prop="type" :formatter="formatter" label="类型">
        </el-table-column>
        <el-table-column align="center" prop="groupName" label="考勤组">
        </el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
            <template slot-scope="scope">
                <el-button @click="deleteRow(scope.row)" type="text" size="small">删除</el-button>
                <el-button @click="editKaoQin(scope.row)" type="text" size="small">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
import HolidaysAndFestivalsApi from '@/api/checkingIn/holidaysAndFestivals/index'
export default {
    props: {
        list: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            tableData: [],
            multipleSelection: []
        }
    },
    methods: {
        formatter(row, column) {
            let obj = {
                0: '公众假日',
                1: "调配工作日",
                2: "调配休息日"
            }
            return obj[row.type];
        },
        editKaoQin(item) {
            this.$emit('editDate', item)
        },
        handleSelectionChange(val) {
            console.log(val)
            this.multipleSelection = val
        },
        async deleteRow(item, isBranch) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let ids = isBranch ? this.multipleSelection.map(ele => ele.id) : item.id
                let res = await HolidaysAndFestivalsApi.delete(ids)
                if (res.data.code === 0) {
                    this.$emit('getDetail')
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });


        },
    }
}
</script>
