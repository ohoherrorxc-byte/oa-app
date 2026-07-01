<template>
    <el-dialog :title="title" :visible.sync="dialogVisible" width="90%" :before-close="handleClose" :append-to-body="true"
        :lock-scroll="false">
        <el-form :disabled="isDetail" ref="form" :model="form" :rules="rules" label-width="100px" label-position="right">
            <el-form-item label="零件名称">
                <el-input v-model="form.partName" clearable></el-input>
            </el-form-item>
            <el-form-item label="零件编号" prop="partNumber">
                <el-input v-model="form.partNumber" disabled clearable></el-input>
            </el-form-item>
            <el-form-item label="采购零件号">
                <el-input v-model="form.purchasePartNumber" clearable></el-input>
            </el-form-item>
            <el-form-item label="零件大类">
                <el-select v-model="form.partsCategory" clearable>
                    <el-option v-for="item in categoriesList" :value="item.dictValue" :key="item.id"
                        :label="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="零件中类" prop="">
                <el-input v-model="form.middlePart"></el-input>
            </el-form-item>
            <el-form-item label="零件小类" prop="">
                <el-input v-model="form.partsSubcategory"></el-input>
            </el-form-item>
            <el-form-item label="适用项目">
                <el-input v-model="form.partsProject" clearable></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
                <el-input v-model="form.currentState" clearable ></el-input>
            </el-form-item>

            <el-form-item label="零件简称">
                <el-input v-model="form.partAbbreviation" clearable></el-input>
            </el-form-item>
            <el-form-item label="零件级别">
                <el-select v-model="form.partLevel">
                    <el-option value="A" label="A"></el-option>
                    <el-option value="B" label="B"></el-option>
                    <el-option value="C" label="C"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="单价">
                <el-input v-model="form.unitPrice" clearable></el-input>
            </el-form-item>
            <el-form-item label="金额">
                <el-input v-model="form.money" clearable></el-input>
            </el-form-item>
            <el-form-item label="存放地点">
                <el-input v-model="form.storageLocation"></el-input>
                <!-- <el-select v-model="form.storageLocation" clearable>
                    <el-option v-for="item in placeList" :value="item.dictValue" :key="item.id"
                        :label="item.dictValue"></el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="规格型号">
                <el-input v-model="form.specificationAndModel" clearable></el-input>
            </el-form-item>
            <el-form-item label="领用人">
                <autoAddress ref="autoAddress" :initList="initList" class="w-100" @getPerson="getRecipient"
                    placeholder="领用人" :initData="form.recipient" :disabled="isEdit" :multiple="false">
                </autoAddress>
            </el-form-item>
            <el-form-item label="领用时间">
                <el-date-picker class="w100" value-format="yyyy-MM-dd" clearable v-model="form.usageTime" type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="归还时间">
                <el-date-picker class="w100" value-format="yyyy-MM-dd" clearable v-model="form.returnTime" type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="借用时间">
                <el-date-picker class="w100" value-format="yyyy-MM-dd" clearable v-model="form.borrowingTime" type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="入库时间">
                <el-date-picker class="w100" value-format="yyyy-MM-dd" clearable v-model="form.createTime" type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="用途说明">
                <el-input v-model="form.usageDescription" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer text-center">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button v-if="!isDetail" type="primary" @click="remark">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import autoAddress from '@/components/autoAddress/index'
import PartsManageApi from '@/api/partsManage/index'
import { mapGetters } from 'vuex';
import AssetsManageApi from '@/api/assetsManage/index'
import { dealTimerSecond } from '@/util/util'
export default {
    components: {
        autoAddress
    },
    data() {
        return {
            placeList: [],
            categoriesList: [],
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
            title: '新增零件信息管理',
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
            this.getCategories()
            this.getPlace()
        },
        async getDetails(id) {
            let res = await PartsManageApi.basicDetail(id)
            if (res.data.code === 0 || res.data.code === 200) {
                this.form = res.data.data
                this.title = '编辑零件信息管理'
            }
        },
        async getCategories() {
            let res = await AssetsManageApi.getDictionary('partCategories')
            if (res.data.code === 0 || res.data.code === 200) {
                this.categoriesList = res.data.data
            }
        },
        resetForm() {
            this.initData()
            // this.$nextTick(() => {
            //     this.$refs.form.resetFields()
            // })
        },
        async getPlace() {
            let res = await AssetsManageApi.getDictionary('storageLocation')
            if (res.data.code === 0 || res.data.code === 200) {
                this.placeList = res.data.data
            }
        },

        getRecipient(data) {
            console.log(data)
            this.form.recipient = data.realName
        },
        getInventory(data) {
            this.form.inventoryPerson = data.realName
        },
        initData() {
            this.form = {
                "partAbbreviation": "",
                "partsCategory": "",
                middlePart:null,
                partsSubcategory:null,
                "purchasePartNumber": "",
                "assetClass": "",
                "assetDescription": "",
                "partLevel": "",
                "partName": "",
                "partNumber": "",
                "assetStatus": null,
                "assetSubcategories": "",
                "brand": "",
                "createDept": null,
                "inventoryDate": "",
                "inventoryPerson": "",
                "inventoryStatus": null,
                "inventoryYear": "",
                "money": null,
                "usageTime": "",
                "quantity": null,
                "receivingDepartment": "",
                "receivingDepartmentId": null,
                "usageDescription": "",
                "recipient": "",
                "recipientId": null,
                "currentState": "",
                "remark": "",
                "requisitionDate": "",
                "serviceLife": null,
                "unitPrice": "",
                "status": null,
                "storageLocation": "",
                "storageTime": "",
                "supplierName": "",
                "unitPrice": null,
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
                    obj.usageTime = dealTimerSecond(obj.usageTime)
                    obj.returnTime = dealTimerSecond(obj.returnTime)
                    obj.borrowingTime = dealTimerSecond(obj.borrowingTime)
                    obj.createTime = dealTimerSecond(obj.createTime)
                    let res = await PartsManageApi.basicSave(obj)
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

.w-100 {
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
}</style>