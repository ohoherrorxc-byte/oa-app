import request from '@/router/axios';

//补卡

export default class BomChangeApply {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/bomChange/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

}
