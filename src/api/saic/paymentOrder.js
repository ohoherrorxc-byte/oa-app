import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/payment/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getSupplier = (licenseSupplier) => {
  return request({
    url: '/api/oa-portal/payment/getSupplier',
    method: 'get',
    params: {
      licenseSupplier,
    }
  })
}
