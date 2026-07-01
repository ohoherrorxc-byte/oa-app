<template>
    <div>
        <basic-container>
            <span>{{ $t('trainingApplication.trainingInfo') }}</span>
            <avue-form ref="formBaseInfo" :option="option" v-model="form">
                <template slot-scope="{disabled}" slot="attendeesIds">
                    <autoAddress placeholder="" ref="autoAddress" :initList="form.attendees" class="w-100"
                        @getPerson="getPerson" valueKey="userId" :initData="form.attendeesIds" :disabled="disabled"
                        :multiple="true"></autoAddress>
                </template>
            </avue-form>
        </basic-container>
        <basic-container>
            <span class="pb10">{{ $t('trainingApplication.costInfo') }}</span>
            <div class="fr pb10" v-if="!disabled">
                <span class="add-icon" @click="addRow">+</span>
            </div>
            <el-form ref="form" :rules="rules" :model="form" :disabled="disabled">
                <el-form-item>
                    <el-table ref="multipleTable" :data="form.tbTrainingCostList" :class="{'w-720':isPdfDown,'w-100':!isPdfDown}" class="mb20 table-now">
                        <el-table-column type="index" width="50" label="序号"></el-table-column>
                        <el-table-column label="费用名称" align="center">
                            <template slot="header">
                                {{ $t('trainingApplication.costName') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;"
                                    :prop="'tbTrainingCostList.' + scope.$index + '.costName'" :rules="rules.costName">
                                    <el-input  clearable v-model="scope.row.costName"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="费用金额" align="center">
                            <template slot="header">
                                {{ $t('trainingApplication.costAmount') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'tbTrainingCostList.' + scope.$index + '.cost'"
                                    :rules="rules.cost">
                                    <el-input  clearable v-model="scope.row.cost"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="remark" :label="$t('trainingApplication.remark')" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.remark"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('trainingApplication.operation')" align="center" v-if="!disabled">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-button type="text" @click="deleteRow(scope.row)" style="color:red">{{ $t('trainingApplication.delete') }}</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="$t('trainingApplication.totalAmount')" label-width="80px">
                            <div > {{ getTotalAmount() }}</div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="$t('trainingApplication.amountInChinese')" label-width="80px">
                            <div v-if="form.totalAmount"> {{ getChinese() }}</div>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </basic-container>

        <addressBookDialog @getPerson="getPerson" ref="addressBookDialog"></addressBookDialog>
    </div>
</template>

<script>
import addressBookDialog from "@/components/addressBookDialog/index";
import autoAddress from '@/components/autoAddress/index'
import { numberToTraditionalChinese } from '@/util/util'
import { mapGetters } from "vuex";
import TrainingApplicationApi from "@/api/trainingApplication";
export default {
    components: {
        addressBookDialog, autoAddress
    },
    props: {
        disabled: {
            default: false,
        },
        isPdfDown:{
            type: Boolean,
            default:false
        }
    },
    data() {
        return {
            form: {
                tbTrainingCostList: [],
                totalAmount: null

            },
            option: {
                column: [
                    {
                        label: this.$t("trainingApplication.courseName"),
                        span: 24,
                        prop: "courseName",
                        type: "input",
                        row: 2,
                        rules: [
                            {
                                required: true,
                                  message: this.$t("trainingApplication.courseNameRequired"),
                            },
                        ],
                    },
                    {
                        label: this.$t("trainingApplication.trainingInstitutions"),
                        span: 12,
                        prop: "trainingInstitutions",
                        rules: [
                            {
                                required: true,
                                message: this.$t("trainingApplication.trainingInstitutionsRequired"),
                            },
                        ],
                    },
                    {
                        label: this.$t("trainingApplication.courseHours"),
                        span: 12,
                        prop: "courseHours",
                        rules: [
                            {
                                required: true,
                                message: this.$t("trainingApplication.courseHoursRequired"),
                            },
                        ],
                    },
                    {
                        type: "date",
                            label: this.$t("trainingApplication.trainingTime"),
                        span: 12,
                        prop: "trainingTime",
                        rules: [
                            {
                                required: true,
                                message: this.$t("trainingApplication.trainingTimeRequired"),
                            },
                        ],
                    },
                    {
                        type: "input",
                          label: this.$t("trainingApplication.trainingLocation"),
                        span: 12,
                        prop: "trainingLocation",
                        rules: [
                            {
                                required: true,
                                message: this.$t("trainingApplication.trainingLocationRequired"),
                            },
                        ],
                    },
                    {
                        type: "directSuperior",
                        label: this.$t("trainingApplication.attendees"),
                        span: 12,
                        slot: true,
                        prop: "attendeesIds",
                        rules: [
                            {
                                required: true,
                                  message: this.$t("trainingApplication.attendeesRequired"),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t("trainingApplication.numberOfTrainees"),
                        span: 12,
                        prop: "numberOfTrainees",
                        rules: [
                            {
                                required: true,
                                  message: this.$t("trainingApplication.numberOfTraineesRequired"),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t("trainingApplication.lecturer"),
                        span: 12,
                        prop: "lecturer",
                        rules: [
                            {
                                required: true,
                                  message: this.$t("trainingApplication.lecturerRequired"),
                            },
                        ],
                    },
                    {
                        type: "textarea",
                        filterable: true,
                        label: this.$t("trainingApplication.courseObjectives"),
                        span: 24,
                        prop: "courseObjectives",
                        rules: [
                            {
                                required: true,
                                message: this.$t("trainingApplication.courseObjectivesRequired"),
                            },
                        ],
                    },
                    {
                        type: "textarea",
                        label: this.$t("trainingApplication.courseContent"),
                        span: 24,
                        prop: "courseContent",
                        rules: [
                            {
                                required: true,
                                message: this.$t("trainingApplication.courseContentRequired"),
                            },
                        ],
                    },

                ],
                labelPosition: "right",
                labelWidth: 140,
                gutter: 0,
                menuBtn: true,
                submitBtn: false,
                emptyBtn: false,
                emptyText: this.$t("trainingApplication.clear"),
                menuPosition: "center",
                detail: false,
                tabs: false,
                disabled: this.disabled,
                labelSuffix: " ",
            },
            rules: {
                costName: [
                    { required: true, message: this.$t("trainingApplication.costNameRequired"), trigger: "blur" },
                ],
                cost: [
                    { required: true, message: this.$t("trainingApplication.costAmountRequired"), trigger: "blur" },
                ],
            },
        };
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    mounted() {
        this.deepForm = JSON.parse(JSON.stringify(this.form))
        this.businessId = this.$route.query.businessId;

        if (this.businessId) {
            this.getDetail();

        }
    },
    methods: {
        async getDetail() {
            let res = await TrainingApplicationApi.details(this.businessId)
            if (res.data.code === 200 || res.data.code === 0) {
                this.form = res.data.data
                this.form.attendees.map(ele => {
                    ele.realName = ele.userName
                })
                this.form.attendeesIds = this.form.attendees.map(ele => ele.userId)
                this.$emit('getFormData', this.form)
            }
        },
        deleteRow(row){
            this.form.tbTrainingCostList = this.form.tbTrainingCostList.filter(ele=>{
                return ele!==row
            })

        },
        addRow() {
            this.form.tbTrainingCostList.push({})
        },
        getPerson(data) {
            // console.log(data)
            this.form.attendees = []
            this.form.attendeesNames = data.map(ele => ele.realName)
            this.form.attendeesIds = data.map(ele => ele.id)
            data.map(ele => {
                this.form.attendees.push({
                    realName: ele.realName,
                    userId: ele.id,
                    userName: ele.realName
                })
            })
            console.log(this.form.attendees)

        },
        getChinese() {
            return numberToTraditionalChinese(this.form.totalAmount)
        },
        getTotalAmount() {
            let amounts = this.form.tbTrainingCostList.map(ele => Number(ele.cost) || 0)
            if(amounts.length===0)return
            var sum = amounts.reduce(function (prev, curr, idx, arr) {
                return Number(prev || 0) + Number(curr || 0);
            });
            this.form.totalAmount = sum
            return sum
        },
        testForm() {
            return new Promise((resolve) => {
                this.$refs.formBaseInfo.validate((valid, done, msg) => {
                    msg &&
                        this.$message({
                            message: Object.values(msg)[0][0].message,
                            type: "warning",
                        });

                    this.$refs.form.validate((valid1)=>{
                        resolve(valid1&&valid);
                    })
                    // resolve(valid)
                    done();
                });

            });
        },
    },
};
</script>

<style>
.add-icon {
    color: #1d76ff;
    background-color: #deebff;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}

.w100 {
    width: 100%;
}
</style>
