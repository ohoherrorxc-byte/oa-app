import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/supplierModel/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/oa-portal/supplierModel/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/supplierModel/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/supplierModel/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/supplierModel/submit',
    method: 'post',
    data: row
  })
}

export const getSupplier = (licenseSupplier) => {
  return request({
    url: '/api/oa-portal/supplierModel/getSupplier',
    method: 'get',
    params: {
      licenseSupplier,
    }
  })
}

