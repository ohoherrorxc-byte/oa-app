import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/voice/list',
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
    url: '/api/oa-portal/voice/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/voice/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/voice/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/voice/submit',
    method: 'post',
    data: row
  })
}

export const getVoiceSupplier = (licenseSupplier) => {
  return request({
    url: '/api/oa-portal/voice/getSupplier',
    method: 'get',
    params: {
      licenseSupplier,
    }
  })
}

export const exportList = (params) => {
  return request({
    url: '/api/oa-portal/voice/export',
    method: 'get',
    params: {
      ...params
    },
    responseType: 'blob'
  })
}
