<template>
    <div>
        <basic-container class="container">
            <el-form label-width="120px" :disabled="isDetail" :model="form" class="form-style " :rules="rules" ref="ruleForm">
                <el-form-item label="开屏照片">
                    <Upload :isDetail="isDetail" :fileListL="fileList" @getFileList="getFileList" :multiple="true" btnName="上传图片"></Upload>
                </el-form-item>
            </el-form>
            <div class="flex justify-center">
                <el-button v-if="!isDetail" type="primary" icon="el-icon-check" @click="handleSubmit">提 交</el-button>
            </div>
        </basic-container>
    </div>
</template>

<script>
import MessageApi from '@/api/message/index'
import Upload from '@/views/oa/photoWall/upload'
import { debounce } from "@/util/util";
export default {
    components: {
        Upload,
    },
    data() {
        return {
            form: {
              
                tbSpreadTailList: []
            },
            isDetail:false,
            PhotoAlbumName: '',
            fileList: [],
            rules: {
             
            }
        }
    },
    mounted() {
        this.getDetails()
    },
    methods: {
        getFileList(list) {
            this.fileList = list
        },
        async getDetails() {
            let res = await MessageApi.listSpreadTail()
            if (res.data.code === 0) {
                let { data } = res.data
              
                this.$set(this.form, 'id', data.id)
                let arr = data.tbSpreadTailList
                arr.map(ele => {
                    ele.progress = 100
                     ele.uid = ele.id
                    ele.link = ele.url
                })
                this.fileList = arr
            }
        },
        async saveAlbum() {
            this.form.tbSpreadTailList = []
            this.fileList.map(ele => {
                let key = (ele.type === "video/mp4" || ele.type === 1) ? 1 : 0
                this.form.tbSpreadTailList.push({ type: key, url: ele.originalUrl||ele.link })
            })
     
            let res = await MessageApi.saveSpreadTail(this.form)
            if (res.data.code === 0) {
                this.$message.success('开屏设置成功')
                this.getDetails()
            }
        },
        async handleSubmit() {
            this.$refs.ruleForm.validate((valid) =>{
                if(valid){
                    debounce(this.saveAlbum, this, 3000);
                }else{
                    return false
                }
                
            })
            
        }
    }
}

</script>

<style lang="scss" scoped>
.input-name {
    width: 80%;
}

.form-style {
    min-height: 60vh;
}
</style>