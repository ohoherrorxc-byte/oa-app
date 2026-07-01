<template>
    <div>
        <basic-container>
            <span>合同信息</span>
            <avue-form ref="formBaseInfo" :option="option" v-model="form"></avue-form>
        </basic-container>
        <el-form ref="form" v-model="form" :rules="rules">
            <basic-container>
                <span>验收明细</span>
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow">+</span>
                    </div>
                    <el-table ref="multipleTable" :data="form.partBasicDtoList" @selection-change="handleSelectionChange"
                        class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column property="partsCategory" label="品名" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;"
                                    :prop="'partBasicDtoList.' + scope.$index + '.partsCategory'"
                                    :rules="rules.partsCategory">
                                    <el-select v-model="scope.row.partsCategory" clearable>
                                        <el-option v-for="item in categoriesList" :value="item.dictValue" :key="item.id"
                                            :label="item.dictValue"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="partName" label="详述及技术性能" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partName'"
                                    :rules="rules.partName">
                                    <el-input clearable v-model="scope.row.partName"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="partNumber" label="单位" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.partNumber"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="数量" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;"
                                    :prop="'partBasicDtoList.' + scope.$index + '.storageLocation'"
                                    :rules="rules.storageLocation">
                                    <el-select v-model="scope.row.storageLocation" clearable>
                                        <el-option v-for="item in placeList" :value="item.dictValue" :key="item.id"
                                            :label="item.dictValue"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="partId" label="验收金额" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.partId"></el-input>
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
            </basic-container>
        </el-form>
        <basic-container>
            <span>付款信息</span>
            <avue-form ref="formBaseInfo" :option="optionPay" v-model="formPay"></avue-form>
        </basic-container>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                partBasicDtoList: [],

            },
            formPay: {},
            option: {
                column: [
                    {
                        type: "input",
                        label: "申请金额（原币）",
                        span: 12,
                        prop: "titleName",
                        dicData: [
                            {
                                label: "人民币",
                                value: "资本性采购",
                            },
                            {
                                label: "美元",
                                value: "费用性采购",
                            },
                            {
                                label: "欧元",
                                value: "项目性采购",
                            },
                            {
                                label: "澳大利亚元",
                                value: "其他采购",
                            },
                            {
                                label: "泰铢",
                                value: "特殊权使用费",
                            },
                            {
                                label: "印度卢比",
                                value: "特殊权使用费",
                            }],
                    },
                    {
                        type: "input",
                        label: "金额大写（原币)",
                        span: 12,
                        prop: "createUserName",
                    },
                    {
                        type: "input",
                        label: "金额合计",
                        span: 12,
                        prop: "createDeptName",
                    },
                    {
                        type: "date",
                        label: "申请金额（RMB)",
                        span: 12,
                        prop: "applyTime",
                    },
                    {
                        type: "input",
                        label: "金额大写（RMB）",
                        span: 12,
                        prop: "approvalCode",
                    },
                    {
                        type: "select",
                        label: "申请事由",
                        span: 12,
                        prop: "titleName",
                        dicData: [
                            {
                                label: "资本性采购",
                                value: "资本性采购",
                            },
                            {
                                label: "费用性采购",
                                value: "费用性采购",
                            },
                            {
                                label: "项目性采购",
                                value: "项目性采购",
                            },
                            {
                                label: "其他采购",
                                value: "其他采购",
                            },
                            {
                                label: "特殊权使用费",
                                value: "特殊权使用费",
                            }],
                    },
                    {
                        type: "input",
                        label: "项目名称",
                        span: 12,
                        prop: "createUserName",
                    },
                    {
                        type: "date",
                        label: "项目编号",
                        span: 12,
                        prop: "createDeptName",
                    },
                    {
                        type: "select",
                        label: "相关合同",
                        span: 12,
                        prop: "applyTime",
                        dicData: [
                            {
                                label: "否",
                                value: 0,
                            },
                            {
                                label: "是",
                                value: 1,
                            },],
                    },
                    {
                        type: "input",
                        label: "合同编号",
                        span: 12,
                        prop: "approvalCode",
                    },
                    {
                        type: "date",
                        label: "币种",
                        span: 12,
                        prop: "createDeptName",
                    },
                    {
                        type: "input",
                        label: "汇率",
                        span: 12,
                        prop: "approvalCode",
                    },
                    {
                        type: "date",
                        label: "合同总金额（原币）",
                        span: 12,
                        prop: "createDeptName",
                    },
                    {
                        type: "input",
                        label: "合同已付金额（原币）",
                        span: 12,
                        prop: "approvalCode",
                    },
                    {
                        type: "date",
                        label: "合同剩余金额（原币）",
                        span: 12,
                        prop: "createDeptName",
                    },
                    {
                        type: "input",
                        label: "本次付款金额（原币）",
                        span: 12,
                        prop: "approvalCode",
                    },
                    {
                        type: "date",
                        label: "合同总金额（RMB）",
                        span: 12,
                        prop: "createDeptName",
                    },
                    {
                        type: "input",
                        label: "合同已付金额（RMB）",
                        span: 12,
                        prop: "approvalCode",
                    },
                    {
                        type: "date",
                        label: "合同剩余金额（RMB）",
                        span: 12,
                        prop: "createDeptName",
                    },
                    {
                        type: "input",
                        label: "本次付款金额（RMB）",
                        span: 12,
                        prop: "approvalCode",
                    },
                    {
                        type: "date",
                        label: "相关验收",
                        span: 12,
                        prop: "createDeptName",
                    },
                    {
                        type: "date",
                        label: "是否尾款",
                        span: 12,
                        prop: "createDeptName",
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
                disabled: false,
                labelSuffix: " ",
            },
            optionPay: {
                column: [
                    {
                        type: "input",
                        label: "供应商名称",
                        span: 12,
                        prop: "titleName",
                        dicData: [
                            {
                                label: "人民币",
                                value: "资本性采购",
                            },
                            {
                                label: "美元",
                                value: "费用性采购",
                            },
                            {
                                label: "欧元",
                                value: "项目性采购",
                            },
                            {
                                label: "澳大利亚元",
                                value: "其他采购",
                            },
                            {
                                label: "泰铢",
                                value: "特殊权使用费",
                            },
                            {
                                label: "印度卢比",
                                value: "特殊权使用费",
                            }],
                    },
                    {
                        type: "input",
                        label: "银行开户行",
                        span: 12,
                        prop: "createUserName",
                    },
                    {
                        type: "input",
                        label: "银行账号",
                        span: 12,
                        prop: "createDeptName",
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
                disabled: false,
                labelSuffix: " ",
            },
            rules: {

            }
        }
    },
    methods: {
        addRow() { }
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