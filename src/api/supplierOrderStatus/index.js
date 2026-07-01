import request from '@/router/axios';

export default class SupplierOrderStatusApi {
    static detail(id) {
        return request({
            url: `/api/oa-flow/operation/supplierOrderStatus/detail?businessId=${id}`,
            method: 'get',
        })
    }
    static sendEmail(data) {
        return request({
            url: `/api/oa-flow/operation/supplierOrderStatus/sendEmail`,
            method: 'post',
            data
        })
    }
}
