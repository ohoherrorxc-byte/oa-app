import request from '@/router/axios';

export default class PurchaseContractPayApplyApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-portal/purchaseContractPay/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

    static getInvoiceList(applyNo){
        console.log(applyNo+'applyNo')
        return request({
            url: `/api/oa-portal/supplierInvoice/getSupplierInvoiceListByOrderId?applyNo=${applyNo}`,
            method: 'get',
        })
        
    }
  static updatePurchaseActualPayStatus(params) {
    return request({
      url: `/api/oa-portal/purchaseContractPay/updatePurchaseActualPayStatus`,
      method: 'get',
      params
    })
  }

}
