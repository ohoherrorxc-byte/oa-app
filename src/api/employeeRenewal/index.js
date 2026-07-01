import request from '@/router/axios';

//补卡s

export default class EmployeeRenewalApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/renewContract/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

}
