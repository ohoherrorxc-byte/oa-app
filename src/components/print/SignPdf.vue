<template>
  <el-dialog
    title="查看发票"
    :visible="true"
    :append-to-body="true"
    width="800px"
    height="600px"
    class="PDF"
    @close="$emit('close')"
  >
    <div v-loading="loading" class="pdf-wrap" :style="{height: calcHeight}">
      <iframe
        id="print"
        :src="pdfUrl"
        frameborder="0"
        style="width:100%; height:100%"
        allowtransparency="true"
        @load="loadPdf"
      />
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    pdfUrl: {
      type: String,
      default:
        "https://za-charity-tst.oss-cn-hzfinance.aliyuncs.com/2019/10/22/签发电子合约_1571738162752.pdf",
    },
  },
  data() {
    return {
      loading: false,
      calcHeight: window.innerHeight - 380 + "px",
    };
  },
  created() {},
  methods: {
    loadPdf(e) {
      this.loading = false;
    },
    download() {
      location.href = this.pdfUrl;
    },
    print() {
      this.$Print("#print");
    },
  },
};
</script>
<style lang="scss">
.PDF .el-dialog {
  margin-top: 50px !important;
}
.PDF .el-dialog__body {
  padding: 10px 24px;
}
.PDF .pdf-wrap {
  max-height: 100%;
  max-width: 750px;
}
</style>
