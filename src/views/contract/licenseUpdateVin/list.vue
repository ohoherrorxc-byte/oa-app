<template>
    <basic-container>
        <TableForm ref="TableForm" :paginationShow="false" :tableColumn="tableColumn" :searchForm="searchForm" @handleSubmit="handleSubmit"
            @searchForm="searchFormFn">
            <template #monthDate>
                <el-date-picker v-model="monthDate"  :picker-options="pickerOptions" type="monthrange" placeholder="选择月份"
                    value-format="timestamp" :clearable="false"></el-date-picker>
            </template>
            <template #shouldInvoiceNumber="{ row }">
                <div class="row-content">
                    <div>{{ row.shouldInvoiceNumber}}</div>
                    <i @click="downFile(row)" class="el-icon-download colorglue"></i>
                </div>
            </template>
        </TableForm>
    </basic-container>
</template>
  
<script>
import vinUpdateApi from '@/api/vinUpdate/index'
import {downBlobFile} from '@/util/util'
export default {
    data() {
        return {
            formData: {},
            monthDate: null,
            tableData: [],
            searchForm: {
                uploadBtn: "/api/oa-portal/licenseChangeVin/importVinList",
                downloadBtn: false,
                column: [
                    {
                        label: "月份",
                        prop: "monthDate",
                        formSlot: true,
                    },
                    "countryReginCode",
                    {
                        label: "客户名称",
                        type:'select',
                        filterable:true,
                        dicUrl: `/api/oa-portal/contractCustomer/selectList`,
                        props: {
                            label: "custName",
                            value: "id",
                        },
                        prop: "custId",
                    }
                ],
            },
            tableColumn: {
                dicUrl: "/api/oa-portal/licenseChangeVin/selectLicenseList",
                type: "post",
                column: [
                    {
                        label: "月份",
                        prop: "monthDate",
                    },
                    {
                        label: "国家/区域",
                        type: "select",
                        prop: "countryReginName",
                    },
                    {
                        label: "客户",
                        prop: "customerName",
                  
                    },
                    {
                        label: "应开票",
                        prop: "shouldInvoiceNumber",
                        slotName: 'shouldInvoiceNumber'
                    },
                    {
                        label: "激活数（实际开票数量）",
                        prop: "invoiceNumber",
                    },
                    {
                        label: "未开票",
                        prop: "notInvoiceNumber",
                        type: "select",
                    },
                ],
            },
        };
    },
    created() {

    },
    methods: {
      async  downFile(row){
        console.log(row)
            let res = await vinUpdateApi.exportRow(row.id)
            console.log(res)
            downBlobFile(res.data,`${row.countryReginName} ${row.monthDate} 应开票`)
        }

    },
};
</script>
  
<style scoped lang="scss">
.colorglue {
    color: green;
    font-size: 24px;
}
.row-content{
    display: flex;
    justify-content: space-between;
}
</style>
  