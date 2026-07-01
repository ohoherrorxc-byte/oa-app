import request from '@/router/axios';

export default class OriginalStatementApi {
    static list(params) {
        return request({
            url: `/api/oa-portal/flowTable/getBusinessHospitality`,
            method: 'get',
            params
        })
    }
    static originalStatementExport(params){
        return request({
            url: `/api/oa-portal/flowTable/businessPayExport`,
            method: 'get',
            params,
            responseType: 'blob'
        })
    }
    static updateBusinessActualPayStatus(params) {
      return request({
        url: `/api/oa-portal/flowTable/updateBusinessActualPayStatus`,
        method: 'get',
        params
      })
    }
}
