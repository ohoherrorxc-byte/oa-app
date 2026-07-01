import request from '@/router/axios';

export default class OriginalStatementApi {
    static list(params) {
        return request({
            url: `/api/oa-portal/flowTable/getBusinessTrip`,
            method: 'get',
            params
        })
    }
    static originalStatementExport(){
        return request({
            url: `/api/oa-portal/clockInfo/exportWorkOvertime`,
            method: 'get',
            responseType: 'blob'
        })
    }
}
