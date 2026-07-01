<template>
    <div>
        <el-dialog :title="title" :visible.sync="dialogVisible" width="70%" :before-close="handleClose"
            :append-to-body="true">
            <el-form :model="form" label-width="120px">
                <el-form-item label="考勤组">
                    <el-input disabled v-model="curKaoQin.groupName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item v-if="isEdit" label="日期">
                    <el-date-picker disabled v-model="form.day" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开始日期" v-if="!isEdit">
                    <el-date-picker v-model="form.startDay" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" v-if="!isEdit">
                    <el-date-picker v-model="form.endDay" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="form.remark">
                    </el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="0">公众假日</el-radio>
                        <el-radio :label="1">调配工作日</el-radio>
                        <el-radio :label="2">调配休息日</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="同步到其他考勤">
                    <el-switch v-model="form.otherGroup" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </el-form-item>
                <el-form-item v-if="form.otherGroup" label="同步考勤组">
                    <el-select v-model="form.otherGroupIds" placeholder="请选择" multiple>
                        <el-option v-for="item in groupList" :label="item.groupName" :value="item.id"
                            :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteRow" v-if="isEdit">删 除</el-button>
                <el-button type="primary" @click="save">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import HolidaysAndFestivalsApi from '@/api/checkingIn/holidaysAndFestivals/index'
import { getFormatDate } from '@/util/util'
export default {
    data() {
        return {
            dialogVisible: false,
            title: "新建工作日期调整",
            form: {
                "day": "",
                "endDay": "",
                "groupId": null,
                "groupName": "",
                "otherGroupIds": [],
                otherGroup: false,
                "remark": "",
                "startDay": "",
                "type": null,
            },
            isEdit: false,
            groupList: []
        }
    },
    props: {
        curKaoQin: {
            type: Object
        }
    },
    watch: {
        curKaoQin() {
            console.log('curKaoQin')
            this.getGroupName()
        }
    },
    computed: {

    },
    mounted() {
        this.getList()
    },
    methods: {
        getGroupName() {
            console.log(this.curKaoQin)
            if (this.curKaoQin) {
                this.form.groupId = this.curKaoQin.id
                this.form.groupName = this.curKaoQin.groupName
            }
        },
        async getList() {
            let res = await HolidaysAndFestivalsApi.attendanceGroup()
            // console.log(res)
            if (res.data.code === 0) {
                this.groupList = res.data.data.records
                // console.log(this.groupList)
                if (this.groupList.length > 0) {
                    this.currKaoQin = this.groupList[0].id
                    this.currRow = this.groupList[0]
                    this.$emit('currRow', this.currRow)
                }
            }
        },
        handleClose() {
            this.dialogVisible = false
        },
        reset() {
            this.form = {
                "day": "",
                "endDay": "",
                "groupId": null,
                "groupName": "",
                "otherGroupIds": [],
                otherGroup: false,
                "remark": "",
                "startDay": "",
                "type": null,
            }
        },
        async getDetail(data) {
            this.title = '编辑工作日期调整'
            let day = data.id ? data.day : getFormatDate(data.date)
            let res = await HolidaysAndFestivalsApi.getDetail(day, this.form.groupId)
            console.log(res)
            this.isEdit = true
            if (res.data.code === 0) {
                this.form = res.data.data
            }
        },
        async deleteRow() {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let res = await HolidaysAndFestivalsApi.delete(this.form.id)
                console.log(res)
                if (res.data.code === 0) {
                    this.dialogVisible = false
                    this.$emit('getDetail')
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });


        },
        async save() {
            if (this.curKaoQin) {
                this.form.groupId = this.curKaoQin.id
                this.form.groupName = this.curKaoQin.groupName
            }
            let res = this.isEdit ? await HolidaysAndFestivalsApi.update(this.form) : await HolidaysAndFestivalsApi.batchSave(this.form)
            console.log(res)
            if (res.data.code === 0) {
                this.$emit('getDetail')
                this.dialogVisible = false
            }
        }
    }
}
</script>

<style></style>