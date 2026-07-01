<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="90%" :before-close="handleClose" :append-to-body="true"
        :lock-scroll="false">
        <el-form :disabled="isDetail" ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
            <el-form-item label="资产名称">
                <el-input v-model="form.assetName" clearable></el-input>
            </el-form-item>
            <el-form-item label="资产编号" prop="realName">
                <el-input v-model="form.assetNumber" clearable></el-input>
            </el-form-item>
            <el-form-item label="资产类别">
                <el-input v-model="form.assetCategory" clearable></el-input>
            </el-form-item>
            <el-form-item label="资产大类">
                <el-select v-model="form.assetCategories" clearable>
                    <el-option v-for="item in categoriesList" :value="item.dictValue" :key="item.id" :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="相关项目">
                <el-input v-model="form.relatedProjects" clearable></el-input>
            </el-form-item>
            <el-form-item label="规格型号">
                <el-input v-model="form.specificationAndModel" clearable></el-input>
            </el-form-item>
            <el-form-item label="品牌">
                <el-input  clearable v-model="form.brand" >
                </el-input>
            </el-form-item>
            <el-form-item label="供应商名称">
                <el-input v-model="form.supplierName" clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="价格（含税）">
                <el-input @blur="testNumber(form.unitPrice,'unitPrice')" v-model.number="form.unitPrice"  clearable></el-input>
            </el-form-item>
            <el-form-item label="数量">
                <el-input @blur="testNumber(form.quantity,'quantity')" v-model.number="form.quantity" clearable></el-input>
            </el-form-item>
            <el-form-item label="领用人">
                <autoAddress ref="autoAddress" :initList="initList" class="w-100" @getPerson="getRecipient"
                    placeholder="领用人" :initData="form.recipient" :disabled="isEdit" :multiple="false">
                </autoAddress>
            </el-form-item>
            <el-form-item label="采购日期">
                <el-date-picker class="w100" value-format="yyyy-MM-dd" clearable v-model="form.purchaseDate" type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="使用年限">
                <el-input v-model="form.serviceLife" clearable></el-input>
            </el-form-item>
            <el-form-item label="存放地点">
                <el-select v-model="form.storageLocation"  clearable>
                    <el-option v-for="item in placeList"  :value="item.dictValue" :key="item.id" :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资产说明">
                <el-select v-model="form.assetDescription" clearable>
                    <el-option value="个人" label='个人'></el-option>
                    <el-option value="公用" label='公用'></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资产级别">
                <el-select v-model="form.assetLevel">
                    <el-option value="A" label="A"></el-option>
                    <el-option value="B" label="B"></el-option>
                    <el-option value="C" label="C"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否配有钥匙">
                <el-select v-model="form.haveKey" clearable>
                  <el-option value="是" label="是"></el-option>
                  <el-option value="否" label="否"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="设备SN号">
                <el-input v-model="form.serialNumber" clearable></el-input>
            </el-form-item>
            <el-form-item label="盘点状态">
                <el-select v-model="form.inventoryStatus" >
                    <el-option :value="0" label="未盘点"></el-option>
                    <el-option :value="1" label="已盘点"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年份">
                <el-date-picker value-format="yyyy" v-model="form.inventoryYear" type="year" placeholder="选择年" class="w-100">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="盘点人">
                <autoAddress ref="autoAddress" :initList="initList" class="w-100" @getPerson="getInventory"
                    placeholder="盘点人" :initData="form.inventoryPerson" :disabled="isEdit" :multiple="false">
                </autoAddress>
            </el-form-item>
            <el-form-item label="盘点部门">
                <avue-input-tree  v-model="form.inventoryDept" placeholder="请选择内容" :dic="departmentList"
                    :props="deptProps"></avue-input-tree>
            </el-form-item>
            <el-form-item label="盘点日期">
                <el-date-picker class="w100" value-format="yyyy-MM-dd" clearable v-model="form.inventoryDate" type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.remark" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="领用备注">
                <el-input v-model="form.receivingRemark" type="textarea"></el-input>
            </el-form-item>
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
import AssetsManageApi from '@/api/assetsManage/index'
import { mapGetters } from 'vuex';
import {dealTimerSecond} from '@/util/util'
export default {
    components: {
        autoAddress
    },
    data() {
        return {
            placeList:[],
            categoriesList:[],
            isDetail: false,
            deptProps: {
                label: "title",
                value: "id",
                children: "children",
            },
            roleProps: {
                label: "title",
                value: "id",
                children: "children",
            },
            title: '新增资产盘点',
            dialogVisible: false,
            form: {},
            rules: {
            },
            choosePersonKey: "",
            departmentList: [],
            postList: [],
            professionalList: [],
            roleList: [],
            locationList: [],
            educationalList: [],
            supplyList: [],
            areaList: [],
            multipleSelection: []
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    created() {
        this.initData()
        this.init()
       
    },
    methods: {
        init() {
            this.getDepartment()
            this.getCategories()
            this.getPlace()
        },
        testNumber(value,key){
            if( !/^[\d.]+$/.test(Number(value))){
                this.$message.error('请输入数字')
                this.form[key] = null
            }
        },
        async getDetails(id, type) {
            let res = await AssetsManageApi.getDetailInventory(id)
            if (res.data.code === 0 || res.data.code === 200) {
                this.form = res.data.data
                this.title = '编辑资产盘点'
            }
        },
        async getCategories(){
            let res =await AssetsManageApi.getDictionary('assetCategories')
            if(res.data.code===0||res.data.code===200){
                this.categoriesList = res.data.data
            }
        },
        resetForm() {
            this.$nextTick(() => {
                this.$refs.form.resetFields()
            })
        },
        async getPlace(){
            let res =await AssetsManageApi.getDictionary('storageLocation')
            if(res.data.code===0||res.data.code===200){
                this.placeList = res.data.data
            }
        },
        async getDepartment() {
            let res = await getDeptTree(629965)
            if (res.data.code === 0 || res.data.code === 200) {
                this.departmentList = res.data.data
            }
        },
        getRecipient(data){
            console.log(data)
            this.form.recipient = data.realName
        },
        getInventory(data){
            this.form.inventoryPerson = data.realName
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
                "createDept": null,
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
                haveKey:'否',
                serialNumber:''
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
                    obj.purchaseDate = dealTimerSecond(obj.purchaseDate)
                    obj.inventoryDate = dealTimerSecond(obj.inventoryDate)
                    obj.inventoryDept = obj.inventoryDept?obj.inventoryDept.toString():null
                    let res = await AssetsManageApi.inventoryAdd(obj)
                    if (res.data.code === 0 || res.data.code === 200) {
                        this.$message.success('提交成功')
                        this.$emit('getReflesh')
                        this.dialogVisible = false
                    }
                } else {
                    this.$message.error('请填写必填项')
                    return false;
                }
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
.w-100{
    width: 100%;
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