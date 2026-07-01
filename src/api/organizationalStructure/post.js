import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-system/post/v2.0/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getPostList = (tenantId) => {
  return request({
    url: '/api/oa-system/post/v2.0/select',
    method: 'get',
    params: {
      tenantId
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/oa-system/post/v2.0/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-system/post/v2.0/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-system/post/v2.0/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-system/post/v2.0/submit',
    method: 'post',
    data: row
  })
}

