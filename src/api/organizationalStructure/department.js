import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-system/dept/v2.0/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getLazyList = (parentId, params) => {
  return request({
    url: '/api/oa-system/dept/v2.0/lazy-list',
    method: 'get',
    params: {
      ...params,
      parentId
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-system/dept/v2.0/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-system/dept/v2.0/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-system/dept/v2.0/submit',
    method: 'post',
    data: row
  })
}

export const getDept = (id) => {
  return request({
    url: `/api/oa-system/dept/v2.0/detail?id=${id}`,
    method: 'get'
  })
}

export const getDeptTree = (tenantId) => {
  return request({
    url: '/api/oa-system/dept/v2.0/tree',
    method: 'get',
    params: {
      tenantId,
    }
  })
}

export const getDeptLazyTree = (parentId) => {
  return request({
    url: '/api/oa-system/dept/v2.0/lazy-tree',
    method: 'get',
    params: {
      parentId
    }
  })
}


