/*
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-03-10 10:20:39
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-05-25 15:05:48
 * @FilePath: \icarx-ui\src\api\contract\contractCustomer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/contractCustomer/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getCustList = (params) => {
  return request({
    url: '/api/oa-portal/contractCustomer/selectList',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const importExcel = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    url: '/api/oa-portal/contractCustomer/importCust',
    method: 'post',
    data: formData
  })
}

export const delCust = (param) => {
  return request({
    url: '/api/oa-portal/contractCustomer/delete',
    method: 'get',
    params: {
      ids:param
    }
  })
}

export const saveOrUpdateCust = (params) => {
  return request({
    url: '/api/oa-portal/contractCustomer/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const ContractCustomerDetail = (id, params) => {
  return request({
    url: '/api/oa-portal/contractCustomer/detail',
    method: 'get',
    params: {
      ...params,
      id
    }
  })
}

