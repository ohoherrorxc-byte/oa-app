<template>
    <div>
        <basic-container>
            <span>申请信息</span>
            <avue-form ref="formBaseInfo" :option="option" v-model="form">
                <template slot-scope="{disabled,size}" slot="tripUser">
                    <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                        @getPerson="getPersonTripUser" :initData="form.tripUser" :disabled="disabled" :multiple="false">
                    </autoAddress>
                </template>
                <template slot="totalPriceOriginal">
                    {{ getOriginalAmountToTal('detailList', 'totalPriceOriginal') }}
                </template>
                <template slot="totalPriceChinese">
                    {{ getRMBAmountToTal('detailList', 'totalPriceOriginal') }}
                </template>
                <template slot="purchaseApplyName">
                    <el-select v-model="form.purchaseApplyId" :disabled="form.havePurchaseApply === '否'"
                        @change="getRelationBill">
                        <el-option v-for="item in purchaseApplyList" :key="item.id" :label="item.titleName"
                            :value="item.id"></el-option>
                    </el-select>
                </template>
                <template slot-scope="{disabled,size}" slot="withTripUser">
                    <autoAddress placeholder="" ref="autoAddress" class="w-100" @getPerson="getPersonWithTripUser"
                        :initData="form.withTripUserIds" :initList="form.withTripUser" :disabled="disabled"
                        :multiple="true">
                    </autoAddress>
                </template>
            </avue-form>
            <el-form ref="form" :model="form" :disabled="disabled" :rules="rules">
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow">+</span>
                    </div>
                    <el-table ref="multipleTable" :data="form.detailList" @selection-change="handleSelectionChange"
                        class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column property="startTime" label="品名" align="center">
                            <template slot="header">
                                品名
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'detailList.' + scope.$index + '.startTime'" :rules="rules.startTime">
                                    <el-input></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="endTime" label="详述及技术性能" align="center">
                            <template slot="header">
                                详述及技术性能
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'detailList.' + scope.$index + '.endTime'" :rules="rules.endTime">
                                    <el-input></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="tripPlace" label="单位" align="center">
                            <template slot="header">
                                单位
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'detailList.' + scope.$index + '.tripPlace'"
                                    :rules="rules.tripPlace">
                                    <el-input></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" property="startPlace" align="center">
                            <template slot="header">
                                数量
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'detailList.' + scope.$index + '.startPlace'"
                                    :rules="rules.startPlace">
                                    <el-input v-model="scope.row.startPlace"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="amount" label="验收金额（原币）" align="center" width="140">
                            <template slot="header">
                                验收金额（原币）
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'detailList.' + scope.$index + '.amount'"
                                    :rules="rules.amount">
                                    <el-input clearable v-model="scope.row.totalPriceOriginal"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="tripUtil" label="验收金额（RMB）" align="center" width="140">
                            <template slot="header">
                                验收金额（RMB）
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'detailList.' + scope.$index + '.tripUtil'"
                                    :rules="rules.tripUtil">
                                    {{ getRMBAmount(scope.row.totalPriceOriginal,scope) }}
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" v-if="!disabled">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-button type="text" @click="deleteRow(scope.row)" style="color:red">删除</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
        </basic-container>
    </div>
</template>

<script>
import autoAddress from '@/components/autoAddress/index'
import { mixinsAmount } from '@/mixins/amount'
import { mapGetters } from 'vuex'
import PurchaseApplyApi from "@/api/purchaseApply/index";
export default {
    mixins: [mixinsAmount],
    components: {
        autoAddress
    },
    props: {
        slotForm: {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            isEdit: false,
            form: {
                detailList: [],
                budgetInfo: {},
                costId: null,
                withTripUser: []
            },
            purchaseApplyList: [],
            deptProps: {
                label: "subjectName",
                value: "id",
                children: "childList",
            },
            searchForm: {
                currentPage: 1,
                pageSize: 10000,
            },
            formPay: {},
            option: {
                column: [
                    {
                        type: "select",
                        label: "项目名称",
                        span: 12,
                        prop: "subjectName",
                        dicData: [
                            {
                                label: '服务验收',
                                value: '服务验收'
                            },
                            {
                                label: '货物验收',
                                value: '货物验收'
                            },
                        ],
                        rules: [
                            {
                                required: true,
                                message: "预算科目不能为空",
                            },
                        ],
                    },
                    {
                        type: "select",
                        label: "项目编号",
                        span: 12,
                        prop: "",
                        dicData: [
                            {
                                label: '一般合同验收',
                                value: '一般合同验收'
                            },
                            {
                                label: 'BOM框架验收',
                                value: 'BOM框架验收'
                            },
                            {
                                label: '其他验收',
                                value: '其他验收'
                            },
                        ],
                        rules: [
                            {
                                required: true,
                                message: "成本中心不能为空",
                            },
                        ],
                    },
                    {
                        type: "input",

                        label: "相关合同",
                        span: 12,
                        prop: "subjectCode",
                    },
                    {
                        type: "input",
                        label: "合同编号",
                        disabled: true,
                        span: 12,
                        prop: "budgetInfo",
                    },
                    {
                        type: "input",
                        label: "币种",
                        span: 24,
                        prop: "tripUser",
                        rules: [
                            {
                                required: true,
                                message: "验收人不能为空",
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: "汇率",
                        span: 12,
                        prop: "purchaseApplyName",
                    },
                    {
                        type: "input",
                        label: "合同总金额",
                        span: 12,
                        prop: "tripCountry",
                        rules: [
                            {
                                required: true,
                                message: "出访国家不能为空",
                            },
                        ],
                    },
                    {
                        type: "select",
                        label: "合同已付金额",
                        span: 24,
                        prop: "tripTask",
                        dicData: [
                            {
                                label: '培训',
                                value: '培训'
                            },
                            {
                                label: '验收',
                                value: '验收'
                            },
                            {
                                label: '会议',
                                value: '会议'
                            },
                            {
                                label: '考察',
                                value: '考察'
                            },
                            {
                                label: '其他',
                                value: '其他'
                            },
                        ],
                        rules: [
                            {
                                required: true,
                                message: "出差任务不能为空",
                            },
                        ],
                    },
                    {
                        type: "select",
                        label: "合同剩余金额",
                        span: 12,
                        valueFormat: 'yyyy-MM-dd',
                        prop: "startTime",
                        change: this.changeTime,
                        rules: [
                            {
                                required: true,
                                message: "出差开始时间不能为空",
                            },
                        ],
                    },
                    {
                        type: "select",
                        label: "本次付款金额",
                        span: 12,
                        valueFormat: 'yyyy-MM-dd',
                        prop: "endTime",
                        change: this.changeTime,
                        rules: [
                            {
                                required: true,
                                message: "出差结束时间不能为空",
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: "合同总金额",
                        span: 12,

                        disabled: true,
                        prop: "totalDay",
                    },
                    {
                        type: "input",
                        label: "汇率",
                        span: 12,
                        prop: "exchangeRate",
                    },
                    {
                        type: "input",
                        label: "合同编号",
                        span: 24,

                        disabled: true,
                        prop: "totalDay",
                    },
                    {
                        type: "input",
                        label: "合同总金额（原币）",
                        span: 12,

                        disabled: true,
                        prop: "totalDay",
                    },
                    {
                        type: "input",
                        label: "合同总金额（RMB）",
                        span: 12,

                        disabled: true,
                        prop: "totalDay",
                    },
                    {
                        type: "input",
                        label: "累计验收金额（原币）",
                        span: 12,

                        disabled: true,
                        prop: "totalDay",
                    },
                    {
                        type: "input",
                        label: "累计验收金额（RMB）",
                        span: 12,

                        disabled: true,
                        prop: "totalDay",
                    },
                    {
                        type: "input",
                        label: "累计验收合计（原币）",
                        span: 12,

                        disabled: true,
                        prop: "totalPriceOriginal",
                    },
                    {
                        type: "input",
                        label: "累计验收合计（RMB）",
                        span: 12,

                        disabled: true,
                        prop: "totalPriceChinese",
                    },
                    {
                        type: "input",
                        label: "验收单编号",
                        span: 12,

                        disabled: true,
                        prop: "totalDay",
                    },

                ],
                labelPosition: "right",
                labelWidth: 160,
                gutter: 0,
                menuBtn: true,
                submitBtn: false,
                emptyBtn: false,
                emptyText: "清空",
                menuPosition: "center",
                detail: false,
                tabs: false,
                disabled: this.disabled,
                labelSuffix: " ",
            },
            rules: {
                startTime: [
                    { required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'change' }
                ],
                tripPlace: [
                    { required: true, message: '请选择出差地', trigger: 'change' }
                ],
                startPlace: [
                    { required: true, message: '请输入起始地', trigger: 'blur' }
                ],
                endPlace: [
                    { required: true, message: '请输入目的地', trigger: 'blur' }
                ],
                tripUtil: [
                    { required: true, message: '请输入交通工具', trigger: 'blur' }
                ],
            },
            subjectList: []
        }
    },
    mounted() {
        this.form.budgetInfo = '可用预算:  0.00\n已发生费用:  0.00\n审批中费用:  0.00'
        this.businessId = this.$route.query.businessId;
        this.isEdit = this.$route.query.isEdit;
        if (this.businessId) {
            this.getDetail();
            this.option.disabled = this.disabled
        }
        this.getPurchaseApplyList()
    },
    computed: {
        ...mapGetters(["isMobile"]),
        disabled() {
            return this.businessId && !this.isEdit;
        },
    },
    methods: {
        async getDetail() {
            let res = await FinancialManagementApi.onBusinessTripDetails(this.businessId);
            if (res.data.code === 200) {
                this.form = res.data.data;
                this.$emit("getFormData", this.form);
                this.form.withTripUser = this.form.withTripUser || []
                this.form.withTripUser.map(ele => {
                    ele.id = ele.userId
                    ele.realName = ele.userName
                })
                let ids = this.form.withTripUser.map(ele => ele.id || ele.userId)
                this.$set(this.form, 'withTripUserIds', ids)
                this.getFeeDetail()
            }
        },
        async getPurchaseApplyList() {
            let res = await PurchaseApplyApi.selectList();
            if (res.data.code === 200) {
                this.purchaseApplyList = res.data.data;
            }
        },
        handleNodeClick(a) {
        },
        addRow() {
            this.form.detailList.push({})
        },
        deleteRow(row) {
            this.form.detailList = this.form.detailList.filter(ele => { return ele !== row })
        },
        getPersonTripUser(data) {
            this.form.tripUserId = data.id
            this.form.tripUser = data.realName
        },
        getPersonWithTripUser(data, arr) {
            let deepArr = JSON.parse(JSON.stringify(arr))
            this.form.withTripUser = []
            deepArr.map(ele => {
                this.form.withTripUser.push({ userName: ele.realName, userId: ele.id, id: ele.id, realName: ele.realName })
            })
            this.form.withTripUserIds = deepArr.map(ele => ele.id)
        },
        changeRow(row) {
            const diffDay = getDateDifference(row.startTime, row.endTime)
            if (diffDay < 0) {
                this.$message.error('开始时间不得大于结束时间')
                return false
            }
            return true
        },
        changeTime(e) {
            this.form[e.column.prop] = e.value
            if (this.form.startTime && this.form.endTime) {
                const diffDay = getDateDifference(this.form.startTime, this.form.endTime)
                if (diffDay < 0) {
                    this.$message.error('出差开始时间不得大于出差结束时间')
                    return
                }
                this.form.totalDay = diffDay
            } else {
                this.form.totalDay = 0
            }
        },
        testForm() {
            if (!this.slotForm.titleName) {
                this.$message.error('请输入标题')
                return false
            } else if (!this.slotForm.applyReason) {
                this.$message.error('请输入申请事由')
                return false
            }
            let timeTest = this.changeRow(this.form)
            if (!timeTest) return false
            for (const row of this.form.detailList) {
                if (!this.changeRow(row)) {
                    return false
                }
            }
            return new Promise((resolve) => {
                this.$refs.formBaseInfo.validate((valid, done, msg) => {
                    msg &&
                        this.$message({
                            message: Object.values(msg)[0][0].message,
                            type: "warning",
                        });
                    this.$refs.form.validate((validForm) => {
                        resolve(valid && validForm);
                    })
                    done();
                });
            });
        }
    }
}
</script>

<style>
.add-icon {
    color: #1D76FF;
    background-color: #DEEBFF;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}
</style>