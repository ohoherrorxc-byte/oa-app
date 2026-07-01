<template>
    <basic-container>
        <el-button type="primary" @click="getList" class="mb10">查 询</el-button>
        <el-button type="primary" @click="createMsg" class="mb10">新 建</el-button>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="title" label="标题">
            </el-table-column>
            <el-table-column prop="sendType" label="类型">
            </el-table-column>
            <el-table-column prop="sendTime" label="消息时间">
            </el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
                    <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
                    <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :append-to-body="true" title="消息中心" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="消息类型" label-width="120px" prop="sendType">
                    <el-select v-model="form.sendId" autocomplete="off" @change="changeType">
                        <el-option v-for="item in typeList" :label="item.dictValue" :value="item.dictKey"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题" label-width="120px" prop="title">
                    <el-input v-model="form.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容" label-width="120px">
                    <el-input type="textarea" v-model="form.content" autocomplete="off"></el-input>
                </el-form-item>
                <!-- -->
                <el-form-item   v-show="form.sendType==='项目开阀'"  label="消息接收人" label-width="120px" prop="recipient">
                    <autoAddress   :multiple="true" :initData="form.recipientIds" :initList="form.recipient"
                        class="w-100" @getPerson="getPersonRecipient"></autoAddress>
                </el-form-item>
                <el-form-item label="重复方式" label-width="120px" prop="sendWay">
                    <el-select v-model="form.sendWay" autocomplete="off">
                        <el-option v-for="item in repeatList" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发布时间" label-width="120px" prop="sendTime">
                    <el-date-picker v-model="form.sendTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="发布图片" label-width="120px">
                    <Upload :process='false' :fileListL="fileList" @getFileList="getFileList" :multiple="false"
                        btnName="上传图片"></Upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">确 定</el-button>
            </div>
        </el-dialog>
    </basic-container>
</template>

<script>
import MessageApi from '@/api/message/index'
import Upload from '@/views/oa/photoWall/upload'
import autoAddress from '@/components/autoAddress/index'
export default {
    data() {
        return {
            tableData: [],
            dialogFormVisible: false,
            form: {
                sendType: "",
                url: "",
                title: null,
                content: null,
                sendWay: null,
                sendTime: null,
                recipient: [],
                recipientIds:[]
            },
            fileList: [],
            typeList: [

            ],
            repeatList: [
                {
                    label: '每天',
                    value: "每天"
                },
                {
                    label: '每月',
                    value: "每月"
                },
                {
                    label: '无',
                    value: "无"
                },
            ],
            rules: {
                sendType: [{ required: true, message: '请选择消息类型', trigger: 'change' }],
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                sendTime: [{ required: true, message: '请选择发布时间', trigger: 'blur' }],

            }
        }
    },
    created() {
        this.getTypeList()
        this.getList()
    },
    components: { Upload, autoAddress },
    methods: {
        async getList() {
            let res = await MessageApi.getList()
            if (res.data.code === 0) {
                this.tableData = res.data.data
              
            }
        },
        async getTypeList() {
            let res = await MessageApi.messageType()
            if (res.data.code === 0 || res.data.code === 200) {
                this.typeList = res.data.data
            }
        },
        getPersonRecipient(data,arr){
          
            this.form.recipient = []
            // let arr = arr
            arr.map(ele=>{
                this.form.recipient.push({realName:ele.realName,userId:ele.id,userName:ele.realName,id:ele.id})
            })
            console.log( this.form.recipient)
            this.form.recipientIds=this.form.recipient.map(ele=>ele.id)       
        },
        createMsg() {
            this.dialogFormVisible = true
            this.resetForm()
            if(this.$refs.form){
                this.$refs.form.validateField()
            }
        },
        resetForm() {
            this.form = {
                sendType: "",
                url: "",
                title: null,
                content: null,
                sendWay: null,
                sendTime: null
            }
            this.fileList = []
        },
        getFileList(data) {
            this.form.url = data[0].link
            this.form.originalUrl = data[0].link
        },
        changeType() {
            
            let row = this.typeList.find(ele => {
                return ele.dictKey === this.form.sendId
            })
            this.form.recipient = []
            this.form.recipientIds = []
            // console.log(row)
            // this.rules['sendTime'][0].required = row.dictValue === '考勤提醒' ? false : true
            this.form.sendType = row.dictValue
            this.form.sendName = row.sendName
        },
        async save() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let res = await MessageApi.saveMassMessage(this.form)
                    if (res.data.code === 0 || res.data.code === 200) {
                        this.$message.success('保存成功')
                        this.dialogFormVisible = false
                        this.getList()
                    }
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        async editRow(row) {
            this.dialogFormVisible = true
            let res = await MessageApi.detailMassMessage(row.id)
            // console.log(res)
            if (res.data.code === 0) {
                this.form = res.data.data
                this.fileList = [{ url: this.form.url, link: this.form.url, process: 100 }]
                this.form.recipient = this.form.recipient||[]
                this.form.recipient.map(ele=>{
                    ele.realName = ele.userName
                    ele.id = ele.userId
                })
                this.form.recipientIds = this.form.recipient.map(ele=>ele.id)
                console.log(this.form)
            }
            // this.form = row
        },
        async deleteRow(row) {
            this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                let res = await MessageApi.deleteMassMessage(row.id)
                if (res.data.code === 0) {
                    this.getList()
                }
            })
        }
    }
}
</script>