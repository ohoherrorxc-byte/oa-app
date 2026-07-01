/*
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-05-31 10:33:28
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-06-19 15:57:03
 * @FilePath: \icarx-ui\src\api\contract\subscriptionApplication.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/router/axios';

export const selectPage = ( params) => {
  return request({
    url: '/api/oa-portal/subscribeApply/selectPage',
    method: 'get',
    params
  })
}

// 创建人列表
export const userList = (tenantId) => {
    return request({
      url: '/api/oa-user/user-list',
      method: 'get',
      params: {
        tenantId
      }
    })
  }
// 申请部门
  export const getDeptTree = (tenantId) => {
    return request({
      url: '/api/oa-system/dept/tree',
      method: 'get',
      params: {
        tenantId,
      }
    })
  }

  export const invoiceList = (params) => {
    return request({
      url: '/api/oa-portal/invoice/selectList',
      method: 'get',
      params
    })
  }

// 保存发票详情信息
export const saveSubscribeInvoice = (data) => {
  return request({
    url: '/api/oa-portal/subscribeApply/saveSubscribeInvoice',
    method: 'post',
    data
  })
}

export const invoiceListForSubscribe = (params) => {
  return request({
    url: '/api/oa-portal/invoice/selectListForSubscribe',
    method: 'get',
    params
  })
}
