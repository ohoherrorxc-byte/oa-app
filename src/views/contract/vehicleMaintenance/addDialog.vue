<template>
    <el-dialog :visible.sync="vehicleModelDialogFormVisible" append-to-body width="90%">
        <template slot="title">
            <div style="font-size: 15px">{{ dialogTitle }}</div>
        </template>
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
            <el-row>
                <el-col :span="12">
                    <el-form-item prop="modelId">
                        <label slot="label">{{$t('vehicleMaintenance.modelName')}}:</label>
                        <el-select v-model="editForm.modelId" clearable filterable @change="selectModel"
                            :disabled="isShowDetail || isEdit">
                            <el-option v-for="item in modelNameList" :key="item.id" :label="item.modelName"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop="materialNumber">
                        <label slot="label">{{$t('vehicleMaintenance.materialNo')}}:</label>
                        <el-select :disabled="isShowDetail" v-model="editForm.materialNumber" clearable filterable multiple>
                            <el-option v-for="item in modelWithMaterialList" :key="item" :label="item"
                                :value="item"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item prop="countryReginCode">
                        <label slot="label">{{$t('vehicleMaintenance.countryReginCode')}}:</label>
                        <el-select v-model="editForm.countryReginCode" clearable filterable disabled>
                            <el-option v-for="item in areaList" :key="item.dictKey" :label="item.dictValue"
                                :value="item.dictKey"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item>
                        <label slot="label">{{$t('vehicleMaintenance.seriesName')}}:</label>
                        <el-input v-model="editForm.seriesName" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item prop="type">
                        <label slot="label">{{$t('vehicleMaintenance.modelNameConnet')}}:</label>
                        <el-input v-model="editForm.modelTypeName" disabled></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <div class="fr" v-if="!isShowDetail">
                    <span class="add-icon" @click="addBomList">+</span>
                </div>
                <el-col :span="24" class="pt10">
                    <el-table :data="editForm.vehicleMaterialBomList" style="width: 100%">
                        <el-table-column prop="date" :label="$t('vehicleMaintenance.relatedBom')" align="center" width="220">
                            <template slot="header">
                                {{$t('vehicleMaintenance.relatedBom')}}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'vehicleMaterialBomList.' + scope.$index + '.bomId'"
                                    :rules="editFormRules.bomId" style="width: 100%;" label-width="0px">
                                    <el-select :disabled="isShowDetail" style="width: 100%" v-model="scope.row.bomId"
                                        clearable filterable @change="selectBom(scope.row.bomId, scope)">
                                        <el-option v-for="item in bomList" :key="item.id" :label="item.bomName"
                                            :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="bomType" :label="$t('vehicleMaintenance.bomType')" align="center" width="80">
                        </el-table-column>
                        <el-table-column prop="costCny" :label="$t('vehicleMaintenance.costCny')" align="center" width="80">
                        </el-table-column>
                        <el-table-column prop="offenders" :label="$t('vehicleMaintenance.offenders')" align="center" width="80">
                        </el-table-column>
                        <el-table-column prop="contractPrice" :label="$t('vehicleMaintenance.contractPrice')" align="center" width="80">
                        </el-table-column>
                        <el-table-column prop="name" :label="$t('vehicleMaintenance.sopTime')" align="center">
                            <template slot="header">
                                {{$t('vehicleMaintenance.sopTime')}}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'vehicleMaterialBomList.' + scope.$index + '.sopTime'"
                                    :rules="editFormRules.sopTime" style="width: 100%;" label-width="0px">
                                    <el-date-picker style="width: 100%" v-model="scope.row.sopTime" type="date"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        :disabled="isShowDetail"></el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" label="eop有效期" align="center">
                            <template slot="header">
                                {{$t('vehicleMaintenance.eopTime')}}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'vehicleMaterialBomList.' + scope.$index + '.eopTime'"
                                    :rules="editFormRules.eopTime" style="width: 100%;" label-width="0px">
                                    <el-date-picker style="width: 100%" v-model="scope.row.eopTime" type="date"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        :disabled="isShowDetail"></el-date-picker>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" :label="$t('vehicleMaintenance.platform')" align="center">
                            <template slot-scope="scope">
                                <el-form-item label-width="0px">
                                    <el-select :disabled="isShowDetail" style="width: 100%" v-model="scope.row.platform"
                                        clearable filterable>
                                        <el-option v-for="item in platformList" :key="item.dictKey" :label="item.dictValue"
                                            :value="item.dictKey"></el-option>
                                    </el-select>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column width="50">
                            <template slot-scope="scope">
                                <el-button v-if="!isShowDetail" type="text" style="color: red;" @click="delRow(scope.row)">{{$t("commonContent.delete")}}</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-form>
        <template #footer v-if="!isShowDetail">
            <span class="dialog-footer">
                <el-button @click="vehicleModelDialogFormVisible = false" size="mini"
                    icon="el-icon-circle-close">{{$t('vehicleMaintenance.cancel')}}</el-button>
                <el-button type="primary" @click="addCustomer('editFormRef')" size="mini"
                    icon="el-icon-circle-check">{{$t('vehicleMaintenance.save')}}</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script>
import { selectList } from "@/api/contract/bomMaint";
import { getOptions } from "@/api/base";
import VehicleMaintenanceApi from '@/api/contract/vehicleMaintenance'
import { selectLists } from "@/api/contract/vehicleModelManage";
import { dealTimerSecond } from '@/util/util'
export default {
    data() {
        return {
            editForm: {
                vehicleMaterialBomList: [{
                    bomId: null,
                    costCny: null,
                    offenders: null,
                    contractPrice: null,
                    sopTime: null,
                    eopTime: null,
                    platform: null
                }]
            },
            modelWithMaterialList: [],
            editFormRules: {
                modelId: [{ required: true, message: this.$t('vehicleMaintenance.modelName') }],
                bomId: [{ required: true, message: this.$t('vehicleMaintenance.bomName') }],
                eopTime: [{ required: true, message: this.$t('vehicleMaintenance.eopTime') }],
                sopTime: [{ required: true, message: this.$t('vehicleMaintenance.sopTime') }],
                materialNumber: [{ required: true, message: this.$t('vehicleMaintenance.materialNo') }]
            },
            dialogTitle: this.$t('vehicleMaintenance.addModel'),
            bomList: [],
            platformList: [],
            modelNameList: [],
            vehicleModelDialogFormVisible: false
        }
    },
    props: {
        isShowDetail: {}
    },
    mounted() {
        this.initData({})
    },
    methods: {
        async initData(params) {
            selectList(params).then((res) => {
                this.bomList = res.data.data;
                this.bomList.forEach((item) => {
                    item.id = +item.id;
                });
            });
            selectLists().then((res) => {
                this.modelNameList = res.data.data;
                this.modelNameList.forEach((item) => {
                    item.id = +item.id;
                });
            });
            getOptions({ code: "COUNTRY_REGIN" }).then((res) => {
                this.areaList = res.data.data;
            });
            getOptions({ code: "PLATFORM" }).then((res) => {
                this.platformList = res.data.data;
            });
        },
        delRow(row) {
            this.editForm.vehicleMaterialBomList = this.editForm.vehicleMaterialBomList.filter(ele => {
                return ele !== row
            })
        },
        addBomList() {
            this.editForm.vehicleMaterialBomList.push({})
        },
        setTitle(type, row) {
            this.isShowDetail = type === 'detail'
            this.dialogTitle = type === 'detail' ? '车型查看' : type === 'edit' ? '车型编辑' : '车型新增'
            if (row.id) {
                this.getDetail(row.id)
            } else {
                this.editForm = {
                    modelId: null,
                    materialNumber: [],
                    countryReginCode: null,
                    seriesName: null,
                    modelTypeName: null,
                    vehicleMaterialBomList: [{
                        bomId: null,
                        costCny: null,
                        offenders: null,
                        contractPrice: null,
                        sopTime: null,
                        eopTime: null,
                        platform: null
                    }]
                }
            }
        },
        async getDetail(id) {
            let res = await VehicleMaintenanceApi.detail(id)
            console.log(res)
            if(res.data.code===200||res.data.code===0){
                this.editForm = res.data.data

                this.selectModel(this.editForm.modelId,'isStart')
            }
        },
        async selectModel(val,isStart) {
            this.modelNameList.find((item) => {
                if (item.id === val) {
                    this.editForm.countryReginCode = item.countryReginCode;
                    this.editForm.seriesName = item.seriesName;

                    this.editForm.modelTypeName = item.modelTypeName;
                }
            });
            let res = await VehicleMaintenanceApi.materialList(val)
            // console.log(res)
            if(!isStart){
                this.editForm.materialNumber = []
            }
            if (res.data.code === 0 || res.data.code === 200) {
                if (!res.data.data) {
                    this.$message.error('请为车型添加物料号')
                }
                this.modelWithMaterialList = res.data.data
            }
        },
        selectBom(val, scope) {
            //选中的数据和options进行匹配
            this.bomList.find((item) => {
                if (item.id === val) {
                    console.log(item)
                    scope.row.costCny = item.costCny;
                    scope.row.offenders = item.offenders;
                    scope.row.contractPrice = item.contractPrice;
                    scope.row.bomName = item.bomName
                    scope.row.bomType = item.bomType
                    return false;
                }
            });
        },
        addCustomer(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    this.editForm.vehicleMaterialBomList.map(ele => {
                        ele.eopTime = dealTimerSecond(ele.eopTime)
                        ele.sopTime = dealTimerSecond(ele.sopTime)
                    })
                    const message = !this.editForm.id ? "新增成功" : "编辑成功";
                    VehicleMaintenanceApi.saveOrUpdate(this.editForm)
                        .then((res) => {
                            if (res.data.code == 0) {
                                this.$message({
                                    message,
                                    type: "success",
                                });
                            } else {
                                this.$message.error(res.data.msg);
                            }
                        })
                        .catch((err) => this.$message.error(`新增失败,${err.data.msg}`))
                        .finally(() => {
                            this.vehicleModelDialogFormVisible = false;
                            this.$emit('getList')
                        });
                }
            });
        },
    }
}
</script>
