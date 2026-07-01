import request from '@/router/axios';

export default class TemporarySaveApi {
  static budgetApproval(data) {
    return request({
      url: '/api/oa-flow/project/budget/save-budget',
      method: 'post',
      data
    })
  }

  static purchaseApproval(data) {
    return request({
      url: '/api/oa-flow/procurement/contract/save-procurement',
      method: 'post',
      data
    })
  }
  static firewall(data) {
    return request({
      url: '/api/oa-flow/operation/fireWall/save-fireWall',
      method: 'post',
      data
    })
  }
  //维修
  static maintenanceApply(data) {
    return request({
      url: '/api/oa-flow/operation/property/save-property',
      method: 'post',
      data
    })
  }
  //领用
  static receiveApplication(data) {
    return request({
      url: '/api/oa-flow/operation/property/save-property',
      method: 'post',
      data
    })
  }
  //归还
  static returnApplication(data) {
    return request({
      url: '/api/oa-flow/operation/property/save-property',
      method: 'post',
      data
    })
  }
  //报废
  static scrappingApplication(data) {
    return request({
      url: '/api/oa-flow/operation/property/save-property',
      method: 'post',
      data
    })
  }
  //入库
  static storageApplication(data) {
    return request({
      url: '/api/oa-flow/operation/property/save-property',
      method: 'post',
      data
    })
  }
  //转让
  static transferPartSaveDraft(data) {
    return request({
      // url: '/api/oa-flow/operation/part/save-partTranfer',
      url: '/api/oa-flow/application/testingPartEquipment/transfer/saveDraft',
      method: 'post',
      data
    })
  }
  static usingPartSaveDraft(data) {
    return request({
      url: '/api/oa-flow/application/testingPartEquipment/using/saveDraft',
      method: 'post',
      data
    })
  }
  static scrapPartSaveDraft(data) {
    return request({
      url: '/api/oa-flow/application/testingPartEquipment/scrap/saveDraft',
      method: 'post',
      data
    })
  }
  static returnPartSaveDraft(data) {
    return request({
      url: '/api/oa-flow/application/testingPartEquipment/return/saveDraft',
      method: 'post',
      data
    })
  }
  static stockInPartSaveDraft(data) {
    return request({
      url: '/api/oa-flow/application/testingPartEquipment/stockIn/saveDraft',
      method: 'post',
      data
    })
  }
  //保存
  static saveParts(data) {
    return request({
      url: '/api/oa-flow/operation/part/save-part',
      method: 'post',
      data
    })
  }
  //自定义表单
  static customFlow(data) {
    return request({
      url: '/api/oa-flow/custom/approval/save-custom',
      method: 'post',
      data
    })
  }
  //入职
  static saveJoin(data) {
    return request({
      url: '/api/oa-flow/operation/user/save-join',
      method: 'post',
      data
    })
  }
  //离职
  static saveLeave(data) {
    return request({
      url: '/api/oa-flow/operation/user/save-leave',
      method: 'post',
      data
    })
  }
  //销售合同保存
  static saveSaleContractApply(data) {
    return request({
      url: '/api/oa-flow/sale/contract/saveSaleContractApply',
      method: 'post',
      data
    })
  }
  //销售合同变更
  static saveSaleContractChangeApply(data) {
    return request({
      url: '/api/oa-flow/saleContractChange/saveSaleContractChangeApply',
      method: 'post',
      data
    })
  }
  //开票申请
  static saveInvoiceApplication(data) {
    return request({
      url: '/api/oa-flow/sale/contract/saveSaleContractApply',
      method: 'post',
      data
    })
  }
  //发票申请
  static invoiceApply(data) {
    return request({
      url: '/api/oa-portal/invoice/commonSave',
      method: 'post',
      data
    })
  }
  //销售PO订单申请
  static saveSaleOrderApply(data) {
    return request({
      url: '/api/oa-flow/sale/order/saveSaleOrderApply',
      method: 'post',
      data
    })
  }
  //补卡申请
  static startAddClockIn(data) {
    return request({
      url: '/api/oa-flow/addClockIn/save-addClockIn',
      method: 'post',
      data
    })
  }
  //请假申请
  static leaveApply(data) {
    return request({
      url: '/api/oa-flow/leave/save-leave',
      method: 'post',
      data
    })
  }
  //加班申请
  static workOvertimeApply(data) {
    return request({
      url: '/api/oa-flow/workOvertime/save-workOvertime',
      method: 'post',
      data
    })
  }
  //一般采购保存
  static savePurchaseApply(data) {
    return request({
      url: '/api/oa-portal/purchaseApply/save',
      method: 'post',
      data
    })
  }

  //采购委员会决议申请
  static savePurchaseCommissionDecisionApply(data) {
    return request({
      url: '/api/oa-portal/purchaseCommissionDecision/save',
      method: 'post',
      data
    })
  }
  //发起零星费用支付审批单
  static miscellaneousCost(data) {
    return request({
      url: '/api/oa-flow/pettyCostPay/save-pettyCostPay',
      method: 'post',
      data
    })
  }

  //认款申请单
  static saveSubscriptionApply(data) {
    return request({
      url: '/api/oa-portal/subscribeApply/saveOrUpdate',
      method: 'post',
      data
    })
  }

  //一般通用采购合同
  static savePurchaseContractApply(data) {
    return request({
      url: '/api/oa-portal/purchaseContract/saveOrUpdate',
      method: 'post',
      data
    })
  }
  //调薪调岗
  static transferSalaryAndPost(data) {
    return request({
      url: '/api/oa-flow/employeeTransfer/save-employeeTransfer',
      method: 'post',
      data
    })
  }
  //转正
  static regularizationApply(data) {
    return request({
      url: '/api/oa-flow/employeeRegularization/save-employeeRegularization',
      method: 'post',
      data
    })
  }
  //培训
  static trainingApplication(data) {
    return request({
      url: '/api/oa-flow/trainingApply/save-trainingApply',
      method: 'post',
      data
    })
  }
  //tsp接口申请
  static tspInterface(data) {
    return request({
      url: '/api/oa-flow/tspUpdate/save-tspUpdate',
      method: 'post',
      data
    })
  }
  //tsp上线申请
  static tspOnline(data) {
    return request({
      url: '/api/oa-flow/tspLaunch/save-tspLaunch',
      method: 'post',
      data
    })
  }
  //appOnline
  static appOnline(data) {
    return request({
      url: '/api/oa-flow/appLaunch/save-appLaunch',
      method: 'post',
      data
    })
  }
  //appOnline25
  static appOnline25(data) {
    return request({
      url: '/api/oa-flow/appLaunchApply25/save-appLaunch',
      method: 'post',
      data
    })
  }
  //差旅报销
  static travelReimbursement(data) {
    return request({
      url: '/api/oa-flow/tripReimburse/save-tripReimburse',
      method: 'post',
      data
    })
  }
  //因公出差
  static onBusinessTrip(data) {
    return request({
      url: '/api/oa-flow/businessTrip/save-businessTrip',
      method: 'post',
      data
    })
  }
  //业务招待
  static async businessHospitality(data) {
    return request({
      url: '/api/oa-flow/businessHospitality/save-businessHospitality',
      method: 'post',
      data
    })
  }
  //市内交通
  static async cityTraffic(data) {
    return request({
      url: '/api/oa-flow/cityTraffic/save-cityTraffic',
      method: 'post',
      data
    })
  }
  //公费经费
  static async unionFunds(data) {
    return request({
      url: '/api/oa-flow/unionFunds/save-unionFunds',
      method: 'post',
      data
    })
  }
  //License数据核对验收单
  static saveLicensePurchaseContractApply(data) {
    return request({
      url: '/api/oa-flow/licensePurchaseContract/saveOrUpdate',
      method: 'post',
      data
    })
  }
  //BOM及框架采购合同评审
  static saveBomPurchaseContractApply(data) {
    return request({
      url: '/api/oa-portal/bomPurchaseContract/saveOrUpdate',
      method: 'post',
      data
    })
  }

  //bom采购订单申请
  static saveBomPurchaseOrderApply(data) {
    return request({
      url: '/api/oa-portal/bomPurchaseOrder/save',
      method: 'post',
      data
    })
  }

  //bom采购订单申请
  static savePurchaseContractPayApply(data) {
    return request({
      url: '/api/oa-portal/purchaseContractPay/save',
      method: 'post',
      data
    })
  }
  //验收申请单
  static saveAcceptApply(data) {
    return request({
      url: '/api/oa-portal/acceptApply/save',
      method: 'post',
      data
    })
  }
  //bom采购合同付款
  static saveBomPurchaseContractPay(data) {
    return request({
      url: '/api/oa-portal/bomPurchaseContractPay/save',
      method: 'post',
      data
    })
  }

  //预算追加与调整
  static budgetAdditions(data) {
    return request({
      url: '/api/oa-flow/changeSubjectCost/save-changeSubjectCost',
      method: 'post',
      data
    })
  }
  //员工续签
  static employeeRenewal(data) {
    return request({
      url: '/api/oa-flow/renewContract/save-renewContract',
      method: 'post',
      data
    })
  }
  //公司内部划款
  static internalTransfer(data) {
    return request({
      url: '/api/oa-flow/companyTransfer/save-companyTransfer',
      method: 'post',
      data
    })
  }

  static invoiceUpdate(data) {
    return request({
      url: '/api/oa-flow/changeInvoice/save-changeInvoice',
      method: 'post',
      data
    })
  }
  //供应链子零件报废
  static scrapParts(data) {
    return request({
      url: '/api/oa-flow/financeCategoryScrapApply/save-financeCategoryScrap',
      method: 'post',
      data
    })
  }
  //领域领用接口
  static fieldApplication(data) {
    return request({
      url: '/api/oa-flow/operation/assemblyPart/save-assemblyPartReceive',
      method: 'post',
      data
    })
  }
  //门禁申请信息表
  static doorAccessControl(data) {
    return request({
      url: '/api/oa-flow/doorAccessControl/saveDraft',
      method: 'post',
      data
    })
  }

   //零件价格维护
   static partsPriceMaintenance(data) {
    return request({
      url: '/api/oa-flow/operation/partPrice/start-partsPrice',
      method: 'post',
      data
    })
  }

   //供应商订单更新
   static supplierOrderChange(data) {
    return request({
      url: '/api/oa-flow/operation/supplierOrderChange/save-supplierOrderChange',
      method: 'post',
      data
    })
  }
   //供应商订单发送
   static supplierOrderSend(data) {
    return request({
      url: '/api/oa-flow/operation/supplierOrderSend/save-supplierOrderSend',
      method: 'post',
      data
    })
  }
   //供应商订单更新
   static supplierOrderStatus(data) {
    return request({
      url: '/api/oa-flow/operation/supplierOrderStatus/save-supplierOrderStatus',
      method: 'post',
      data
    })
  }

  static banknoteApply(data) {
    return request({
      url: '/api/oa-flow/banknote/save-banknote',
      method: 'post',
      data
    })
  }

  static bomChangeApply(data) {
    return request({
      url: '/api/oa-flow/bomChange/save-BomChange',
      method: 'post',
      data
    })
  }
}
