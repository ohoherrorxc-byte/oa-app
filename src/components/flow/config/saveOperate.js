import SaveApi from '@/api/myFlow/operate/save.js'

//不同流程的时间轴
export default class SaveOperate {
    //项目预算审批单
    static async budgetApproval(data) {
        let res = await SaveApi.budgetApproval(data)
        return res
    }
    static async purchaseApproval(data) {
        let res = await SaveApi.purchaseApproval(data)
        return res
    }
    static async firewall(data) {
        let res = await SaveApi.firewall(data)
        return res
    }
    static async maintenanceApply(data) {
        let res = await SaveApi.maintenanceApply(data)
        return res
    }
    static async receiveApplication(data) {
        let res = await SaveApi.receiveApplication(data)
        return res
    }
    static async returnApplication(data) {
        let res = await SaveApi.returnApplication(data)
        return res
    }
    static async scrappingApplication(data) {
        let res = await SaveApi.scrappingApplication(data)
        return res
    }
    static async storageApplication(data) {
        let res = await SaveApi.storageApplication(data)
        return res
    }
    //盘点
    static async maintenanceParts(data) {
        let res = await SaveApi.maintenanceParts(data)
        return res
    }
    //领用
    static async receiveParts(data) {
        let res = await SaveApi.receiveParts(data)
        return res
    }
    //归还
    static async returnParts(data) {
        let res = await SaveApi.returnParts(data)
        return res
    }
    //报废
    static async scrappingParts(data) {
        let res = await SaveApi.scrappingParts(data)
        return res
    }
    //入库
    static async storageParts(data) {
        let res = await SaveApi.storageParts(data)
        return res
    }
    //transferParts转让
    static async transferParts(data) {
        let res = await SaveApi.transferParts(data)
        return res
    }
    static async customFlow(data) {
        let res = await SaveApi.customFlow(data)
        return res
    }
    // 入职
    static async entryWorkshop(data) {
        let res = await SaveApi.startJoin(data)
        return res
    }
    // 离职
    static async dimission(data) {
        let res = await SaveApi.startLeave(data)
        return res
    }
    // 加班
    static workOvertime(data) {
        return SaveApi.workOvertimeApply(data)
    }
    // 补卡
    static cardReplacement(data) {
        return SaveApi.startAddClockIn(data)
    }
    // 请假
    static askForLeave(data) {
        return SaveApi.leaveApply(data)
    }
    // 销售合同
    static async saleContractApplication(data) {
        let res = await SaveApi.saleContractStartProcess(data)
        return res
    }
    // 销售合同变更
    static async saleContractChangeApplication(data) {
        let res = await SaveApi.saleContractChangeStartProcess(data)
        return res
    }

    //开票申请
    static async invoiceApplication(data) {
        let res = await SaveApi.invoiceStartProcess(data)
        return res
    }
    //发票申请
    static async invoiceApply(data) {
        let res = await SaveApi.invoiceApply(data)
        return res
    }
    // 一般采购合同
    static async purchaseApplication(data) {
        let res = await SaveApi.purchaseStartProcess(data)
        return res
    }
    // 采购委员会决议申请
    static async purchaseCommissionDecisionApplication(data) {
        let res = await SaveApi.purchaseCommissionDecisionStartProcess(data)
        return res
    }
    // 发起零星费用支付审批单
    static async miscellaneousCost(data) {
        let res = await SaveApi.miscellaneousCost(data)
        return res
    }
    //认款申请单
    static async subscriptionApplication(data) {
        let res = await SaveApi.subscriptionStartProcess(data)
        return res
    }
    //一般通用采购合同
    static async purchaseContractApplication(data) {
        let res = await SaveApi.purchaseContractStartProcess(data)
        return res
    }
    //调薪调岗
    static async transferSalaryAndPost(data) {
        let res = await SaveApi.transferSalaryAndPost(data)
        return res
    }
    //转正
    static async regularizationApply(data) {
        let res = await SaveApi.regularizationApply(data)
        return res
    }
    //培训
    static async trainingApplication(data) {
        let res = await SaveApi.trainingApplication(data)
        return res
    }
    //tspInterface
    static async tspInterface(data) {
        let res = await SaveApi.tspInterface(data)
        return res
    }
    //tspOnline
    static async tspOnline(data) {
        let res = await SaveApi.tspOnline(data)
        return res
    }
    //appOnline
    static async appOnline(data) {
        let res = await SaveApi.appOnline(data)
        return res
    }
    //appOnline25
    static async appOnline25(data) {
        let res = await SaveApi.appOnline25(data)
        return res
    }
    //差旅报销
    static async travelReimbursement(data) {
        let res = await SaveApi.travelReimbursement(data)
        return res
    }
    //业务招待
    static async businessHospitality(data) {
        let res = await SaveApi.businessHospitality(data)
        return res
    }
    //市内交通
    static async cityTraffic(data) {
        let res = await SaveApi.cityTraffic(data)
        return res
    }
    //因公出差
    static async onBusinessTrip(data) {
        let res = await SaveApi.onBusinessTrip(data)
        return res
    }
    //工费经费
    static async unionFunds(data) {
        let res = await SaveApi.unionFunds(data)
        return res
    }
    //License数据核对验收单
    static async licensePurchaseContractApplication(data) {
        let res = await SaveApi.licensePurchaseContractStartProcess(data)
        return res
    }
    //BOM及框架采购合同评审
    static async bomPurchaseContractApplication(data) {
        let res = await SaveApi.bomPurchaseContractStartProcess(data)
        return res
    }
    //BOM及框架采购订单
    static async bomPurchaseOrderApplication(data) {
        let res = await SaveApi.bomPurchaseOrderStartProcess(data)
        return res
    }
    //一般通用采购合同付款申请
    static async purchaseContractPayApplication(data) {
        let res = await SaveApi.purchaseContractPayStartProcess(data)
        return res
    }
    //验收申请单
    static async acceptApply(data) {
        let res = await SaveApi.acceptApplyStartProcess(data)
        return res
    }
    //bom采购合同付款
    static async bomPurchaseContractPayApplication(data) {
        let res = await SaveApi.bomPurchaseContractPayStartProcess(data)
        return res
    }
    //预算追加与调整budgetAdditions
    static async budgetAdditions(data) {
        let res = await SaveApi.budgetAdditions(data)
        return res
    }
    //员工续签
    static async employeeRenewal(data) {
        let res = await SaveApi.employeeRenewal(data)
        return res
    }
    //公司内部划款申请单
    static async internalTransfer(data) {
        let res = await SaveApi.internalTransfer(data)
        return res
    }
    //发票变更
    static async invoiceUpdate(data) {
        let res = await SaveApi.invoiceUpdate(data)
        return res
    }
    //供应链子零件报废
    static async scrapParts(data) {
        let res = await SaveApi.scrapParts(data)
        return res
    }
    //领域领用计划外
    static async fieldApplication(data) {
        let res = await SaveApi.fieldApplication(data)
        return res
    }
    // 门禁申请信息表
    static async doorAccessControl(data) {
        let res = await SaveApi.doorAccessControl(data)
        return res
    }
    //零件价格维护
    static async partsPriceMaintenance(data) {
        let res = await SaveApi.partsPriceMaintenance(data)
        return res
    }
    //供应商订单变更
    static async supplierOrderChange(data) {
        let res = await SaveApi.supplierOrderChange(data)
        return res
    }
    //供应商订单发送
    static async supplierOrderSend(data) {
        let res = await SaveApi.supplierOrderSend(data)
        return res
    }
    //供应商订单状态
    static async supplierOrderStatus(data) {
        let res = await SaveApi.supplierOrderStatus(data)
        return res
    }
    static banknoteApply(data) {
        return SaveApi.banknoteApply(data)
    }
    static bomChangeApply(data) {
        return SaveApi.bomChangeApply(data)
    }
}
