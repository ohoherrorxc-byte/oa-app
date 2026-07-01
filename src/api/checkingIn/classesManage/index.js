import request from '@/router/axios';

export default class ClassesManageApi {
    static detail(id) {
        return request({
            url: `/api/oa-portal/rank/detail?id=${id}`,
            method: 'get',
        })
    }
    static save(data) {
        return request({
            url: `/api/oa-portal/rank/save`,
            method: 'post',
            data
        })
    }
    static list(params) {
        return request({
            url: `/api/oa-portal/rank/selectPage`,
            method: 'get',
            params: {
                ...params,
            }
        })
    }
    static delete(ids) {
        return request({
            url: `/api/oa-portal/rank/delete?ids=${ids}`,
            method: 'get',
        })
    }
}