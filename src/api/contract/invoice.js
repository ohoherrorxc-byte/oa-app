import request from '@/router/axios';

export const getTotal = (params) => {
  return request({
    url: '/api/oa-portal/invoice/getInvoiceTotal',
    method: 'get',
    params
  })
}

export const getInvoiceTotalByYear = (params) => {
  return request({
    url: '/api/oa-portal/invoice/getInvoiceTotalByYear',
    method: 'get',
    params
  })
}

export const getInvoiceGoal = (params) => {
  return request({
    url: '/api/oa-portal/invoice/getInvoiceGoal',
    method: 'get',
    params
  })
}

export const getInvoiceGoalByYear = (params) => {
  return request({
    url: '/api/oa-portal/invoice/getInvoiceGoalByYear',
    method: 'get',
    params
  })
}
