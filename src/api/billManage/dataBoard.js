import request from '@/router/axios';


export const getSalesOrderStatisticTotalBoard = (params) => {
  return request({
    url: '/api/oa-portal/contractStatistics/getSalesOrderStatisticTotalBoard',
    method: 'get',
    params
  })
}

//激活明细看板
export const getAllAreaActiveCount = (params) => {
  return request({
    url: '/api/oa-portal/contractStatistics/getAllAreaActiveCount',
    method: 'get',
    params
  })
}

//激活明细看板
export const getEurInvoiceCount = () => {
  return request({
    url: '/api/oa-portal/contractStatistics/getEurInvoiceCount',
    method: 'get'
  })
}

//激活明细看板
export const getSalesBusinessData = () => {
  return request({
    url: '/api/oa-portal/contractStatistics/getSalesBusinessData',
    method: 'get'
  })
}

export const getBillList = () => {
  return request({
    url: '/api/oa-portal/contractStatistics/getInvoiceAmountTotalByArea',
    method: 'get'
  })
}

export const clearRedis = ()=>{
  return request({
    url: '/api/oa-portal/contractStatistics/clearRedis',
    method: 'get'
  })
}

export const  getUpdateTime = ()=>{
  return request({
    url: '/api/oa-portal/contractStatistics/getUpdateTime',
    method: 'get'
  })
}

export const  getAllYearLicenseInvoiceCount = ()=>{
  return request({
    url: '/api/oa-portal/contractStatistics/getAllYearLicenseInvoiceCount',
    method: 'get'
  })
}
