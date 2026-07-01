<template>
  <el-dialog :visible="true" :append-to-body="true" width="800px" height="600px" class="PDF">
    <div class="pdf-wrap" :style="{height: calcHeight}">
      <el-tabs v-if="urlType" v-model="activeName">
        <el-tab-pane
          v-for="(item, index) in pdfUrl"
          :key="index"
          :label="item.contractName"
          :name="item.contractNo"
        >
          <iframe
            :src="item.contractUrl"
            frameborder="0"
            style="width:100%; height:100%"
            allowtransparency="true"
          />
        </el-tab-pane>
      </el-tabs>
      {{ url }}111
      <iframe
        v-if="!urlType"
        :src="pdfUrl"
        frameborder="0"
        style="width:100%; height:100%"
      />
    </div>
    <div slot="footer" class="dialog-footer">
      <slot :close="close" />
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "PDF",
  prop: {
    pdfUrl: {
      type: String,
      default:
        "https://za-charity-tst.oss-cn-hzfinance.aliyuncs.com/2019/10/22/签发电子合约_1571738162752.pdf",
    },
    urlType: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      activeName: "1",
      titleTxet: "",
      pdfUrl: "",
      pdfUrl2: "",
      calcHeight: window.innerHeight - 200 + "px",
    };
  },
  created() {
    console.log(this.url);
  },
  methods: {
    close() {},
  },
};
</script>
<style lang="scss" scoped>
.pdf-wrap {
  ::v-deep ep.el-tabs {
    height: 100%;
  }
  ::v-deep ep.el-tabs__content {
    height: calc(100% - 62px) !important;
  }
  ::v-deep ep.el-tab-pane {
    height: 100%;
  }
}

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
