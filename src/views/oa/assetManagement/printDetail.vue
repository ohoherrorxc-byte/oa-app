<template>
    <basic-container>
        <div id="all-content" class="all-content">
            <div class="container1" :id="item.id" v-for="item in multipleSelection">
                <div class="content" id="my-node">
                    <div class="setPadding"></div>
                    <div class="inner-content">
                        <div class="text-center border-bottom">上汽海外出行科技有限公司</div>
                        <div class="flex border-bottom">
                            <div class="w-140">资产名称</div>
                            <div class="text-center w-260">{{ item.assetName }}</div>
                        </div>
                        <div class="flex border-bottom">
                            <div class="w-140">资产编号</div>
                            <div class="text-center w-260 bold ">{{ item.assetNumber }}</div>
                        </div>
                        <div class="flex ">
                            <div class="w-140 flex-center">资产条码</div>
                            <div class="text-center w-260" :id="'tiaoma' + item.id">
                                <QrCodeComponent style="display: none;" :width="0" :height="0" :text="textQr(item.id)">
                                </QrCodeComponent>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="paging"></div>
            </div>
        </div>
    </basic-container>
</template>

<script>
import AssetsManageApi from '@/api/assetsManage/index'
import { toJpeg } from "html-to-image";
import QrCodeComponent from '@/components/qrcodeComponent/index.vue'
import QRCode from 'qrcode'
export default {
    data() {
        return {
            form: {
                id: ""
            },
            isPrint: false
        }
    },
    props: {
        multipleSelection: {
            type: Object,

        }
    },
    mounted() {
        if (this.$route.query.id) {
            this.getDetail()
        }
    },
    components: {
        QrCodeComponent
    },
    watch: {
        row() {
            this.form = this.row
            console.log(this.form)
        }
    },
    methods: {

        textQr(id) {
            return `key=asset&id=${id || this.form.id}`
        },
        async getDetail() {
            console.log(this.form)

            let res = await AssetsManageApi.getDetails(this.$route.query.id)
            console.log(res)
            if (res.data.code === 200 || res.data.code === 0) {
                this.form = res.data.data
            }
        },
        printStyle() { },
        handlePrint() {
            console.log(this.multipleSelection.length)
            var newWin = window.open(""); //新打开一个空窗口
            for (var i = 0; i < this.multipleSelection.length; i++) {
                let item = this.multipleSelection[i]
                var imageToPrint = document.getElementById(this.multipleSelection[i].id); //获取需要打印的内容
                let canvas = document.getElementById(this.textQr(item.id))
                QRCode.toCanvas(canvas, this.textQr(item.id), { height: 105, width: 105 }, error => {
                    if (error) console.error(error)
                })
                let img = new Image()
                img.src = canvas.toDataURL('image/png')
                console.log(img.src)
                var targetElement = document.getElementById('tiaoma' + item.id)
                targetElement.appendChild(img);
                newWin.document.write(imageToPrint.outerHTML); //将需要打印的内容添加进新的窗口
            }
            const styleSheet = `<style>
            html,body{height:auto;margin:0;}
            .container1{ 
               font-size:12px;
                }
            .bold{
                font-weight:bold
            }
            
@page { margin: 5px; }
.setPadding{
    padding-top:8px;
}
.inner-content {
    margin:0 2px;
    border: 1px solid #000;
}
.flex{
    display:flex;
}
.flex-center {
    display: flex;
    align-items: center;
    justify-content: center
}
.text-center {
    text-align: center;
    padding: 2px;

}
.text-center{
    text-align: center;
}
.border-bottom {
    border-bottom: 1px solid #000;
    
}

.w-140 {
    width: 30%;
    text-align: center;
    border-right: 1px solid #000;
}
.paging{display: block; page-break-after: always;}
.w-260 {
    width: 70%;
}</style>`;
            newWin.document.head.innerHTML = styleSheet; //给打印的内容加上样式
            newWin.document.close(); //在IE浏览器中使用必须添加这一句
            newWin.focus(); //在IE浏览器中使用必须添加这一句
            setTimeout(function () {
                newWin.print(); //打印
                this.isPrint = false
                newWin.close(); //关闭窗口

            }, 100)

        },
    }
}
</script>

<style lang="scss" scoped>
.all-content {
    background-color: #fff;
    width: 850px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}

.container1 {
    font-size: 32px
}

.content {
    width: 850px;
    line-height: 38px;
    // box-sizing: border-box;
    height: fit-content;
    font-weight: bold;
    background-color: #fff;
    page-break-before: always;
}

.inner-content {
    border: 2px solid #000;
}

.setPadding {
    // padding-top: 15px;
    background-color: #fff;
}

.flex-center {
    display: flex;
    align-items: center;
    justify-content: center
}



.text-center {
    text-align: center;
    padding: 2px;

}

.border-bottom {
    border-bottom: 2px solid #000;
}

.w-140 {
    width: 40%;
    text-align: center;
    border-right: 2px solid #000;
}

.w-260 {
    width: 60%;
}
</style>
