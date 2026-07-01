<template>
    <div class="content">
        <basic-container>
            <div style="color: red; font-weight: bold; margin-bottom: 10px;">
                        员工应在出差返回后的60天内及时办理费用报销手续，超过60天，公司不予报销并由员工个人承担。
            </div>
            <span>{{ $t('onBusinessTrip.applyInfo') }}</span>
            <avue-form ref="formBaseInfo" :option="option" v-model="form">
                <template slot-scope="{disabled,size}" slot="tripUser">
                    <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100"
                        @getPerson="getPersonTripUser" :initData="form.tripUser" :disabled="disabled" :multiple="false">
                    </autoAddress>
                </template>
                <!-- <template slot="costName">
                    <el-select disabled v-model="form.costName" @change="getCostItem" :disabled="disabled">
                        <el-option v-for="item in costList" :label="item.costName" :value="item.costName"></el-option>
                    </el-select>
                </template> -->
                <template slot="totalDay">
                    <div>
                        {{ getDay() }} {{ $t('onBusinessTrip.day') }}
                    </div>
                    <!-- <div v-else>
                        {{ }}
                    </div> -->
                </template>
                <template slot="estimatedTotalAmount">
                    <div>
                        {{ getEstimatedTotalAmount() }}
                    </div>
                </template>
                <template slot-scope="{disabled,size}" slot="withTripUser">
                    <autoAddress placeholder="" ref="autoAddress" class="w-100" @getPerson="getPersonWithTripUser"
                        :initData="form.withTripUserIds" :initList="form.withTripUser" :disabled="disabled"
                        :multiple="true">
                    </autoAddress>
                </template>
                <template slot="subjectName" >
                    <elSelectTree v-if="!disabled" @getValue="getSubjetRow" :value="{ name: form.subjectName }" :options="subjectList"
                        :accordion="false" :disabled="disabled" :props="deptProps"></elSelectTree>
                    <div class="font12" v-else>{{ form.subjectName }}</div>
                </template>
                <template slot="subjectCode" >
                    <div class="font12">{{ form.subjectCode }}</div>
                </template>

                <template slot="excessReason" >
                    <div>
                        <div style="color: red; font-size: 12px; margin-bottom: 5px;">
                            如遇特殊情况需报销超标费用时，须在费用发生前通过上汽集团财务服务管理平台公差申请办理申请审批，说明超标原因及金额。
                        </div>
                        <el-input
                            v-model="form.excessReason"
                            type="textarea"
                            :rows="3"
                            placeholder="请详细说明超标原因">
                        </el-input>
                    </div>
                </template>
            </avue-form>
            <el-form ref="form" :model="form" :disabled="disabled" :rules="rules">
                <el-form-item label-width="0">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow">+</span>
                    </div>
                    <el-table ref="multipleTable" :data="form.detailList" @selection-change="handleSelectionChange"
                        class="mb20 " :class="{'w-720':isPdfDown,'w-100':!isPdfDown}" >
                        <el-table-column prop="chooseStatus" type="index"  :label="$t('onBusinessTrip.serialNumber')">
                        </el-table-column>
                        <el-table-column property="startTime" :label="$t('onBusinessTrip.startTime')" align="center" width="150">
                            <template slot="header">
                                {{ $t('onBusinessTrip.startTime') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'detailList.' + scope.$index + '.startTime'" :rules="rules.startTime"
                                    style="width: 100%;">
                                    <el-date-picker v-if="!disabled" @change="changeRow(scope.row)"
                                        value-format="yyyy-MM-dd" v-model="scope.row.startTime" type="date"
                                        :placeholder="$t('onBusinessTrip.chooseDate')" style="width: 100%;">
                                    </el-date-picker>
                                    <div v-else>
                                        {{ scope.row.startTime }}
                                    </div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="endTime" label="结束日期" align="center"  width="150">
                            <template slot="header">
                                {{ $t('onBusinessTrip.endTime') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'detailList.' + scope.$index + '.endTime'" :rules="rules.endTime"
                                    style="width: 100%;">
                                    <el-date-picker v-if="!disabled" @change="changeRow(scope.row)"
                                        value-format="yyyy-MM-dd" style="width: 100%;" v-model="scope.row.endTime"
                                        type="date" :placeholder="$t('onBusinessTrip.chooseDate')">
                                    </el-date-picker>
                                    <div v-else>
                                        {{ scope.row.endTime }}
                                    </div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="tripPlace" label="出差地" align="center"  width="120">
                            <template slot="header">
                                {{ $t('onBusinessTrip.tripPlace') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'detailList.' + scope.$index + '.tripPlace'"
                                    :rules="rules.tripPlace">
                                    <el-select v-if="!disabled" clearable v-model="scope.row.tripPlace">
                                        <el-option label="境内" value="境内"></el-option>
                                        <el-option label="境外" value="境外"></el-option>
                                    </el-select>
                                    <div v-else>
                                        {{ scope.row.tripPlace }}
                                    </div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="起始地" property="startPlace" align="center" width="130">
                            <template slot="header">
                                {{ $t('onBusinessTrip.startPlace') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'detailList.' + scope.$index + '.startPlace'"
                                    :rules="rules.startPlace">
                                    <el-input v-if="!disabled" v-model="scope.row.startPlace"></el-input>
                                    <div v-else>
                                        {{ scope.row.startPlace }}
                                    </div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="endPlace" label="目的地" align="center" width="130">
                            <template slot="header">
                                {{ $t('onBusinessTrip.endPlace') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'detailList.' + scope.$index + '.endPlace'"
                                    :rules="rules.endPlace">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.endPlace"></el-input>
                                    <div v-else>
                                        {{ scope.row.endPlace }}
                                    </div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="tripUtil" label="交通工具" align="center" width="130">
                            <template slot="header">
                                {{ $t('onBusinessTrip.tripUtil') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'detailList.' + scope.$index + '.tripUtil'"
                                    :rules="rules.tripUtil">
                                    <el-select v-if="!disabled" clearable v-model="scope.row.tripUtil">
                                        <el-option label="飞机（公务舱）" value="飞机（公务舱）"></el-option>
                                        <el-option label="飞机（经济舱）" value="飞机（经济舱）"></el-option>
                                        <el-option label="火车（一等座）" value="火车（一等座）"></el-option>
                                        <el-option label="火车（二等座其他）" value="火车（二等座其他）"></el-option>
                                        <el-option label="其他" value="其他"></el-option>
                                    </el-select>
                                    <div v-else>
                                        {{ scope.row.tripUtil }}
                                    </div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="other" :label="$t('onBusinessTrip.other')" align="center" width="130">
                            <template slot-scope="scope">
                                <el-form-item v-if="!disabled" style="width: 100%;">
                                    <el-input clearable v-model="scope.row.other"></el-input>
                                </el-form-item>
                                <div v-else>
                                    {{ scope.row.other }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column property="remark" :label="$t('onBusinessTrip.remark')" align="center" width="130">
                            <template slot-scope="scope">
                                <el-form-item v-if="!disabled" style="width: 100%;">
                                    <el-input clearable v-model="scope.row.remark" type="textarea"></el-input>
                                </el-form-item>
                                <div v-else>
                                    {{ scope.row.remark }}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('onBusinessTrip.operation')" align="center" v-if="!disabled">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-button type="text" @click="deleteRow(scope.row)" style="color:red">{{ $t('onBusinessTrip.delete') }}</el-button>
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
import { getDateDifference } from '@/util/util'
import elSelectTree from '@/components/elSelectTree/index'
// import subjectManageApi from '@/api/subjectManage'
import FinancialManagementApi from '@/api/financialManagement/index'
import { mixins } from '../Mixin'
import { mapGetters } from 'vuex'
export default {
    components: {
        autoAddress, elSelectTree
    },
    props: {
        slotForm: {
            type: Object,
            default: {}
        },
        isPdfDown:{
            type: Boolean,
            default:false
        }
    },
    mixins: [mixins],
    data() {
        return {
            isEdit: false,
            form: {
                detailList: [{}],
                budgetInfo: {},
                costId: null,
                withTripUser: []
            },
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
                        type: "input",
                        label: this.$t('onBusinessTrip.subjectName'),
                        span: 12,
                        prop: "subjectName",
                        rules: [
                            {
                                required: true,
                                message: this.$t('onBusinessTrip.subjectNameRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('onBusinessTrip.costName'),
                        span: 12,
                        disabled: true,
                        prop: "costName",
                        rules: [
                            {
                                required: true,
                                message: this.$t('onBusinessTrip.costNameRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        disabled: true,
                        label: this.$t('onBusinessTrip.subjectCode'),
                        span: 12,
                        prop: "subjectCode",
                    },
                    {

                        type: 'textarea',
                        label: this.$t('onBusinessTrip.budgetInfo'),
                        disabled: true,
                        span: 12,
                        minRows: 4,
                        maxRows: 7,
                        prop: "budgetInfo",
                    },
                    {
                        type: "input",
                        label: this.$t('onBusinessTrip.tripUser'),
                        span: 12,
                        prop: "tripUser",
                        rules: [
                            {
                                required: true,
                                message: this.$t('onBusinessTrip.tripUserRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('onBusinessTrip.withTripUser'),
                        span: 12,
                        prop: "withTripUser",
                    },
                    {
                        type: "input",
                        label: this.$t('onBusinessTrip.tripCountry'),
                        span: 12,
                        prop: "tripCountry",
                        rules: [
                            {
                                required: true,
                                message: this.$t('onBusinessTrip.tripCountryRequired'),
                            },
                        ],
                    },
                    {
                        type: "select",
                        label: this.$t('onBusinessTrip.tripTask'),
                        span: 12,
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
                                message: this.$t('onBusinessTrip.tripTaskRequired'),
                            },
                        ],
                    },
                    {
                        type: "date",
                          label: this.$t('onBusinessTrip.startTime'),
                        span: 12,
                        valueFormat: 'yyyy-MM-dd',
                        prop: "startTime",
                        // change: this.changeTime,
                        rules: [
                            {
                                required: true,
                                message: this.$t('onBusinessTrip.startTimeRequired'),
                            },
                        ],
                    },
                    {
                        type: "date",
                            label: this.$t('onBusinessTrip.endTime'),
                        span: 12,
                        valueFormat: 'yyyy-MM-dd',
                        prop: "endTime",
                        // change: this.changeTime,
                        rules: [
                            {
                                required: true,
                                message: this.$t('onBusinessTrip.endTimeRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('onBusinessTrip.totalDay'),
                        span: 24,

                        disabled: true,
                        prop: "totalDay",
                    },
                    {
                        type: "input",
                        label: "住宿费（预计）",
                        span: 12,
                        prop: "hotelExpense",
                        value: "0",
                    },
                    {
                        type: "input",
                        label: "交通费（预计）",
                        span: 12,
                        prop: "trafficExpense",
                        value: "0",
                    },
                    {
                        type: "input",
                        label: "补贴（预计）",
                        span: 12,
                        prop: "subsidies",
                        value: "0",
                    },
                    {
                        type: "input",
                        label: "其他费用（预计）",
                        span: 12,
                        prop: "otherExpense",
                        value: "0",
                    },
                    {
                        type: "input",
                        label: "超标金额",
                        span: 12,
                        prop: "excessAmount",
                        value: "0",
                    },
                    {
                        type: "input",
                        label: "超标原因",
                        span: 12,
                        prop: "excessReason",
                        value: null,
                    },
                    {
                        type: "input",
                        label: "预计总金额",
                        span: 12,
                        disabled: true,
                        prop: "estimatedTotalAmount",
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
                    { required: true, message: this.$t('onBusinessTrip.startTimeRequired'), trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: this.$t('onBusinessTrip.endTimeRequired'), trigger: 'change' }
                ],
                tripPlace: [
                    { required: true, message: this.$t('onBusinessTrip.tripPlaceRequired'), trigger: 'change' }
                ],
                startPlace: [
                    { required: true, message: this.$t('onBusinessTrip.startPlaceRequired'), trigger: 'blur' }
                ],
                endPlace: [
                    { required: true, message: this.$t('onBusinessTrip.endPlaceRequired'), trigger: 'blur' }
                ],
                tripUtil: [
                    { required: true, message: this.$t('onBusinessTrip.tripUtilRequired'), trigger: 'blur' }
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
        handleNodeClick(a) {
            // console.log(a)tripUser
            // console.log(this.$refs.tree)
            // console.log(this.$refs.tree.$el)
            console.log('handleNodeClick')
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
            console.log(arr)
            console.log(1111111111)
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
        getDay() {
            console.log('3333')
            if (this.form.startTime && this.form.endTime) {
                const diffDay = getDateDifference(this.form.startTime, this.form.endTime)
                // console.log(diffDay)
                if (diffDay < 0) {
                    this.$message.error('出差开始时间不得大于出差结束时间')
                    return
                }
                this.form.totalDay = diffDay+1
                console.log( this.form.totalDay)
            } else {
                this.form.totalDay = null
            }
            return this.form.totalDay
        },
        getEstimatedTotalAmount() {
        console.log('4444444')
                    if (this.form.hotelExpense
                    && this.form.trafficExpense
                    && this.form.subsidies
                    && this.form.otherExpense) {
                        this.form.estimatedTotalAmount = Number(this.form.hotelExpense) + Number(this.form.trafficExpense)+Number(this.form.subsidies)+Number(this.form.otherExpense)
                    } else {
                        this.form.estimatedTotalAmount = 0
                    }
                    return this.form.estimatedTotalAmount
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

<style scoped lang="scss">
.add-icon {
    color: #1D76FF;
    background-color: #DEEBFF;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}

.table-now {
    // width: 100%;
    width: 700px;
}

.content {
    width: 100%;
}</style>
