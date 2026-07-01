import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/weather/list',
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
    url: '/api/oa-portal/weather/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/weather/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/weather/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/weather/submit',
    method: 'post',
    data: row
  })
}

export const getVoiceSupplier = (licenseSupplier) => {
  return request({
    url: '/api/oa-portal/weather/getSupplier',
    method: 'get',
    params: {
      licenseSupplier,
    }
  })
}

export const exportList = (params) => {
  return request({
    url: '/api/oa-portal/weather/export',
    method: 'get',
    params: {
      ...params
    },
    responseType: 'blob'
  })
}
