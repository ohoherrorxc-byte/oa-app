import request from '@/router/axios';

export default class BomPurchaseOrderApplyApi {
  static details(businessId, applyNo) {
    let url = businessId ? `/api/oa-portal/bomPurchaseOrder/detail?businessId=${businessId}` : `/api/oa-portal/bomPurchaseOrder/detail?applyNo=${applyNo}`
    return request({
      url: url,
      method: 'get',
    })
  }

  //列表
  static selectList(params) {
    return request({
      url: `/api/oa-portal/bomPurchaseOrder/selectList`,
      method: 'get',
      params
    })
  }
  //零件
  static selectListByPartsNo(params) {
    return request({
      url: `/api/oa-portal/stockOut/selectListByPartsNo`,
      method: 'get',
      params
    })
  }
 
  static downloadWord(data) {
    return request({
      url: `/api/oa-portal/bomPurchaseContractPay/downloadWord`,
      method: 'post',
      data
    })
  }
  static getMultiplicationMoney(num1, num2) {
    return request({
      url: `/api/oa-portal/bomPurchaseOrder/getMultiplicationMoney?num1=${num1}&num2=${num2}`,
      method: 'get',

    })
  }

  static exportBomOrderDetail() {
    return request({
      url: `/api/oa-portal/bomPurchaseOrder/exportBomOrderDetail`,
      method: 'get',
      responseType: 'blob',
    })
  }
  static getDeliverFile(customNo) {
    return request({
      url: `/api/oa-portal/bomPurchaseOrder/getDeliverFile?customNo=${customNo}`,
      method: 'get',
    })
  }
}
