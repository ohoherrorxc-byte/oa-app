<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="userName" label="用户" width="180" align="center">
        </el-table-column>
        <el-table-column prop="logInfo" label="操作" width="180" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="处理时间" align="center">
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center">
        </el-table-column>
    </el-table>
</template>

<script>
import substituteOrderManageApi from '@/api/substitute/orderManage'
export default {
    data() {
        return {
            tableData: []
        }
    },
    mounted(){
        this.getList()
    },
    methods: {
        async getList() {
            let res = await substituteOrderManageApi.log(this.$route.query.id)
            console.log(res)
            if(res.data.code===0||res.data.code===200){
                this.tableData = res.data.data
            }
        }
    }
}
</script>