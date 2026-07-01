/*
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-05-26 17:15:24
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-06-19 16:07:23
 * @FilePath: \icarx-ui\src\api\contract\saleContractManage.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/router/axios';

export const getList = ( params) => {
  return request({
    url: '/api/oa-portal/saleContract/selectPage',
    method: 'get',
    params
  })
}

export const getListAllS = (current, size, params) => {
  return request({
    url: '/api/oa-portal/saleContract/selectList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getMyList = (userId, current, size, params) => {
  return request({
    url: '/api/oa-portal/saleContract/selectMyRequestPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      userId
    }
  })
}

