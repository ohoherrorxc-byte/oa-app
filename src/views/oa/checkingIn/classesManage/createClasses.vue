<template>
    <el-dialog title="提示" :append-to-body="true" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
        <el-form ref="form" label-width="140px" v-model="form">
            <el-form-item label="班次名称">
                <el-input v-model="form.rankName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="一天内上下班次数">
                <el-radio-group v-model="radio">
                    <el-radio :label="3">1天1次上下班</el-radio>
                    <el-radio :label="6">1天2次上下班</el-radio>
                    <el-radio :label="9">1天3次上下班</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="">
                <div class="set-timer ">
                    <span class="mr5">上班时间</span>
                    <el-time-picker @change="changeSpace" format="HH:mm" value-format="HH:mm" v-model="form.workHours"
                        class="mr5" placeholder="任意时间点">
                    </el-time-picker>
                    <el-input class="w100 mr5" v-model="form.earlyWorkMinutes"></el-input>分钟前开始打卡
                    <el-input class="w100 ml20 mr5" v-model="form.delayWorkMinutes"></el-input>分钟后结束打卡
                </div>
                <div class="set-timer ">
                    <span class="mr5">下班时间</span>
                    <el-time-picker v-model="form.dutyTime" @change="changeSpace" format="HH:mm" value-format="HH:mm"
                        class="mr5" placeholder="任意时间点">
                    </el-time-picker>
                    <el-input class="w100 mr5" v-model="form.earlyDutyMinutes"></el-input>分钟前开始打卡
                    <el-input class="w100 ml20" v-model="form.delayDutyMinutes"></el-input>分钟后结束打卡
                </div>
                <div class="font-gery">
                    合计工作时长：{{ spaceTimer }}（考勤统计工作时长及请假出差外出统计，会以此时间为准）
                </div>
            </el-form-item>
            <el-form-item label="排除休息时间">
                <div class="flex items-center">
                    <el-switch class="mr10" @change="changeExclude" v-model="form.excludeRestTime" active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                    <div v-if="form.excludeRestTime">
                        休息开始
                        <el-time-picker @change="changeSpace" v-model="form.restStartTime" format="HH:mm"
                            value-format="HH:mm" class="mr5" placeholder="任意时间点">
                        </el-time-picker>
                    </div>
                    <div v-if="form.excludeRestTime">
                        休息结束
                        <el-time-picker @change="changeSpace" v-model="form.restEndTime" format="HH:mm" value-format="HH:mm"
                            class="mr5" placeholder="任意时间点">
                        </el-time-picker>
                    </div>
                </div>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="允许迟到分钟数">
                        <el-input v-model="form.allowDelayMinutes"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="允许早退分钟数">
                        <el-input v-model="form.allowEarlyLeaveMinutes"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="严重迟到分钟数">
                        <el-input v-model="form.severelyLateMinutes"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="严重早退分钟数">
                        <el-input v-model="form.severelyLeaveMinutes"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="迟到Arrive late">
                        <div class="flex">
                            <el-input class="w100 mr5" v-model="form.lateArrivalAbsenteeismMinutes"></el-input>分钟算旷工
                        </div>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="早退">
                        <div class="flex">
                            <el-input class="w100 mr5" v-model="form.earlyLeaveAbsenteeismMinutes"></el-input>分钟算旷工
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="允许晚到晚走">
                        <div class="flex items-center">
                            <el-switch @change="changeArrive" class="mr5" v-model="form.arriveLateAndLeaveLate"
                                active-color="#13ce66" inactive-color="#ff4949">
                            </el-switch>
                            <el-input v-if="form.arriveLateAndLeaveLate" class="w100 mr5"
                                v-model="form.allowLateArrivalMinutes"></el-input>分钟
                        </div>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="remark">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import ClassesManageApi from '@/api/checkingIn/classesManage/index'
import { calculateTimeDifference } from '@/util/util'
export default {
    data() {
        return {
            dialogVisible: false,
            activeName: 'first',
            spaceTimer: '',
            form: {      
            }
        }
    },
    mounted(){
        this.init()
    },
    methods: {
        handleClose() {
            this.dialogVisible = false
        },
        init(){
            this.form = {
                rankName: '',
                workHours: "",
                earlyWorkMinutes: "",
                delayWorkMinutes: "",
                dutyTime: "",
                earlyDutyMinutes: "",
                delayDutyMinutes: "",
                totalWorkHours: "",
                allowDelayMinutes: "",
                allowEarlyLeaveMinutes: "",
                severelyLateMinutes: "",
                severelyLeaveMinutes: "",
                lateArrivalAbsenteeismMinutes: "",
                earlyLeaveAbsenteeismMinutes: "",
                arriveLateAndLeaveLate: true,
                allowLateArrivalMinutes: "",
                excludeRestTime: true,
                restStartTime: "",
                restEndTime: "",
            }
        },
        async getDetails(id) {
            let res = await ClassesManageApi.detail(id)
            if (res.data.code === 0) {
                this.form = res.data.data
                this.changeSpace()
            }
        },
        changeArrive() {
            console.log(this.form.arriveLateAndLeaveLate)
        },
        changeExclude() {
            if (!this.form.excludeRestTime) {
                this.form.restStartTime = ''
                this.form.restEndTime = ''
            }
        },
        changeSpace() {
            if (this.form.workHours && this.form.dutyTime) {
                let result = calculateTimeDifference(this.form.workHours, this.form.dutyTime)
                if (!this.form.excludeRestTime) {
                    this.spaceTimer = `${result[0]}小时 ${result[1]}分钟`
                } else {
                    let result2 = calculateTimeDifference(this.form.restStartTime, this.form.restEndTime)
                    let result3 = calculateTimeDifference(`${result[0]}:${result[1]}`, `${result2[0]}:${result2[1]}`)
                    console.log(result3)
                    if (result3.length > 1) {
                        this.spaceTimer = `${result3[0]}小时 ${result3[1]}分钟`
                    }
                }
            }
        },
        resetForm(){
            this.init()      
        },
        async remark() {
            let res = await ClassesManageApi.save(this.form)
            console.log(res)
            if (res.data.code === 0) {
                this.dialogVisible = false
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.set-timer {
    display: flex;
    flex-wrap: wrap;
    line-height: 40px;


}

.w100 {
    width: 100px !important;
}

.mx10 {
    margin: 0 10px;
}

.mr5 {
    margin-right: 5px;
}

.ml20 {
    margin-right: 20px;
}

.font-gery {
    font-size: #666;
}

.items-center {
    align-items: center;
}
</style>