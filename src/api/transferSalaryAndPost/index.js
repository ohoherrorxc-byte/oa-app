import request from '@/router/axios';

export default class TransferSalaryAndPostApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/employeeTransfer/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
  
}
