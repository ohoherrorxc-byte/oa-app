import request from '@/router/axios';

//加班

export default class workOvertimeApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/workOvertime/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //
    static pettyCostPay(businessId) {
        return request({
            url: `/api/oa-flow/pettyCostPay/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //加班换算类型
    static changeTypeStatus(businessId) {
        return request({
            url: `/api/oa-flow/workOvertime/changeTypeStatus?businessId=${businessId}`,
            method: 'get',
        })
    }
}
