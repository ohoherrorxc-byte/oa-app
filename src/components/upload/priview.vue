<template>
    <div>
        <el-dialog :append-to-body="true" title="文件预览" :visible.sync="dialogTableVisible" width="60%">
            <el-form class="mb10">
                <el-button @click="prevPage">上一页</el-button>
                <el-button @click="nextPage">下一页</el-button>
                <el-button class="fr mr20" type="primary" @click="addWater">下载</el-button>
            </el-form>
            <!-- v-if="pdfSrc" 关键:防止 <pdf> 在 pdfSrc 为空时挂载,触发 pdfvuer 内部
                 page watcher 在 this.pdf 仍为 null 时调用 this.pdf.getPage() 抛错 -->
            <div class="pdf-preview-wrapper">
              <pdf
                v-if="pdfSrc"
                :src="pdfSrc"
                :page="currentPage"
                :resize="true"
                @numpages="pageCount = $event"
              >
              </pdf>
            </div>
            <p>当前页码: {{ currentPage }} / {{ pageCount }}</p>
        </el-dialog>
    </div>
</template>

<script>
// 由 vue-pdf@4.3.0 升级到 pdfvuer@1.10.0：
//   1) pdfvuer 用 pdfjs-dist/build/pdf.worker.entry，不再走 worker-loader，webpack 5 兼容
//   2) 事件 num-pages → numpages（pdfvuer 用驼峰命名）
//   3) 移除自定义 CMapReaderFactory（pdfvuer 不导出该 factory，新版 pdfjs-dist 内置 CJK 支持）
// pdfvuer 改为按需 import：触发 Preview(file) 时才加载（pdfjs 链 ~3MB）
// 原本顶层 import 导致整个 components/upload 引用方都拉进 pdfjs-dist
import { getFormatDate } from '@/util/util'
import { mapGetters } from 'vuex'
export default {
    // 异步组件：pdfvuer/pdfjs 仅在 <pdf> 真的渲染时才下载
    components: {
        pdf: () => import('pdfvuer')
    },
    data() {
        return {
            dialogTableVisible: false,
            pdfSrc: '', // 可设置为URL或Blob URL
            pageCount: 0,
            currentPage: 1,
            loaded: false,
            filePdf: null
        }
    },
    computed: {
        ...mapGetters(["isMobile", 'userInfo']),
    },
    props:{
        isNotWater:{
            type: Boolean,
            default: false,
        }
    },
    methods: {
        nextPage() {
            if (this.currentPage < this.pageCount) {
                this.currentPage++;
            } else {
                this.currentPage = 1; // 循环到第一页
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            } else {
                this.currentPage = this.pageCount; // 循环到最后一页
            }
        },
        async Preview(file) {
            // 小屏 (OAmobile iframe) 直接走下载链路,完全跳过 pdfjs 链
            if (window.$isMobile) {
                const url = file.temUrl || file.url
                const a = document.createElement('a')
                a.href = url
                a.download = file.name || 'file'
                a.click()
                return
            }
            this.filePdf = file
            // 只设一次 pdfSrc,不要反复 null/blob/task 来回切(pdfvuer 内部会跑多次 loading task 链,会 race)
            // createLoadingTask 内部会自己 fetch,不需要外面再 fetch 一次
            const { default: pdf } = await import('pdfvuer')
            let url = file.temUrl || file.url
            this.pdfSrc = pdf.createLoadingTask({
                url: url,
            })
            // currentPage 不要重置成 1(可能本来就是 1),避免触发 pdfvuer 的 page watcher
            // 仅当之前显示过别的页时才重置
            if (this.pageCount > 0) {
                this.currentPage = 1
                this.pageCount = 0
            }
        },
        addWater() {
            // 小屏不做水印预览,直接下载
            if (window.$isMobile) {
                const url = this.filePdf.temUrl || this.filePdf.url
                const a = document.createElement('a')
                a.href = url
                a.download = this.filePdf.name || 'file'
                a.click()
                return
            }
            let url = this.filePdf.temUrl || this.filePdf.url
            fetch(url).then(response => {
                return response.blob();
            }).then(async blob => {
                // PreviewPdf 改成按需 import,小屏不下载 pdf-lib
                const { default: PreviewPdf } = await import('@/util/previewPdf')
                new PreviewPdf({
                    blob: blob,
                    docTitle: this.filePdf.name,
                    isAddWatermark: !this.isNotWater,
                    watermark: {
                        type: 'canvas',
                        text: `${this.userInfo.nick_name || this.userInfo.realName || this.userInfo.user_name} ${getFormatDate()}`
                    },
                    isMobile: false,
                    url: url
                })
            })
        },
    }
}
</script>