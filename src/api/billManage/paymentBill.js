import request from '@/router/axios';

export const monthBillTotal = ( params) => {
  return request({
    url: '/api/oa-portal/payBill/monthBillTotal',
    method: 'get',
    params
  })
}
export const monthBill = ( params) => {
  return request({
    url: '/api/oa-portal/payBill/monthBill',
    method: 'get',
    params
  })
}