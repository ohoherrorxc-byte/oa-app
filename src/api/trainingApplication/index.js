import request from '@/router/axios';

export default class TrainingApplicationApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/trainingApply/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
  
}
