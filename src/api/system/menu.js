import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-system/menu/list',
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
    url: '/api/oa-system/menu/lazy-list',
    method: 'get',
    params: {
      ...params,
      parentId
    }
  })
}

export const getLazyMenuList = (parentId, params) => {
  return request({
    url: '/api/oa-system/menu/lazy-menu-list',
    method: 'get',
    params: {
      ...params,
      parentId
    }
  })
}

export const getMenuList = (current, size, params) => {
  return request({
    url: '/api/oa-system/menu/menu-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getMenuTree = (tenantId) => {
  return request({
    url: '/api/oa-system/menu/tree',
    method: 'get',
    params: {
      tenantId,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-system/menu/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-system/menu/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-system/menu/submit',
    method: 'post',
    data: row
  })
}

export const getMenu = (id) => {
  return request({
    url: '/api/oa-system/menu/detail',
    method: 'get',
    params: {
      id,
    }
  })
}

export const getTopMenu = () => request({
  url: '/api/oa-system/menu/top-menu',
  method: 'get'
});

export const getRoutes = (topMenuId,languages) => request({
  url: '/api/oa-system/menu/routes',
  method: 'get',
  params: {
    topMenuId,
    languages
  }
});
