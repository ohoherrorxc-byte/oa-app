<template>
    <basic-container>
        <p class="table-title">
            <span></span>{{ $t('return.info') }}
        </p>
        <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="转让说明" prop="transferRemark">
                <el-input type="textarea" v-model="form.transferRemark"></el-input>
            </el-form-item>
            <el-form-item label="被转让人" prop="transferPerson">
              <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100" @getPerson="getPerson"
                           :initData="form.transfereePerson" v-model="form.transferPerson" :disabled="transferPersonDisabled" :multiple="false">
              </autoAddress>
            </el-form-item>
            <el-form-item label="被转让部门" prop="transferRemark">
                <el-input disabled v-model="form.transfereeDept"></el-input>
            </el-form-item>
            <el-form-item label-width="0" style="width: 100%;">
                <div class="fr" v-if="!disabled">
                    <span class="add-icon" @click="addRow">+</span>
                </div>
                <el-table ref="multipleTable" :data="form.partBasicDtoList" @selection-change="handleSelectionChange"
                    class="mb20 table-now">
                    <el-table-column prop="chooseStatus" type="index" width="50"
                        :label="$t('commonContent.serialNumber')"></el-table-column>
                    <el-table-column property="partName" :label="$t('parts.name')" align="center" width="180">
                        <template slot-scope="scope">
                            <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partName'"
                                :rules="rules.partName">
                                <el-select filterable clearable v-model="scope.row.partName"
                                    @change="getPartsDetail(scope.row, scope.$index)">
                                    <el-option v-for="item in partsList" :key="item.id"
                                        :label="item.partName + ' ' + item.specificationAndModel + ' ' + item.partNumber"
                                        :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="partsCategory" :label="$t('parts.category')" align="center"></el-table-column>
                    <el-table-column prop="partNumber" :label="$t('parts.number')" align="center">
                        <template slot-scope="scope">
                            <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partNumber'"
                                :rules="rules.partNumber">
                                <el-select filterable clearable v-model="scope.row.partNumber"
                                    @change="getPartsDetail(scope.row, scope.$index, 'partNumber')">
                                    <el-option v-for="item in partsList" :key="item.id" :label="item.partNumber"
                                        :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column prop="partId" :label="$t('parts.systemId')" align="center"></el-table-column>
                    <el-table-column prop="specificationAndModel" :label="$t('parts.specification')" align="center">
                        <template slot-scope="scope">
                            <el-form-item style="width: 100%;"
                                :prop="'partBasicDtoList.' + scope.$index + '.specificationAndModel'"
                                :rules="rules.specificationAndModel">
                                <el-select filterable clearable v-model="scope.row.specificationAndModel"
                                    @change="getPartsDetail(scope.row, scope.$index, 'specificationAndModel')">
                                    <el-option v-for="item in partsList" :key="item.id" :label="item.specificationAndModel"
                                        :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('parts.storageLocation')" align="center"
                        prop="storageLocation"></el-table-column>
                    <el-table-column prop="partsProject" :label="$t('parts.applicableProject')"
                        align="center"></el-table-column>
                    <el-table-column prop="remark" :label="$t('commonContent.remark')" align="center"></el-table-column>
                    <el-table-column :label="$t('commonContent.operation')" align="center" v-if="!disabled">
                        <template slot-scope="scope">
                            <el-form-item style="width: 100%;">
                                <el-button type="text" @click="deleteRow(scope.row)" style="color:red">{{
                                    $t('commonContent.delete') }}</el-button>
                            </el-form-item>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
    </basic-container>
</template>

<script>
import PartsApplyApi from "@/api/partsApply/index";
import { getPlace, getPartCategories } from "../util";
import { mixins } from "../Mixin";
import { mapGetters } from 'vuex'
import autoAddress from '@/components/autoAddress/index'
export default {
    mixins: [mixins],
    components:{autoAddress},
    data() {
        return {
            categoriesList: [],
            placeList: [],
            partsList: [],
            form: {
                purchaseRequestId: "",
                purchaseRequestName: "",
                purchaseDate: "",
                storageTime: "",
                transfereeDept:null,
                transfereePerson:null,
                // transferRemark:null,
                assetCategory: "公司零件",
                partsCategory: "",
                transferRemark: "",
                partBasicDtoList: [
                    {
                        partName: "",
                        partNumber: "",
                        specificationAndModel: "",
                        partsProject: "",
                        unitPrice: "",
                        quantity: "",
                        money: "",
                        serviceLife: "",
                        relatedProjects: "",
                        storageLocation: "",
                    },
                ],
            },
            rules: {
                transferRemark: [
                    { required: true, message: '请输入转让说明', trigger: 'blur' }
                ],
                partsCategory: [
                    { required: true, message: this.$t('return.partCategoryRequired'), trigger: "change" },
                ],

                partName: [
                    { required: true, message: this.$t('return.partNameRequired'), trigger: "blur" },
                ],
            },
            businessId: null,
            multipleSelection: [],
            isEdit: false,
        };
    },
    mounted() {
        this.businessId = this.$route.query.businessId;
        this.isEdit = this.$route.query.isEdit;
        if (this.businessId) {
            this.getDetail();
        }
        this.init();
        this.remoteMethodPartName('isStart', '已领用')
    },
    computed: {
        ...mapGetters(["userInfo"]),
        disabled() {
            return this.businessId && !this.isEdit;
        },
        transferPersonDisabled() {
          return this.businessId; // 回退后禁用 transferPerson
        },
    },
    methods: {
        async init() {
            this.categoriesList = await getPartCategories();
            this.placeList = await getPlace();
        },
        async getDetail() {
            // let res = await PartsApplyApi.details(this.businessId);
            let res = await PartsApplyApi.transferDetails(this.businessId);
            if (res.data.code === 200) {
                this.form = res.data.data;
                this.$emit("getFormData", this.form);
            }
        },
        getPerson(v){
            this.form.transfereePerson = v.realName
            this.form.transfereeDept = v.deptName
            // console.log(v)
            // console.log(this.form)
        },
        addRow() {
            this.form.partBasicDtoList.push({
                key: Date.now(),
            });
        },
        deleteRow(row) {
            this.form.partBasicDtoList = this.form.partBasicDtoList.filter((ele) => {
                return ele !== row;
            });
        },
        testForm() {
            let partCategoryList = this.form.partBasicDtoList.map(ele => ele.partsCategory)
            partCategoryList = Array.from(new Set(partCategoryList));
            if (partCategoryList.length > 1 && partCategoryList.includes('SIM卡')) {
                this.$message.error('零件大类包括SIM卡只能选择SIM卡一种类型')
                return
            }
            // console.log(this.form);
            return new Promise((resolve) => {
                this.$refs.form.validate((valid) => {
                    resolve(valid);
                    if (!valid) {
                        console.log("error submit!!");
                        return false;
                    }
                });
            });
        },
    },
};
</script>

<style lang="scss" scoped>
.el-form {
    display: flex;
    flex-wrap: wrap;
}

@media (min-width: 768px) {
    .el-form-item {
        width: 48%;
    }
}

.fullscreenL {
    overflow: scroll;
}

.add-icon {
    color: #1d76ff;
    background-color: #deebff;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}

.w-100 {
    width: 100%;
}

.dec-icon {
    color: #979797;
    background-color: #eaeaea;
    padding: 3px 6px;
    border-radius: 2px;
    margin-right: 20px;
}

.exitFull {
    position: absolute;
    padding: 20px;
    color: transparent;
    z-index: 1000;
}

.exitFull:hover {
    color: #fff;
    background-color: #000;
}

.botton-row {
    margin-top: 50px;
    display: flex;
    justify-content: center;
}

.table-now {}
</style>
