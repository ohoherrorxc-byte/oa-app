import request from '@/router/axios';

export default class SaveApi {
  static budgetApproval(data) {
    return request({
      url: '/api/oa-flow/project/budget/start-budget',
      method: 'post',
      data
    })
  }
  static purchaseApproval(data) {
    return request({
      url: '/api/oa-flow/procurement/contract/start-procurement',
      method: 'post',
      data
    })
  }
  static firewall(data) {
    return request({
      url: '/api/oa-flow/operation/fireWall/start-fireWall',
      method: 'post',
      data
    })
  }
  //维修
  static maintenanceApply(data) {
    return request({
      url: '/api/oa-flow/operation/property/start-service',
      method: 'post',
      data
    })
  }
  //领用
  static receiveApplication(data) {
    return request({
      url: '/api/oa-flow/operation/property/start-receive',
      method: 'post',
      data
    })
  }
  //归还
  static returnApplication(data) {
    return request({
      url: '/api/oa-flow/operation/property/start-return',
      method: 'post',
      data
    })
  }
  //报废
  static scrappingApplication(data) {
    return request({
      url: '/api/oa-flow/operation/property/start-scrap',
      method: 'post',
      data
    })
  }
  // 入库
  // 资产入库
  static storageApplication(data) {
    return request({
      url: '/api/oa-flow/operation/property/start-warehousing',
      method: 'post',
      data
    })
  }
  //盘点
  static maintenanceParts(data) {
    return request({
      url: '/api/oa-flow/operation/part/start-partCheck',
      method: 'post',
      data
    })
  }
  //领用
  static receiveParts(data) {
    return request({
      // url: '/api/oa-flow/operation/part/start-partReceive',
      url: '/api/oa-flow/application/testingPartEquipment/using/startOrSaveBackUpdate',
      method: 'post',
      data
    })
  }
  //归还
  static returnParts(data) {
    return request({
      // url: '/api/oa-flow/operation/part/start-partReturn',
      url: '/api/oa-flow/application/testingPartEquipment/return/startOrSaveBackUpdate',
      method: 'post',
      data
    })
  }
  //报废
  static scrappingParts(data) {
    return request({
      // url: '/api/oa-flow/operation/part/start-partScrap',
      url: '/api/oa-flow/application/testingPartEquipment/scrap/startOrSaveBackUpdate',
      method: 'post',
      data
    })
  }
  //入库
  static storageParts(data) {
    return request({
      // url: '/api/oa-flow/operation/part/start-partWarehousing',
      url: '/api/oa-flow/application/testingPartEquipment/stockIn/startOrSaveBackUpdate',
      method: 'post',
      data
    })
  }
  //转让
  static transferParts(data) {
    return request({
      // url: '/api/oa-flow/operation/part/start-partTranfer',
      url: '/api/oa-flow/application/testingPartEquipment/transfer/startOrSaveBackUpdate',
      method: 'post',
      data
    })
  }

  //自定义表单
  static customFlow(data) {
    return request({
      url: '/api/oa-flow/custom/approval/start-custom',
      method: 'post',
      data
    })
  }
  //入职
  static startJoin(data) {
    return request({
      url: '/api/oa-flow/operation/user/start-join',
      method: 'post',
      data
    })
  }
  //离职
  static startLeave(data) {
    return request({
      url: '/api/oa-flow/operation/user/start-leave',
      method: 'post',
      data
    })
  }
  //销售合同申请
  static saleContractStartProcess(data) {
    return request({
      url: '/api/oa-flow/sale/contract/startProcess',
      method: 'post',
      data
    })
  }
  //销售合同变更
  static saleContractChangeStartProcess(data) {
    return request({
      url: '/api/oa-flow/saleContractChange/startProcess',
      method: 'post',
      data
    })
  }
  //发票申请
  static invoiceStartProcess(data) {
    return request({
      url: '/api/oa-flow/sale/contract/startProcess',
      method: 'post',
      data
    })
  }
  //发票申请
  static invoiceApply(data) {
    return request({
      url: '/api/oa-portal/invoice/commonStartProcess',
      method: 'post',
      data
    })
  }


  //销售PO订单申请
  static saleOrderStartProcess(data) {
    return request({
      url: '/api/oa-flow/sale/order/startProcess',
      method: 'post',
      data
    })
  }
  //补卡申请
  static startAddClockIn(data) {
    return request({
      url: '/api/oa-flow/addClockIn/start-addClockIn',
      method: 'post',
      data
    })
  }
  //请假申请
  static leaveApply(data) {
    return request({
      url: '/api/oa-flow/leave/start-leave',
      method: 'post',
      data
    })
  }
  //加班申请
  static workOvertimeApply(data) {
    return request({
      url: '/api/oa-flow/workOvertime/start-workOvertime',
      method: 'post',
      data
    })
  }
  //一般采购申请
  static purchaseStartProcess(data) {
    return request({
      url: '/api/oa-portal/purchaseApply/startProcess',
      method: 'post',
      data
    })
  }
  //采购委员会决议申请
  static purchaseCommissionDecisionStartProcess(data) {
    return request({
      url: '/api/oa-portal/purchaseCommissionDecision/startProcess',
      method: 'post',
      data
    })
  }
  //发起零星费用支付审批单
  static miscellaneousCost(data) {
    return request({
      url: '/api/oa-flow/pettyCostPay/start-pettyCostPay',
      method: 'post',
      data
    })
  }
  //认款申请单
  static subscriptionStartProcess(data) {
    return request({
      url: '/api/oa-portal/subscribeApply/startProcess',
      method: 'post',
      data
    })
  }
  //一般通用采购合同
  static purchaseContractStartProcess(data) {
    return request({
      url: '/api/oa-portal/purchaseContract/startProcess',
      method: 'post',
      data
    })
  }
  //调薪调岗
  static transferSalaryAndPost(data) {
    return request({
      url: '/api/oa-flow/employeeTransfer/start-employeeTransfer',
      method: 'post',
      data
    })
  }
  //转正
  static regularizationApply(data) {
    return request({
      url: '/api/oa-flow/employeeRegularization/start-employeeRegularization',
      method: 'post',
      data
    })
  }
  //培训
  static trainingApplication(data) {
    return request({
      url: '/api/oa-flow/trainingApply/start-trainingApply',
      method: 'post',
      data
    })
  }
  //tsp接口申请
  static tspInterface(data) {
    return request({
      url: '/api/oa-flow/tspUpdate/start-tspUpdate',
      method: 'post',
      data
    })
  }
  //tsp上线申请
  static tspOnline(data) {
    return request({
      url: '/api/oa-flow/tspLaunch/start-tspLaunch',
      method: 'post',
      data
    })
  }
  //appOnline
  static appOnline(data) {
    return request({
      url: '/api/oa-flow/appLaunch/start-appLaunch',
      method: 'post',
      data
    })
  }
  //appOnline25
  static appOnline25(data) {
    return request({
      url: '/api/oa-flow/appLaunchApply25/start-appLaunch',
      method: 'post',
      data
    })
  }
  //差旅报销
  static travelReimbursement(data) {
    return request({
      url: '/api/oa-flow/tripReimburse/start-tripReimburse',
      method: 'post',
      data
    })
  }
  //因公出差
  static onBusinessTrip(data) {
    return request({
      url: '/api/oa-flow/businessTrip/start-businessTrip',
      method: 'post',
      data
    })
  }
  //业务招待
  static async businessHospitality(data) {
    return request({
      url: '/api/oa-flow/businessHospitality/start-businessHospitality',
      method: 'post',
      data
    })
  }
  //市内交通
  static async cityTraffic(data) {
    return request({
      url: '/api/oa-flow/cityTraffic/start-cityTraffic',
      method: 'post',
      data
    })
  }
  //公费经费
  static async unionFunds(data) {
    return request({
      url: '/api/oa-flow/unionFunds/start-unionFunds',
      method: 'post',
      data
    })
  }
  //License数据核对验收单
  static licensePurchaseContractStartProcess(data) {
    return request({
      url: '/api/oa-portal/licensePurchaseContract/startProcess',
      method: 'post',
      data
    })
  }
  //BOM及框架采购合同评审
  static bomPurchaseContractStartProcess(data) {
    return request({
      url: '/api/oa-portal/bomPurchaseContract/startProcess',
      method: 'post',
      data
    })
  }
  //BOM及框架采购订单
  static bomPurchaseOrderStartProcess(data) {
    return request({
      url: '/api/oa-portal/bomPurchaseOrder/startProcess',
      method: 'post',
      data
    })
  }
  //一般通用采购合同付款申请
  static purchaseContractPayStartProcess(data) {
    return request({
      url: '/api/oa-portal/purchaseContractPay/startProcess',
      method: 'post',
      data
    })
  }
  //验收申请单
  static acceptApplyStartProcess(data) {
    return request({
      url: '/api/oa-portal/acceptApply/startProcess',
      method: 'post',
      data
    })
  }
  //bom采购合同付款
  static bomPurchaseContractPayStartProcess(data) {
    return request({
      url: '/api/oa-portal/bomPurchaseContractPay/startProcess',
      method: 'post',
      data
    })
  }
  //预算追加与调整
  static budgetAdditions(data) {
    return request({
      url: '/api/oa-flow/changeSubjectCost/start-changeSubjectCost',
      method: 'post',
      data
    })
  }
  //员工续签
  static employeeRenewal(data) {
    return request({
      url: '/api/oa-flow/renewContract/start-renewContract',
      method: 'post',
      data
    })
  }
  //公司内部划款
  static internalTransfer(data) {
    return request({
      url: '/api/oa-flow/companyTransfer/start-companyTransfer',
      method: 'post',
      data
    })
  }
  //发票更新
  static invoiceUpdate(data) {
    return request({
      url: '/api/oa-flow/changeInvoice/start-changeInvoice',
      method: 'post',
      data
    })
  }
  //供应链子零件报废
  static scrapParts(data) {
    return request({
      url: '/api/oa-flow/financeCategoryScrapApply/start-financeCategoryScrap',
      method: 'post',
      data
    })
  }
  //领域领用接口
  static fieldApplication(data) {
    return request({
      url: '/api/oa-flow/operation/assemblyPart/start-assemblyPartReceive',
      method: 'post',
      data
    })
  }
  //门禁申请信息表
  static doorAccessControl(data) {
    return request({
      url: '/api/oa-flow/doorAccessControl/startOrSaveBackUpdate',
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
      url: '/api/oa-flow/operation/supplierOrderChange/start-supplierOrderChange',
      method: 'post',
      data
    })
  }
  static supplierOrderSend(data) {
    return request({
      url: '/api/oa-flow/operation/supplierOrderSend/start-supplierOrderSend',
      method: 'post',
      data
    })
  }
  
 //供应商订单更新
 static supplierOrderStatus(data) {
  return request({
    url: '/api/oa-flow/operation/supplierOrderStatus/start-supplierOrderStatus',
    method: 'post',
    data
  })
}

  static banknoteApply(data) {
    return request({
      url: '/api/oa-flow/banknote/start-banknote',
      method: 'post',
      data
    })
  }

  static bomChangeApply(data) {
    return request({
      url: '/api/oa-flow/bomChange/start-BomChange',
      method: 'post',
      data
    })
  }
}
