<template>
    <div>
        <el-dialog :visible.sync="vehicleModelDialogFormVisible" append-to-body width="80%">
            <template slot="title">
                <div style="font-size: 15px">{{ dialogTitle }}</div>
            </template>
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="120px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="countryReginCode">
                            <label slot="label">国家/地区:</label>
                            <el-input disabled v-model="editForm.countryRegin"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <label slot="label">车系:</label>
                            <el-select v-model="editForm.seriesName" @change="changeSeries">
                                <el-option v-for="item in vehicleSereisList" :key="item.id" :label="item.seriesName"
                                    :value="item.seriesName"></el-option></el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col span="24">
                        <el-button class="fr mb10" type="primary" @click="addVehicleMode">添 加</el-button>
                        <el-table :data="editForm.vehicleModelList" style="width: 100%">
                            <el-table-column prop="date" label="车型名称" width="180">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.modelId" clearable filterable @change="selectModel">
                                        <el-option v-for="item in modelNameList" :key="item.id" :label="item.modelName"
                                            :value="item.id"></el-option>
                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" label="SOP时间" width="180">
                                <template slot-scope="scope">
                                    <el-date-picker style="width: 100%" v-model="scope.row.sopTime" type="date"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        :disabled="isShowDetail"></el-date-picker>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="EOP有效期">
                                <template slot-scope="scope">
                                    <el-date-picker style="width: 100%" v-model="scope.row.eopTime" type="date"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        :disabled="isShowDetail"></el-date-picker>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="所属平台">
                                <template slot-scope="scope">
                                    <el-select style="width: 100%" v-model="scope.row.platform" clearable filterable>
                                        <el-option v-for="item in platformList" :key="item.dictKey" :label="item.dictValue"
                                            :value="item.dictKey"></el-option>

                                    </el-select>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="所属平台">
                                <template slot-scope="scope">
                                  <el-button @click="delRow(scope.$index)" type="text" style="color: red;">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                    <!-- <el-col :span="12">
                        <el-form-item prop="modelId">
                            <label slot="label">车型名称:</label>
                            <el-select v-model="editForm.modelId" clearable filterable @change="selectModel">
                                <el-option v-for="item in modelNameList" :key="item.id" :label="item.modelName"
                                    :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                    <!-- <el-col :span="12" v-if="!isEdit">
                        <el-form-item prop="sopTime">
                            <label slot="label">SOP时间:</label>
                            <el-date-picker style="width: 100%" v-model="editForm.sopTime" type="date" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" :disabled="isShowDetail"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12" v-if="!isEdit">
                        <el-form-item prop="eopTime">
                            <label slot="label">EOP有效期:</label>
                            <el-date-picker style="width: 100%" v-model="editForm.eopTime" type="date" format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd" :disabled="isShowDetail"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item>
                            <label slot="label">所属平台:</label>
                            <el-select style="width: 100%" v-model="editForm.platform" clearable filterable>
                                <el-option v-for="item in platformList" :key="item.dictKey" :label="item.dictValue"
                                    :value="item.dictKey"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col> -->
                </el-row>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="vehicleModelDialogFormVisible = false" size="mini"
                        icon="el-icon-circle-close">取消</el-button>
                    <el-button type="primary" @click="addCustomer('editFormRef')" size="mini"
                        icon="el-icon-circle-check">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import {
    getList,
    delVehicleModel,
    saveOrUpdateVehicleModel,
    selectLists,
    saveOrUpdateVehicleModelNew,
    exportList, syncModelType,
    getSeriesName
} from "@/api/contract/vehicleModelManage";
import { getOptions } from "@/api/base";
export default {
    props: {
        detailId: {
            type: String,
            default: ""
        },
        formData: {
            type: Object,
            default: {}
        },
    },
    data() {
        return {
            vehicleModelDialogFormVisible: false,
            editForm: {
                vehicleModelList: [{
                    modelId: null,
                    sopTime: null,
                    eopTime: null,
                    platform: null
                }]
            },
            vehicleSereisList: [],
            editFormRules: [],
            dialogTitle: "添加车型",
            modelNameList: [],
            platformList: [],
            editFormRules: {
                modelId: [{ required: true, message: "请选择车型名称" }],
                eopTime: [{ required: true, message: "请选择EOP有效期" }],
                sopTime: [{ required: true, message: "请选择SOP时间" }],
            },
        }
    },
    mounted() {

    },
    methods: {
        initData(editForm) {
          
            getOptions({ code: "PLATFORM" }).then((res) => {
                this.platformList = res.data.data;
            });
            console.log(editForm)
            console.log(123455)
            this.editForm.countryReginCode= editForm.countryReginCode
            this.editForm.countryRegin = editForm.countryRegin
            let obj = { countryRegionCode: editForm.countryReginCode }
            getSeriesName(obj).then(res => {
                this.vehicleSereisList = res.data.data
            })
        },
        getCarList(){
            console.log('eeeew3333')
            selectLists({countryRegionCode:this.editForm.countryReginCode,seriesName:this.editForm.seriesName}).then((res) => {
                this.modelNameList = res.data.data;
                this.modelNameList.forEach((item) => {
                    item.id = +item.id;
                });
            });
        },
        addVehicleMode() {
            this.editForm.vehicleModelList.push({
                modelId: null,
                sopTime: null,
                eopTime: null,
                platform: null
            })
        },
        delRow(index){
            this.editForm.vehicleModelList.splice(index,1)
        },
        resetForm() {
            for (let key in this.editForm) {
                this.editForm[key] = null
                this.editForm.vehicleModelList = [{
                    modelId: null,
                    sopTime: null,
                    eopTime: null,
                    platform: null
                }]
            }
        },
        changeSeries() {
            this.getCarList()
            // let row = this.vehicleSereisList.find(ele => {
            //     return ele.id === this.editForm.seriesId
            // })
        },
        selectModel(val) {
            //选中的数据和options进行匹配
            this.modelNameList.find((item) => {
                if (item.id === val) {
                    this.editForm.countryReginCode = item.countryReginCode;
                    this.editForm.seriesName = item.seriesName;
                    this.editForm.modelTypeName = item.modelTypeName;
                    return false;
                }
            });
        },
        addCustomer(formName) {

            this.editForm.bomId = this.detailId
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    const message = "新增成功";
                    saveOrUpdateVehicleModelNew(this.editForm)
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
                            this.$emit('refleshDetail')
                            this.vehicleModelDialogFormVisible = false;
                        });
                }
            });
        }
    }
}
</script>