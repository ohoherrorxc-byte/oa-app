<!--
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-05-29 10:53:32
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2024-01-08 14:22:17
 * @FilePath: \icarx-ui\src\components\upload\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <el-form class="mb5">
        <el-button @click="down">{{ $t("commonContent.download") }}</el-button>
        <!-- <el-button @click="handlePrint">打印</el-button> -->
      </el-form>
      <img id="img-print" width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <el-upload
      :disabled="disabled"
      :limit="limit"
      :before-upload="beforeAvatarUpload"
      :accept="accept"
      :multiple="multiple"
      :file-list="fileList"
      :show-file-list="showFileList"
      :http-request="httpRequest"
      :on-exceed="handleExceed"
      :before-remove="beforeAvatarRemove"
      :on-change="handleChange"
      :on-preview="handlePreview"
    >
      <el-button
        :disabled="disabled"
        :size="size"
        :type="btnType"
        :icon="icon"
        >{{ btnName || $t("commonContent.importL") }}</el-button
      >
      <div v-if="showTip" slot="tip" class="el-upload__tip">
        <slot name="tip"></slot>
      </div>
    </el-upload>
    <priview ref="pdfPriview" :isNotWater="isNotWater(curFile)"></priview>
  </div>
</template>

<script>
import request from "@/router/axios";
import { getImageByUrl } from "@/api/billManage/poOrder";
import {
  fileDownload,
  downloadFileBlob,
  isPDF,
  getFormatDate,
} from "@/util/util";
import printJS from "print-js";
// PreviewPdf 不再顶层 import：仅在加水印分支才需要,改为 dynamic import
import { mapGetters } from "vuex";
// priview 也改为异步组件：它内部引用 pdfvuer + pdfjs,延迟到真正打开预览对话框才下载
import { debounce } from "@/util/util";
export default {
  components: {
    priview: () => import('./priview.vue')
  },
  props: {
    // 有值是导入，空是上传
    url: {
      type: String,
      default: "",
    },
    btnType: {
      type: String,
      default: "primary",
    },
    btnName: {
      type: String,
    },
    accept: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "mini",
    },
    icon: {
      type: String,
      default: "el-icon-upload2",
    },
    limit: {
      type: Number,
      default: null,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    fileList: {
      type: Array,
      default: [],
    },
    showFileList: {
      type: Boolean,
      default: false,
    },
    beforeUpload: {
      type: Function,
      default: () => {},
    },
    showTip: {
      type: Boolean,
      default: true,
    },
    isHistory: {
      type: Boolean,
      default: false,
    },
    approvalName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dataList: [],
      dialogImageUrl: null,
      choostUrl: {},
      dialogVisible: false,
      currentPage: 0,
      pageCount: 0,
      curFile: null,
    };
  },
  computed: {
    ...mapGetters(["isMobile", "userInfo"]),
  },
  watch: {
    fileList() {
      if (this.fileList && this.fileList.length > 0) {
        this.dataList = this.fileList.map((item) => {
          return {
            name: item.name,
            uid: item.uid,
            url: item.originalUrl || item.url,
            temUrl: item.temUrl || item.url,
          };
        });
      } else {
        this.dataList = [];
      }
    },
  },
  methods: {
    fileListFn(fileList) {
      if (fileList && fileList.length > 0) {
        this.dataList = fileList.map((item) => {
          return {
            name: item.name,
            uid: item.uid,
            url: item.originalUrl || item.url,
            temUrl: item.temUrl || item.url,
          };
        });
      } else {
        this.dataList = [];
      }
    },
    getList(arr) {
      this.dataList = arr.map((item) => {
        return {
          name: item.name,
          uid: item.uid,
          url: item.originalUrl || item.url,
          temUrl: item.temUrl || item.url,
        };
      });
    },
    change(file) {
      this.dataList.forEach((item, index) => {
        if (item.uid === file.uid || item.url === file.url) {
          // console.log(item);
          this.dataList.splice(index, 1);
        }
      });
      this.$emit("handleRequest", "", this.dataList, file);
      this.$emit("handleChange", this.dataList);
    },
    handlePrint() {
      printJS({
        printable: "img-print",
        type: "html",
        header: null,
        imageStyle: `@page { size: auto;  margin: 0mm;page-break-inside: avoid;
    page-break-after: always; }`,
      });
    },
    down() {
      console.log(this.choostUrl);
      let url = this.choostUrl.temUrl || this.choostUrl.url;
      downloadFileBlob(url, this.choostUrl.name);
    },
    handleChange(file, fileList) {
      if (!this.showFileList) {
        // let limit = this.limit ? -this.limit : -1;
        this.fileList = fileList.slice(-1);
      }
      this.$emit("handleChange", this.dataList);
    },
    // 文件超出个数限制时的钩子
    handleExceed(files) {},
    // 删除文件之前的钩子
    beforeAvatarRemove(file, fileList) {
      this.change(file);
      this.$emit("beforeAvatarRemove", this.dataList);
    },
    // 上传文件之前的钩子
    beforeAvatarUpload(file) {
      return this.beforeUpload(file);
    },
    // 	覆盖默认的上传行为，可以自定义上传的实现
    httpRequest(params) {
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
        url = "/api/oa-resource/oss/endpoint/put-file-attach-by-name";
      }
      request({
        url,
        method: "post",
        data: formData,
      }).then((res) => {
        const { code, msg, message, data } = res.data;
        if (code === 200 || code === 0) {
          this.$message({
            type: "success",
            message: msg || message,
          });
          this.dataList.push({
            name: file.name,
            uid: file.uid,
            url: data ? data.link : "",
            temUrl: data ? data.domain : "",
          });

          this.$emit("handleRequest", data, this.dataList, file);
        } else {
          this.$emit("errRequest", data);
        }
      });
    },
    downUrl(file) {
      window.parent.postMessage(
        {
          param: file,
          msg: "upload",
        },
        "*"
      );
      this.$message({
        message: "文件正在下载，请稍等",
        type: "success",
      });
    },
    async addWater(file, isMobile = false) {
      // console.log('addWater')
      // 小屏直接下载,跳过 pdf-lib
      if (window.$isMobile) {
        const url = file.temUrl || file.url;
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name || 'file';
        a.click();
        return;
      }
      let url = file.temUrl || file.url;
      fetch(url)
        .then((response) => {
          return response.blob();
        })
        .then(async (blob) => {
          // PreviewPdf 改为 dynamic import：仅在用户真正点击"加水印下载"时才下载 pdf-lib 链
          const { default: PreviewPdf } = await import('@/util/previewPdf');
          new PreviewPdf({
            blob: blob,
            docTitle: file.name,
            isAddWatermark: true,
            watermark: {
              type: "canvas",
              text: `${
                this.userInfo.nick_name ||
                this.userInfo.realName ||
                this.userInfo.user_name
              } ${getFormatDate()}`,
            },
            isMobile: isMobile,
            url: url,
          });
        });
      this.$message({
        message: "文件正在下载，请稍等",
        type: "success",
      });
    },
    isNotWater(file) {
      return (
        this.isYWM() ||
        this.userInfo.account === "huangbeichuan" ||
        ((this.userInfo.dept_id === "1674254439328370689" ||
          this.userInfo.nick_name == "王荀" ||
          this.userInfo.realName == "王荀" ||
          this.userInfo.user_name == "王荀") &&
          file &&
          (file.businessName === "bomPurchaseContractPay" ||
            file.businessName === "purchaseContractPay" ||
            file.businessName === "acceptFinished" ||
            file.businessName === "invoiveBomPay" ||
            file.businessName === "invoivePurchaseContractPay"))
      );
    },
    isYWM() {
      return (
        this.userInfo.account === "yangweimin" &&
        (this.approvalName === "项目预算申请" ||
          this.approvalName === "销售合同申请" ||
          this.approvalName === "预算追加与调整" ||
          this.approvalName === "Budget Append and Adjustment" ||
          this.approvalName === "Project Budget Request" ||
          this.approvalName === "Sales Contracts Request")
      );
    },
    doSomePreview(file) {
      // console.log(file)
      this.$refs.pdfPriview.dialogTableVisible = true;
      this.curFile = file;
      this.$refs.pdfPriview.Preview(file);
    },
    dealDown(file) {
      if (isPDF(file) && this.isMobile) {
        this.addWater(file, this.isMobile);
        return;
      }
      if (isPDF(file) && !this.isHistory) {
        this.doSomePreview(file);
        // if (this.isMobile) {
        //   this.addWater(file, this.isMobile)
        // } else {
        // this.doSomePreview(file)
        // }
        return;
      }
      if (this.isMobile) {
        this.$message({
          message: "文件正在下载，请稍等",
          type: "success",
        });
        debounce(this.downUrl(file), this, 1000);
        return;
      }
      if (!file.url) {
        file = this.dataList.find((ele) => {
          return ele.uid === file.uid;
        });
      }
      try {
        // console.log("file.url-->" + file.url);
        if (this.isHistory || navigator.userAgent.indexOf("Firefox") >= 0) {
          window.open(file.url);
        } else {
          if (/\.(jpg|jpeg|png|GIF|JPG|PNG)$/.test(file.name)) {
            // console.log(21121)
            this.dialogVisible = true;
            this.dialogImageUrl = file.temUrl || file.url;
            this.choostUrl = file;
            console.log(this.dialogImageUrl);
            console.log(file.temUrl);
            return;
          }
          if (file.temUrl) {
            downloadFileBlob(file.temUrl, file.name);
            return;
          }
          downloadFileBlob(file.url, file.name);
        }
      } catch (error) {
        this.$message.error("解析路径失败！");
      }
    },
    handlePreview(file) {
      debounce(this.dealDown.bind(null, file), this, 1000);
    },
    getImageByUrl(url) {
      getImageByUrl({ url }).then((res) => {
        this.download(res, url);
      });
    },
    download(rsp, imgUrl) {
      console.log(rsp);
      let blob = new Blob([rsp.data], { type: "application/octet-stream;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", this.splitStr(imgUrl));
      document.body.appendChild(link);
      link.click();
    },
    splitStr(str) {
      return str.split("/")[str.split("/").length - 1];
    },
  },
};
</script>
