import request from '@/router/axios';

export default class SaleContractApplyApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-portal/salesContractNew/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

}
