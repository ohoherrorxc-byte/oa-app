import request from '@/router/axios';

export default class BudgetAdditionsApi {
    static getDetail(params) {
        return request({
            url: `/api/oa-flow/changeSubjectCost/detail`,
            method: 'get',
            params
        })
    }
}