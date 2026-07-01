import request from '@/router/axios';

export const getTotal = (params) => {
  return request({
    url: '/api/oa-portal/salesContractNew/getTotalAmount',
    method: 'get',
    params
  })
}

export const getSalesContractList = (params) => {
  return request({
    url: '/api/oa-portal/salesContractNew/selectList',
    method: 'get',
    params
  })
}
export const getCustInvoiceAmount = (params)=>{
  return request({
    url: '/api/oa-portal/contractStatistics/getCustInvoiceAmount',
    method: 'get',
    params
  })
}
export const getSalesContractDetail = (id) => {
  return request({
    url: '/api/oa-portal/salesContractNew/detail?businessId=' + id,
    method: 'get'
  })
}
export const generateSalesOrder = (params) => {
  return request({
    url: '/api/oa-portal/salesContractNew/generateSalesOrder',
    method: 'get',
    params
  })
}
export const getSalesContractAmountGroupByCust = (params) => {
  return request({
    url: '/api/oa-portal/salesContractNew/getSalesContractAmountGroupByCust',
    method: 'get',
    params
  })
}
export const getContractInvoiceAmount = (contractId) =>{
  return request({
    url: `/api/oa-portal/invoice/getContractInvoiceAmount?contractId=${contractId}`,
    method: 'get'
  })
}
