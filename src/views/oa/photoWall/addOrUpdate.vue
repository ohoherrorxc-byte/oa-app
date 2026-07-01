<template>
    <div>
        <basic-container class="container">
            <el-form label-width="120px" :disabled="isDetail" :model="form" class="form-style " :rules="rules" ref="ruleForm">
                <el-form-item label="相册名称" prop="albumName">
                    <el-input v-model="form.albumName" class="input-name"></el-input>
                </el-form-item>
                <el-form-item label="照片/视频">
                    <Upload :isDetail="isDetail" :fileListL="fileList" @getFileList="getFileList" :multiple="true" btnName="上传图片"></Upload>
                </el-form-item>
            </el-form>
            <div class="flex justify-center">
                <el-button v-if="!isDetail" type="primary" icon="el-icon-check" @click="handleSubmit">提交</el-button>
            </div>
        </basic-container>
    </div>
</template>

<script>
import photoWallApi from '@/api/photoWall/index'
import Upload from './upload'
import { debounce } from "@/util/util";
export default {
    components: {
        Upload,
    },
    data() {
        return {
            form: {
                albumName: "",
                photoInfoList: []
            },
            isDetail:false,
            PhotoAlbumName: '',
            fileList: [],
            rules: {
                albumName: [
                    { required: true, message: '请输入相册名称', trigger: 'blur' },

                ],
            }
        }
    },
    mounted() {
        if (this.$route.query.id) {
            this.getDetails()
        }
        if(this.$route.query.type){
            this.isDetail = this.$route.query.type === 'detail'
        }
    },
    methods: {
        getFileList(list) {
            this.fileList = list
        },
        async getDetails() {
            let res = await photoWallApi.detail({ id: this.$route.query.id })
            if (res.data.code === 0) {
                let { data } = res.data
                this.form.albumName = data.albumName
                this.$set(this.form, 'id', data.id)
                let arr = data.photoInfoList
                arr.map(ele => {
                    ele.progress = 100,
                        ele.uid = ele.id
                    ele.link = ele.url
                })
                this.fileList = arr
            }
        },
        async saveAlbum() {
            this.form.photoInfoList = []
            this.fileList.map(ele => {
                let key = (ele.type === "video/mp4" || ele.type === 1) ? 1 : 0
                this.form.photoInfoList.push({ type: key, url: ele.originalUrl||ele.link })
            })
            let Api = this.form.id ? photoWallApi.update : photoWallApi.add
            let res = await Api(this.form)
            if (res.data.code === 0) {
                this.$router.push('/oa/photoWall/index?reflesh=true')
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