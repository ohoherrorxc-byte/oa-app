<template>
    <el-dialog title="查看文件" :visible.sync="dialogTableVisible" :append-to-body="true" width="80%">
        <div class="red mb20">注意：暂不支持非pdf文件批量打印</div>
        <div v-for="item in fileListAll">
            <div class="mb20">
                <div class="mb10  fontBold">{{ item.name }}</div>
                <div v-for="subItem in item.fileList" class="mb10">
                    <div class="flex-space">
                        <div @click="downFile(subItem)">
                            <span>{{ subItem.name }}</span><span v-if="!subItem.isPdf">(暂不支持)</span>
                        </div>
                        <el-input-number v-model="subItem.num" :disabled="!subItem.isPdf" @change="handleChange"
                            label="描述文字"></el-input-number>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div class="text-center">
            <el-button type="primary" @click="downBranch">一键打印</el-button>
        </div> -->
    </el-dialog>
</template>

<script>
import {  downloadFileBlob, isPDF, mergePDFs } from '@/util/util'
import BomPurchaseContractApplyApi from '@/api/bomPurchaseContractPayApply/index'
// 打印功能已停用（从首屏 vendors 移除 print-js）
// import printJS from "print-js";
export default {
    data() {
        return {
            gridData: {},
            dialogTableVisible: false,
            num: 1,
            fileListAll: [
                {
                    name: "BOM及框架采购合同付款单",
                    fileList: []
                },
                {
                    name: "验收申请单",
                    fileList: []
                },
                {
                    name: "BOM及框架采购合同评审",
                    fileList: []
                },
                {
                    name: "BOM及框架采购合同订单",
                    fileList: []
                }
            ]
        }
    },
    mounted() {
    },
    methods: {
        async getFileList(form, key) {      
            let res = await BomPurchaseContractApplyApi.getAllFileList(form.id, form.acceptApplyId, key)
            if (res.data.code === 200 || res.data.code === 0) {
                let data = res.data.data
                if (key === 'bomPay') {
                    this.fileListAll = [
                        {
                            name: "BOM及框架采购合同付款单",
                            fileList: data.bomPayList || []
                        },
                        {
                            name: "验收申请单",
                            fileList: data.acceptList || []
                        },
                        {
                            name: "BOM及框架采购合同评审",
                            fileList: data.bomContractList || []
                        },
                        {
                            name: "BOM及框架采购合同订单",
                            fileList: data.bomOrderList || []
                        },
                    ]
                } else if (key === 'purchasePay') {
                    this.fileListAll = [
                        {
                            name: "一般通用采购合同付款申请",
                            fileList: data.bomPayList || []
                        },
                        {
                            name: "验收申请单",
                            fileList: data.acceptList || []
                        },
                        {
                            name: "一般通用采购合同评审",
                            fileList: data.purchaseList || []
                        },
                    ]
                }
                this.fileListAll.map(ele => {
                    ele.fileList.map(self => {
                        let pdf = isPDF(self)
                        this.$set(self, 'isPdf', pdf)
                        let num = pdf ? 1 : 0
                        this.$set(self, 'num', num)
                        console.log(pdf)
                    })
                })
            }
        },
        downFile(item) {
            downloadFileBlob(item.url, item.name)
        },
        async downBranch() {
            let arr = []
            this.fileListAll.map(ele => {
                ele.fileList.map(self => {
                    if (self.isPdf) {
                        for (let i = 0; i < self.num; i++) {
                            arr.push(self)
                        }
                    }
                })
            })
            const pdfBlobs = await Promise.all(
                arr.map(async file => {
                    const url = file.temUrl || file.url;
                    const response = await fetch(url);
                    return response.blob();
                })
            );
            // Merge PDFs and print
            // const mergedPdf = await mergePDFs(pdfBlobs);
            // printJS({
            //     printable: URL.createObjectURL(mergedPdf),
            //     type: 'pdf',
            //     showModal: true
            // });

        },
    }
}
</script>

<style>
.flex-space {
    display: flex;
    justify-content: space-between;
}

.blue {
    color: #409EFF
}

.text-center {
    text-align: center;
}

.fontBold {
    font-weight: bold;
}

.red {
    color: red;
}
</style>