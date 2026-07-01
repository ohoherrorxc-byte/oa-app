<template>
    <div>

        <el-upload v-if="!isDetail && ((fileList.length < 1 && !this.multiple) || this.multiple)" class="avatar-uploader"
            action="#" ref="uploadRef" :http-request="httpRequest" :on-progress="handleProgress" :accept="acceptMimeTypes"
            :before-upload="handleBeforeUpload" :multiple="multiple" :on-preview="handlePictureCardPreview"
            :show-file-list="false" :on-remove="handleRemove">
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <div class="flex flex-wrap content-img pb30">
            <draggable class="flex flex-wrap" @start="onStart" @end="onEnd" :move="onMove">
                <div v-for="item in fileList" :key="item.uid" class="pl20 pb20">
                    <div class="item-pic">
                        <!-- {{ item }} -->
                        <el-image class="item-pics" fit="cover" :src="item.domain || item.link" @click="setPreviewPic(item)"
                            v-if="(item.type === 'image/jpeg' || item.type === 'image/png' || item.type === 0 || !item.type) && item.link">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                        <video v-else-if="(item.type === 'video/mp4' || item.type === 1) && item.link" :controls="true"
                            controlslist="nodownload" class="item-pic" style="background-color: #000;">
                            <source :src="item.link" type="video/ogg">
                            <source :src="item.link" type="video/mp4">
                            Your browser does not support the video tag.
                        </video>
                        <el-progress v-if="item.progress !== 100 && process" class="progeress-set" type="circle"
                            :percentage="item.progress"></el-progress>
                        <i v-if="!isDetail" @click="deletRow(item)" class="el-icon-error close-class"></i>
                    </div>
                </div>
            </draggable>
        </div>

        <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import request from "@/router/axios";
export default {
    data() {
        return {
            acceptMimeTypes: "image/*, video/*",
            dialogImageUrl: '',
            dialogVisible: false,
            fileList: [],
            url: '',
            oldIndex: null,
            newIndex: null,
            imageDemo: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg'
        }
    },
    props: {
        fileListL: {
            type: Array,
            default: []
        },
        isDetail: {
            type: Boolean,
            default: false
        },
        multiple: {
            type: Boolean,
            default: false
        },
        process: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        fileListL: {
            handler(newValue, oldValue) {
                this.fileList = newValue
            },
            deep: true
        }
    },
    methods: {
        handleRemove(file, fileList) {
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleBeforeUpload(file) {
            // 检查文件类型
            const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];
            if (!allowedTypes.includes(file.type)) {
                this.$message.error(`文件类型不符合要求，请上传图片或视频文件`);
                return false; // 取消上传
            }
            // 其他处理逻辑...
        },
        httpRequest(params, fileList) {
            console.log('调用次数')
            // console.log(this.$refs.uploadRef)
            // console.log(fileList)
            let progressCur
            let file = params.file,
                url = this.url;
            const formData = new FormData();
            formData.append("file", file);
            if (!url) {
                // 上传
                const fileName =
                    "bladex/vehicle/service/" +
                    new Date().Format("yyyyMMddHHmmss") +
                    "-" +
                    file.name;
                formData.append("fileName", fileName);
                url =
                    "/api/oa-resource/oss/endpoint/put-file-attach-by-name";
            }
            request({
                url,
                method: "post",
                data: formData,
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    // 在这里处理上传进度，可以将进度保存到状态中或进行其他操作
                    // console.log(`上传进度：${progress}%`);
                    progressCur = progress
                    let data = {}
                    let ids = this.fileList.map(ele => ele.uid)
                    data.progress = progressCur
                    data.uid = file.uid
                    data.type = file.type
                    data.link = this.src
                    if (!ids.includes(file.uid)) {
                        this.fileList.push(data)
                    } else {
                        this.fileList.map(ele => {
                            if (ele.uid === file.uid) {
                                ele.progress = progressCur
                            }
                        })
                    }
                },
            }).then((res) => {
                const { code, data } = res.data;
                if (code === 200 || code === 0) {
                    let arr = JSON.parse(JSON.stringify(this.fileList))
                    let data = res.data.data
                    arr.map(ele => {
                        if (ele.uid === file.uid) {
                            Object.assign(ele, data)
                        }
                    })
                    console.log(arr)
                    this.fileList = arr
                    this.$emit('getFileList', this.fileList)
                } else {
                    let arr = JSON.parse(JSON.stringify(this.fileList))
                    this.fileList = arr.filter(ele => {
                        return ele.uid !== file.uid
                    })
                    this.$emit('getFileList', this.fileList)
                    this.$emit("errRequest", data);
                }
            });
        },
        onMove(e, originalEvent) { // 拖拽move事件回调
            console.log('move:', e)
            console.log('originalEvent:', originalEvent)
            // 不允许拖拽
            if (e.draggedContext.element.num === 11) return false // false表示阻止，true表示不阻止
            return true;
        },
        onStart(e) { // 开始拖动时触发的事件
            console.log('start:', e)
            console.log('拖拽操作前的索引oldIndex:', e.oldIndex)
            console.log('拖拽完成后的索引newIndex:', e.newIndex)
            this.oldIndex = e.oldIndex
        },
        onEnd(e) {
            console.log(e.newIndex)
            this.newIndex = e.newIndex
            let arr = this.swapArrayElements(this.fileList,this.oldIndex,this.newIndex)
            this.$emit('getFileList', arr)
        },
        swapArrayElements(arr, indexA, indexB) {
            const temp = arr[indexA];
            arr[indexA] = arr[indexB];
            arr[indexB] = temp;
            return arr;
        },
        deletRow(item) {
            this.fileList = this.fileList.filter(ele => {
                return ele !== item
            })
            this.$emit('getFileList', this.fileList)
        },
        setPreviewPic(item) {
            this.dialogImageUrl = item.domain || item.link
            this.dialogVisible = true
        }
    }
}

</script>

<style lang="scss">
.item-pic {
    width: 200px;
    height: 200px;
    position: relative;
}

.item-pics {
    width: 200px;
    height: 200px;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 108px;
    height: 108px;
    line-height: 108px;
    text-align: center;
}

.avatar {
    width: 108px;
    height: 108px;
    display: block;
}

.progeress-set {
    position: absolute;
    width: 50px;
    top: 30%;
    left: 40%;
}

.el-progress-circle {
    width: 50px !important;
    height: 50px !important;
}

.close-class {
    position: absolute;
    right: -7px;
    font-size: 20px;
    top: -7px;
    color: red;
}

.content-img {

    margin-left: -20px;
}
</style>