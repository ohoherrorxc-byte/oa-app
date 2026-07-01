import request from '@/router/axios';

function formatApprovalCodeListParam(params = {}) {
  const approvalCodeList = Array.isArray(params.approvalCodeList)
    ? params.approvalCodeList.filter((item) => item)
    : [];
  return {
    approvalCodeList: approvalCodeList.join(',')
  };
}

export default class PettyPayApi {
    static list(params) {
        return request({
            url: `/api/oa-portal/flowTable/getPettyCostPay`,
            method: 'get',
            params
        })
    }
    static pettyExport(params){
        return request({
            url: `/api/oa-portal/flowTable/pettyExport`,
            method: 'get',
            params,
            responseType: 'blob'
        })
    }
    static updatePettyActualPayStatus(params) {
      return request({
        url: `/api/oa-portal/flowTable/updatePettyActualPayStatus`,
        method: 'get',
        params
      })
    }
    static listPayInfo(params) {
       return request({
         url: `/api/oa-portal/payReceiveRecord/listPayInfo`,
         method: 'get',
         params
    })
  }
  static allPayInfoExport(params){
    return request({
      url: `/api/oa-portal/payReceiveRecord/allPayInfoExport`,
      method: 'get',
      params,
      responseType: 'blob'
    })
  }

  static allPayInfoDachengExport(params = {}) {
    return request({
      url: `/api/oa-portal/payReceiveRecord/allPayInfoDachengExport`,
      method: 'get',
      params: formatApprovalCodeListParam(params),
      responseType: 'blob'
    })
  }
  static allPayInfoDacheng2Export(params = {}) {
    return request({
      url: `/api/oa-portal/payReceiveRecord/allPayInfoDacheng2Export`,
      method: 'get',
      params: formatApprovalCodeListParam(params),
      responseType: 'blob'
    })
  }
  static batchUpdatePayStatus(params = {}) {
    return request({
      url: `/api/oa-portal/payReceiveRecord/batchUpdatePayStatus`,
      method: 'get',
      params: formatApprovalCodeListParam(params)
    })
  }
}
