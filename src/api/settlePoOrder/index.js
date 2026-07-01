import request from '@/router/axios';

export default class SettlePoOrderApi {
  static update(data) {
    return request({
      url: '/api/oa-portal/partsPurchaseOrder/updatePartsPurchaseOrder',
      method: 'post',
     data
    })
  }
}