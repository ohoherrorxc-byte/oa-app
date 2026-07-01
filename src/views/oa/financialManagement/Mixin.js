import subjectManageApi from '@/api/subjectManage'
import { numberToTraditionalChinese } from '@/util/util'
import autoAddress from '@/components/autoAddress/index'
import FinancialManagementApi from '@/api/financialManagement';
import CostApi from '@/api/cost/index'
import { mapGetters } from 'vuex';
import UserApi from '@/api/organizationalStructure/user.js'
import { getDateDifference,getFormatDate } from '@/util/util'
import elSelectTree from '@/components/elSelectTree/index'
export const mixins = {
    components: {
        autoAddress,elSelectTree
    },
    data() {
        return {
            tripList:[],
            supplyList:[],
            subjectList:[],
            costList:[],
            isEdit:false,
            businessId:null,         
            deptProps: {
                label: "subjectName",
                value: "id",
                children: "childList",
            },
            searchForm: {
                currentPage: 1,
                pageSize: 10000,
            },
            form:{
                budgetInfo:null,
                costName:null,
                subjectName:null,
                subjectCode:null,
                costId:null,
                tripApply:null
            },
            rules: {
                startTime: [
                    { required: true, message: '请选择开始时间', trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: '请选择结束时间', trigger: 'change' }
                ],

                feeDate: [
                    { required: true, message: '请选择费用日期', trigger: 'change' }
                ],
                startPlace: [
                    { required: true, message: '请输入起始地', trigger: 'blur' }
                ],
                endPlace: [
                    { required: true, message: '请输入目的地', trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ],
                currency: [
                    { required: true, message: '请输入币种', trigger: 'blur' }
                ],
                exchangeRate: [
                    { required: true, message: '请输入汇率', trigger: 'blur' }
                ],
                reason: [
                    { required: true, message: '请输入事由', trigger: 'blur' }
                ],
                hotelName: [
                    { required: true, message: '请输入酒店名称', trigger: 'blur' }
                ],
                hostPerson:[
                    { required: true, message: '请输入被招待人', trigger: 'blur' }
                ],
                hostDept:[
                    { required: true, message: '请输入招待部门', trigger: 'change' }
                ],
                time: [
                    { required: true, message: '请选择费用日期', trigger: 'change' }
                ],
                projectName: [
                    { required: true, message: '请选择费用项目', trigger: 'blur' }
                ],
            }
        }
    },
    props: {
        slotForm: {
            type: Object,
            default: {}
        }
    },
    mounted(){
        console.log(this.userInfo)
        this.form.payee = this.userInfo.nick_name||this.userInfo.realName||this.userInfo.user_name
        this.form.payeeId = this.userInfo.user_id
        this.getTripList()
        this.businessId = this.$route.query.businessId;
        this.isEdit = this.$route.query.isEdit;
        if (this.businessId) {
            this.getDetail();
        }
        this.getSubjectList()
        this.getCostList()
        
        this.getSupplier()
        this.$refs.form.clearValidate();
        this.form.budgetInfo = '可用预算:  0.00\n已发生费用:  0.00\n审批中费用:  0.00'
    },
    methods: {
        async getTripList() {
            console.log(this.userInfo)
            let res = await FinancialManagementApi.listBusinessTripApply(this.userInfo.user_id);
            this.tripList = res.data.data
        },
      
        changeTripApply(v) {
            // console.log(v)
            let item = this.tripList.find(ele => {
                return ele.id === v
            })
            // console.log(item)
            if (item) {
                this.form.tripApply = item.titleName
            }
        },
        async getCostList(){
            let res = await CostApi.getList()
            if (res.data.code === 0) {
                this.costList = res.data.data.records
            }
        },
        async getSubjectList() {
            let res = await subjectManageApi.getList(this.searchForm)
            if (res.data.code === 0) {
                this.subjectList = res.data.data
            }
        },
        async getSubjetRow(row) { 
            // console.log(id)
            // if(this.subjectList.length===0){
            //     await this.getSubjectList()
            // }
            // console.log(id)
            // let row = this.getTreeName(this.subjectList, id)
            // if(!row&&id)return
            console.log(row)
            this.form.subjectName = row? row.subjectName:null
            this.form.subjectCode = row? row.subjectCode:null
            this.form.subjectId = row? row.id:null   
            this.form.costId = row? row.costCenterId:null
            this.form.costName =  row? row.costName:null
            this.form.budgetInfo = row? `可用预算:  ${row.availableBudget || 0.00}\n已发生费用:  ${row.expensesIncurred || 0.00}\n审批中费用: ${row.expensesUnderReview || 0.00}`:null
            this.getFeeDetail()
        },
        getCostItem(v){
            // console.log(v)
            let row = this.costList.find(ele=>{
                return ele.costName===v
            })
            // console.log(row)
            this.form.costId = row.id
            this.getFeeDetail()
        },
        async getSupplier() {
            let res = await UserApi.contractSupplier('')
            if (res.data.code === 0 || res.data.code === 200) {
                this.supplyList = res.data.data
            }
        },
        changeRow(row) {
            const diffDay = getDateDifference(row.startTime, row.endTime)
            if (diffDay < 0) {
                this.$message.error('开始时间不得大于结束时间')
                return false
            }
            return true
        },
       async getSupplyRow(v){
            if(this.supplyList.length===0){
               await this.getSupplier()
            }
            let row = this.supplyList.find(ele=>{
                return ele.id === v
            })
            if(!row)return
            this.form.supplierId = row.id
            this.form.supplierName = row.supplierName
            if (row.supplierSettlementList && row.supplierSettlementList.length > 0){
                this.form.bankName = row.supplierSettlementList[0].openBank
                this.form.bankAccount = row.supplierSettlementList[0].bankAccount
            }
           
        },
       async getFeeDetail(){
            if(this.form.costId&&this.form.subjectId){
                let res = await subjectManageApi.subjectMoney(this.form.subjectId,this.form.costId)
                // console.log(res)
                if(res.data.code===0){
                    let row = res.data.data
                    // this.form.subjectCode = row.subjectCode
                    this.form.budgetInfo = `可用预算:  ${row.availableBudget || 0.00}\n已发生费用:  ${row.expensesIncurred || 0.00}\n审批中费用: ${row.expensesUnderReview || 0.00}`
                }
            }
        },
        getTreeName(treeList, id) {
            let _this = this
            for (let i = 0; i < treeList.length; i++) {
                let treeItem = treeList[i]
                if (treeItem.id === id) {
                    return treeItem
                } else {
                    if (treeItem.childList && treeItem.childList.length > 0) {
                        let res = _this.getTreeName(treeItem.childList, id)
                        if (res) {
                            return res
                        }
                    }
                }
            }
        }, 
        testValue(key){
            if (!this.slotForm.applyReason) {
                this.$message.error('请输入申请事由')
                return false
            }
            for(const row of this.form[key]){
                if(!this.changeRow(row)){
                    return false
                }
            }
            return true
        },
        deleteRow(row,key){
            this.form[key] = this.form[key].filter(ele=>{return ele!==row})
        }
    },
    computed: {
        disabled() {
            return this.businessId && !this.$route.query.isEdit;
        },
        ...mapGetters(['userInfo']),
    },
}