import request from '@/router/axios';

export default class OriginalStatementApi {
    static list(params) {
        return request({
            url: `/api/oa-portal/flowTable/getTripReimburse`,
            method: 'get',
            params
        })
    }
    static originalStatementExport(params){
        return request({
            url: `/api/oa-portal/flowTable/tripPayExport`,
            method: 'get',
            params,
            responseType: 'blob'
        })
    }
  static updateTripActualPayStatus(params) {
    return request({
      url: `/api/oa-portal/flowTable/updateTripActualPayStatus`,
      method: 'get',
      params
    })
  }
  
}
