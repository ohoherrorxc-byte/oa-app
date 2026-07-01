import request from '@/router/axios';

export default class PartsPriceMaintenanceApi {
  //详情
  static details(businessId) {
    return request({
      url: `/api/oa-flow/operation/partPrice/detail?businessId=${businessId}`,
      method: 'get',
    })
  } 
  //批量发送到采购
  static startBranchPartsPrice(ids,type) {
    return request({
      url: `/api/oa-flow/operation/partPrice/start-branch-partsPrice?ids=${ids}&type=${type}`,
      method: 'get',
    })
  } 
}
