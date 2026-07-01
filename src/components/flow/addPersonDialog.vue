<template>
    <el-dialog :title="titleDialog" :append-to-body='true' :visible.sync="dialogFormVisible">
        <el-form :model="form" label-width="120px">
            <p class="textHint">{{ textHint }}</p>
            <el-form-item :label="labelDialog">
                <autoAddress placeholder="请选择人员" ref="autoAddress" class="w-100" @getPerson="getUser"
                    :initData="form.userIds" :initList="userList" :multiple="true">
                </autoAddress>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
import autoAddress from '@/components/autoAddress/index'
import { forwardTask } from '@/api/myFlow/index'
export default {
    components: { autoAddress },
    props:{
        curRow:{
            type:Object,
            default:{}
        }
    },
    data() {
        return {
            titleDialog: '我的加签',
            textHint: "注：加签人员参与审批过程",
            labelDialog: "加签人员",
            dialogFormVisible: false,
            userList: [],
            form: { userIds: [] }
        }
    },
    methods: {
        cancel() {
            this.dialogFormVisible = false
         },
        async confirm() {
            let obj = {
                "businessId": this.$route.query.businessId,
                "processDefinitionId": this.curRow.processDefinitionId,
                "processInstanceId": this.curRow.processInstanceId,
                "remark": this.curRow.comment,
                "userIdList": this.form.userIds
            }
            let res = await forwardTask(obj)
            if (res.data.code === 200) {
                this.dialogFormVisible = false
                this.$message.success('已加签')
                this.$emit('reflesh')
            }
        },
        getUser(data,arr) { 
            this.form.userIds = arr.map(ele=>ele.id)
        }
    }
}
</script>

<style scoped lang="scss">
.textHint {
    padding: 10px 50px;
    color: red
}
</style>