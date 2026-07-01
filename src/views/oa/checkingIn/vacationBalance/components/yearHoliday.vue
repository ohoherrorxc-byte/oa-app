<template>
    <div>
        <el-form label-width="60px">
            <el-row :gutter="20">
                <el-col :span="6">
                    <el-form-item label="年份">
                        <el-date-picker class="w100" v-model="form.year" value-format="yyyy" type="year" placeholder="选择年">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
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
                    <el-button @click="getList('isQuery')" type="primary">查 询</el-button>
                    <el-button @click="clean">清 空</el-button>
                </el-col>
                <el-col :span="6">
                    <div class="fr btn-row">
                        <el-button type="primary" @click="submit">保 存</el-button>
                        <upload :showTip="false" @handleRequest="handleRequest" class="mx10 "
                            url="/api/oa-portal/holiday/importYearHoliday"></upload>
                        <el-button type="primary" @click="exportFile">导 出</el-button>
                    </div>
                </el-col>

            </el-row>
        </el-form>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="realName" label="姓名" align="center">
            </el-table-column>
            <el-table-column prop="company" label="分部" align="center">
            </el-table-column>
            <el-table-column prop="deptName" label="部门" align="center">
            </el-table-column>
            <el-table-column prop="dateInWork" label="参加工作日期" align="center">
            </el-table-column>
            <el-table-column prop="employmentDate" label="入职日期" align="center">
            </el-table-column>
            <el-table-column label="年假基数（天）" align="center" width="120">
                <template slot-scope="scope">
                    <el-input-number class="w100" @change="getRestDay(scope.row, scope.$index)"
                        v-model="scope.row.yearRestBasicDay"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="额外年假（天）" width="110" align="center">
                <template slot-scope="scope">
                    <el-input-number class="w100" @change="getRestDay(scope.row, scope.$index)"
                        v-model="scope.row.otherYearRestDay"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="已休年假（天）" width="110" align="center">
                <template slot-scope="scope">
                    <el-input-number class="w100" @change="getRestDay(scope.row, scope.$index)"
                        v-model="scope.row.restDay"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column prop="residueDay" label="剩余年假（天）" width="110" align="center">
            </el-table-column>
        </el-table>
        <el-pagination class="fr" @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="form.current" :page-sizes="[10, 100, 200, 300, 400]" :page-size="form.size"
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
    components: { upload },
    data() {
        return {
            deptList: [],
            tableData: [],
            form: {
                size: 10,
                current: 1,
                year: "",
                realName: null,
                deptName: null
            },
        }
    },
    mounted() {
        this.getTodayYear()
        this.getList()
        this.getDeptList()
    },
    methods: {
        async getList(isQuery) {
            if (isQuery) {
                this.form.size = 10
                this.form.current = 1
            }
            let res = await VacationBalanceApi.selectYearHolidayPage(this.form)
            if (res.data.code === 0) {
                this.tableData = res.data.data.records
                this.total = res.data.data.total
            }
            console.log(res)
        },
        async exportFile() {
            let res = await VacationBalanceApi.exportYearHoliday(this.form.year)
            downBlobFile(res.data, '年假报表')
        },
        handleSizeChange(val) {
            this.form.size = val
            this.getList()
        },
        getRestDay(row) {
            let curRow = row
            curRow.residueDay = Number(curRow.yearRestBasicDay) + Number(curRow.otherYearRestDay) - Number(curRow.restDay)
        },
        handleCurrentChange(val) {
            this.form.current = val
            this.getList()
        },
        getTodayYear() {
            let date = new Date()
            let year = date.getFullYear()
            this.form.year = year.toString()
        },
        getDeptList() {
            getLazyList('', 629965).then((res) => {
             this.deptList = res.data.data;
            });
        },
        clean() {
            this.form = {
                size: 10,
                current: 1,
                year: "",
                realName: null
            }
            this.getTodayYear()
            this.getList()
        },
        async submit() {
            let res = await VacationBalanceApi.batchUpdateYearHoliday(this.tableData)
            if (res.data.code === 0) {
                this.$message.success('已保存')
                this.getList()
            }
        }
    }

}
</script>

<style lang="scss" scoped>
.btn-row {
    display: flex;
    align-items: center;
}

.w100 {
    width: 100%;
}
</style>