<template>
    <basic-container>
        <el-button @click="handlePrint" type="primary" class="fr">打 印</el-button>
        <div class="container" id="container" :style="styleFont()">
            <div class="content" :style="setStyle()" id="my-node">
                <div class="setPadding"></div>
                <div class="inner-content">
                    <div class="text-center border-bottom">上汽海外出行科技有限公司</div>
                    <div class="flex border-bottom">
                        <div class="w-140">资产名称</div>
                        <div class="text-center w-260">{{ form.assetName }}</div>
                    </div>
                    <div class="flex border-bottom">
                        <div class="w-140">资产编号</div>
                        <div class="text-center w-260">{{ form.assetNumber }}</div>
                    </div>
                    <div class="flex">
                        <div class="w-140 flex-center">资产条码</div>
                        <div class="text-center w-260">
                            <QrCodeComponent v-show="!isPrint" :width="200" :height="200"
                                :text="textQr(this.$route.query.id)"></QrCodeComponent>
                            <QrCodeComponent v-show="isPrint" :width="300" :height="300"
                                :text="textQr(this.$route.query.id)"></QrCodeComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </basic-container>
</template>

<script>
import AssetsManageApi from '@/api/assetsManage/index'
import { toJpeg } from "html-to-image";
import QrCodeComponent from '@/components/qrcodeComponent/index.vue'
import print from "print-js";
export default {
    data() {
        return {
            form: {
                id: ""
            },
            isPrint: false
        }
    },
    props:{
        row:{
            type:Object,

        }
    },
    mounted() {
        if(this.$route.query.id){
            this.getDetail()
        }     
    },
    components: {
        QrCodeComponent
    },
    watch:{
        row(){     
            this.form = this.row
        }
    },
    methods: {
        setStyle() {
            let style = {
                width: !this.isPrint ? '450px' : '750px'
            }
            return style
        },
        textQr(id) {
            return `key=asset&id=${id||this.form.id}`
        },
        async getDetail() {
            console.log(this.form)
            let res = await AssetsManageApi.getDetails(this.$route.query.id)
            console.log(res)
            if (res.data.code === 200 || res.data.code === 0) {
                this.form = res.data.data
            }
        },
        styleFont(){
            return {
                "font-size":!this.isPrint?'16px':'32px'
            }
        },
        handlePrint() {
            this.isPrint = true
            setTimeout(() => {
                toJpeg(document.getElementById('my-node'), { quality: 0.95 })
                    .then(function (dataUrl) {
                        print({
                            printable: dataUrl,
                            type: "image",
                            base64: true,
                            style: `@media print { @page {size: auto; margin: 0; } body{margin:0 5px}}`,
                        });
                    });
            }, 300)
            setTimeout(() => {
                this.isPrint = false
            }, 1000)
        },
    }
}
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: center;
    height: 80vh;
  
    padding-top: 30px;
    background-color: #fff;
}

.content {
    width: 400px;
    line-height: 40px;
    height: fit-content;
    font-weight: bold;
    background-color: #fff;
}

.inner-content {
    border: 2px solid #000;
}

.setPadding {
    padding-top: 15px;
    background-color: #fff;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center
}

.mt20 {
    margin-top: 20px;
}

.text-center {
    text-align: center;
    padding:2px;

}

.border-bottom {
    border-bottom: 2px solid #000;
}

.w-140 {
    width: 30%;
    text-align: center;
    border-right: 2px solid #000;
}

.w-260 {
    width: 70%;
}</style>