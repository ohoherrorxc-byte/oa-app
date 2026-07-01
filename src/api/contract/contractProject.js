/*
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-03-10 10:20:39
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-05-26 17:46:03
 * @FilePath: \icarx-ui\src\api\contract\contractProject.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/contractProject/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getProjectList = (params) => {
  return request({
    url: '/api/oa-portal/contractProject/selectList',
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
    url: '/api/oa-portal/contractProject/importProject',
    method: 'post',
    data: formData
  })
}

export const delProject = (param) => {
  return request({
    url: '/api/oa-portal/contractProject/delete',
    method: 'get',
    params: {
      ids:param
    }
  })
}

export const delInvoices = (param) => {
  return request({
    url: '/api/oa-portal/invoice/delete',
    method: 'get',
    params: {
      ids:param
    }
  })
}

export const saveOrUpdateProject = (params) => {
  return request({
    url: '/api/oa-portal/contractProject/saveOrUpdate',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const importExcelInvoices = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    url: '/api/oa-portal/invoice/importInvoice',
    method: 'post',
    data: formData
  })
}

