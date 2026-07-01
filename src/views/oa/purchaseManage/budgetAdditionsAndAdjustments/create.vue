<template>
    <div>
        <basic-container>
            <span>申请信息</span>
            <avue-form ref="formBaseInfo" :option="option" v-model="form"></avue-form>
            <el-form ref="form" v-model="form" :rules="rules">
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow">+</span>
                    </div>
                    <el-table ref="multipleTable" :data="form.partBasicDtoList" @selection-change="handleSelectionChange"
                        class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" width="50" label="序号">
                        </el-table-column>
                        <el-table-column property="partsCategory" label="成本中心" align="center">
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
                        <el-table-column property="partName" label="成本代码" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partName'"
                                    :rules="rules.partName">
                                    <el-input clearable v-model="scope.row.partName"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="partNumber" label="预算科目" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.partNumber"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="科目代码" align="center">
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
                        <el-table-column property="partId" label="预算信息" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input clearable v-model="scope.row.partId"></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column lable="调整金额" prop="">
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

            </el-form>
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
                        label: "调整说明",
                        span: 12,
                        prop: "createDeptName",
                    },
                    {
                        type: "input",
                        label: "是否项目相关",
                        span: 12,
                        prop: "createUserName",
                    },
                    {
                        type: "date",
                        label: "相关项目",
                        span: 12,
                        prop: "applyTime",
                    },
                    {
                        type: "input",
                        label: "会签部门",
                        span: 24,
                        prop: "approvalCode",
                    },
                    {
                        type: "input",
                        label: "调整合计",
                        span: 24,
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
}
</style>