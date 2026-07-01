import request from '@/router/axios';

export default class PartsUpdateApi {
  //详情
  static details(businessId) {
    return request({
      url: `/api/oa-flow/operation/partUpdate/detail?businessId=${businessId}`,
      method: 'get',
    })
  } 

}
