import request from '@/router/axios';

export default class PurchaseCommissionDecisionApplyApi {
  //详情
  static details(businessId, applyNo) {
    let url = businessId ? `/api/oa-portal/purchaseCommissionDecision/detail?businessId=${businessId}` : `/api/oa-portal/purchaseCommissionDecision/detail?applyNo=${applyNo}`
    return request({
      url: url,
      method: 'get',
    })
  }

  //详情
  static selectList() {
    return request({
      url: `/api/oa-portal/purchaseCommissionDecision/selectList`,
      method: 'get',
    })
  }
  //评估项列表
  static getPurchaseSupplierEvalList() {
    return request({
      url: `/api/oa-portal/purchaseCommissionDecision/getPurchaseSupplierEvalList`,
      method: 'get',
    })
  }
  //采购委员会决议申请
  static saveSign = (data) => {
    return request({
      url: `/api/oa-portal/purchaseCommissionDecision/saveSign`,
      method: 'post',
      data
    })
  }
}
