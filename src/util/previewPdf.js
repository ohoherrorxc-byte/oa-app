import request from '@/router/axios';
// pdf-lib 不再顶层 import：仅在加水印/编辑等场景真正调用时再 import
// 顶层 import 会让 previewPdf.js 一被引用就拉进 pdf-lib (~0.93MB)
import { downloadFileBlob } from '@/util/util'
/**
 * 浏览器打开新页签预览pdf
 * blob（必选）: pdf文件信息（Blob对象）【Blob】
 * docTitle（可选）: 浏览器打开新页签的title  【String】
 * isAddWatermark（可选，默认为false）: 是否需要添加水印 【Boolean】
 * watermark（必选）：水印信息 【Object: { type: string, text: string, image:{ bytes: ArrayBuffer, imageType: string } }】
 * watermark.type（可选）：类型 可选值：text、image、canvas
 * watermark.text（watermark.type为image时不填，否则必填）：水印文本。注意：如果watermark.type值为text，text取值仅支持拉丁字母中的218个字符。详见：https://www.npmjs.com/package/pdf-lib
 * watermark.image（watermark.type为image时必填，否则不填）：水印图片
 * watermark.image.bytes：图片ArrayBuffer
 * watermark.image.imageType：图片类型。可选值：png、jpg
 * Edit By WFT
 */
export default class PreviewPdf {
    constructor({ blob, docTitle, isAddWatermark = false, watermark: { type = 'text', text = 'WFT', image }, isMobile,url }) {
        const _self = this
        if (!blob) {
            return console.error('[PDF Blob Is a required parameter]')
        }
        console.log(isAddWatermark+'isAddWatermark')
        if (!isAddWatermark) { // 不添加水印
            _self.preView(blob, docTitle)
        } else {
            let bytes, imageType
            if (type == 'image') {
                if (!image) {
                    return console.error('["image" Is a required parameter]')
                }
                bytes = image.bytes
                imageType = image.imageType
            }
            const map = {
                'text': _self.addTextWatermark.bind(_self),
                'image': _self.addImageWatermark.bind(_self),
                'canvas': _self.addCanvasWatermark.bind(_self)
            }
            blob.arrayBuffer().then(async buffer => {
                const existingPdfBytes = buffer
                const { PDFDocument } = await import('pdf-lib')
                const pdfDoc = await PDFDocument.load(existingPdfBytes)
                let params
                if (type == 'text') params = { pdfDoc, text, docTitle,blob }
                if (type == 'image') params = { pdfDoc, bytes, imageType, docTitle , blob}
                if (type == 'canvas') params = { pdfDoc, text, docTitle, isMobile , blob}
                map[type](params)
            }).catch(e => {
                downloadFileBlob(url, docTitle)
                console.error('[Preview Pdf Error]:', e)
            })
        }
    }

    // 添加 Text 水印
    async addTextWatermark({ pdfDoc, text, docTitle }) {
        const { StandardFonts, rgb, degrees } = await import('pdf-lib')
        console.log('addTextWatermark')
        console.log(pdfDoc)
        console.log(text)
        console.log(docTitle)
        // console.log(StandardFonts, 'StandardFonts-->>') // 字体
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
        const pages = pdfDoc.getPages()
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i]
            let { width, height } = page.getSize()
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                    page.drawText(text, {
                        x: j * 100,
                        y: height / 5 + i * 100,
                        size: 30,
                        font: helveticaFont,
                        color: rgb(0.95, 0.1, 0.1),
                        opacity: 0.2,
                        rotate: degrees(-35),
                    })
                }
            }
        }
        // 序列化为字节
        const pdfBytes = await pdfDoc.save()
        this.preView(pdfBytes, docTitle)
    }

    // 添加 image 水印
    async addImageWatermark({ pdfDoc, bytes, imageType, docTitle }) {
        const { degrees } = await import('pdf-lib')
        console.log('addImageWatermark')
        // 嵌入JPG图像字节和PNG图像字节
        let image
        const maps = {
            'jpg': pdfDoc.embedJpg.bind(pdfDoc),
            'png': pdfDoc.embedPng.bind(pdfDoc)
        }
        image = await maps[imageType](bytes)
        // 将JPG图像的宽度/高度缩小到原始大小的50%
        const dims = image.scale(0.5)
        const pages = pdfDoc.getPages()
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i]
            let { width, height } = page.getSize()
            for (let i = 0; i < 6; i++) {
                for (let j = 0; j < 6; j++) {
                    page.drawImage(image, {
                        x: width / 5 - dims.width / 2 + j * 100,
                        y: height / 5 - dims.height / 2 + i * 100,
                        width: dims.width,
                        height: dims.height,
                        rotate: degrees(-35)
                    })
                }
            }
        }
        // 序列化为字节
        const pdfBytes = await pdfDoc.save()
        this.preView(pdfBytes, docTitle)
    }

    // 添加 canvas 水印
    addCanvasWatermark({ pdfDoc, text, docTitle, isMobile ,blob}) {
        // 旋转角度大小
        const rotateAngle = Math.PI / 6;

        // labels是要显示的水印文字，垂直排列
        let labels = new Array();
        labels.push(text);

        const pages = pdfDoc.getPages()

        const size = pages[0].getSize()

        let pageWidth = size.width
        let pageHeight = size.height

        let canvas = document.createElement('canvas');
        let canvasWidth = canvas.width = pageWidth;
        let canvasHeight = canvas.height = pageHeight;

        const context = canvas.getContext('2d');
        context.font = "15px Arial";

        // 先平移到画布中心
        context.translate(pageWidth / 2, pageHeight / 2 - 250);
        // 在绕画布逆方向旋转30度
        context.rotate(-rotateAngle);
        // 在还原画布的坐标中心
        context.translate(-pageWidth / 2, -pageHeight / 2);

        // 获取文本的最大长度
        let textWidth = Math.max(...labels.map(item => context.measureText(item).width));

        let lineHeight = 15, fontHeight = 12, positionY, i
        i = 0, positionY = 0
        while (positionY <= pageHeight) {
            positionY = positionY + lineHeight * 5
            i++
        }
        canvasWidth += Math.sin(rotateAngle) * (positionY + i * fontHeight) // 给canvas加上画布向左偏移的最大距离
        canvasHeight = 2 * canvasHeight
        for (positionY = 0, i = 0; positionY <= canvasHeight; positionY = positionY + lineHeight * 5) {
            // 进行画布偏移是为了让画布旋转之后水印能够左对齐;
            context.translate(-(Math.sin(rotateAngle) * (positionY + i * fontHeight)), 0);
            for (let positionX = 0; positionX < canvasWidth; positionX += 2 * textWidth) {
                let spacing = 0;
                labels.forEach(item => {
                    context.fillText(item, positionX, positionY + spacing);
                    context.fillStyle = 'rgba(187, 187, 187, .8)'; // 字体颜色
                    spacing = spacing + lineHeight;
                })
            }
            context.translate(Math.sin(rotateAngle) * (positionY + i * fontHeight), 0);
            context.restore();
            i++
        }
        // 图片的base64编码路径
        let dataUrl = canvas.toDataURL('image/png');
        // 使用Xhr请求获取图片Blob
        let xhr = new XMLHttpRequest();
        xhr.open("get", dataUrl, true);
        xhr.responseType = "blob";
        xhr.onload = res => {
            const imgBlob = res.target.response
            // 获取Blob图片Buffer
            imgBlob.arrayBuffer().then(async buffer => {
                const pngImage = await pdfDoc.embedPng(buffer)
                for (let i = 0; i < pages.length; i++) {
                    pages[i].drawImage(pngImage)
                }
                // 序列化为字节
                const pdfBytes = await pdfDoc.save()
                let pdfBase64 = await pdfDoc.saveAsBase64()
                pdfBase64 = "data:application/pdf;base64," + pdfBase64          
                if (isMobile) {
                    let filesCur = base64toFile(pdfBase64, docTitle)
                    console.log(filesCur)
                    getNewUrl(filesCur,docTitle)
                } else {
                    this.preView(pdfBytes, docTitle)
                    // if(pdfBytes.length>130000){
                    //     this.preView(pdfBytes, docTitle)
                    // }else{
                    //     this.preView(blob,docTitle)
                    // }   
                }
            })
        }
        xhr.send();
    }
    // 下载
    preView(stream, docTitle) {
        // console.log(stream)
        const URL = window.URL || window.webkitURL;
        const href = URL.createObjectURL(new Blob([stream], { type: 'application/pdf;charset=utf-8' }))
        console.log(href)
        let a = document.createElement('a')
        a.href = href
        a.style.display = 'none'
        document.body.appendChild(a)
        a.download = docTitle  // 将获取的文件名赋值过去，也可自行赋值
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(href)

        // console.log(href)
        // const wo = window.open(href)
        // // 设置新打开的页签 document title
        // let timer = setInterval(() => {
        //   if(wo.closed) {
        //     clearInterval(timer)
        //   } else {
        //     wo.document.title = docTitle
        //   }
        // }, 500)
    }
}

function base64toFile(dataurl, filename = 'file') {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    // suffix是该文件的后缀
    let suffix = mime.split('/')[1];
    // atob 对经过 base-64 编码的字符串进行解码
    let bstr = atob(arr[1]);
    // n 是解码后的长度
    let n = bstr.length;
    // Uint8Array 数组类型表示一个 8 位无符号整型数组 初始值都是 数子0
    let u8arr = new Uint8Array(n);
    // charCodeAt() 方法可返回指定位置的字符的 Unicode 编码。这个返回值是 0 - 65535 之间的整数
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    // new File返回File对象 第一个参数是 ArraryBuffer 或 Bolb 或Arrary 第二个参数是文件名
    // 第三个参数是 要放到文件中的内容的 MIME 类型
    return new File([u8arr], `${filename}.${suffix}`, {
        type: mime,
    });
}
function getNewUrl(file,docTitle) {
    const formData = new FormData();
    formData.append("file", file);
    const fileName =
        "bladex/vehicle/service/" +
        new Date().Format("yyyyMMddHHmmss") +
        "-" +
        file.name;
    formData.append("fileName", fileName);
    let url =
        "/api/oa-resource/oss/endpoint/put-file-attach-by-name";

    request({
        url,
        method: "post",
        data: formData,
    }).then((res) => {
        if(res.data.code===0){
            let fileObj = {
                name:docTitle,
                url:res.data.data.domain
            }
            downUrl(fileObj)
        }     
    })
}
function downUrl(file) {
    window.parent.postMessage(
        {
            param: file,
            msg: "upload",
        },
        "*"
    );
}