import request from '@/router/axios';

//补卡

export default class BanknoteApply {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/banknote/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

}
