import request from '@/router/axios';

export default class SaleOrderApplyApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/sale/order/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

}
