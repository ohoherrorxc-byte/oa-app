import request from '@/router/axios';

export default class PurchaseContractApplyApi {
    //详情
    static details(businessId,applyNo) {
        let url = businessId?`/api/oa-portal/purchaseContract/detail?businessId=${businessId}`:`/api/oa-portal/purchaseContract/detail?applyNo=${applyNo}`
        return request({
            url: url,
            method: 'get',
        })
    }

    //列表
    static selectList() {
      return request({
        url: `/api/oa-portal/purchaseContract/selectList`,
        method: 'get',
      })
    }

}
