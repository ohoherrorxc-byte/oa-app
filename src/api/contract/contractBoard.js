/*
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-06-01 14:15:39
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-06-15 13:48:02
 * @FilePath: \icarx-ui\src\api\contract\contractboard.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/router/axios';

export const getSalesAmount = (params) => {
  return request({
    url: '/api/oa-portal/contractStatistics/getSalesAmount',
    method: 'get',
    params
  })
}
export const getSalesAmountPic = () => {
  return request({
    url: '/api/oa-portal/contractStatistics/getSalesAmountPic',
    method: 'get',
  })
}

export const exportExcelAll = (params) => {
    return request({
      url: '/api/oa-portal/saleContract/export',
      method: 'get',
      params: {
        ...params
      },
      responseType: 'blob'
    })
  }