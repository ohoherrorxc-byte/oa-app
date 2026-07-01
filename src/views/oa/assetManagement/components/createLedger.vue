<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="90%" :before-close="handleClose" :append-to-body="true"
        :lock-scroll="false">
        <el-form :disabled="isDetail || isNotHu" ref="form" :model="form" :rules="rules" label-width="100px"
            label-position="right">
            <div class="w100 sub-title">基本信息</div>
            <el-form-item label="资产名称" prop="assetName">
                <el-input v-model="form.assetName" clearable></el-input>
            </el-form-item>
            <el-form-item label="资产编号" prop="">
                <!-- {{ form.assetNumber }} -->
                <el-input v-model="form.assetNumber" disabled clearable></el-input>
            </el-form-item>
            <el-form-item label="资产大类" prop="assetCategories">
                <el-select v-model="form.assetCategories" clearable>
                    <el-option v-for="item in categoriesList" :value="item.dictValue" :key="item.id"
                        :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规格型号" prop="specificationAndModel">
                <el-input v-model="form.specificationAndModel" clearable></el-input>
            </el-form-item>
            <div class="w100 sub-title">详细信息</div>
            <el-form-item label="资产简称" prop="assetAbbreviation">
                <el-input class="w100" clearable v-model="form.assetAbbreviation">
                </el-input>
            </el-form-item>
            <el-form-item label="资产级别" prop="assetLevel">
                <el-select v-model="form.assetLevel">
                    <el-option value="A" label="A"></el-option>
                    <el-option value="B" label="B"></el-option>
                    <el-option value="C" label="C"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="品牌">
                <el-input v-model="form.brand" clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="form.supplierName" clearable></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="unitPrice">
                <el-input @blur="testNumber(form.unitPrice, 'unitPrice')" v-model.number="form.unitPrice"
                    clearable></el-input>
            </el-form-item>
            <el-form-item label="数量">
                <el-input @blur="testNumber(form.quantity, 'quantity')" v-model.number="form.quantity" clearable></el-input>
            </el-form-item>
            <el-form style="width: 50%;display: flex;" label-width="100px">
              <el-form-item label="采购日期" prop="purchaseDate" :disabled="isNotHuang">
                  <el-date-picker class="w100" value-format="yyyy-MM-dd" clearable v-model="form.purchaseDate" type="date"
                    placeholder="选择日期">
                  </el-date-picker>
              </el-form-item>
            </el-form>
            <el-form-item label="使用年限">
                <el-input v-model="form.serviceLife" clearable></el-input>
            </el-form-item>
            <div class="w100 sub-title">领用信息</div>
            <el-form-item label="领用人">
                <autoAddress ref="autoAddress" :initList="initList" class="w-100" @getPerson="getRecipient"
                    @getPersonClear="getPersonClear" placeholder="领用人" :initData="form.recipient" :disabled="isEdit"
                    :multiple="false">
                </autoAddress>
            </el-form-item>
            <el-form-item label="领用部门">
                <avue-input-tree disabled v-model="form.receivingDepartment" placeholder="请选择内容" :dic="departmentList"
                    :props="deptProps"></avue-input-tree>
            </el-form-item>
            <el-form-item label="领用时间" prop="requisitionDate">
                <el-date-picker class="w100" value-format="yyyy-MM-dd" clearable v-model="form.requisitionDate" type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="在库状态" prop="assetStatus">
                <el-select v-model="form.assetStatus" clearable>
                    <el-option v-for="item in assetStatusList" :label="item.label" :key="item.value"
                        :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form style="width: 50%;display: flex;" label-width="100px">
              <el-form-item label="存放地点" prop="storageLocation" :disabled="isNotHuang">
                <el-select v-model="form.storageLocation" clearable>
                    <el-option v-for="item in placeList" :value="item.dictValue" :key="item.id"
                        :label="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-form style="width: 50%;display: flex;" label-width="100px">
              <el-form-item label="资产说明" prop="assetDescription":disabled="isNotHuang">
                  <el-select v-model="form.assetDescription" clearable>
                      <el-option value="个人" label='个人'></el-option>
                      <el-option value="公用" label='公用'></el-option>
                  </el-select>
              </el-form-item>
            </el-form>
            <el-form style="width: 50%;display: flex;" label-width="100px">
              <el-form-item label="是否配有钥匙" :disabled="isNotHuang">
                  <el-select v-model="form.haveKey" clearable>
                      <el-option value="是" label="是"></el-option>
                      <el-option value="否" label="否"></el-option>
                  </el-select>
              </el-form-item>
            </el-form>
            <el-form style="width: 50%;display: flex;" label-width="100px">
                   <el-form-item label="钥匙数量" :disabled="isNotHuang">
                       <el-input v-model="form.keyNum" clearable></el-input>
                   </el-form-item>
             </el-form>
            <el-form style="width: 50%;display: flex;" label-width="100px">
                    <el-form-item label="设备SN号" :disabled="isNotHuang">
                      <el-input v-model="form.serialNumber" clearable></el-input>
                    </el-form-item>
            </el-form>
            <el-form style="width: 50%;display: flex;" label-width="100px">
                          <el-form-item label="电脑是否入域" :disabled="isNotHuang">
                              <el-select v-model="form.computerDomainEntry" clearable>
                                  <el-option value="是" label="是"></el-option>
                                  <el-option value="否" label="否"></el-option>
                              </el-select>
                          </el-form-item>
            </el-form>
            <el-form style="width: 50%;display: flex;" label-width="100px">
                                      <el-form-item label="是否需要重新打印" :disabled="isNotHuang">
                                          <el-select v-model="form.needPrint" clearable>
                                              <el-option value="是" label="是"></el-option>
                                              <el-option value="否" label="否"></el-option>
                                          </el-select>
                                      </el-form-item>
            </el-form>
            <el-form style="width: 50%;display: flex;" label-width="100px">
                    <el-form-item label="实际使用人" :disabled="isNotHuang">
                       <el-input v-model="form.actualUser" clearable></el-input>
                    </el-form-item>
            </el-form>
            <el-form style="width: 100%;display: flex;" label-width="100px">
              <el-form-item label="备注" v-if="!isAssetPerson" :disabled="isNotHuang">
                  <el-input type="textarea"  v-model="form.remark"></el-input>
              </el-form-item>
            </el-form>
            <el-form style="width: 100%;display: flex;" label-width="100px">
                <el-form-item label="领用备注" :disabled="isDetail">
                    <el-input type="textarea" v-model="form.receivingRemark"></el-input>
                </el-form-item>
            </el-form>

        </el-form>
        <span slot="footer" class="dialog-footer text-center">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button v-if="!isDetail" type="primary" @click="remark">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { getDeptTree } from "@/api/organizationalStructure/department";
import autoAddress from '@/components/autoAddress/index'
import { mapGetters } from 'vuex';
import AssetsManageApi from '@/api/assetsManage/index'
import { getAssetStatusList } from '../config'
import { dealTimerSecond } from '@/util/util'
export default {
    components: {
        autoAddress
    },
    props:{
        isAssetPerson:{
            type:Boolean,

        }
    },
    data() {
        return {
            isDetail: false,
            deptProps: {
                label: "title",
                value: "title",
                children: "children",
            },
            title: '新增资产台账',
            dialogVisible: false,
            form: {},
            rules: {
                assetName: [
                    { required: true, message: '请输入资产名称', trigger: 'blur' }
                ],
                assetNumber: [
                    { required: true, message: '请输入资产编号', trigger: 'blur' }
                ],
                assetAbbreviation: [
                    { required: true, message: '请输入资产简称', trigger: 'blur' }
                ],
                assetLevel: [
                    { required: true, message: '请选择资产级别', trigger: 'blur' }
                ],
                supplierName: [
                    { required: true, message: '请输入供应商名称', trigger: 'blur' }
                ],
                unitPrice: [
                    { required: true, message: '请输入价格', trigger: 'blur' }
                ],
                purchaseDate: [
                    { required: true, message: '请选择采购日期', trigger: 'blur' }
                ],
                requisitionDate: [
                    { required: false, message: '请选择领用时间', trigger: 'change' }
                ],
                storageLocation: [
                    { required: true, message: '请选择存放地点', trigger: 'change' }
                ],
                assetDescription: [
                    { required: true, message: '请选择资产说明', trigger: 'change' }
                ],
                assetCategories: [
                    { required: true, message: '请选择资产大类', trigger: 'change' }
                ],
                specificationAndModel: [
                    { required: true, message: '请输入规格型号', trigger: 'blur' }
                ],
                assetStatus: [
                    { required: true, message: '请选择在库状态', trigger: 'change' }
                ]
            },
            categoriesList: [],
            placeList: [],
            choosePersonKey: "",
            departmentList: [],
            assetStatusList: [],
            multipleSelection: [],
            keyNum: "",
            computerDomainEntry: "",
            actualUser: "",
            needPrint: "",
            isNotHu: true
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    mounted() {
        this.initData()
        this.init()
        this.assetStatusList = getAssetStatusList()
    },
    methods: {
        init() {
            this.getDepartment()
            this.getCategories()
            this.getPlace()
            console.log(this.useInfo)
            this.isNotHu = this.userInfo.nick_name !== "胡晓芸"
            this.isNotHuang = this.userInfo.nick_name !== "黄子恩"
            console.log(  this.isNotHu+'isNotHu')
            console.log(  this.isNotHuang+'isNotHuang')
        },
        async getDetails(id, type) {
            let res = await AssetsManageApi.getDetails(id)
            if (res.data.code === 0 || res.data.code === 200) {
                this.form = res.data.data
                this.title = '编辑资产台账'
            }
        },
        testNumber(value, key) {
            if (!/^[\d.]+$/.test(Number(value))) {
                this.$message.error('请输入数字')
                this.form[key] = null
            }
        },
        getRecipient(data) {
            this.form.recipient = data.realName
            this.form.receivingDepartment = data.deptName
            this.rules.requisitionDate[0].required = true
        },
        getPersonClear() {
            this.form.recipient = null
            this.form.receivingDepartment = null
            this.rules.requisitionDate[0].required = false
        },
        resetForm() {
            this.$nextTick(() => {
                this.$refs.form.resetFields()
            })
        },
        async getCategories() {
            let res = await AssetsManageApi.getDictionary('assetCategories')
            console.log(res)
            if (res.data.code === 0 || res.data.code === 200) {
                this.categoriesList = res.data.data
            }
        },
        async getPlace() {
            let res = await AssetsManageApi.getDictionary('storageLocation')
            if (res.data.code === 0 || res.data.code === 200) {
                this.placeList = res.data.data
            }
        },
        async getDepartment() {
            let res = await getDeptTree(629965)
            if (res.data.code === 0 || res.data.code === 200) {
                this.departmentList = res.data.data
            }
        },
        initData() {
            this.form = {
                "assetAbbreviation": "",
                "assetCategories": "",
                "assetCategory": "",
                "assetClass": "",
                "assetDescription": "",
                "assetLevel": "",
                "assetName": "",
                "assetNumber": "",
                "assetStatus": null,
                "assetSubcategories": "",
                "brand": "",
                "inventoryDate": "",
                "inventoryPerson": "",
                "inventoryStatus": null,
                "inventoryYear": "",
                "money": null,
                "purchaseDate": "",
                "quantity": null,
                "receivingDepartment": "",
                "receivingDepartmentId": null,
                "receivingRemark": "",
                "recipient": "",
                "recipientId": null,
                "relatedProjects": "",
                "remark": "",
                "requisitionDate": "",
                "serviceLife": null,
                "specificationAndModel": "",
                "status": null,
                "storageLocation": "",
                "storageTime": "",
                "supplierName": "",
                "unitPrice": null,
                "updateTime": "",
                "updateUser": null,
                haveKey: '否',
                serialNumber: ''
            }
        },
        resetForm() {
            this.initData()
            this.$nextTick(() => {
                this.$refs.form.clearValidate(); // 清除表单校验
            });
        },
        remark() {

            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    let obj = JSON.parse(JSON.stringify(this.form))
                    obj.receivingDepartment = obj.receivingDepartment ? obj.receivingDepartment.toString() : ''
                    obj.purchaseDate = dealTimerSecond(obj.purchaseDate)
                    obj.requisitionDate = dealTimerSecond(obj.requisitionDate)
                    let res = await AssetsManageApi.assetSave(obj)
                    if (res.data.code === 0 || res.data.code === 200) {
                        this.$message.success('提交成功')
                        this.$emit('getReflesh')
                        this.dialogVisible = false
                    }
                } else {
                    this.$message.error('请填写必填项')
                    return false;
                }
                // this.dialogVisible = false
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form {
    display: flex;
    flex-wrap: wrap;

}

.text-center {
    text-align: center;
}

.sub-title {
    margin-left: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    color: black;
}

.add-icon {
    color: #1D76FF;
    background-color: #DEEBFF;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}

.dec-icon {
    color: #979797;
    background-color: #EAEAEA;
    padding: 3px 6px;
    border-radius: 2px;
    margin-right: 20px;
}

.between {
    justify-content: space-between;
}

.w100 {
    width: 100%;
}

.el-form-item {
    width: 30%;
}

.ml3 {
    margin-left: 3px;
}

.font22 {
    font-size: 22px;
}

.color666 {
    color: #666666
}

.font10 {
    font-size: 10px;
}

.delete-img {
    color: red;
    position: absolute;
    font-size: 16px;
    margin-left: -10px;
    margin-top: -5px;
}

.borad-cicle {
    border-radius: 5px;
}

.w-55 {
    width: 55%;
}
</style>
