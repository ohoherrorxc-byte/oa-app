<template>
    <div class="pt20" v-if="!isPdfDown">
        <el-row>
            <el-col span="8"> <el-form-item  :label="$t('purchaseRecommend.assessmentDept')">
                    {{ formData.assessorDeptName }}
                </el-form-item></el-col>
            <el-col span="7"> <el-form-item :label="$t('purchaseRecommend.assessor')">
                    {{ formData.supplierAssessorName }}
                </el-form-item></el-col>
            <el-col span="7"> <el-form-item :label="$t('purchaseRecommend.assessmentDate')">
                    {{ formData.assessorDate }}
                </el-form-item></el-col>
            <el-col span="2">
                <div class="fr">
                    <el-button v-if="!disabled" type="success" @click="addRow">{{ $t('commonContent.add') }}</el-button>
                </div>
            </el-col>
        </el-row>
        <el-table :data="tableData" style="width: 100%" :key="key" :class="{ 'table-now': isPdfDown, 'w-100': !isPdfDown }">
            <el-table-column :width="isPdfDown ? 50 : ''">
                <template slot-scope="scope">
                    <div v-if="scope.$index < tableData.length - 1">
                        {{ scope.$index + 1 }}
                    </div>
                    <div v-else>
                        {{ $t('technicalEvaluation.assessmentResult') }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="province" align="center" :label="$t('technicalEvaluation.evaluationItem')" :width="isPdfDown ? 80 : ''">
                <template slot-scope="scope">
                    <el-form-item>
                        <el-input v-if="!disabled && scope.$index < tableData.length - 1"
                            v-model="scope.row.itemName"></el-input>
                        <div v-else>{{ scope.row.itemName }}</div>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="item" v-for="(item, supplyIndex) in mySupplyList">
                <el-table-column prop="province" align="center" :label="$t('technicalEvaluation.isSatisfied')" :width="isPdfDown ? 80 : ''">
                    <template slot-scope="scope">
                        <el-form-item>
                            <el-switch v-if="!disabled"
                                v-model="scope.row.purchaseSupplierEvalResultSecondList[supplyIndex].isSatisfyName"
                                active-color="#13ce66">
                            </el-switch>
                            <div v-else>{{ scope.row.purchaseSupplierEvalResultSecondList[supplyIndex].isSatisfyName ? "是" :
                                "否"
                            }}
                            </div>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="address" align="center" :label="$t('commonContent.remarks')">
                    <template slot-scope="scope">
                        <el-form-item>

                            <el-input v-if="!disabled"
                                v-model="scope.row.purchaseSupplierEvalResultSecondList[supplyIndex].remark"></el-input>
                            <div v-else>{{ scope.row.purchaseSupplierEvalResultSecondList[supplyIndex].remark }}</div>
                        </el-form-item>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column prop="address" align="center" :label="$t('commonContent.operation')" v-if="!disabled">
                <template slot-scope="scope">
                    <el-button v-if="scope.$index < tableData.length - 1" @click="delRow(scope.row, scope.$index)"
                        type="text" class="red">{{ $t('commonContent.delete') }}</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            row: {
                key: null,
                itemName: null,
                purchaseSupplierEvalResultSecondList: [
                    {
                        remark: null,
                        isSatisfyName: false
                    },
                    {
                        remark: null,
                        isSatisfyName: false
                    },
                    {
                        remark: null,
                        isSatisfyName: false
                    }
                ]
            },
            tableData: [],
            isStart: true,
            mySupplyList: [],
            deepList: []
        }
    },
    props: {
        supplyList: {
            type: Array,
            default: []
        },
        formData: {
            type: Object,
            default: {}
        },
        disabled: {
            type: Boolean,
            default: false
        },
        isPdfDown: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        formData() {
            if (this.formData.id) {
                this.tableData = this.formData.purchaseSupplierEvalItemSecondList
                this.deepList = JSON.parse(JSON.stringify(this.tableData))
            }
        },
        supplyList() {
            this.mySupplyList = this.supplyList
            if (!this.isStart) {
                this.tableData = JSON.parse(JSON.stringify(this.deepList))
            }
        }
    },
    mounted() {
        ["1", "2"].map(ele => {
            let deepRow = JSON.parse(JSON.stringify(this.row))
            deepRow.key = new Date() + ele
            this.tableData.push(deepRow)
            this.deepList = JSON.parse(JSON.stringify(this.tableData))
        })
        setTimeout(() => {
            this.isStart = false
        }, 10000);
    },
    methods: {
        updateSupply(key, index) {
            this.deepList = JSON.parse(JSON.stringify(this.tableData))
            if (key === 'del') {
                this.deepList.map(ele => {
                    ele.purchaseSupplierEvalResultSecondList.splice(index, 1)
                })

            } else if (key === 'add') {
                this.deepList.map(ele => {
                    ele.purchaseSupplierEvalResultSecondList.push({
                        remark: null, isSatisfyName: false, supplierName: null
                    })
                })
            }
            this.tableData = JSON.parse(JSON.stringify(this.deepList))
        },
        addRow() {
            let deepRow = JSON.parse(JSON.stringify(this.row))
            deepRow.purchaseSupplierEvalResultSecondList = []
            this.mySupplyList.map(ele => {
                deepRow.purchaseSupplierEvalResultSecondList.push({
                    remark: null,
                    isSatisfyName: false
                })
            })
            deepRow.key = new Date()
            this.tableData.splice(this.tableData.length - 1, 0, deepRow)
        },
        delRow(row, index) {
            this.tableData.splice(index, 1)
        }
    }
}
</script>

<style>
.red {
    color: red;
}
</style>