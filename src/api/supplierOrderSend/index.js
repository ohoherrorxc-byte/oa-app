import request from '@/router/axios';

export default class SupplierOrderSendApi {
    static detail(id) {
        return request({
            url: `/api/oa-flow/operation/supplierOrderSend/detail?businessId=${id}`,
            method: 'get',
        })
    }
}
