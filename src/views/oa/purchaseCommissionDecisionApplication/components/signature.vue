
<template>
    <el-form>
        <img v-if="dateUrl" :src="dateUrl" alt="" width="50">   
            <el-button @click="openDialig">手写</el-button>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" style="overflow: hidden;;" :before-close="handleClose" :append-to-body="true">
            <div class="content">
                <canvas id="signature-pad" @mousedown="startSignature" @touchstart="startSignature"
                    @touchmove="drawSignature" @mousemove="drawSignature" @touchend="endSignature" @mouseup="endSignature"
                    width="300" height="250" style="border: 1px solid #000;"></canvas>
                <el-button @click="clearSignature" class="mt10">清除</el-button>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="remark">确 定</el-button>
            </span>
        </el-dialog>
    </el-form>
</template>
   
<script>
import { mapGetters } from 'vuex'
export default {
    data() {
        return {
            dialogVisible: false,
            canvas: null,
            context: null,
            isDrawing: false,
            dateUrl: ''
        };
    },
    computed: {
        ...mapGetters(["userInfo", "isMobile"]),
    },
    watch:{
        dialogVisible(){
            if(this.dialogVisible){
                document.body.classList.add('stop-scroll');
            }else{
                document.body.classList.remove('stop-scroll');
            }
        }
    },
    methods: {
        openDialig() {
            this.dialogVisible = true

        },
        startSignature(e) {
            e.stopPropagation()
            console.log('wwqqwqwqw')
            const canvas = document.getElementById('signature-pad');
            this.canvas = canvas;
            console.log(canvas)
            this.context = canvas.getContext('2d');
            this.context.strokeStyle = '#000';
            this.context.lineWidth = 2;
            this.isDrawing = true;
            const rect = canvas.getBoundingClientRect();
            console.log(e)
            if (this.isMobile) {
                this.context.moveTo(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
            } else {
                this.context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            }

        },
        drawSignature(e) {
            e.stopPropagation()
            e.preventDefault()
            // console.log(this.isDrawing)
            if (this.isDrawing) {
                const rect = this.canvas.getBoundingClientRect();
                // console.log(rect)
                if (this.isMobile) {
                    this.context.lineTo(e.changedTouches[0].clientX - rect.left, e.changedTouches[0].clientY - rect.top);
                } else {
                    this.context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                }
                this.context.stroke();
            }

        },
        endSignature() {
            this.isDrawing = false;
        },
        clearSignature() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.context.beginPath()
        },
        remark() {
            this.dateUrl = this.canvas.toDataURL()
            this.$emit('signUrl',this.dateUrl)
            console.log(this.dateUrl)
            this.dialogVisible = false
        }
    }
};
</script>

<style lang="scss" scoped>
.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>