import request from '@/router/axios';

//补卡

export default class CardReplacementApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/addClockIn/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

}
