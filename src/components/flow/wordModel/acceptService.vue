<template>
  <div ref="word" style="font-size: 16px">
    <h3 style="text-align: center" v-html="form.docTitle"></h3>
    <div>
      <div data-v-1a1eb75f style="margin-top: 20px" id="eleTable">
        <table border="1" style="width: 650px; font-size: 16px">
          <tr
            style="
              height: 40px;
              padding: 0px;
              text-align: center;
              font-size: 16px;
            "
          >
            <th colspan="2">
              <div class="m10 flex-center">
                <div>甲方公司名称</div>
                <div>Client</div>
              </div>
            </th>
            <td colspan="2">
              <div class="m10 flex-center">
                <div>上汽海外出行科技有限公司</div>
                <div>
                  SAIC MOTOR Overseas Intelligent Mobility Technology Co.,Ltd.
                </div>
              </div>
            </td>
          </tr>
          <tr
            style="
              height: 40px;
              padding: 0px;
              text-align: center;
              font-size: 16px;
            "
          >
            <th colspan="2">
              <div class="m10 flex-center">
                <div>项目进度</div>
                <div>Status</div>
              </div>
            </th>
            <td colspan="2">
              <div class="m10 flex-center">
                <div>已完成服务</div>
                <div>Completed</div>
              </div>
            </td>
          </tr>
          <tr
            style="
              height: 40px;
              padding: 0px;
              text-align: center;
              font-size: 16px;
            "
          >
            <th colspan="2">
                <div>开票内容</div>
                <div>Invoice Content</div>
            </th>
            <td colspan="2"></td>
          </tr>
          <tr
            style="
              height: 40px;
              padding: 0px;
              text-align: center;
              font-size: 16px;
            "
          >
            <th colspan="2">
                <div>
                    <div>发票类型</div>
                    <div>Invoice Type (applicable under China Tax Regime)</div>
                </div>
            </th>
            <td colspan="2">
                <div>
                    <div>增值税专用发票</div>
                    <div>VAT Special Invoice</div>
                </div>
            </td>
          </tr>
          <tr
            style="
              height: 40px;
              padding: 0px;
              text-align: center;
              font-size: 16px;
            "
          >
            <th colspan="2">税率</th>
            <td colspan="2">6%</td>
          </tr>
          <tr
            style="
              height: 40px;
              padding: 0px;
              text-align: center;
              font-size: 16px;
            "
          >
            <th colspan="2">开票金额(含税)</th>
            <td colspan="2">{{ form.acceptAmountRmb }}</td>
          </tr>
          <tr
            style="
              height: 40px;
              padding: 0px;
              text-align: center;
              font-size: 16px;
            "
          >
            <th colspan="2">合同号</th>
            <td colspan="2">
              {{ form.bomPurchaseOrderNo || form.purchaseContractNo }}
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { baseUrl, indexUrl } from "@/config/env";
import { exportHtmlToDocx } from "@/util/wordDown";
import AcceptApplyApi from "@/api/acceptApply/index";
import logoBase64 from "../logoBase64";
export default {
  data() {
    return {
      form: {},
      imgUrl: "",
    };
  },
  mounted() {
    this.imgUrl = logoBase64;
  },
  props: {
    bomPurchaseContractForm: {},
    downModelTitle: {},
  },
  methods: {
    init() {},
    async downModel(id) {
      let res = await AcceptApplyApi.details(id);
      this.form = res.data.data;
      let word = this.$refs.word;
      let title = this.form.docTitle.replace("<br/>", "");
      title = `${title}.docx`;
      setTimeout(() => {
        exportHtmlToDocx(word.innerHTML, title);
      }, 300);
    },
  },
};
</script>

<style>
.flex-space {
  display: -webkit-box;
  justify-content: space-between;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>