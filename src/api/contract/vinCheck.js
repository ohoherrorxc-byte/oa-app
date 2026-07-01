import request from '@/router/axios';

export default class VinCheckApi {
    static getList(params) {
        return request({
            url: `/api/oa-portal/activationDetail/selectList`,
            method: 'get',
            params
        })
    }
}