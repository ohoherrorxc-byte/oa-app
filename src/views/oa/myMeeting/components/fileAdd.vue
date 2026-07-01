<template>
    <div>
        <el-dialog title="会议文件" :visible.sync="dialogVisibleFiles" :append-to-body="true" width="70%">
            <el-form :model="form" :disabled="row && !row.isCreateUser" label-position="left" ref="refForm">
                <el-form-item label-width="0px" prop="fileList">
                    <el-table :data="form.fileList">
                        <el-table-column property="fileName" prop="fileName" label="文件名" width="250" align="center">
                        </el-table-column>
                        <el-table-column property="fileType" prop="fileType" label="文档类型" width="100" align="center">
                        </el-table-column>
                        <el-table-column property="createUserName" prop="createUserName" label="上传人" width="100" align="center">
                        </el-table-column>
                        <el-table-column property="createTime" prop="createTime" label="上传时间"  align="center">
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button v-if="isCreater(scope.row)" @click="handleDeleteData(scope.row)" type="text"
                                    icon="el-icon-delete">删除</el-button>
                                <el-button @click="downFile(scope.row)" type="text" icon="el-icon-download">下载</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <upload btnName="上传" @handleRequest="handleRequest"></upload>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import meetingApi from '@/api/meeting'
import upload from '@/components/upload/index'
import {downloadFileBlob} from '@/util/util'
import { mapGetters } from "vuex";
export default {
    props: {
        row: {
            type: Object
        }
    },
    components: {
        upload
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    data() {
        return {
            dialogVisibleFiles: false,
            form: {
                id: "",
                conferenceOverview: '',
                fileList: [{
                    fileName: '',
                    fileUrl: "",
                    fileType: "",
                    createUserName: "",
                    conferenceId: "",
                    id: ''
                }],
            },
            recipientsList: [
            ],
            messageForm: { recipients: [], },
            messageDialog: false
        }
    },
    mounted() {
    },
    methods: {
        async getDetail(id) {
            // console.log('id' + id)
            let res = await meetingApi.listConferenceFile({ id: id })
            if (res.data.code === 0) {
                this.form.fileList = res.data.data
            }
        },
        async handleRequest(file, data, other) {
            // console.log(file)
            // console.log(data)
            let obj = {
                fileName: other.name,
                fileUrl: file.link,
                fileType: other.name.substring(other.name.lastIndexOf(".") + 1),
                conferenceId: this.row.id
            }
            let res = await meetingApi.saveConferenceFile(obj)
            if (res.data.code === 0) {
                this.getDetail(this.row.id)
            }
        },
        isCreater(row){
            // console.log(this.userInfo)
            return row.createUserName === this.userInfo.user_name
        },
        resetFrom() {
            this.$refs.refForm.resetFields()
        },
        async handleDeleteData(row) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let res = await meetingApi.deleteConferenceFile({ id: row.id })
                if (res.data.code ===0) {
                    this.getDetail(this.row.id)
                }
                // console.log(res)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        },
        downFile(row) {
            downloadFileBlob(row.fileUrl,row.fileName)
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
}
</style>