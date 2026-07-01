import request from '@/router/axios';
import website from "@/config/website";

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/licenseorder/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (orderNumber) => {
  return request({
    url: '/api/oa-portal/licenseorder/detail',
    method: 'get',
    params: {
      orderNumber
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/licenseorder/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/licenseorder/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/licenseorder/submit',
    method: 'post',
    data: row
  })
}

export const check = (vinList, supplierId, supplierName, orderType) => {
  return request({
    url: '/api/oa-portal/license/amount-statistics',
    method: 'post',
    data: {
      vinList,
      supplierId,
      supplierName,
      orderType,
    }
  })
}

export const upload = (file, fileName) => {
  const directory = 'license/tbox/xlsx/';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', directory + fileName);
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/api/oa-resource/oss/endpoint/put-file-attach-by-name',
    method: 'post',
    data: formData
  })
}

