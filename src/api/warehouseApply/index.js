import request from '@/router/axios';

export default class WarehouseApplyApi {
    //报废详情
    static financeCategoryScrapApplyDetails(businessId) {
        return request({
            url: `/api/oa-flow/financeCategoryScrapApply/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //入库详情
    static financeStockInApplyDetails(businessId) {
        return request({
            url: `/api/oa-flow/financeStockInApply/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //出库详情
    static financeStockOutApplyDetails(businessId) {
        return request({
            url: `/api/oa-flow/financeStockOutApply/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //子零件入库
    static financeCategoryStockInApplyDetails(businessId) {
        return request({
            url: `/api/oa-flow//financeCategoryStockInApply/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //子零件出库
    static financeCategoryStockOutApplyDetails(businessId) {
        return request({
            url: `/api/oa-flow/financeCategoryStockOutApply/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

 
}