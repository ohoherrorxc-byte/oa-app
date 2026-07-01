<template>
    <div>
      <el-scrollbar>
        <div class="text-center">
          <el-card shadow="always" id="print" class="invoice-box pt20 pb20 pr20" style="border:none;">
            <el-row type="flex">
              <el-col style="width: 40px;" class="mr10">
                <img src="/oa/img/newlogo.png" width="100%" />
              </el-col>
              <el-col>
                <el-row type="flex" class="mb10 text-left">
                  <el-col class="fs12" style="line-height: 20px">
                    <span class="fs14">SAIC MOTOR Overseas Intelligent Mobility Technology Co., Ltd</span>
                    <br />
                    <span>7th Floor, 1CVIC, NO.36 South YuTian Rd.</span>
                    <br />
                    <span>AnTing, JiaDing District, Shanghai PR.China 201805</span>
                    <br />
                    <span>Tel: 021-59110319</span>
                  </el-col>
                  <el-col style="width: 300px;">
                    <p class="fr">Invoice</p>
                    <table class="el-table el-table--border fs12">
                      <thead class="el-table__header">
                        <tr class="el-table__row">
                          <th class="is-center" width="50%">Date</th>
                          <th class="is-center" width="50%">Invoice #</th>
                        </tr>
                      </thead>
                      <tbody class="el-table__body">
                        <tr class="el-table__row">
                          <td class="is-center">{{ form.applyDate }}</td>
                          <td class="is-center">{{ form.invoiceNo }}</td>
                        </tr>
                      </tbody>
                    </table>
                    <table class="el-table el-table--border fs12">
                      <thead class="el-table__header">
                        <tr class="el-table__row">
                          <th class="is-center" width="50%">Contract NO.</th>
                          <th class="is-center" width="50%">POR</th>
                        </tr>
                      </thead>
                      <tbody class="el-table__body">
                        <tr class="el-table__row">
                          <td class="is-center"></td>
                          <td class="is-center"></td>
                        </tr>
                      </tbody>
                    </table>
                  </el-col>
                </el-row>
                <el-row type="flex" :gutter="20">
                  <el-col>
                    <table class="el-table el-table--border fs12">
                      <thead>
                        <tr>
                          <th class="is-center">Bill To</th>
                        </tr>
                      </thead>
                      <tbody class="el-table__body fs12">
                        <tr class="el-table__row fs12">
                          <td height="60px" style="padding-left: 10px;">
                            <p>{{ form.custName }}</p>
                            <div class="mt15 mb15">{{ form.custAddr }}</div>
                            <p>Attn:</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-col>
                  <el-col>
                    <table class="el-table el-table--border fs12">
                      <thead>
                        <tr>
                          <th class="is-center fs12">Notify</th>
                        </tr>
                      </thead>
                      <tbody class="el-table__body fs12">
                        <tr class="el-table__row">
                          <td height="50px" style="padding-left: 10px;" class="fs10">
                            <p>{{ form.contactName }}</p>
                            <p>Tel:{{ form.contactTel }}</p>
                            <p>email:{{ form.contactEmail }}</p>
                            <p>Fax:{{ form.fax }}</p>
                            <p>IEC:{{ form.iec }}</p>
                            <p>PAN:{{ form.pan }}</p>
                            <p>GSTIN:{{ form.gstin }}</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </el-col>
                </el-row>
                <el-row type="flex" class="mb10 mt10 text-left">
                  <el-col>Terms:{{ form.projectName }}</el-col>
                  <el-col>Currency：{{ form.currency }}</el-col>
                </el-row>
                <table class="el-table el-table--border fs12">
                  <thead>
                    <tr>
                      <th class="is-center">Item NO</th>
                      <th class="is-center">Item Description</th>
                      <th class="is-center">part no</th>
                      <th class="is-center">QTY</th>
                      <th class="is-center">UNIT PRICE</th>
                      <th class="is-center">Amount</th>
                    </tr>
                  </thead>
                  <tbody class="el-table__body">
                    <tr class="el-table__row text-c fs12" v-for="(item, index) in form.invoiceInfoList" :key="item.id">
                      <td>{{ index + 1 }}</td>
                      <td style="width: 310px;text-align: left;">{{ item.itemDesc }}</td>
                      <td>{{ item.partsNo }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.unitPrice }}</td>
                      <td>{{ item.amount }}</td>
                    </tr>
                  </tbody>
                </table>
                <el-row type="flex" class="mt5 fs12">
                  <el-col>
                    <el-card style="height: 120px;  display:flex; align-items:center;white-space: pre-wrap;font-size: 11px"
                      shadow="never">Remarks： {{ form.remarkLeft }}</el-card>
                  </el-col>
                  <el-col class="ml40 invoice-details text-left fs12" style="">
                    <p class="flex">
                      <span class="label">Discount item</span>
                      <span class="value"></span>
                    </p>
                    <p class="flex">
                      <span class="label">Margin</span>
                      <span class="value"></span>
                    </p>
                    <p class="flex">
                      <span class="label">Total Net Expense Flat Fee</span>
                      <span class="value">{{ total.toFixed(2) }}</span>
                    </p>
                    <p class="flex">
                      <span class="label">Remarks</span>
                      <span class="value">{{ form.remark }}</span>
                    </p>
                    <p class="flex">
                      <span class="label">Others</span>
                      <span class="value"></span>
                    </p>
                    <p class="flex">
                      <span class="label">Total</span>
                      <span class="value">{{ total.toFixed(2) }}</span>
                    </p>
                  </el-col>
                </el-row>
                <table class="el-table el-table--border mt5 fs12">
                  <thead>
                    <tr>
                      <th style="padding-left: 10px;">PLEASE MAKE A DIRECT DEPOSIT OF <span style="color: red">{{
                        total.toFixed(2) }}</span> WITHIN 30 DAYS TO:</th>
                    </tr>
                  </thead>
                  <tbody class="el-table__body fs12">
                    <tr class="el-table__row">
                      <td style="padding-left: 10px;     height: 90px;  vertical-align: top;" class="fs10">
                        Bank Name: Industrial and Commercial Bank of China , Shanghai Municipal Branch
                        <br />Account Name: SAIC MOTOR Overseas Intelligent Mobility Technology Co., Ltd
                        <br />CNY Account No: 1001190709004852992
                        <br />USD Account No: 1001190709148033951
                        <br />Swift Code: ICBKCNBJSHI
                        <br />CNAPS Code: 102290019077
                        <br />Bank Address: NO.9 Pudong Avenue 200120 Shanghai,China
                      </td>
                    </tr>
                  </tbody>
                </table>
                <el-card style="height: 90px; " class="mt10 fs10 text-left" shadow="never" :body-style="{ padding: '10px' }">
                  <p class="mb10">
                    We would like to thank you very much for the pleasant and trustful cooperation.
                    <br />Regards,
                  </p>Finance
                  <br />SAIC MOTOR Overseas Intelligent Mobility Technoloy Co., Ltd
                </el-card>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-scrollbar>
    </div>
  </template>

  <script>
  import { toJpeg } from "html-to-image";
  import print from "print-js";
  import { invoiceDetail } from "@/api/billManage/poOrder";
  import { mapGetters } from "vuex";

  export default {
    components: {  },
    data() {
      return {
        invoiceSet: false,
        saleTypeList: [],
        salesContractList: [],
        salesOrderList: [],
        invoiceTypeList: [],
        projectList: [],
        currencyList: [],
        custList: [],
        userList: [],
        deptList: [],
        invoiceInfoMultipleSelection: [],
        form: {
          invoiceInfoList: [
            {
              key: Date.now(),
            },
          ],
        },
      };
    },
    props:{
        invoiceId:null
    },
    watch:{
        invoiceId(){
            this.init()
        }
    },
    computed: {
      ...mapGetters(["userInfo"]),
      total() {
        const invoiceInfoList = this.form.invoiceInfoList.map((item) =>
          Number(item.amount)
        );
        return invoiceInfoList.reduce((pre, cur) => pre + cur, 0);
      },
    },
    created() {
      this.init();
    },
    methods: {
      handlePrint() {
        toJpeg(document.getElementById("print"), { quality: 0.99, width: 790, backgroundColor: '#ffffff' }).then(
          (dataUrl) => {
            print({
              printable: dataUrl,
              type: "image",
              base64: true,
              style: `@media print { @page {size: auto; margin: 30; } body{margin:0 5px;padding: 20px;}}`,
            });
          }
        );
      },
 
      init() {
        const businessId = this.invoiceId;
        // const salesOrderNo = this.$route.query.salesOrderNo;
        invoiceDetail({  businessId }).then((res) => {
          this.form = res.data.data;
          if (this.form.invoiceTypeDisplay != null) {
            this.form.invoiceTypeDisplay = this.form.invoiceTypeDisplay.toString()
          }
        });
      
      },

    
    },
  };
  </script>
  <style scoped lang="scss">
  .text-center {
    display: flex;
    justify-content: center
  }
  
  .el-form {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  
    .el-form-item {
      width: 48%;
      margin-left: 5px;
    }
  }
  .text-left{
    text-align: left;
  }
  
  .invoice-box {
    font-size: 12px;
    width: 795px;
    // margin: 0 auto 50px;
  }
  
  .el-table {
    thead tr th {
      background: #81d3f8;
    }
  
    th,
    td {
      color: #000;
      padding: 3px 0;
    }  
    .text-c {
  
      th,
      td {
        text-align: center;
      }
    }
  }
  
  .invoice-details {
    p {
      // line-height: 20px;
    }
  
    .label {
      width: 110px;
      display: inline-block;
    }
  
    .value {
      display: inline-block;
      width: 200px;
      border-bottom: 1px solid #ebeef5;
    }
  }
  </style>
  