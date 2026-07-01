<template>
    <div ref="word">
        <table cellspacing="0" cellpadding="0" border="0" style='mso-element:header;width:650px;' id="h0"
            class="el-table__header">
            <tr style="  height: 40px; padding: 0px;">
                <td colspan="2" style="border: none;"> <img :src="imgUrl" alt="" height="50" width="50"></td>
                <td colspan="2" style="border: none;color: #999;font-size: 14px;text-align: right;">上汽海外出行科技有限公司订单</td>
            </tr>
        </table>
        <h3 style="text-align: center">{{ downModelTitle }}</h3>
        <div class="el-table__header-wrapper">
            <table cellspacing="0" cellpadding="0" border class="el-table__header" style="width:650px;">
                <colgroup>
                    <col name="el-table_17_column_229" width="400" />
                    <col name="el-table_17_column_230" width="400" />
                </colgroup>
                <thead class="" style="font-weight: 400;">
                    <tr class>
                        <td colspan="1" class="" style="height: 120px; padding: 0px;font-size: 16px;">
                            <div class="" style="text-align: left;margin-left: 4px;margin-bottom: 4px;"><span
                                    style="font-weight: 700;">合同编号：</span>{{ form.contractApplyNo }} </div>
                            <div class="" style="text-align: left;margin-left: 4px;"><span
                                    style="font-weight: 700;">采购方（甲方）：</span>上汽海外出行科技有限公司</div>
                            <div class="" style="text-align: left;margin-left: 4px;">联系人：{{ form.applyPersonName }} </div>
                            <div class="" style="text-align: left;margin-left: 4px;">电话： 15221426841</div>
                            <div class="" style="text-align: left;margin-left: 4px;">地址：上海市嘉定区于田南路36号7楼</div>
                        </td>
                        <td class="el-table_17_column_230 is-center is-leaf el-table__cell"
                            style="height: 120px; padding: 0px;font-size: 16px;">
                            <div class="" style="text-align: left;margin-left: 4px;margin-bottom: 4px;"><span
                                    style="font-weight: 700;">供应商编号：</span>{{ form.supplierNo }} </div>
                            <div class="" style="text-align: left;margin-left: 4px;"><span
                                    style="font-weight: 700;">供应方（乙方）：</span>{{ form.supplierName }}</div>
                            <div class="" style="text-align: left;margin-left: 4px;">联系人：{{ form.supplierContact }} </div>
                            <div class="" style="text-align: left;margin-left: 4px;">电话： {{ form.supplierTel }}</div>
                            <div class="" style="text-align: left;margin-left: 4px;">地址：{{ form.supplierAddr }}</div>
                        </td>
                    </tr>
                </thead>
            </table>
        </div>
        <div data-v-1a1eb75f style="font-size: 16px;font-weight: 700;color: #fff;">订单明细</div>
        <div>
            <div data-v-1a1eb75f style="margin-top: 20px; " id="eleTable">
                <table border="1" style="width: 650px;font-size: 16px; table-layout: fixed;">
                    <tr style="background: #EBEDF0; color: rgb(0, 0, 0);  height: 40px; padding: 0px;">
                        <th colspan="2">下单时间</th>
                        <th colspan="2">采购负责人</th>
                        <th colspan="2">付款方式</th>
                        <th colspan="2">订单号</th>
                    </tr>
                    <tr style=" height: 40px; padding: 0px;text-align: center;">
                        <td colspan="2">{{ form.applyDate }}</td>
                        <td colspan="2">{{ form.applyPersonName }}</td>
                        <td colspan="2">{{ form.payMethod === 2 ? '转账' : "现金" }}</td>
                        <td colspan="2">{{ form.applyNo }}</td>
                    </tr>
                </table>
                <div style="height: 20px;">
                    <div data-v-1a1eb75f style="font-size: 16px;font-weight: 700;color: #fff;">订单明细</div>
                </div>
                <table border="1" style="width: 650px;table-layout:fixed;font-size: 16px;">
                    <tr style="background: #EBEDF0; color: rgb(0, 0, 0);  height: 40px; padding: 0px;">
                        <th colspan="2" style="width: 200px;">产品名称</th>
                        <th colspan="1">周期</th>
                        <th colspan="1">激活数</th>
                        <th colspan="1">交付时间</th>
                        <th colspan="1">原币单价{{ form.currency }},含税</th>
                        <th colspan="1">汇率</th>
                        <th colspan="1">总价/CNY（含税）</th>
                        <!-- <th colspan="1">总计/CNY（含税）</th> -->
                    </tr>
                    <tr v-for="item in form.bomPurchaseOrderDetailList" :key="item"
                        style=" height: 40px; padding: 0px;text-align: center;">
                        <td colspan="2">{{ item.partsName }}</td>
                        <td colspan="1">{{ item.cycle }}</td>
                        <td colspan="1">{{ item.quantity }}</td>
                        <td colspan="1">{{ item.deliveryTime ? item.deliveryTime.substring(0, 10) : "" }}</td>
                        <td colspan="1">{{ item.unitPrice }}</td>
                        <td colspan="1">{{ form.exchangeRate }}</td>
                        <td colspan="1">{{ item.totalPriceRmb }}</td>
                        <!-- <td colspan="1">{{ item.totalPriceOriginal }}</td> -->
                    </tr>
                    <tr style="height: 40px;">
                        <td colspan="5" style="padding-left: 10px;">总计</td>
                        <td colspan="1" style="text-align: center;" >{{ getOriginalAmountToTal('bomPurchaseOrderDetailList') }}</td>
                        <td colspan="1" style="padding-left: 10px;"></td>
                        <td colspan="1" style="text-align: center;">{{ getRMBAmountToTal('bomPurchaseOrderDetailList') }}</td>
                    </tr>
                </table>
            </div>
        </div>
        <div>
            <div data-v-1a1eb75f style="font-size: 16px;font-weight: 700;color: #fff;">订单明细</div>
            <div data-v-1a1eb75f style="font-size: 16px;font-weight: 700;color: #fff;">订单明细</div>
        </div>
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
        <!-- <table border="0" style="width: 650px;">
            <tr style=" height: 80px; padding: 0px;text-align: left;font-weight: 700;">
                <td colspan="2" align="left">采购方：上汽海外出行科技有限公司</td>
                <td colspan="2" align="left">供应方：{{form.supplierName}} </td>
            </tr>
            <tr style=" height: 120px; padding: 0px;text-align: left;font-weight: 700">
                <td colspan="2">代表签字（盖章）</td>
                <td colspan="2">代表签字（盖章）</td>
            </tr>
        </table> -->
        <div style="width:650px;padding:10pt;font-size: 16px;">
            <div> 说明：</div>
            <div> 1. 原币/人民币汇率：{{form.exchangeRate}}；</div>
            <div> 2. 产品许可费用支付条款以双方协议约定为准，由采购方以电汇方式支付给供应方。</div>
            <div> 3. 供应方按照《采购订单》，在收到采购方订单后的五个工作日内，按订单要求向采购方提供相应许可服务。</div>
            <div> 4. 供应方按照国家规定向采购方出具相应的国家统一的{{form.taxRate||"..."}}增值税专用发票</div>  
        </div>
    </div>
</template>

<script>
import { baseUrl, indexUrl } from "@/config/env";
import { exportHtmlToDocx } from '@/util/wordDown'
import BomPurchaseOrderApplyApi from '@/api/bomPurchaseOrderApply/index'
import logoBase64 from '../logoBase64'
import { mixinsAmount } from '@/mixins/amount'
export default {
    data() {
        return {
            form: {
            },
            imgUrl: ''
        }
    },
    mixins: [mixinsAmount],
    mounted() {
        this.imgUrl = logoBase64
    },
    props: {
        bomPurchaseContractForm: {

        },
        downModelTitle: {}
    },
    methods: {
        init() {

        },
        async downModel(id) {
            let res = await BomPurchaseOrderApplyApi.details(id)
            // console.log(res)
            this.form = res.data.data
            let word = this.$refs.word;
            // this.downModelTitle = `${this.downModelTitle}`  
            let  title = `${ this.downModelTitle}.docx`
            setTimeout(() => {
                exportHtmlToDocx(word.innerHTML, title);
            }, 300);
        }
    }
}
</script>

<style>
.flex-space {
    display: -webkit-box;
    justify-content: space-between;
}</style>