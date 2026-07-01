import request from '@/router/axios';

export default class CostApi {
    static getCostList(){
        return request({
            url: '/api/oa-portal/costCenter/list',
            method: 'get',
        })
    }
    static getList(params) {
        return request({
            url: '/api/oa-portal/costCenter/selectPage',
            method: 'get',
            params: {
                ...params,
            }
        })
    }
    static add(data) {
        return request({
            url: '/api/oa-portal/costCenter/save',
            method: 'post',
            data
        })
    }
    static update(data) {
        return request({
            url: '/api/oa-portal/costCenter/update',
            method: 'post',
            data
        })
    }
    static deleteRow(id) {
        return request({
            url: `/api/oa-portal/costCenter/delete?ids=${id}`,
            method: 'get',
        })
    }
} 