<template>
    <div class="container">
        <el-form label-width="60px">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="姓名">
                        <el-input v-model="form.realName">
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                     <el-form-item label="部门">
                         <el-select v-model="form.deptName">
                            <el-option v-for="item in deptList" :key="item.id" :label="item.deptName"
                                :value="item.deptName"></el-option>
                            </el-select>
                     </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button @click="getList" type="primary">查 询</el-button>
                    <el-button @click="clean">清 空</el-button>
                </el-col>
                <el-col :span="6">
                    <div class="fr btn-row">
                        <el-button type="primary" @click="submit">保 存</el-button>
                        <upload :showTip="false" @handleRequest="handleRequest" class="mx10 " url="/api/oa-portal/childrenHoliday/importChildrenHoliday"></upload>
                        <!-- <el-button type="primary">导 入</el-button> -->
                        <el-button type="primary" @click="exportFile">导 出</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="realName" label="姓名" align="center">
            </el-table-column>
            <el-table-column prop="childrenName" label="新生儿姓名" align="center">
            </el-table-column>
            <el-table-column prop="childrenBirthday" label="新生儿出生日期" align="center">
            </el-table-column>
            <el-table-column prop="basicDay" label="基础育儿假天数" align="center">
                <template slot-scope="scope">
                    <el-input-number @change="getRest(scope.row)" v-model="scope.row.basicDay"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column prop="restDay" label="已请育儿假天数" align="center">
                <template slot-scope="scope">
                    <el-input-number  @change="getRest(scope.row)" v-model="scope.row.restDay"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column prop="residueDay" label="剩余育儿假天数" align="center">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.residueDay"></el-input-number>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="fr" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="form.current" :page-sizes="[10,100, 200, 300, 400]" :page-size="form.size"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
    </div>
</template>

<script>
import { getLazyList, getDept } from "@/api/organizationalStructure/department";
import VacationBalanceApi from '@/api/checkingIn/vacationBalance/index'
import upload from '@/components/upload/index'
import { downBlobFile } from '@/util/util'
export default {
    components:{upload},
    data() {
        return {
            deptList: [],
            tableData: [],
            form: {
                size: 10,
                current: 1,
                realName: null
            },
            total: 10
        }
    },
    mounted() {
        this.getList()
        this.getDeptList()
    },
    methods: {
        async getList() {
            let res = await VacationBalanceApi.selectChildrenHolidayPage(this.form)
            // console.log(res)
            if (res.data.code === 0) {
                this.tableData = res.data.data.records
                this.total = res.data.data.total
            }
        },
        async exportFile(){
            let res = await VacationBalanceApi.exportChildrenHoliday()
            downBlobFile(res.data, '育儿假报表')
        },
        getRest(row){
            row.residueDay = Number(row.basicDay) - Number(row.restDay)
        },
        handleSizeChange(val) {
            this.form.size = val
            this.getList()
        },
        handleCurrentChange(val) {
            this.form.current = val
            this.getList()
        },
        getDeptList() {
          getLazyList('', 629965).then((res) => {
          this.deptList = res.data.data;
         });
        },
        clean() {
            this.form = {
                size: 10,
                page: 1,
                realName: null,
                deptName: null
            }
            this.getTodayYear()
            this.getList()
        },
        async submit() {
            let res = await VacationBalanceApi.batchUpdateChildrenHoliday(this.tableData)
            if(res.data.code===0){
                this.$message.success('已保存')
                this.getList()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.w100{
    width: 100%;
}
.btn-row{
    display: flex;
    align-items: center;
}

</style>
