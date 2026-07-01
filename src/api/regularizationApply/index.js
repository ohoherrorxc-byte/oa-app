import request from '@/router/axios';

export default class RegularizationApplyApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/employeeRegularization/detail?businessId=${businessId}`,
            method: 'get',
        })
    } 
}
