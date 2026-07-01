<template>
    <basic-container>
        <p class="table-title"><span></span>基本信息</p>
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
            <el-form-item label="标题" style="width: 96%">
                <el-input v-model="form.titleName" disabled></el-input>
            </el-form-item>
            <el-form-item label="申请人">
                <el-select v-model="form.applyPerson" disabled>
                    <el-option v-for="item in userList" :key="item.id" :label="item.realName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请部门">
                <el-select v-model="form.applyDept" clearable disabled>
                    <el-option v-for="item in deptList" :key="item.id" :label="item.deptName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请日期">
                <el-input v-model="form.applyDate" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="发票编号">
                <el-input v-model="form.invoiceNo" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="开票说明" style="width: 96%;">
                <el-input type="textarea" v-model="form.applyDesc" clearable disabled></el-input>
            </el-form-item>
            <div class="flex-center">
                <p class="table-title"><span></span>开票信息</p>
                <el-button @click="goToSalesOrderDetail">查看订单</el-button>
                <el-button @click="goToSalesContractDetail">查看合同</el-button>
            </div>
            <el-form-item label="相关发票" label-width="120px" style="width: 96%;">
                <el-select v-model="invoiceId" :disabled="isDetail" @change="getInvoiceRow">
                    <el-option v-for="item in invoiceListDetail" :key="item.id" :label="item.titleName"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="销售类型">
                <el-select v-model="form.salesType" disabled>
                    <el-option v-for="item in saleTypeList" :key="item.dictKey" :label="item.dictValue"
                        :value="item.dictKey"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="相关合同">
                <el-select v-model="form.salesContractId" disabled @change="salesContractChange">
                    <el-option v-for="item in salesContractList" :key="item.id" :label="item.titleName"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同编号">
                <el-input v-model="form.salesContractNo" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="相关PO订单">
                <el-select @change="salesOrderChange" v-model="form.salesOrderId" clearable disabled>
                    <el-option v-for="item in salesOrderList" :key="item.id" :label="item.orderName"
                        :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单编号">
                <el-input v-model="form.salesOrderNo" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="票据类型" prop="invoiceType">
                <el-select v-model="form.invoiceType" disabled>
                    <el-option v-for="item in invoiceTypeList" :key="item.dictKey" :label="item.dictValue"
                        :value="item.dictKey"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同类型">
                <el-select v-model="form.salesContractType" clearable disabled>
                    <el-option v-for="item in salesContractTypeList" :value="item.dictKey" :key="item.dictKey"
                        :label="item.dictValue"></el-option>
                </el-select>
                <!-- <el-input></el-input> -->
            </el-form-item>
            <el-form-item label="项目名称">
                <el-select @change="projectListChange" v-model="form.projectId" clearable disabled>
                    <el-option v-for="item in projectList" :value="item.id" :key="item.id"
                        :label="item.projectName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目编号">
                <el-input v-model="form.projectNo" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="币种">
                <el-select v-model="form.currency" clearable disabled>
                    <el-option v-for="item in currencyList" :key="item.dictKey" :label="item.dictValue"
                        :value="item.dictKey"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="税率">
                <el-input v-model="form.taxRate" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="本次开票金额">
                <el-input disabled v-model="form.invoicingAmount" clearable></el-input>
            </el-form-item>
            <p class="table-title" style="width: 96%"><span></span>客户信息</p>
            <el-form-item label="客户名称">
                <el-select v-model="form.custId" clearable @change="contractCustChange" disabled>
                    <el-option v-for="item in custList" :value="item.id" :key="item.id" :label="item.custName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="联系人">
                <el-select v-model="form.contactId" clearable disabled @change="getCustChange">
                    <el-option v-for="item in custContactList" :value="item.id" :key="item.id"
                        :label="item.contactName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户编号">
                <el-input v-model="form.custNo" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别号">
                <el-input v-model="form.taxpayerIdentityNumber" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="客户地址、电话">
                <el-input v-model="form.custAddr" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="开户银行">
                <el-input v-model="form.openBank" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="开户账号">
                <el-input v-model="form.bankAccount" clearable disabled></el-input>
            </el-form-item>
            <p class="table-title" style="width: 96%"><span></span>票据信息</p>
            <el-form-item label-width="0" style="width: 100%;">
                <!-- <div class="fr" v-if="!isDetail">
                    <span class="add-icon" @click="addInvoiceInfoRow">+</span>
                    <span class="dec-icon" @click="deleteInvoiceInfoRow">―</span>
                </div> -->
                <el-table ref="multipleTable" :data="form.invoiceInfoList" class="mb20 table-now"
                    @selection-change="invoiceInfoSelectionChange">
                    <el-table-column type="selection" width="42"></el-table-column>
                    <el-table-column label="开票品名">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.itemDesc" disabled></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="零件号">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.partsNo" disabled></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="单位">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.unitName" disabled></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="销售价格">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.unitPrice" disabled></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="激活数/出货数">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.quantity" disabled></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="销售总价">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.amount" disabled></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <p class="table-title" style="width: 96%"><span></span>其他信息</p>
            <!-- {{ form.salesType }} -->
            <el-form-item label="相关附件" style="width: 96%"
                :required="form.salesType === 'license' || form.invoiceType === '1'">
                <upload disabled :fileList="form.fileList" btnName="上传" @handleRequest="handleRequest" :multiple="true"
                    :showFileList="true"></upload>
            </el-form-item>
            <el-form-item label="PAN:">
                <el-input type="input" v-model="form.pan" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="GSTIN:">
                <el-input type="input" v-model="form.gstin" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="Remarks(Left)">
                <el-input type="textarea" v-model="form.remarkLeft" clearable disabled></el-input>
            </el-form-item>
            <el-form-item label="Remarks">
                <el-input type="textarea" v-model="form.remark" clearable disabled></el-input>
            </el-form-item>
            <p class="table-title" style="width: 96%"><span></span>其他信息</p>
            <el-form-item label="相关附件" prop="fileList" :required="otherFileRequest" style="width: 96%">
                <upload :disabled="true" :isHistory="isHistory" :fileList="form.fileList" btnName="上传"
                    @handleRequest="handleRequest" :multiple="true" :showFileList="true"></upload>

            </el-form-item>
            <el-form-item label="备注" style="width: 96%">
                <div>{{ form.remark }}</div>
            </el-form-item>
            <p class="table-title" style="width: 96%"><span></span>发票更新信息</p>
            <el-form-item label-width="0" style="width: 100%;">
                <div class="fr" v-if="!isDetail">
                    <span class="add-icon" @click="addInvoiceUpdateRow">+</span>
                    <span class="dec-icon" @click="deleteInvoiceUpdateRow">―</span>
                </div>
                <el-table ref="multipleTable" :data="remarks" class="mb20 table-now"
                    @selection-change="remrkSelectionChange">
                    <el-table-column type="selection" width="42"></el-table-column>
                    <el-table-column label="更改类型">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.changeType" :disabled="isDetail">
                                <el-option label="基本信息" value="基本信息"></el-option>
                                <el-option label="开票信息" value="开票信息"></el-option>
                                <el-option label="客户信息" value="客户信息"></el-option>
                                <el-option label="票据信息" value="票据信息"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="内容">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.remark" type="textarea" :disabled="isDetail"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </basic-container>
    <!--  </div>-->
</template>
<script>
import upload from "@/components/upload/index";
import { toJpeg } from "html-to-image";
import print from "print-js";
import InvoiceSet from "@/views/billManage/poOrder/invoiceSet";
import { invoiceDetail, invoiceStartProcess, getSalesOrderList, getCustContactList, getTaskHis, saveInvoice, invoiceUpdateDetail } from "@/api/billManage/poOrder";
import { getDictionary } from "@/api/system/dict";
import { getSalesContractList } from "@/api/contract/salesContractNew";
import { getProjectList } from "@/api/contract/contractProject";
import { getCustList } from "@/api/contract/contractCustomer";
import { userList } from "@/api/contract/bomMaint";
import { getLazyList } from "@/api/organizationalStructure/department";
import { mapGetters } from "vuex";
import { getFormatDate } from '@/util/util'
import { getDept } from "@/api/organizationalStructure/department";
import { invoiceList } from '@/api/contract/subscriptionApplication'

export default {
    components: {
        InvoiceSet,
        upload
    },
    data() {
        return {
            comment: null,
            flowList: [],
            salesContractTypeList: [],
            invoiceListDetail: [],
            reverse: true,
            invoiceSet: false,
            activeName: "first",
            saleTypeList: [],
            salesContractList: [],
            salesOrderList: [],
            invoiceTypeList: [],
            projectList: [],
            currencyList: [],
            custList: [],
            custContactList: [],
            userList: [],
            deptList: [],
            isDetail: false,
            invoiceInfoMultipleSelection: [],
            timeout: null,
            invoiceId: null,
            invoiceName: null,
            form: {
                titleName: null,
                applyPerson: null,
                applyDept: null,
                applyDate: null,
                invoiceNo: null,
                applyDesc: null,
                salesType: null,
                salesContractId: null,
                salesContractNo: null,
                salesOrderId: null,
                salesOrderNo: null,
                projectName: null,
                salesOrderName: null,
                invoiceType: null,
                salesContractType: null,
                salesContractName: null,
                projectId: null,
                projectNo: null,
                currency: null,
                taxRate: null,
                invoicingAmount: null,
                custId: null,
                contactId: null,
                custNo: null,
                taxpayerIdentityNumber: null,
                custAddr: null,
                openBank: null,
                bankAccount: null,
                fileList: [],
                updateList: [{}],
                pan: null,
                gstin: null,
                remarkLeft: null,
                remark: null,
                invoiceInfoList: [
                    {
                        itemDesc: null,
                        partsNo: null,
                        unitName: null,
                        unitPrice: null,
                        quantity: null,
                        amount: null,
                        key: Date.now(),
                    },
                ],
            },
            remarks: [
                {
                    "changeType": "",
                    "remark": ""
                }
            ],
            multipleRemark: []
        };
    },
    computed: {
        ...mapGetters(["userInfo", "isMobile"]),
        total() {
            const invoiceInfoList = this.form.invoiceInfoList.map((item) =>
                Number(item.amount)
            );
            return invoiceInfoList.reduce((pre, cur) => pre + cur, 0);
        },
        disabled() {
            return this.$route.query.businessId && !this.$route.query.isEdit
        }
    },
    created() {
        this.init();
    },
    methods: {
        //流程
        handleClick() {
            if (this.form.id) {
                this.processInstanceId = this.form.processInstanceId;
                this.src = `/api/oa-flow/process/diagram-view?processInstanceId=${this.processInstanceId
                    }&t=${new Date().getTime()}`;
            }
        },
        handlePrint() {
            toJpeg(document.getElementById("print"), { quality: 0.95, width: 980, backgroundColor: '#ffffff' }).then(
                (dataUrl) => {
                    print({
                        printable: dataUrl,
                        type: "image",
                        base64: true,
                        style: `@media print { @page {size: auto; margin: 0; } body{margin:0 5px}}`,
                    });
                }
            );
        },
        init() {
            this.getInvoice()
            this.getDepartment();
            this.form.applyDate = getFormatDate();
            this.form.applyPerson = this.userInfo.user_id;
            this.form.applyPersonName = this.userInfo.nick_name || this.userInfo.realName || this.userInfo.user_name;
            this.form.applyDept = this.userInfo.dept_id;
            const businessId = this.$route.query.businessId;
            this.form.titleName = `发票申请 - ${(this.userInfo.nick_name || this.userInfo.realName || this.userInfo.user_name)} - ${getFormatDate()}`
            if (businessId) {
                this.invoiceDetail();
            }
            this.getDictionary({ code: "CONTRACT_TYPE" }, "saleContractType");
            this.getDictionary({ code: "CURRENCY" }, "currency");
            this.getDictionary({ code: "SALE_TYPE" }, "saleType");
            this.getDictionary({ code: "INVOICE_TYPE" }, "invoiceType");
            this.getSalesContractList({});
            this.getSalesOrderList({});
            this.getProjectList();
            this.getCustList();
            this.getUserList();
            this.getDeptList();
        },
        addInvoiceUpdateRow() {
            this.remarks.push({
                key: new Date()
            })
        },
        async getInvoice() {
            let res = await invoiceList()
            console.log(res)
            this.invoiceListDetail = res.data.data
        },
        getInvoiceRow() {
            let row = this.invoiceListDetail.find(ele => {
                return ele.id === this.invoiceId
            })
            console.log(row)
            this.form = row
            row.fileList = row.fileList || []
        },
        deleteInvoiceUpdateRow() {
            if (this.multipleRemark.length === 0) {
                this.$message.error("请先选择发票更新信息");
                return;
            }
            let ids = this.multipleRemark.map(ele => ele.key)
            this.remarks = this.remarks.filter(ele => {
                return !ids.includes(ele.key)
            })
        },
        invoiceDetail() {
            const businessId = this.$route.query.businessId;
            const salesOrderNo = this.$route.query.salesOrderNo;
            invoiceUpdateDetail({ salesOrderNo, businessId }).then((res) => {
                let data = res.data.data
                this.form = data.oldTbInvoice
                this.remarks = data.remarks
                this.invoiceId = data.invoiceId
                this.invoiceName = data.invoiceName
                this.form.salesContractType = this.form.salesContractType+""
                this.remarks.map((ele, index) => {
                    ele.key = new Date() + index
                })
                if (this.$route.query.isEdit) {
                    this.isDetail = false
                } else {
                    this.isDetail = true
                }

                if (this.form.invoiceType != null) {
                    this.form.invoiceType = this.form.invoiceType.toString()
                }
                console.log("this.form.processInstanceId-->" + this.form.processInstanceId);
                if (this.form.processInstanceId != null) {
                    getTaskHis({ processInstanceId: this.form.processInstanceId }).then(res => {
                        console.log("res.data-->" + JSON.stringify(res));
                        this.flowList = res.data.data;
                    });
                }
                this.$emit('getFormData', this.form)
            });
        },
        salesContractChange() {
            let row = this.salesContractList.find(ele => {
                return ele.id === this.form.salesContractId
            })
            this.form.salesContractType = row.salesContractType
            this.form.salesContractName = row.titleName
            console.log(row)
            this.form.salesContractNo = row.applyNo
        },
        salesOrderChange() {
            let row = this.salesOrderList.find(ele => {
                return ele.id === this.form.salesOrderId
            })
            // console.log(row)
            this.form.salesOrderNo = row.orderNo
            this.form.salesOrderName = row.orderName
        },
        projectListChange() {
            let row = this.projectList.find(ele => {
                return ele.id === this.form.projectId
            })
            // console.log(row)
            this.form.projectNo = row.projectNo
            this.form.projectName = row.projectName
        },
        async getDepartment() {
            if (this.detailId) return
            let res = await getDept(this.userInfo.dept_id || this.userInfo.deptId);
            this.form.createDeptName = res.data.data.deptName;
        },
        goToSalesContractDetail() {
            if (!this.form.salesContractId) return
            this.$router.push({
                path: "/saleContractApplication",
                query: {
                    businessId: this.form.salesContractId,
                },
            });
        },
        goToInvoiceView() {
            this.$router.push({
                path: "/billManage/poOrder/invoiceView",
                query: {
                    businessId: this.form.id,
                },
            });
        },
        goToSalesOrderDetail() {
            this.$router.push({
                path: "/billManage/poOrder/add",
                query: {
                    id: this.form.salesOrderId,
                },
            });
        },
        invoiceSetClose(data) {
            this.invoiceSet = false;
            if (data) this.init();
        },
        getDictionary(params, type) {
            getDictionary(params).then((res) => {
                if (type === "currency") {
                    this.currencyList = res.data.data;
                } else if (type === "saleType") {
                    this.saleTypeList = res.data.data;
                } else if (type === "invoiceType") {
                    this.invoiceTypeList = res.data.data;
                } else if (type === "saleContractType") {
                    this.salesContractTypeList = res.data.data;
                }
            });
        },
        getSalesContractList(params) {
            getSalesContractList(params).then((res) => {
                this.salesContractList = res.data.data;
            });
        },
        getSalesOrderList(params) {
            getSalesOrderList(params).then((res) => {
                this.salesOrderList = res.data.data;
            });
        },
        getProjectList() {
            getProjectList({}).then((res) => {
                this.projectList = res.data.data;
            });
        },
        getCustChange() {
            let row = this.custContactList.find(ele => {
                return ele.id === this.form.contactId
            })
            this.form.contactName = row.contactName
            // console.log(row)
        },
        getCustList() {
            getCustList({}).then((res) => {
                this.custList = res.data.data;
                this.custList.forEach((item) => {
                    if (this.form.custId == item.id) {
                        this.form.custNo = item.custNo;
                        this.form.taxpayerIdentityNumber = item.taxpayerIdentityNumber;
                        this.form.custAddr = item.custAddr;
                        this.form.openBank = item.openBank;
                        this.form.bankAccount = item.bankAccount;
                        getCustContactList({ id: item.id }).then((res) => {
                            this.custContactList = res.data.data;
                        });
                    }
                })
            });
        },
        getUserList() {
            userList(this.tenantId).then((res) => {
                this.userList = res.data.data;
            });
        },
        getDeptList() {
            getLazyList(this.parentId, this.tenantId).then((res) => {
                this.deptList = res.data.data;
            });
        },
        handleRequest(data, list) {
            this.form.fileList = list;
            this.form.fileList.forEach((file) => {
                delete file.status
            });
        },
        addInvoiceInfoRow() {
            this.form.invoiceInfoList.push({
                key: Date.now(),
            });
        },
        deleteInvoiceInfoRow() {
            if (this.invoiceInfoMultipleSelection.length === 0) {
                this.$message.error("请先选择票据信息");
                return;
            }
            let keys = this.invoiceInfoMultipleSelection.map((ele) => ele.key);
            let ids = this.invoiceInfoMultipleSelection.map((ele) => ele.id);
            this.form.invoiceInfoList = this.form.invoiceInfoList.filter((ele) => {
                return !keys.includes(ele.key) || !ids.includes(ele.id);
            });
        },
        invoiceInfoSelectionChange(val) {
            this.invoiceInfoMultipleSelection = val;
        },
        remrkSelectionChange(val) {
            this.multipleRemark = val
        },
        contractCustChange(val) {
            console.log("val-->" + val);
            console.log("custList-->" + JSON.stringify(this.custList));
            this.custList.forEach((item) => {
                if (val == item.id) {
                    this.form.custNo = item.custNo;
                    this.form.taxpayerIdentityNumber = item.taxpayerIdentityNumber;
                    this.form.custAddr = item.custAddr;
                    this.form.openBank = item.openBank;
                    this.form.bankAccount = item.bankAccount;
                    this.form.custName = item.custName
                    // this.form.contactId = item.contactId
                    this.form.contactName = item.contactName
                }
            });
            getCustContactList({ id: val }).then((res) => {
                this.custContactList = res.data.data;
            });
        },
        saveInvoice() {
            saveInvoice(this.form).then((res) => {
                if (res.data.success) {
                    this.$message.success(res.data.message);
                } else {
                    this.$message.error(res.data.message);
                }
            });
        },
        testForm() {
            let deepForm = JSON.parse(JSON.stringify(this.form))

            return new Promise((resolve) => {
                this.$refs.form.validate((valid, msg) => {
                    this.form = {}
                    this.form.oldTbInvoice = deepForm
                    this.form.invoiceId = this.invoiceId
                    this.form.invoiceName = deepForm.titleName
                    this.form.remarks = this.remarks
                    resolve(valid);
                    if (valid) {
                    } else {
                        this.$message.error(Object.values(msg)[0][0].message);
                    }
                });
            });

        }
    },
};
</script>
<style scoped lang="scss">
.el-form {
    display: flex;
    flex-wrap: wrap;

    .el-form-item {
        width: 48%;
        margin-left: 5px;
    }
}

.invoice-box {
    font-size: 12px;
    width: 795px;
    margin: 0 auto 50px;
}

.el-form-item {
    width: 48%;
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
        line-height: 20px;
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
