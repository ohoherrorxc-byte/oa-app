import request from '@/router/axios';


export default class FinancialManagementApi {
    //因公出差详情
    static onBusinessTripDetails(businessId) {
        return request({
            url: `/api/oa-flow/businessTrip/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //差旅详情
    static travelReimbursementDetails(businessId) {
        return request({
            url: `/api/oa-flow/tripReimburse/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //市内交通详情
    static cityTrafficDetails(businessId) {
        return request({
            url: `/api/oa-flow/cityTraffic/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    //业务招待服务详情
    static businessHospitalityDetails(businessId) {
        return request({
            url: `/api/oa-flow/businessHospitality/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
     //公司内部划款申请单
     static internalTransferDetails(businessId) {
        return request({
            url: `/api/oa-flow/companyTransfer/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    static unionFundsDetails(businessId) {
        return request({
            url: `/api/oa-flow/unionFunds/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

    static listBusinessTripApply(userId){
        return request({
            url: `/api/oa-flow/businessTrip/listBusinessTripApply?userId=${userId}`,
            method: 'get',
        })
    }
    
}
