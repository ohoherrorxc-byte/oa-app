import request from '@/router/axios';

export default class AssetsApplyApi {
  static details(businessId) {
    return request({
      url: `/api/oa-flow/operation/property/detail?businessId=${businessId}`,
      method: 'get'
    })
  }
  static getProperty(status){
    let url = status?`/api/oa-portal/assetManagement/getPropertyByName?status=${status}`:`/api/oa-portal/assetManagement/getPropertyByName`
    return request({
      url: url,
      method: 'get'
    })
  }
  
}