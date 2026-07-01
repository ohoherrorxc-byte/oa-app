import TemporarySaveApi from '@/api/myFlow/operate/temporarySave.js'
//不同流程的时间轴
export default class TemporarySaveOperate {
  //项目预算审批单
  static async budgetApproval(data) {
    let res = await TemporarySaveApi.budgetApproval(data)
    return res
  }
  static async purchaseApproval(data) {
    let res = await TemporarySaveApi.purchaseApproval(data)
    return res
  }
  static async firewall(data) {
    let res = await TemporarySaveApi.firewall(data)
    return res
  }
  static async maintenanceApply(data) {
    let res = await TemporarySaveApi.maintenanceApply(data)
    return res
  }
  static async receiveApplication(data) {
    let res = await TemporarySaveApi.receiveApplication(data)
    return res
  }
  static async returnApplication(data) {
    let res = await TemporarySaveApi.returnApplication(data)
    return res
  }
  static async scrappingApplication(data) {
    let res = await TemporarySaveApi.scrappingApplication(data)
    return res
  }
  static async storageApplication(data) {
    let res = await TemporarySaveApi.storageApplication(data)
    return res
  }
  //盘点
  static async maintenanceParts(data) {
    let res = await TemporarySaveApi.saveParts(data)
    return res
  }
  //领用
  static async receiveParts(data) {
    // let res = await TemporarySaveApi.saveParts(data)
    let res = await TemporarySaveApi.usingPartSaveDraft(data)
    return res
  }
  //归还
  static async returnParts(data) {
    // let res = await TemporarySaveApi.saveParts(data)
    let res = await TemporarySaveApi.returnPartSaveDraft(data)
    return res
  }
  //报废
  static async scrappingParts(data) {
    // let res = await TemporarySaveApi.saveParts(data)
    let res = await TemporarySaveApi.scrapPartSaveDraft(data)
    return res
  }
  //入库
  static async storageParts(data) {
    // let res = await TemporarySaveApi.saveParts(data)
    let res = await TemporarySaveApi.stockInPartSaveDraft(data)
    return res
  }
  //transferParts转让
  static async transferParts(data) {
    let res = await TemporarySaveApi.transferPartSaveDraft(data)
    return res
  }
  static async customFlow(data) {
    let res = await TemporarySaveApi.customFlow(data)
    return res
  }
  //入职
  static async entryWorkshop(data) {
    let res = await TemporarySaveApi.saveJoin(data)
    return res
  }
  //离职
  static async dimission(data) {
    let res = await TemporarySaveApi.saveLeave(data)
    return res
  }
  // 加班
  static workOvertime(data) {
    return TemporarySaveApi.workOvertimeApply(data)
  }
  // 补卡
  static cardReplacement(data) {
    return TemporarySaveApi.startAddClockIn(data)
  }
  // 请假
  static askForLeave(data) {
    return TemporarySaveApi.leaveApply(data)
  }

  //销售合同
  static async saleContractApplication(data) {
    let res = await TemporarySaveApi.saveSaleContractApply(data);
    return res;
  }
  //销售合同变更
  static async saleContractChangeApplication(data) {
    let res = await TemporarySaveApi.saveSaleContractChangeApply(data);
    return res;
  }
  //开票申请
  static async invoiceApplication(data) {
    let res = await TemporarySaveApi.saveInvoiceApplication(data);
    return res;
  }
  //发票申请
  static async invoiceApply(data) {
    let res = await TemporarySaveApi.invoiceApply(data)
    return res
  }
  //销售PO订单申请
  static async saleOrderApplication(data) {
    let res = await TemporarySaveApi.saveSaleOrderApply(data);
    return res;
  }
  //一般采购申请
  static async purchaseApplication(data) {
    let res = await TemporarySaveApi.savePurchaseApply(data);
    return res;
  }
  //采购委员会决议申请
  static async purchaseCommissionDecisionApplication(data) {
    let res = await TemporarySaveApi.savePurchaseCommissionDecisionApply(data);
    return res;
  }
  //发起零星费用支付审批单
  static async miscellaneousCost(data) {
    let res = await TemporarySaveApi.miscellaneousCost(data);
    return res;
  }
  //认款申请单
  static async subscriptionApplication(data) {
    let res = await TemporarySaveApi.saveSubscriptionApply(data);
    return res;
  }
  //一般通用采购合同
  static async purchaseContractApplication(data) {
    let res = await TemporarySaveApi.savePurchaseContractApply(data);
    return res;
  }
  //调薪调岗
  static async transferSalaryAndPost(data) {
    let res = await TemporarySaveApi.transferSalaryAndPost(data)
    return res
  }
  //转正
  static async regularizationApply(data) {
    let res = await TemporarySaveApi.regularizationApply(data)
    return res
  }
  //培训
  static async trainingApplication(data) {
    let res = await TemporarySaveApi.trainingApplication(data)
    return res
  }
  //tspInterface
  static async tspInterface(data) {
    let res = await TemporarySaveApi.tspInterface(data)
    return res
  }
  //tspOnline
  static async tspOnline(data) {
    let res = await TemporarySaveApi.tspOnline(data)
    return res
  }
  //appOnline
  static async appOnline(data) {
    let res = await TemporarySaveApi.appOnline(data)
    return res
  }
  //appOnline25
  static async appOnline25(data) {
    let res = await TemporarySaveApi.appOnline25(data)
    return res
  }
  //差旅报销
  static async travelReimbursement(data) {
    let res = await TemporarySaveApi.travelReimbursement(data)
    return res
  }
  //因公出差
  static async onBusinessTrip(data) {
    let res = await TemporarySaveApi.onBusinessTrip(data)
    return res
  }
  //业务招待
  static async businessHospitality(data) {
    let res = await TemporarySaveApi.businessHospitality(data)
    return res
  }
  //市内交通
  static async cityTraffic(data) {
    let res = await TemporarySaveApi.cityTraffic(data)
    return res
  }
  //工费经费
  static async unionFunds(data) {
    let res = await TemporarySaveApi.unionFunds(data)
    return res
  }
  //License数据核对验收单
  static async licensePurchaseContractStartProcess(data) {
    let res = await TemporarySaveApi.licensePurchaseContractStartProcess(data)
    return res
  }
  static async licensePurchaseContractApplication(data) {
    let res = await TemporarySaveApi.saveLicensePurchaseContractApply(data);
    return res;
  }
  static async bomPurchaseContractApplication(data) {
    let res = await TemporarySaveApi.saveBomPurchaseContractApply(data);
    return res;
  }
  static async bomPurchaseOrderApplication(data) {
    let res = await TemporarySaveApi.saveBomPurchaseOrderApply(data);
    return res;
  }
  static async purchaseContractPayApplication(data) {
    let res = await TemporarySaveApi.savePurchaseContractPayApply(data);
    return res;
  }
  static async acceptApply(data) {
    let res = await TemporarySaveApi.saveAcceptApply(data);
    return res;
  }
  static async bomPurchaseContractPayApplication(data) {
    let res = await TemporarySaveApi.saveBomPurchaseContractPay(data);
    return res;
  }
  //预算追加与调整budgetAdditions
  static async budgetAdditions(data) {
    let res = await TemporarySaveApi.budgetAdditions(data)
    return res
  }
  //员工续签
  static async employeeRenewal(data) {
    let res = await TemporarySaveApi.employeeRenewal(data)
    return res
  }
  //公司内部划款申请单
  static async internalTransfer(data) {
    let res = await TemporarySaveApi.internalTransfer(data)
    return res
  }
  //发票变更
  static async invoiceUpdate(data) {
    let res = await TemporarySaveApi.invoiceUpdate(data)
    return res
  }
  //供应链子零件报废
  static async scrapParts(data) {
    let res = await TemporarySaveApi.scrapParts(data)
    return res
  }
  //领域领用计划外
  static async fieldApplication(data) {
    let res = await TemporarySaveApi.fieldApplication(data)
    return res
  }
  // 门禁申请信息表
  static async doorAccessControl(data) {
    let res = await TemporarySaveApi.doorAccessControl(data)
    return res
  }
  //零件价格维护
  static async partsPriceMaintenance(data) {
    let res = await TemporarySaveApi.partsPriceMaintenance(data)
    return res
  }

  //供应商订单变更
  static async supplierOrderChange(data) {
    let res = await TemporarySaveApi.supplierOrderChange(data)
    return res
  }
  //供应商订单发送
  static async supplierOrderSend(data) {
    let res = await TemporarySaveApi.supplierOrderSend(data)
    return res
  }
  //供应商订单状态
  static async supplierOrderStatus(data) {
    let res = await TemporarySaveApi.supplierOrderStatus(data)
    return res
  }
  static async banknoteApply(data) {
    let res = await TemporarySaveApi.banknoteApply(data)
    return res
  }
  static async bomChangeApply(data) {
    let res = await TemporarySaveApi.bomChangeApply(data)
    return res
  }
}
