<template>
    <div>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="realName" :label="$t('addressBook.name')">
            </el-table-column>
            <el-table-column prop="deptName" :label="$t('addressBook.department')">
            </el-table-column>
            <el-table-column prop="phone" :label="$t('addressBook.mobile')">
            </el-table-column>
            <el-table-column prop="email" :label="$t('addressBook.email')">
            </el-table-column>
        </el-table>
        <el-pagination class="fr" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="currentPage" :page-sizes="[10, 20, 30, 100]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import AddressApi from '@/api/organizationalStructure/address'
export default {
    props: {
        departmentId: {
            type: String,
            default: ''
        },
        directSuperiorId: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            tableData: [],
            currentPage: 1,
            pageSize: 10,
            total: 100,
            deptId: null,

        }
    },
    methods: {
        async getList(id,reset) {
            if(reset){
                this.currentPage = 1
                this.pageSize = 10
            }
            this.deptId = id
            let obj = {
                current: this.currentPage,
                size: this.pageSize,
                deptId: this.departmentId ? this.departmentId : id,
                directSuperiorId: this.directSuperiorId
            }
            let res = await AddressApi.addressPerson(obj)
            if (res.data.code === 200 || res.data.code === 0) {
                this.tableData = res.data.data.records
                // console.log(this.tableData)
                this.tableData = this.tableData.filter(ele=>{
                    return ele.account!=='luyong'
                })
                this.total = res.data.data.total
            }
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.getList(this.deptId)
            console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.getList(this.deptId)
            console.log(`当前页: ${val}`);
        }
    }
}
</script>