<template>
    <basic-container>
        <el-button type="primary" @click="getList" class="mb10">查 询</el-button>
        <el-button type="primary" @click="createMsg" class="mb10">新 建</el-button>
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="userName" label="使用人">
            </el-table-column>
            <el-table-column prop="lockNumber" label="地锁编号">
            </el-table-column>
            <el-table-column prop="parkNumber" label="车位编号">
            </el-table-column>
            <el-table-column prop="lockNo" label="上锁编号">
            </el-table-column>  
            <el-table-column prop="unlockNo" label="解锁编号">
            </el-table-column>
            <el-table-column prop="loadTime" label="上锁延迟时间">
            </el-table-column>
            <el-table-column prop="createUser" label="创建人">
            </el-table-column>
            <el-table-column label="操作">
                <template v-slot="scope">
                    <el-button type="text" @click="editRow(scope.row)">编辑</el-button>
                    <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :append-to-body="true" title="智能地锁" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" :rules="rules">
                <el-form-item label="地锁编号" label-width="120px" prop="lockNumber">
                    <el-input v-model="form.lockNumber"></el-input>
                </el-form-item>
                <el-form-item label="车位编号" label-width="120px" prop="parkNumber">
                    <el-input v-model="form.parkNumber" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="上锁编号" label-width="120px" prop="lockNo">
                    <el-input v-model="form.lockNo"></el-input>
                </el-form-item>
                <el-form-item label="解锁编号" label-width="120px" prop="unlockNo">
                   <el-input v-model="form.unlockNo"></el-input>
                </el-form-item>
                <el-form-item label="上锁延迟时间" label-width="120px" prop="loadTime">
                   <el-input v-model="form.loadTime"></el-input>
                </el-form-item>
                <el-form-item   label="使用人" label-width="120px" prop="userName">
                    <autoAddress   :multiple="false" :initData="form.userName"
                        class="w-100" @getPerson="getPerson"></autoAddress>
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
import FloorLockApi from '@/api/floorLock/index'
import autoAddress from '@/components/autoAddress/index'
export default {
    data() {
        return {
            tableData: [],
            dialogFormVisible: false,
            form: {
                lockNumber: "",
                url: "",
                parkNumber: null,
                content: null,
                sendWay: null,
                unlockNo: null,
                userName: [],
                userId:[]
            },
            fileList: [],
            typeList: [

            ],
            rules: {
                lockNumber: [{ required: true, message: '请输入地锁编号', trigger: 'blur' }],
                parkNumber: [{ required: true, message: '请输入车位编号', trigger: 'blur' }],
                unlockNo: [{ required: true, message: '请输入解锁编号', trigger: 'blur' }],
                parkNumber: [{ required: true, message: '请输入上锁编号', trigger: 'change' }],
                unlockNo: [{ required: true, message: '请选择使用人', trigger: 'change' }],
                loadTime:[{ required: true, message: '请输入上锁延迟时间', trigger: 'blur' }]
            }
        }
    },
    created() {
        this.getList()
    },
    components: {  autoAddress },
    methods: {
        async getList() {
            let res = await FloorLockApi.getList()
            if (res.data.code === 0) {
                this.tableData = res.data.data        
            }
        },
      
        getPerson(data){
            console.log(data)
            this.form.userId = data.id
            this.form.userName = data.realName      
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
                lockNumber: "",
                url: "",
                parkNumber: null,
                content: null,
                sendWay: null,
                unlockNo: null
            }
            this.fileList = []
        },
        getFileList(data) {
            this.form.url = data[0].link
            this.form.originalUrl = data[0].link
        },
       
        async save() {
            this.$refs['form'].validate(async (valid) => {
                if (valid) {
                    let res = await FloorLockApi.saveGroundLock(this.form)
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
            let res = await FloorLockApi.detailGroundLock(row.id)
            // console.log(res)
            if (res.data.code === 0) {
                this.form = res.data.data
                this.fileList = [{ url: this.form.url, link: this.form.url, process: 100 }]
            
            }
            // this.form = row
        },
        async deleteRow(row) {
            this.$confirm("是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(async () => {
                let res = await FloorLockApi.deleteGroundLock(row.id)
                if (res.data.code === 0) {
                    this.getList()
                }
            })
        }
    }
}
</script>