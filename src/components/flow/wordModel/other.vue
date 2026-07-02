<template>
    <div ref="word">
        <table cellspacing="0" cellpadding="0" border="0" style="width:650px;"
            class="el-table__header">
            <tr style="  height: 40px; padding: 0px;">
                <td colspan="2" style="border: none;"> <img :src="imgUrl" alt="" height="50" width="50"></td>
                <td colspan="2" style="border: none;color: #999;font-size: 14px;text-align: right;">上汽海外出行科技有限公司订单</td>       
            </tr>
        </table>
        <h3 style="text-align: center" v-html="downModelTitle"></h3>
        <div class="el-table__header-wrapper">
            <table border="1" style="width: 650px;table-layout:fixed;font-size: 16px;">
                <tr style=" height: 40px; padding: 0px;">
                    <td colspan="3">  合同编号:{{ form.contractApplyNo }}</td>
                    <td colspan="3">  订单编号:{{ form.applyNo}}</td>
                </tr>
                <tr style=" height: 40px; padding: 0px;text-align: center;">
                    <td colspan="1">订单日期</td>
                    <td colspan="5">{{form.applyDate}}</td>
                </tr>
                <tr style=" height: 40px; padding: 0px;text-align: center;">
                    <td colspan="1">采购方（甲方）</td>
                    <td colspan="2">上汽海外出行科技有限公司</td>
                    <td colspan="1">供应方（乙方）</td>
                    <td colspan="2">{{form.supplierName}}</td>
                </tr>
                <tr style=" height: 40px; padding: 0px;text-align: center;">
                    <td colspan="1">联系人（甲方）</td>
                    <td colspan="2">{{form.applyPersonName}}</td>
                    <td colspan="1">联系方式</td>
                    <td colspan="2">15221426841</td>
                </tr>
                <tr style=" height: 40px; padding: 0px;text-align: center;">
                    <td colspan="1">联系人（乙方）</td>
                    <td colspan="2">{{form.supplierContact}}</td>
                    <td colspan="1">联系方式</td>
                    <td colspan="2">{{form.supplierTel}}</td>
                </tr>
            </table>
        </div>
        <div>
            <div data-v-1a1eb75f style="margin-top: 20px; " id="eleTable">
                <div data-v-1a1eb75f style="font-size: 16px;font-weight: 700;">订单明细</div>
                <table border="1" style="width: 650px;font-size: 16px;">
                    <tr style="background: #C6D9F1; color: rgb(0, 0, 0);  height: 40px; padding: 0px;">
                        <th colspan="2" style="width: 200px;">项目名称</th>
                        <th colspan="1">服务内容</th>
                        <th colspan="1">数量</th>
                        <th colspan="1">交付日期</th>
                        <th colspan="1">单价/{{form.currency}}（含税）</th>
                        <th colspan="1">汇率</th>
                        <th colspan="1">总计/元（含税）</th>
                        <th colspan="1">备注</th>
                    </tr>
                    <tr v-for="item in form.bomPurchaseOrderDetailList" :key="item"
                        style=" height: 40px; padding: 0px;text-align: center;">
                        <td colspan="2">{{ item.projectName }}</td>
                        <td colspan="1">{{ item.partsName }}</td>
                        <td colspan="1">{{ item.quantity }}</td>
                        <td colspan="1">{{ item.deliveryTime ? item.deliveryTime.substring(0, 10) : ""}}</td>
                        <td colspan="1">{{ item.unitPrice }}</td>
                        <td colspan="1">{{ form.exchangeRate }}</td>
                        <td colspan="1">{{ item.totalPriceRmb }}</td>
                        <td colspan="1">{{ item.remark }}</td>
                    </tr>
                    <tr>
                        <td colspan="7" style="padding-left: 10px;">总计</td>
                        <td colspan="1" style="text-align: center;">{{ getRMBAmountToTal('bomPurchaseOrderDetailList') }}</td>
                    </tr>
                </table>

            </div>
        </div>
        <div>
            <div data-v-1a1eb75f style="font-size: 16px;font-weight: 700;color: #fff;">订单明细</div>
        </div>
        <div style="width:650px;padding:10pt;font-size: 16px;">
           <p> 说明：</p>
           <p>1. 费用支付条款以双方协议约定为准</p> 
            <p> 2. 原币/人民币汇率： {{form.exchangeRate}}；</p>
            <p> 3. 产品许可费用支付条款以双方协议约定为准，由采购方以电汇方式支付给供应方。</p>
            <p> 4. 供应方按照《采购订单》，在收到采购方订单后的五个工作日内，按订单要求向采购方提供相应许可服务。</p>
            <p> 5. 供应方按照国家规定向采购方出具相应的国家统一的{{form.taxRate||"..."}}增值税专用发票</p>
        </div>
        <div data-v-1a1eb75f style="font-size: 16px;font-weight: 700;color: #fff;">订单明细</div>
        <table border="0" style="width: 650px;table-layout:fixed ; page-break-before: always;">
            <tr style=" height:200px; padding: 0px;text-align: left;font-weight: 700;">
                <td colspan="2" align="left">
                    <div style="height: 120px;">采购方：上汽海外出行科技有限公司</div>
                    <p data-v-1a1eb75f style="color: #fff;">订单明细订单明细订单明细订单明细订单明细订单明细</p>

                    <p style="height: 120px;">代表签字（盖章）</p>
                    <div data-v-1a1eb75f style="font-size: 16px;color: #fff;">订单明细</div>
                    <div data-v-1a1eb75f style="font-size: 16px;color: #fff;">订单明细</div>
                </td>
                <td colspan="2" align="left">
                    <div style="height: 120px;">供应方：{{ form.supplierName }}</div>
                    <p data-v-1a1eb75f style="color: #fff;">订单明细订单明细订单明细订单明细订单明细订单明细</p>

                    <p style="height: 120px;">代表签字（盖章）</p>
                    <div data-v-1a1eb75f style="font-size: 16px;color: #fff;">订单明细</div>
                    <div data-v-1a1eb75f style="font-size: 16px;color: #fff;">订单明细</div>
                </td>
            </tr>
        </table>
        <div data-v-1a1eb75f style="font-size: 16px;font-weight: 700;color: #fff;">订单明细</div>
        <div style="font-size: 14px;font-weight: 700;">
            备注：本附件一式贰份，甲乙方各执一份。
        </div>

    </div>
</template>

<script>
import { baseUrl } from "@/config/env";
import { exportHtmlToDocx } from '@/util/wordDown'
import { mixinsAmount } from '@/mixins/amount'
import BomPurchaseOrderApplyApi from '@/api/bomPurchaseOrderApply/index'
export default {
    data() {
        return {
            form: {
            },
            // logo 不再走 base64 嵌入：拆成 public/img/word-logo.png，浏览器走 HTTP 缓存复用
            imgUrl: `${baseUrl}/img/word-logo.png`
        }
    },
    mixins: [ mixinsAmount],
    props:{
        bomPurchaseContractForm:{

        },
        downModelTitle:{}
    },
    mounted() {
    },
    methods: {     
        init() {

        },
        async downModel(id) {
            let res = await BomPurchaseOrderApplyApi.details(id)
            // console.log(res)
            this.form = res.data.data
            let word = this.$refs.word;
            let title =  this.downModelTitle.replace("<br/>",'')       
            title = `${title}.docx`
            setTimeout(() => {
                exportHtmlToDocx(word.innerHTML,title);
            }, 300);

        }
    }
}
</script>

<style>
.flex-space {
    display: -webkit-box;
    justify-content: space-between;
}
</style>