import request from '@/router/axios';

export default class BomPurchaseContractApplyApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-portal/bomPurchaseContractPay/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //列表
    static selectList() {
      return request({
        url: `/api/oa-portal/bomPurchaseContractPay/selectList`,
        method: 'get',
      })
    }
    //付款
    static getAllFileList(payId,acceptId,key) {
      return request({
        url: `/api/oa-portal/bomPurchaseContractPay/getAllFileList?payId=${payId}&acceptId=${acceptId}&key=${key}`,
        method: 'get',
      })
    }
    static updateBomActualPayStatus(params) {
       return request({
          url: `/api/oa-portal/bomPurchaseContractPay/updateBomActualPayStatus`,
          method: 'get',
          params
      })
    }
}
