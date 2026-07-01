import request from '@/router/axios';

//补卡s

export default class DimissionApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/operation/user/leaveDetail?businessId=${businessId}`,
            method: 'get',
        })
    }

}
