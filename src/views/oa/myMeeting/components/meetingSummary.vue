<template>
    <div>
        <el-dialog :visible.sync="dialogVisibleSummary" :append-to-body="true" :before-close="beforeClose"
            :show-close="false">
            <span slot="title" class="flex-space">
                <span class="pr10">会议纪要</span>
                <i v-if="row && row.isCreateUser" @click="showMessageDialog" class="el-icon-message"></i>
            </span>
            <el-form :model="form" :disabled="row && !row.isCreateUser" label-position="left" ref="refForm">
                <el-form-item label="会议概述" label-width="100px" prop="conferenceOverview">
                    <el-input v-model="form.conferenceOverview" type="textarea" :rows="2" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="会议议程" :label-width="formLabelWidth" prop="conferenceOverviewList">
                    <i v-if="row && row.isCreateUser" class="el-icon-circle-plus add-icon" @click="addRow"></i>
                    <el-table :data="form.conferenceOverviewList">
                        <el-table-column property="topic" label="主题" width="150" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.topic"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="content" label="内容" width="200" align="center">
                            <template slot-scope="scope">
                                <el-input type="textarea" v-model="scope.row.content" :rows="1"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="speaker" label="主讲人" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.speaker"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="supporter" label="支持人" width="200" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.supporter"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column property="department" label="部门" align="center">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.department"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="row && row.isCreateUser" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button @click="handleDeleteData(scope.row)" type="text"
                                    icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelSummary">取 消</el-button>
                <el-button type="primary" v-if="row && row.isCreateUser" @click="confirmSummary">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="邮件发送设置" :append-to-body="true" :visible.sync="messageDialog" width="30%"
            :before-close="handleClose">
            <el-form ref="messageForm" :model="messageForm" label-width="100px">
                <el-form-item label="收件人">
                    <autoAddress @getPerson="getPerson" :initList="initList" :multiple="true" :initData="initData" valueKey="email"></autoAddress>
                    <!-- <el-select v-model="messageForm.recipients" multiple clearable>
                        <el-option v-for="item in recipientsList " :key="item.userId" :value="item.email"
                            :label="item.userName"></el-option>
                    </el-select> -->
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="messageDialog = false">取 消</el-button>
                <el-button type="primary" @click="postMessage">发送</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
import meetingApi from '@/api/meeting'
import autoAddress from '@/components/autoAddress/index'
export default {
    props: {
        row: {
            type: Object
        }
    },
    components: {
        autoAddress
    },
    data() {
        return {
            initData: [],
            initList: [],
            dialogVisibleSummary: false,
            form: {
                id: "",
                conferenceOverview: '',
                conferenceOverviewList: [{
                    topic: '',
                    content: "",
                    speaker: "",
                    supporter: "",
                    department: ""
                }],
            },
            recipientsList: [
            ],
            messageForm: { recipients: [], },
            messageDialog: false
        }
    },
    mounted() {
        // this.getUserList()
    },
    methods: {
        // async getUserList() {
        //     let res = await meetingApi.getUserList()
        //     let { data } = res
        //     if (data.code === 0) {
        //         this.recipientsList = data.data
        //     }
        // },
        async getDetail(id) {
            console.log(this.row)
            let res = await meetingApi.overviewDetail({ id: id })
            console.log(res)
            if (res.data.code === 0) {
                this.form = res.data.data
                if (this.form.conferenceOverviewList.length === 0) {
                    this.form.conferenceOverviewList = [{
                        topic: '',
                        content: "",
                        speaker: "",
                        supporter: "",
                        department: ""
                    }]
                }
            }
        },
        getPerson(data,arr){
            console.log(data)
            console.log(arr)
            this.messageForm.recipients = []
             arr.map(ele=>{
                this.messageForm.recipients.push(ele.email)
             })
        },
        beforeClose() {

        },
        showMessageDialog() {
            this.messageDialog = true
            this.getAttendPerson()

        },
        async getAttendPerson() {
            let res = await meetingApi.getUserAttend({ id: this.row.id })
            let data = res.data.data

            this.messageForm.recipients = data.map(ele => ele.email)
            this.initList = []
            this.initData = this.messageForm.recipients
            data.map(ele => {
                this.initList.push({ realName: ele.userName, id: ele.userId, email: ele.email })
            })
        },
        addRow() {
            this.form.conferenceOverviewList.push({})
        },
        resetFrom() {
            console.log(this.$refs.refForm)
            this.$refs.refForm.resetFields()
        },
        handleDeleteData(row) {
            this.form.conferenceOverviewList = this.form.conferenceOverviewList.filter(ele => {
                return ele !== row
            })
        },
        async postMessage() {
            let obj = {
                id: this.row.id,
                emailList: this.messageForm.recipients
            }
            let res = await meetingApi.sendPost(obj)
            if (res.data.code === 0) {
                this.$message.success('邮件已发送，请注意查收')
                this.messageDialog = false
            } else {
                this.$message.error(res.data.msg)
            }
        },
        cancelSummary() {
            this.resetFrom()
            this.dialogVisibleSummary = false
        },
        async confirmSummary() {
            this.form.id = this.row.id
            let arr = []
            this.form.conferenceOverviewList.map(ele => {
                arr.push({
                    topic: ele.topic,
                    content: ele.content,
                    speaker: ele.speaker,
                    supporter: ele.supporter,
                    department: ele.department
                })
            })
            this.form.conferenceOverviewList = arr
            let res = await meetingApi.saveOverview(this.form)
            this.resetFrom()
            this.dialogVisibleSummary = false
        }
    }
}
</script>

<style lang="scss" scoped>
.add-icon {
    font-size: 18px;

}

.el-icon-message {
    font-size: 20px;
    // color:$;
}
</style>