<template>
    <div class="handwritten-name-wrap">
        <el-button plain @click="handleClick">
            手写签名
        </el-button>
        <div class="img-wrap">
            <img :src="imgSrc" alt="" v-if="imgSrc">
        </div>
        <el-dialog title="手写签名"  width="200" height="200" size="large" :visible.sync="panelVisible" :append-to-body="true"
            class="signNameModel">
            <template v-slot>
                <!-- <signature></signature> -->
                <div class="signWrap">
                    <!-- <VueSignaturePad class="signaturePad" width="200" height="350" ref="signaturePad"
                        :options="options" /> -->
                    <footer>
                        <div class="gtnGroup">
                            <el-button type="primary" size="mini" @click="undo">撤销</el-button>
                            <el-button type="primary" size="mini" style="margin-left:20px" @click="clear">清屏</el-button>
                            <el-button type="primary" size="mini" style="margin-left:20px" @click="save">保存</el-button>
                        </div>
                    </footer>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script>

// import VueSignaturePad from "vue-signature-pad";
export default {
    data() {
        return {
            panelVisible: false,
            panelTitle: "",
            options: {
                penColor: "#000",
                minWidth: 1,    //控制画笔最小宽度
                maxWidth: 1,    //控制画笔最大宽度
            },
            isActive1: true,
            isActive2: false,
            isActive3: false,
            imgSrc: "",
        }
    },
    components:{},
    methods: {
        //手写签名按钮的点击
        handleClick() {
            this.panelVisible = true;
            this.isActive1 = true;
            this.isActive2 = false;
            this.isActive3 = false;
            this.options = {
                penColor: "#000",
                minWidth: 1,
                maxWidth: 1,
            }
        },
        //撤销
        undo() {
            this.$refs.signaturePad.undoSignature();
        },
        //清除
        clear() {
            this.$refs.signaturePad.clearSignature();
        },
        //保存
        save() {
            console.log(this.$refs.signaturePad.saveSignature());
            const { isEmpty, data } = this.$refs.signaturePad.saveSignature();
            this.imgSrc = data;
            this.panelVisible = false;
        },
        //调节画笔粗细大小
        selSize(val) {
            this.options = {
                penColor: "#000",
                minWidth: val,
                maxWidth: val,
            };
            if (val == 1) {
                this.isActive1 = true;
                this.isActive2 = false;
                this.isActive3 = false;
            } else if (val == 2) {
                this.isActive1 = false;
                this.isActive2 = true;
                this.isActive3 = false;
            } else if (val == 3) {
                this.isActive1 = false;
                this.isActive2 = false;
                this.isActive3 = true;
            }
        }
    },
}
</script>
<style lang="scss">
.signaturePad {
    width: 300px;
    border: 1px solid #666;
    margin-bottom: 10px;
}

.handwritten-name-wrap {
    .img-wrap {
        width: 100%;
        height: 164px;
        margin-top: 2px;
        // border: 1px solid #ccc;

        img {
            width: 70%;
            height: 100%;
        }
    }

    .signWrap {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
      
        .signName {
            flex: 1;
            border-top: 1px solid #ccc;
        }

        footer {
            height: 40px;
            border-top: 1px solid #ccc;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .gtnGroup {
                width: 50%;
                margin-left: 20px;
            }

            .otherSet {
                width: 50%;
                display: flex;
                align-items: center;

                .penTxt {
                    width: 70px;
                }

                .selSize {
                    width: 70px;
                }

                .el-select__caret {
                    position: absolute;
                    right: -3px;
                }

                .b1,
                .b2,
                .b3 {
                    display: inline-block;
                    background: #000;
                    border-radius: 50%;
                }

                .circleWrap {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    margin-right: 20px;
                }

                .active {
                    border: 1px dashed #0074d9;
                }

                .b1 {
                    width: 4px;
                    height: 4px
                }

                .b2 {
                    width: 6px;
                    height: 6px
                }

                .b3 {
                    width: 8px;
                    height: 8px
                }
            }
        }
    }
}

.signNameModel {
    .vxe-modal--content {
        padding: 0 !important;
    }
}
</style>