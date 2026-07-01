import request from '@/router/axios';

export default class AcceptApplyApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-portal/acceptApply/detail?businessId=${businessId}`,
            method: 'get',
        })
    }

    //详情
    static selectList(payType,payId) {
      let url = payId?`/api/oa-portal/acceptApply/selectList?payType=${payType}&payId=${payId}`:`/api/oa-portal/acceptApply/selectList?payType=${payType}`
     
      return request({
        url: url,
        method: 'get',
      })
    }

    //校验重复勾选问题
    static isUsed(applyNo) {
      return request({
        url: `/api/oa-portal/acceptApply/isUsed?applyNo=${applyNo}`,
        method: 'get',
      })
    }

    static getStampFileList(businessId){
      return request({
        url: `/api/oa-portal/acceptApply/getStampFileList?businessId=${businessId}`,
        method: 'get',
      })
    }
    static getFileList(businessId,type,applyNo){
      return request({
        url: `/api/oa-portal/acceptApply/getFileList?businessId=${businessId}&type=${type}&applyNo=${applyNo}`,
        method: 'get',
      })
    }
}
