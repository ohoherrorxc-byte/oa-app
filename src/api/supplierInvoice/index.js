import request from '@/router/axios';

export default class SupplierInvoiceApi {
    static getCostList(){
        return request({
            url: '/api/oa-portal/supplierInvoice/list',
            method: 'get',
        })
    }
    static getList(params) {
        return request({
            url: '/api/oa-portal/supplierInvoice/page',
            method: 'get',
            params: {
              ...params,
            }
        })
    }
    static add(data) {
        return request({
            url: '/api/oa-portal/supplierInvoice/saveOrUpdate',
            method: 'post',
            data
        })
    }
    static detail(id,bomOrder) {
        let url = id?`/api/oa-portal/supplierInvoice/detail?id=${id}`:`/api/oa-portal/supplierInvoice/detail?bomOrder=${bomOrder}`
        return request({
            url: url,
            method: 'get',
        })
    }
    // static update(data) {
    //     return request({
    //         url: '/api/oa-portal/customsDeclaration/update',
    //         method: 'post',
    //         data
    //     })
    // }
    static listInvoice(payType){
        return request({
            url: `/api/oa-portal/supplierInvoice/getPayApplyList?payType=${payType}`,
            method: 'get',
        })
    }
    static deleteRow(id) {
        return request({
            url: `/api/oa-portal/supplierInvoice/delete?ids=${id}`,
            method: 'get',
        })
    }
    static approvalSupplierInvoice(data) {
        return request({
            url: `/api/oa-portal/supplierInvoice/approvalSupplierInvoice`,
            method: 'post',
            data
        })
    }
  static listOrder(orderType){
    return request({
      url: `/api/oa-portal/supplierInvoice/getOrderApplyList?orderType=${orderType}`,
      method: 'get',
    })
  }
  static listOrderDeclaration(declaration){
    return request({
      url: `/api/oa-portal/supplierInvoice/getOrderApplyDeclarationList?declaration=${declaration}`,
      method: 'get',
    })
  }
}
