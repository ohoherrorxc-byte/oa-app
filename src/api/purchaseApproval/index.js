import request from '@/router/axios';

export default class purchaseApprovalApi {
  static getBudget() {
    return request({
      url: '/api/oa-portal/photoWall/albumPageList',
      method: 'get',
    })
  }
  static details(businessId) {
    return request({
      url: `/api/oa-flow/procurement/contract/detail?businessId=${businessId}`,
      method: 'get',
  })
  }

}