/*
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-07-01 16:33:33
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-11-29 13:59:32
 * @FilePath: \icarx-ui\src\api\contract\monthlyBilling.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/router/axios';

export const monthBill = (params) => {
  return request({
    url: '/api/oa-portal/collectionBill/monthBill',
    method: 'get',
    params
  })
}

export const monthListBill = (params) => {
  return request({
    url: '/api/oa-portal/collectionBill/monthListBill',
    method: 'get',
    params
  })
}
export const saveEmailInfo = (params) => {
  return request({
    url: '/api/oa-portal/collectionBill/saveEmailInfo',
    method: 'post',
    data: {
      ...params,
    }
  })
}
export const getEmailInfo = (params) => {
  return request({
    url: '/api/oa-portal/collectionBill/getEmailInfo',
    method: 'get',
    params
  })
}
export const batchBillConfirm = (params) => {
  return request({
    url: '/api/oa-portal/collectionBill/batchBillConfirm',
    method: 'get',
    params
  })
}

export const billConfirm = (params) => {
  return request({
    url: '/api/oa-portal/collectionBill/billConfirm',
    method: 'post',
    params
  })
}

export const hardwareBillConfirm = (params) => {
  return request({
    url: '/api/oa-portal/collectionBill/hardwareBillConfirm',
    method: 'post',
    params
  })
}
