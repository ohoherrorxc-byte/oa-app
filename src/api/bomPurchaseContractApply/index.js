import request from '@/router/axios';

export default class BomPurchaseContractApplyApi {
    //详情
    static details(businessId,applyNo) {
        let url = businessId? `/api/oa-portal/bomPurchaseContract/detail?businessId=${businessId}`:`/api/oa-portal/bomPurchaseContract/detail?applyNo=${applyNo}`
        return request({
            url: url,
            method: 'get',
        })
    }
    //详情
    static selectList() {
      return request({
        url: `/api/oa-portal/bomPurchaseContract/selectList`,
        method: 'get',
      })
    }
    static exportBomContractDetail(){
      return request({
        url: `/api/oa-portal/bomPurchaseContract/exportBomContractDetail`,
        method: 'get',
        responseType: 'blob',
      })    
    }
}
