<template>
    <el-dialog :title="title" :append-to-body="true" :visible.sync="dialogVisibleAddList" width="30%"
        :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">
            <el-form-item label="列表名称" prop="tabulationName">
                <el-input v-model="form.tabulationName"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisibleAddList = false">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import scheduleApi from '@/api/schedule/index'
export default {
    props: {
        title: {
            type: String
        },
        row: {

        }
    },
    watch: {
        row: {
            handler() {
                if (this.row) {
                    this.form.tabulationName = this.row.tabulationName
                    this.form.id = this.row.tabulationId
                }
            },
            immediate: true,
            // 开启深度监听 deep
            deep: true,
        },

    },
    data() {
        return {
            dialogVisibleAddList: false,
            form: {
                tabulationName: ""
            },
            rules: {
                tabulationName: [
                    { required: true, message: '请输入列表', trigger: 'blur' },

                ],
            }
        };
    },
    methods: {
        handleClose() {
            this.dialogVisibleAddList = false
        },
        confirm() {
            // console.log(this.row)
            this.$refs.ruleForm.validate(async(valid) => {
                if (valid) {
                    let ApiSubmit = this.form.id ? scheduleApi.updateTabulation : scheduleApi.saveTabulation
                    let res =await ApiSubmit(this.form)
                    if (res.data.code === 0) {
                        this.$message.success('创建成功')
                        this.$emit('getList')
                        // console.log('chufazirenwu')
                        this.dialogVisibleAddList = false              
                    } 
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        }
    }
};
</script>