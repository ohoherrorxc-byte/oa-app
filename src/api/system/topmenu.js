import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-system/topmenu/list',
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
    url: '/api/oa-system/topmenu/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-system/topmenu/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-system/topmenu/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-system/topmenu/submit',
    method: 'post',
    data: row
  })
}

export const grantTree = () => {
  return request({
    url: '/api/oa-system/menu/grant-top-tree',
    method: 'get',
  })
}

export const getTopTree = (topMenuIds) => {
  return request({
    url: '/api/oa-system/menu/top-tree-keys',
    method: 'get',
    params: {
      topMenuIds,
    }
  })
}

export const grant = (topMenuIds, menuIds) => {
  return request({
    url: '/api/oa-system/topmenu/grant',
    method: 'post',
    data: {
      topMenuIds,
      menuIds,
    }
  })
}
