import request from '@/router/axios';

export default class OriginalStatementApi {
    static list(params) {
        return request({
            url: `/api/oa-portal/clockInfo/selectLeaveInfoPage`,
            method: 'get',
            params
        })
    }
    static originalStatementExport(){
        return request({
            url: `/api/oa-portal/clockInfo/exportLeaveInfo`,
            method: 'get',
            responseType: 'blob'
        })
    }
 
}