import request from '@/router/axios';

export default class SaleContractChangeApplyApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/saleContractChange/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

}
