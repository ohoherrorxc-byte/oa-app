import request from '@/router/axios';

export default class LicensePurchaseContractApplyApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/sale/contract/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

}
