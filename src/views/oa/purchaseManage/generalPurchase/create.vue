<template>
    <div>
        <basic-container>
            <span>采购信息</span>
            <avue-form ref="formBaseInfo" :option="option" v-model="form"></avue-form>
        </basic-container>
        <el-form ref="form" v-model="form" :rules="rules">
            <basic-container>
                <span>采购明细</span>
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow">+</span>
                    </div>
                    <el-table ref="multipleTable" :data="form.partBasicDtoList" @selection-change="handleSelectionChange"
                        class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column property="partsCategory" label="相关项目" align="center">
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
                        <el-table-column property="partName" label="项目经理" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partName'"
                                    :rules="rules.partName">
                                    <el-input clearable v-model="scope.row.partName"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="partNumber" label="SORP时间" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.partNumber"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="成本中心" align="center">
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
                        <el-table-column property="partId" label="预算科目" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.partId"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="partsProject" label="科目代码" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.partsProject"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="remark" label="预算信息" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.remark"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="remark" label="品名" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.remark"></el-input>
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
            <basic-container>
                <span>供应商推荐</span>
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow">+</span>
                    </div>
                    <el-table ref="multipleTable" :data="form.partBasicDtoList" @selection-change="handleSelectionChange"
                        class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column property="partsCategory" label="供应商推荐名单" align="center">
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
                        <el-table-column property="partName" label="联系人" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partName'"
                                    :rules="rules.partName">
                                    <el-input clearable v-model="scope.row.partName"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="partNumber" label="联系电话" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.partNumber"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="邮箱" align="center">
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
                        <el-table-column property="partId" label="相关案例" align="center">
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
            <basic-container>
                <span>技术评估</span>
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow">+</span>
                    </div>
                    <el-table ref="multipleTable" :data="form.partBasicDtoList" @selection-change="handleSelectionChange"
                        class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column property="partsCategory" label="公司名称" align="center">
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
                        <el-table-column property="partName" label="报价日期" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partName'"
                                    :rules="rules.partName">
                                    <el-input clearable v-model="scope.row.partName"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="partNumber" label="报价价格（原币）" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.partNumber"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="报价价格（RMB）" align="center">
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
                        <el-table-column property="partId" label="评定结果" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.partId"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="合格/不合格说明" align="center">
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
                        <el-table-column property="partId" label="评定得分" align="center">
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
                    <span style="color: red;">申请部门可根据项目特性自定合格分数线，本文件默认合格分数线为60分。</span>
                </el-form-item>
            </basic-container>

        </el-form>

    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                partBasicDtoList: []
            },
            option: {
                column: [
                    {
                        type: "input",
                        label: "币种",
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
                        label: "汇率",
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
                        label: "金额大写",
                        span: 12,
                        prop: "applyTime",
                    },
                    {
                        type: "input",
                        label: "采购说明",
                        span: 12,
                        prop: "approvalCode",
                    },
                    {
                        type: "select",
                        label: "采购类型",
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
                        label: "使用部门",
                        span: 12,
                        prop: "createUserName",
                    },
                    {
                        type: "date",
                        label: "要求进货日期",
                        span: 12,
                        prop: "createDeptName",
                    },
                    {
                        type: "select",
                        label: "是否紧急采购",
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
                        label: "单一供应商备注说明",
                        span: 12,
                        prop: "approvalCode",
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
}</style>