import request from '@/router/axios';


export default class FieldApplyApi {
    //领域领用详情
    static detail(businessId) {
        return request({
            url: `/api/oa-flow/operation/assemblyPart/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //领域领用列表
    static list() {
        return request({
          url: '/api/oa-flow/operation/assemblyPart/list',
          method: 'get',       
        })
      }
    
}
