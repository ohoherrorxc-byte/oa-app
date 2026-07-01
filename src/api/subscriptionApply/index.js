import request from '@/router/axios';

export default class SubscriptionApplyApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-portal/subscribeApply/detail?id=${businessId}`,
            method: 'get',
        })
    }

}
