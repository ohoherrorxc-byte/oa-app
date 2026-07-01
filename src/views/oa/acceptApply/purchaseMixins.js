import subjectManageApi from '@/api/subjectManage'
import { numberToTraditionalChinese } from '@/util/util'
import autoAddress from '@/components/autoAddress/index'
import CostApi from '@/api/cost/index'
export const mixins = {
    components: {
        autoAddress
    },
    data() {
        return {
            subjectList: [],
            costList: [],
            isEdit: false,
            businessId: null,
            deptProps: {
                label: "subjectName",
                value: "id",
                children: "childList",
            },
            searchForm: {
                currentPage: 1,
                pageSize: 10000,
            },
            form: {
                budgetInfo: null,
                costName: null,
                subjectName: null,
                subjectCode: null,
                costId: null,
                purchaseDetailList: []
            }
        }
    },
    mounted() {
        this.getSubjectList()
        this.getCostList()      
    },
    methods: {
        async getCostList() {
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
        getSubjetRow(row,index) {
            let item = this.getTreeName(this.subjectList, row.subjectId)
            if (!item) return
            // this.form.costName = row.costName
            row.subjectName = item.subjectName
            row.subjectCode = item.subjectCode
            row.subjectNo = item.subjectCode
            row.subjectId = item.subjectId
            row.avaliableFee = item.availableBudget
            row.costedFee = item.expensesIncurred
            row.underApprovalFee = item.expensesUnderReview
            row.budgetInfo = `可用预算:  ${item.availableBudget || 0.00}<br/><span style='color:blue'>已发生费用:  ${item.expensesIncurred || 0.00}</span><br/><span style='color:green'>审批中费用: ${item.expensesUnderReview || 0.00}</span>`
            this.getFeeDetail(row,index)
        },
        getCostItem(row, index) {
            let obj = this.costList.find(ele => {
                return ele.costName === row.costCenterName
            })
            console.log(obj)
            row.costCenterId = obj.id
            this.$set(this.form.purchaseDetailList, index, row)
            this.getFeeDetail(row, index)
        },
        async getFeeDetail(row, index) {
            if (row.costCenterId && row.subjectId) {
                let res = await subjectManageApi.subjectMoney(row.subjectId, row.costCenterId )
                console.log(res)
                if (res.data.code === 0) {
                    let data = res.data.data
                    row.budgetInfo = `可用预算:  ${data.availableBudget || 0.00}<br/><span style='color:blue'>已发生费用:  ${data.expensesIncurred || 0.00}</span><br/><span style='color:green'>审批中费用: ${data.expensesUnderReview || 0.00}</span>`
                    this.$set(this.form.purchaseDetailList, index, row)
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
    }
}