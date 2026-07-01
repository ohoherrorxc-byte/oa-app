import request from '@/router/axios';

export default class PurchaseApplyApi {
  //详情
  static details(params) {
    return request({
      url: `/api/oa-portal/purchaseApply/detail`,
      method: 'get',
      params
    })
  }
  static detailsMultiple(params) {
    return request({
      url: `/api/oa-portal/purchaseApply/detailsMultiple`,
      method: 'get',
      params
    })
  }
  
  //详情
  static selectList() {
    return request({
      url: `/api/oa-portal/purchaseApply/selectList`,
      method: 'get',
    })
  }
  static exportPurchaseDetail() {
    return request({
      url: `/api/oa-portal/purchaseApply/exportPurchaseDetail`,
      method: 'get',
      responseType: "blob"
    })
  }
}
