import request from '@/router/axios';

export default class procurementRelatedApi {
  static saveByBomOrder(data) {
    return request({
      url: '/api/oa-portal/acceptApply/saveByBomOrder',
      method: 'post',
      data
    })
  }
  static saveByPurchaseApply(data) {
    return request({
      url: '/api/oa-portal/acceptApply/saveByPurchaseApply',
      method: 'post',
      data
    })
  }
  static saveByPay(data) {
    return request({
      url: '/api/oa-portal/acceptApply/saveByPurchaseApply',
      method: 'post',
      data
    })
  }
  static savePayByAcceptApply(data){
    return request({
      url: '/api/oa-portal/acceptApply/savePayByAcceptApply',
      method: 'post',
      data
    })
  }
  static exportAcceptApplyWithPayStatus(){
    return request({
      url: `/api/oa-portal/acceptApply/exportAcceptApplyWithPayStatus`,
      method: 'get',
      responseType: 'blob'
    })
  }
  static saveBomOrderByPurchaseApply(data){
    return request({
      url: `/api/oa-portal/bomPurchaseOrder/saveBomOrderByPurchaseApply`,
      method: 'post',
      data
    })
  }
}
