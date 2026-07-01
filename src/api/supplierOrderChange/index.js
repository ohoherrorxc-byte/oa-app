import request from '@/router/axios';

export default class SupplierOrderChangeApi {
    static detail(id) {
        return request({
            url: `/api/oa-flow/operation/supplierOrderChange/detail?businessId=${id}`,
            method: 'get',
        })
    }
}
