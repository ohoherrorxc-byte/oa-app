<template>
    <basic-container>
        <TableForm ref="TableForm" :tableColumn="tableColumn" :searchForm="searchForm" @handleSubmit="handleSubmit"
          >
            <template #operation="{ row }">
                <el-row>
                    <el-button @click="handleOpenDialog(row)" type="text" icon="el-icon-edit">编辑</el-button>
                </el-row>
            </template>
        </TableForm>
        <el-dialog title="提示" :visible.sync="dialogVisible" width="70%" :before-close="handleClose" :append-to-body="true">
            <el-form :model="form">
                <el-form-item label="零件号" :label-width="formLabelWidth">
                    <el-input v-model="form.partsNo" disabled></el-input>
                </el-form-item>
                <el-form-item label="结算PO订单编号" :label-width="formLabelWidth">
                    <el-input v-model="form.orderApplyNo" disabled></el-input>
                </el-form-item>
                <el-form-item label="批次号" :label-width="formLabelWidth">
                    <el-input v-model="form.batchNo" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </basic-container>
</template>
  
<script>
import SettlePoOrderApi from '@/api/settlePoOrder/index.js'

export default {
    data() {
        return {
            formData: {},
            form: {},
            dialogVisible: false,
            tableData: [],
            formLabelWidth: '120px',
            searchForm: {
                downloadBtn: {
                    url: "/api/oa-portal/partsPurchaseOrder/exportTemplate",
                    params: {},
                },
                labelWidth: 120,
                column: [
                    {
                        label: "车型",
                        prop: "applyPerson",
                    },
                    "countryReginCode",
                    {
                        label: "零件号",
                        prop: "partsNo",
                    },
                    {
                        label: "结算PO申请编号",
                        prop: "orderApplyNo",
                        type: "input",

                    },
                    {
                        label: "验收申请编号",
                        prop: "acceptApplyNo",
                    },
                    {
                        label: "进仓日",
                        prop: "storageDate",
                        propRange: ["storageDateStart", "storageDateEnd"],
                        type: "daterange",
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",

                    },
                    {
                        label: "出库日",
                        prop: "stockOutDate",
                        propRange: ["stockOutDateStart", "stockOutDateEnd"],
                        type: "daterange",
                        format: "yyyy-MM-dd",
                        valueFormat: "yyyy-MM-dd",
                    },
                    {
                        label: "付款申请编号",
                        prop: "payNo",
                    },
                    {
                        label: "付款状态",
                        prop: "payStatus",
                    },
                    {
                        label: "供应商",
                        prop: "supplierName",
                    },

                ],
            },
            tableColumn: {
                dicUrl: "/api/oa-portal/partsPurchaseOrder/partsPurchaseOrderList",
                column: [
                    {
                        label: "批次号",
                        prop: "batchNo",
                    },
                    {
                        label: "车型",
                        prop: "carModel",
                    },
                    {
                        label: "国家",
                        prop: "countryRegin",
                    },
                    {
                        label: "零件号",
                        prop: "partsNo",
                    },
                    {
                        label: "数量",
                        prop: "countNumber",
                    },
                    {
                        label: "进仓日",
                        prop: "storageDate",
                    },
                    {
                        label: "出库日",
                        prop: "stockOutDate",
                    },
                    {
                        label: "供应商是否开票",
                        prop: "supplierHaveInvoice",
                    },
                    {
                        label: "单价（含税）",
                        prop: "unitPrice",
                    },
                    {
                        label: "总金额（元/含税）",
                        prop: "totalAmount",
                    },
                    {
                        label: "结算PO申请编号",
                        prop: "orderApplyNo",
                    },
                    {
                        label: "验收申请编号",
                        prop: "acceptApplyNo",
                    },
                    {
                        label: "付款申请状态",
                        prop: "payApplyStatus",
                    },
                    {
                        label: "付款状态",
                        prop: "payStatus",
                    },
                    {
                        label: "供应商",
                        prop: "supplierName",
                    },
                    {
                        label: "操作",
                        slotName: "operation",
                        width: 100,
                        fixed: 'right'
                    },
                ],
            },
        };
    },
    created() {
    },
    methods: {
       
        handleOpenDialog(row) {
            this.form = row
            this.dialogVisible = true
        },
        handleClose() {
            this.dialogVisible = false
        },
        async confirm() {
            let res = await SettlePoOrderApi.update(this.form)
            // console.log(res)
            if(res.data.code===0||res.data.code===200){
                this.dialogVisible = false
                this.$refs.TableForm.refresh()
            }
        }
    },
};
</script>
  
<style scoped lang="scss"></style>
  