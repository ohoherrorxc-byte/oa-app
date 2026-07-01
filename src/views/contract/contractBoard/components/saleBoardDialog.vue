<template>
    <el-dialog :title="property.label" :visible.sync="dialogVisible" width="70%" :append-to-body="true">
        <el-form label-width="100px" class="flex">
            <el-form-item label="子列表">
                <el-select v-model="form.custNo" @change="getRow">
                    <el-option v-for="item in selectList" :label="item.custName" :value="item.custNo"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查 询</el-button>
                <el-button @click="clean">清 空</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableList" style="width: 100%" height="500px">
            <el-table-column prop="custNo" label="客户编号" width="100">
            </el-table-column>
            <el-table-column prop="custName" label="客户名称">
            </el-table-column>
            <el-table-column v-if="!isChild" prop="invoicingAmount" :label="tableHead.invoicingAmountTotal">
            </el-table-column>
            <el-table-column v-if="isChild" prop="invoiceNo" :label="tableHead.invoiceNo">
            </el-table-column>
            <el-table-column v-if="isChild" prop="titleName" :label="tableHead.titleName" width="220">
            </el-table-column>
            <el-table-column v-if="isChild" prop="invoicingAmount" :label="tableHead.invoicingAmount">
            </el-table-column>
            <el-table-column v-if="isChild" prop="applyDate" label="申请日期">
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {
    getCustInvoiceAmount
} from "@/api/contract/salesContractNew";
export default {
    data() {
        return {
            dialogVisible: false,
            tableList: [],
            selectList: [],
            originList: [],
            tableHead: {
                invoiceNo: "发票编号",
                titleName: "发票名称",
                invoicingAmount: "发票金额",
                invoicingAmountTotal: "发票总金额"
            },
            isChild: false,
            form: {
                custNo: null
            }
        };
    },
    props: {
        property: {
            type: String,
            default: ""
        }
    },
    methods: {
        async getDetail(column, row) {
            this.isChild = false
            if (column.property === 'collected') {
                this.tableHead = {
                    invoiceNo: "认款单编号",
                    titleName: "认款单名称",
                    invoicingAmount: "认款金额",
                    invoicingAmountTotal: "认款总金额"
                }
            } else if (column.property === 'shouldSignContract') {
                this.tableHead = {
                    invoiceNo: "合同编号",
                    titleName: "合同名称",
                    invoicingAmount: "合同金额"
                }
            } else if (column.property === 'signedContract'||column.property==='shouldOpenInvoice') {
                this.tableHead = {
                    invoiceNo: "合同编号",
                    titleName: "合同名称",
                    invoicingAmount: "合同金额",
                    invoicingAmountTotal: "合同总金额"
                }
            }  else if(column.property === 'openedInvoice'||column.property === 'shouldCollect') {
                this.tableHead = {
                    invoiceNo: "发票编号",
                    titleName: "发票名称",
                    invoicingAmount: "发票金额",
                    invoicingAmountTotal: column.property === 'shouldCollect'?"待认款总金额":"发票总金额"
                }
            }
                this.form.custNo = ''
            //合同-应签未签 shouldSignContract
            //合同-今年已签 signedContract;
            //发票-应开未开 shouldOpenInvoice;
            //发票-今年已开 openedInvoice;
            //收款-应收未收 shouldCollect;
            //收款-今年已收 collected;
            let typeReflect = {
                'NRE': 'nre',
                'License': "license",
                "Hardware": 'hardware',
                "Total": "total"
            }
            let obj = {
                salesType: typeReflect[row.salesType],//hardware,license,nre,total
                businessType: column.property
            }
            let res = await getCustInvoiceAmount(obj)
            if (res.data.code === 0 || res.data.code === 200) {
                this.tableList = res.data.data
                this.originList = JSON.parse(JSON.stringify(res.data.data))
                this.selectList = JSON.parse(JSON.stringify(res.data.data))
                this.selectList = this.selectList.filter(ele => ele.custNo)
                this.selectList.unshift({ custName: "全部", custNo: "" })
            }
        },
        query() {
            this.getRow(this.form.custNo)
        },
        clean() {
            this.form.custNo = ''
            this.getRow(this.form.custNo)
        },
        getRow(v) {
            if (!v) {
                this.tableList = this.originList
                this.isChild = false
                return
            }
            let row = this.selectList.find(ele => {
                return ele.custNo === v
            })
            if (row) {
                this.isChild = true
                this.tableList = row.custInvoiceDetailAmountVOList
            }
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    done();
                })
                .catch(_ => { });
        }
    }
};
</script>