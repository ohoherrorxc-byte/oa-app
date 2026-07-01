import request from '@/router/axios';

export default class OriginalStatementApi {
    static list(params) {
        return request({
            url: `/api/oa-portal/clockInfo/selectAddClockInfoPage`,
            method: 'get',
            params
        })
    }
    static originalStatementExport(){
        return request({
            url: `/api/oa-portal/clockInfo/exportAddClockInfo`,
            method: 'get',
            responseType: 'blob'
        })
    }
}