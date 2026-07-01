<template>
    <el-dialog title="延长会议" :visible.sync="dialogVisibleTimer" :append-to-body="true" width="30%"
        :before-close="handleClose">
        <el-form :model="form" label-width="120px" :rules="rules" ref="ruleForm">
            <el-form-item label="延长时间" prop="timer">
                <el-select v-model="form.timer">
                    <el-option v-for="item in timerList" :label="item.label" :key="item.value"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="delaySubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import meetingApi  from '@/api/meeting/index'
export default {
    props: {
        row: {
            type: Object
        }
    },
    data() {
        return {
            form: {
                timer: null
            },
            timerList: [
                {
                    value: '5',
                    label: "5分钟"
                },
                {
                    value: '10',
                    label: "10分钟"
                },
                {
                    value: '15',
                    label: "15分钟"
                },
                {
                    value: '30',
                    label: "30分钟"
                },
                {
                    value: '60',
                    label: "60分钟"
                },
                {
                    value: '90',
                    label: "90分钟"
                },
                {
                    value: '120',
                    label: "120分钟"
                }
            ],
            dialogVisibleTimer: false,
            rules: {
                timer: [
                    { required: true, message: '请选择延长时间', trigger: 'change' },
                ],
            }
        }
    },
    methods: {
        cancel() {
            this.$refs.ruleForm.resetFields()
            this.dialogVisibleTimer = false
        },
        delaySubmit() {
            console.log(this.row)
            let obj = {
                id: this.row.id,
                time:Number(this.form.timer)
                //   状态 0:未开始、1:进行中、2:结束、3:已取消             
            }
            this.$refs.ruleForm.validate(async(valid) => {
                if (valid) {
                    let res = await meetingApi.updateStatus(obj)
                    if(res.data.code){
                        this.message.success('已延长会议时间')
                        this.dialogVisibleTimer = false
                    }
                } else {

                }
            })
        },
    }
}
</script>